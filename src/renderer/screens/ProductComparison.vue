<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="header-title accent white--text">Cash Flow Comparison</span>
          </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="productA"
                    density="compact"
                    :items="allProducts"
                    item-title="product_name"
                    item-value="product_code"
                    label="Product A"
                    variant="outlined"
                    @update:modelValue="getJobsA"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="productB"
                    density="compact"
                    :items="allProducts"
                    item-title="product_name"
                    item-value="product_code"
                    label="Product B"
                    variant="outlined"
                    @update:modelValue="getJobsB"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="productA !== null && productB !== null">
                <v-col cols="6">
                  <v-select
                    v-model="selectedJobA"
                    density="compact"
                    :items="jobsA"
                    item-title="run_name"
                    return-object
                    label="Available jobs for Product A"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="selectedJobB"
                    density="compact"
                    :items="jobsB"
                    item-title="run_name"
                    return-object
                    label="Available jobs for Product B"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="selectedJobA !== null && selectedJobB !== null">
                <v-col cols="8">
                  <v-select
                    v-model="selectedVariable"
                    density="compact"
                    :items="variableItems"
                    label="Select a Run Variable for comparison"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-btn rounded class="primary" @click="startComparison">Go</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <data-grid
      v-if="resultData.length > 0"
      :chartTitle="'CashflowA vs. CashflowB'"
      :tableTitle="selectedVariable"
      :chartXAxisTitle="'Projection Month'"
      :columnDefs="cDefs"
      :rowData="resultData"
      :pagination="true"
    />
    <v-row v-if="requestStarted">
      <v-col>
        <v-card :loading="loading">
          <v-card-text v-if="responseReceived">
            <Chart class="chart" :options="chartOptions" :updateArgs="updateArgs"></Chart>
          </v-card-text>
          <v-card-text v-else>Processing Request ...</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import ValuationService from '@/renderer/api/ValuationService'
import ProductService from '@/renderer/api/ProductService'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/format_values'
import { Chart } from 'highcharts-vue'
import { ref, onMounted } from 'vue'
import BaseCard from '../components/BaseCard.vue'

// data
const loading = ref(false)
const recentJob: any = ref(null)
const requestStarted = ref(false)
const responseReceived = ref(false)
const productA = ref(null)
const productB = ref(null)
const jobsA = ref([])
const jobsB = ref([])
const selectedJobA = ref(null)
const selectedJobB = ref(null)
const selectedVariable = ref(null)
const resultData = ref([])
const cDefs: any = ref([])
const allProducts: any = ref([])
const variableItems = ref([
  'InitialPolicy',
  'InitialPolicyAdjusted',
  'TotalIncrementalNaturalDeaths',
  'TotalIncrementalNaturalDeathsAdjusted',
  'TotalIncrementalLapses',
  'TotalIncrementalLapsesAdjusted',
  'TotalIncrementalAccidentalDeaths',
  'TotalIncrementalAccidentalDeathsAdjusted',
  'PremiumIncome',
  'PremiumIncomeAdjusted',
  'Commission',
  'CommissionAdjusted',
  'RenewalCommission',
  'RenewalCommissionAdjusted',
  'DeathOutgo',
  'DeathOutgoAdjusted',
  'NonLifeClaimsOutgo',
  'NonLifeClaimsOutgoAdjusted',
  'InitialExpenses',
  'InitialExpensesAdjusted',
  'RenewalExpenses',
  'RenewalExpensesAdjusted',
  'NetCashFlow',
  'NetCashFlowAdjusted',
  'Reserves',
  'ReservesAdjusted',
  'Profit',
  'ProfitAdjusted'
])
const updateArgs = ref([true, true, { duration: 1000 }])
const chartOptions: any = ref({
  credits: {
    enabled: false
  },
  chart: {
    type: 'spline'
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: [],
    title: { text: 'Projection Month' }
  },
  yAxis: {
    title: {
      text: 'Reserves'
    }
  },
  series: []
})

// lifecycle
onMounted(async () => {
  const prodResponse = await ProductService.getProducts()

  prodResponse.data.forEach((family) => {
    family.products.forEach((product) => {
      allProducts.value.push(product)
    })
  })

  // productCategories.value = allProducts.value.map((item: any) => ({
  //   id: item.id,
  //   name: item.name
  // }))
})

// methods
const getJobProductId = (job, prodCode) => {
  const p = job.products.filter((item) => item.product_code === prodCode)
  return p[0].id
}

const combineArrays = (array1, array2) => {
  const combinedArray = array1.map((item1) => {
    const correspondingItem = array2.find(
      (item2) => item2.projection_month === item1.projection_month
    )

    if (correspondingItem) {
      return {
        projection_month: item1.projection_month,
        cashflowA: item1.reserves,
        cashflowB: correspondingItem.reserves
      }
    }

    return null // Handle cases where a matching projectionMonth is not found in array2
  })
  // sort array on the projection_month
  combinedArray.sort((a, b) => {
    return a.projection_month - b.projection_month
  })
  return combinedArray
}

const camelToSnakeCase = (str: any) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

const startComparison = () => {
  requestStarted.value = true
  responseReceived.value = false
  loading.value = true

  let variable = camelToSnakeCase(selectedVariable.value)
  if (variable[0] === '_') {
    variable = variable.substring(1)
  }

  getAggregatedVariable({ variable })
}

const getAggregatedVariable = (payload) => {
  const jobProductIdA = getJobProductId(selectedJobA.value, productA.value)
  const jobProductIdB = getJobProductId(selectedJobB.value, productB.value)
  payload.jobProductIds = [jobProductIdA, jobProductIdB]
  payload.monthRange = 400
  payload.jobIds = true
  ValuationService.getReserves(payload).then((response) => {
    recentJob.value = response.data

    const allReserves = recentJob.value.all_aggregated_reserves
    const reserves1 = allReserves[0].aggregated_reserves
    const reserves2 = allReserves[1].aggregated_reserves
    resultData.value = []
    cDefs.value = []
    resultData.value = combineArrays(reserves1, reserves2)
    cDefs.value = createColumnDefs(resultData.value[0])

    chartOptions.value.series = []
    allReserves.forEach((reserves, index) => {
      const chartSeries: any = {}
      chartSeries.data = []
      reserves.aggregated_reserves.forEach((elem) => {
        if (chartOptions.value.xAxis.categories.indexOf(elem.projection_month) === -1) {
          chartOptions.value.xAxis.categories.push(elem.projection_month)
        }
        chartSeries.data.push(elem.reserves)
      })
      chartSeries.name = reserves.projection_job.product_code + ' [' + (index + 1) + ']'
      chartSeries.color = '#' + Math.floor(Math.random() * 16777215).toString(16)
      chartOptions.value.series.push(chartSeries)
      chartOptions.value.yAxis.title.text = selectedVariable.value
    })
    responseReceived.value = true
    loading.value = false
  })
}

const getJobsA = () => {
  jobsA.value = []
  ValuationService.getJobsForProduct(productA.value).then((resp) => {
    jobsA.value = resp.data
  })
}

const getJobsB = () => {
  jobsB.value = []
  ValuationService.getJobsForProduct(productB.value).then((resp) => {
    jobsB.value = resp.data
  })
}

const createColumnDefs = (data) => {
  const cDefs: any = []
  if (typeof data !== 'undefined') {
    Object.keys(data).forEach((element) => {
      const column: any = {}
      if (element === 'projection_month') {
        column.headerName = element
        column.field = element
        column.chartDataType = 'category'
        column.sortable = true
        column.filter = true
        column.resizable = true

        column.minWidth = 150
        // column.valueFormatter = formatValues;
      } else {
        column.headerName = element
        column.field = element
        column.chartDataType = 'series'
        column.valueFormatter = formatValues
        column.sortable = true
        column.filter = true
        column.resizable = true

        column.minWidth = 150
      }
      cDefs.push(column)
    })
  }
  return cDefs
}
</script>
