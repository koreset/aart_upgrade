<template>
  <v-container>
    <base-card :show-actions="false">
      <template #header>
        <span class="headline">Reporting</span>
      </template>
      <template #default>
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="selectedProduct"
              background-color="white"
              density="compact"
              variant="outlined"
              label="Select a Product"
              :items="allProducts"
              item-title="product_name"
              item-value="id"
              @update:modelValue="getDisclosureForProduct"
            ></v-select>
          </v-col>
        </v-row>
        <loading-indicator :loadingData="loadingAll" />
        <v-row v-if="reports">
          <v-col>
            <v-row>
              <v-col>
                <h3>Model Point Summaries</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedYear"
                  clearable
                  background-color="white"
                  density="compact"
                  variant="outlined"
                  label="Select a year"
                  :items="availableModelPointYears"
                  item-title="Year"
                  item-value="Year"
                  placeholder="Select a year"
                  @update:modelValue="getModelPointVersions"
                ></v-select>
              </v-col>
              <v-col v-if="selectedYear" cols="3">
                <v-select
                  v-model="selectedVersion"
                  clearable
                  background-color="white"
                  density="compact"
                  variant="outlined"
                  label="Select a version"
                  :items="availableModelPointVersions"
                  placeholder="Select a model point version"
                  @update:modelValue="getModelPointSumaryForYear"
                ></v-select>
              </v-col>
            </v-row>
            <loading-indicator :loadingData="loadingMps" />
            <v-row v-if="modelPointSummary.length > 0">
              <v-col>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="table-col">Variable</th>
                      <th class="table-col">Min</th>
                      <th class="table-col">Max</th>
                      <th class="table-col">Sum</th>
                      <th class="table-col">Average</th>
                      <th class="table-col">Male</th>
                      <th class="table-col">Female</th>
                      <th class="table-col">Number of Zeroes</th>
                      <th class="table-col">Number of lives</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in modelPointSummary" :key="item.variable">
                      <td>{{ transformText(item.variable) }}</td>
                      <td>{{ item.min }}</td>
                      <td>{{ item.max }}</td>
                      <td>{{ item.sum }}</td>
                      <td>{{ reduceDecimal(item.average) }}</td>
                      <td>{{ item.male }}</td>
                      <td>{{ item.female }}</td>
                      <td>{{ item.number_of_zeroes }}</td>
                      <td>{{ item.number_of_lives }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="reports">
          <v-col>
            <v-row v-if="reports.lapse">
              <v-col>
                <h3>Lapse Rates</h3>
              </v-col>
            </v-row>
            <v-row v-if="reports.lapse && reports.lapse.length > 0">
              <v-col>
                <data-grid :columnDefs="lapseHeaders" :rowData="reports.lapse"></data-grid>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="reports">
          <v-col>
            <v-row v-if="reports.parameters && reports.parameters.length > 0">
              <v-col>
                <h3>Parameters</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <data-grid :columnDefs="parameterHeaders" :rowData="reports.parameters"></data-grid>
                <!-- <v-data-table
                  class="elevation-1"
                  :headers="parameterHeaders"
                  :items="reports.parameters"
                >
                </v-data-table> -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="reports">
          <v-col>
            <base-card>
              <template #header>
                <span class="headline"> Mortality Rates (Female) </span>
              </template>
              <template #default>
                <!-- <v-row>
                  <v-col>
                    <v-select
                      v-model="selectedMortalityYear"
                      :items="availableMortalityYears"
                    ></v-select>
                  </v-col>
                </v-row> -->
                <Chart
                  class="chart"
                  :options="mortalityFemaleOptions"
                  :updateArgs="updateArgs"
                ></Chart>
              </template>
            </base-card>
          </v-col>
        </v-row>
        <v-row v-if="reports">
          <v-col>
            <base-card>
              <template #header>
                <span class="headline"> Mortality Rates (Male) </span>
              </template>
              <template #default>
                <Chart
                  class="chart"
                  :options="mortalityMaleOptions"
                  :updateArgs="updateArgs"
                ></Chart>
              </template>
            </base-card>
          </v-col>
        </v-row>
        <v-row v-if="reports">
          <v-col>
            <base-card>
              <template #header>
                <span class="headline"> Yield Curve</span>
              </template>
              <template #default>
                <Chart class="chart" :options="yieldOptions" :updateArgs="updateArgs"></Chart>
              </template>
            </base-card>
          </v-col>
        </v-row>
      </template>
    </base-card>
  </v-container>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ProductService from '../api/ProductService'
import { Chart } from 'highcharts-vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import BaseCard from '../components/BaseCard.vue'
import DataGrid from '../components/tables/DataGrid.vue'
// require('@gouch/to-title-case')

// data
const loadingAll = ref(false)
const loadingMps = ref(false)
const availableModelPointYears = ref([])
const availableModelPointVersions = ref([])
const selectedProduct = ref(null)
const selectedYear = ref(null)
const selectedVersion = ref(null)
const reports: any = ref(null)
const updateArgs = ref([true, true, { duration: 1000 }])
const modelPointSummary: any = ref([])
const allProducts: any = ref([])

// lifecycle
onMounted(async () => {
  const prodResponse = await ProductService.getProducts()

  prodResponse.data.forEach((family) => {
    family.products.forEach((product) => {
      allProducts.value.push(product)
    })
  })
})

// methods
const getModelPointVersions = () => {
  ProductService.getModelPointVersions(selectedProduct.value, selectedYear.value)
    .then((res) => {
      availableModelPointVersions.value = res.data
    })
    .catch((err) => {
      console.log(err)
      availableModelPointVersions.value = []
    })
}

const getModelPointSumaryForYear = () => {
  modelPointSummary.value = []
  loadingMps.value = true
  if (selectedVersion.value === '' || selectedVersion.value == null) {
    selectedVersion.value = null
    return
  }

  ProductService.getModelPointSummary(
    selectedProduct.value,
    selectedYear.value,
    selectedVersion.value
  )
    .then((res) => {
      modelPointSummary.value = res.data
      loadingMps.value = false
    })
    .catch((err) => {
      console.log(err)
      modelPointSummary.value = []
      loadingMps.value = false
    })
}

const getDisclosureForProduct = () => {
  reports.value = null
  loadingAll.value = true
  ProductService.getDisclosures(selectedProduct.value).then((res) => {
    reports.value = res.data
    availableModelPointYears.value = reports.value.model_point_years
    loadingAll.value = false
  })
}

const transformText = (text: string) => {
  text = text.replace(/_/g, ' ')
  text = text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return text
}

const reduceDecimal = (number: number) => {
  return Math.round(number)
}

// computed
const mortalityFemaleOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1
  const cats: any = []
  const series1: any = { name: currentYear, color: '#edc356', data: [] }
  const series2: any = { name: previousYear, color: '#777eda', data: [] }
  if (reports.value !== null) {
    reports.value.mortality.forEach((item: any) => {
      if (item.gender === 'F') {
        cats.push(item.anb)
        series1.data.push(item.current_year)
        series2.data.push(item.past_year)
      }
    })
  }

  return {
    credits: {
      enabled: false
    },
    chart: { type: 'line' },
    title: { text: '' },
    xAxis: { categories: cats, title: { text: 'Age Next Birthday' } },
    yAxis: { title: { text: 'Mortality Rate (Female)' } },
    series: [series1, series2]
  }
})

const mortalityMaleOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1
  const cats: any = []
  const series1: any = { name: currentYear, color: '#edc356', data: [] }
  const series2: any = { name: previousYear, color: '#777eda', data: [] }
  if (reports.value !== null) {
    reports.value.mortality.forEach((item: any) => {
      if (item.gender === 'M') {
        cats.push(item.anb)
        series1.data.push(item.current_year)
        series2.data.push(item.past_year)
      }
    })
  }

  return {
    credits: {
      enabled: false
    },
    chart: { type: 'line' },
    title: { text: '' },
    xAxis: { categories: cats, title: { text: 'Age Next Birthday' } },
    yAxis: { title: { text: 'Mortality Rate (Male)' } },
    series: [series1, series2]
  }
})

const yieldOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1

  const series1: any = { name: currentYear, color: '#edc356', data: [] }
  const series2: any = { name: previousYear, color: '#777eda', data: [] }
  const cats: any = []
  if (reports.value.yield) {
    reports.value.yield.forEach((item) => {
      cats.push(item.proj_time)
      series1.data.push(item.current_year_nominal_rate)
      series2.data.push(item.past_year_nominal_rate)
    })
  }
  return {
    credits: {
      enabled: false
    },
    chart: { type: 'line' },
    title: { text: '' },
    xAxis: {
      categories: null,
      title: { text: 'Projection Time (Months)' }
    },
    yAxis: { title: { text: 'Nominal Rate' } },
    series: [series1, series2]
  }
})

const lapseHeaders = computed(() => {
  const currentYear = new Date().getFullYear()
  return [
    { headerName: 'Duration In Force Months', field: 'duration_in_force_months' },
    { headerName: currentYear, field: 'current_year' },
    { headerName: currentYear - 1, field: 'past_year' },
    { headerName: 'Variance', field: 'variance' },
    { headerName: '% Change', field: 'change' }
  ]
})

const parameterHeaders = computed(() => {
  const currentYear = new Date().getFullYear()
  return [
    { headerName: 'Variable', field: 'variable' },
    { headerName: currentYear, field: 'current_year' },
    { headerName: currentYear - 1, field: 'previous_year' },
    { headerName: 'Variance', field: 'variance' },
    { headerName: '% Change', field: 'change' }
  ]
})

// export default {
//   filters: {
//     transformText(text) {
//       text = text.replace(/_/g, ' ')
//       text = text.toTitleCase()
//       return text
//     },
//     reduceDecimal(number) {
//       return Math.round(number)
//     }
//   },

//   data() {
//     return {
//       loadingAll: false,
//       loadingMps: false,
//       availableModelPointYears: [],
//       availableModelPointVersions: [],
//       selectedProduct: null,
//       selectedYear: null,
//       selectedVersion: null,
//       reports: null,
//       updateArgs: [true, true, { duration: 1000 }],
//       modelPointSummary: []
//     }
//   },
//   computed: {
//     mortalityFemaleOptions: function () {
//       const currentYear = new Date().getFullYear()
//       const previousYear = currentYear - 1
//       const cats = []
//       const series1 = { name: currentYear, color: '#edc356', data: [] }
//       const series2 = { name: previousYear, color: '#777eda', data: [] }
//       this.reports.mortality.forEach((item) => {
//         if (item.gender === 'F') {
//           cats.push(item.anb)
//           series1.data.push(item.current_year)
//           series2.data.push(item.past_year)
//         }
//       })
//       return {
//         credits: {
//           enabled: false
//         },
//         chart: { type: 'line' },
//         title: { text: '' },
//         xAxis: { categories: cats, title: { text: 'Age Next Birthday' } },
//         yAxis: { title: { text: 'Mortality Rate (Female)' } },
//         series: [series1, series2]
//       }
//     },
//     mortalityMaleOptions: function () {
//       const currentYear = new Date().getFullYear()
//       const previousYear = currentYear - 1
//       const cats = []
//       const series1 = { name: currentYear, color: '#edc356', data: [] }
//       const series2 = { name: previousYear, color: '#777eda', data: [] }
//       this.reports.mortality.forEach((item) => {
//         if (item.gender === 'M') {
//           cats.push(item.anb)
//           series1.data.push(item.current_year)
//           series2.data.push(item.past_year)
//         }
//       })

//       return {
//         credits: {
//           enabled: false
//         },
//         chart: { type: 'line' },
//         title: { text: '' },
//         xAxis: { categories: cats, title: { text: 'Age Next Birthday' } },
//         yAxis: { title: { text: 'Mortality Rate (Male)' } },
//         series: [series1, series2]
//       }
//     },
//     yieldOptions: function () {
//       const currentYear = new Date().getFullYear()
//       const previousYear = currentYear - 1

//       const series1 = { name: currentYear, color: '#edc356', data: [] }
//       const series2 = { name: previousYear, color: '#777eda', data: [] }
//       const cats = []
//       if (this.reports.yield) {
//         this.reports.yield.forEach((item) => {
//           cats.push(item.proj_time)
//           series1.data.push(item.current_year_nominal_rate)
//           series2.data.push(item.past_year_nominal_rate)
//         })
//       }
//       return {
//         credits: {
//           enabled: false
//         },
//         chart: { type: 'line' },
//         title: { text: '' },
//         xAxis: {
//           categories: null,
//           title: { text: 'Projection Time (Months)' }
//         },
//         yAxis: { title: { text: 'Nominal Rate' } },
//         series: [series1, series2]
//       }
//     },

//     lapseHeaders: function () {
//       const currentYear = new Date().getFullYear()
//       return [
//         { text: 'Duration In Force Months', value: 'duration_in_force_months' },
//         { text: currentYear, value: 'current_year' },
//         { text: currentYear - 1, value: 'past_year' },
//         { text: 'Variance', value: 'variance' },
//         { text: '% Change', value: 'change' }
//       ]
//     },
//     parameterHeaders: function () {
//       const currentYear = new Date().getFullYear()
//       return [
//         { text: 'Variable', value: 'variable' },
//         { text: currentYear, value: 'current_year' },
//         { text: currentYear - 1, value: 'previous_year' },
//         { text: 'Variance', value: 'variance' },
//         { text: '% Change', value: 'change' }
//       ]
//     },
//     productsList: function () {
//       const productList = []
//       this.$store.state.productFamilies.forEach((family) => {
//         family.products.forEach((product) => {
//           if (product.product_state !== 'pending') {
//             productList.push(product)
//           }
//         })
//       })
//       return productList
//     }
//   },
//   methods: {
//     getModelPointVersions() {
//       ProductService.getModelPointVersions(this.selectedProduct, this.selectedYear)
//         .then((res) => {
//           this.availableModelPointVersions = res.data
//         })
//         .catch((err) => {
//           this.availableModelPointVersions = []
//         })
//     },
//     getModelPointSumaryForYear() {
//       this.modelPointSummary = []
//       this.loadingMps = true
//       if (this.selectedVersion == '' || this.selectedVersion == null) {
//         this.selectedVersion = null
//         return
//       }

//       ProductService.getModelPointSummary(
//         this.selectedProduct,
//         this.selectedYear,
//         this.selectedVersion
//       )
//         .then((res) => {
//           this.modelPointSummary = res.data
//           this.loadingMps = false
//         })
//         .catch((err) => {
//           this.modelPointSummary = []
//           this.loadingMps = false
//         })
//     },

//     getDisclosureForProduct() {
//       this.reports = null
//       this.loadingAll = true
//       ProductService.getDisclosures(this.selectedProduct).then((res) => {
//         this.reports = res.data
//         this.availableModelPointYears = this.reports.model_point_years
//         this.loadingAll = false
//       })
//     }
//   }
// }
</script>
