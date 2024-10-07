<template>
  <v-container>
    <v-card class="rounded-lg">
      <v-card-title v-if="product" class="header-title accent white--text mb-6"
        >{{ product.product_name }} [{{ product.product_code }}] Pricing Analysis</v-card-title
      >
      <v-card-text>
        <v-row
          ><v-col>
            <v-btn class="custom-btn" plain text :to="'/pricing-jobs'">
              {{ backButton }} Back to Pricing Run List
            </v-btn></v-col
          ></v-row
        >

        <v-row v-if="product">
          <v-col cols="4">
            <v-select
              v-model="selectedScenario"
              light
              background-color="white"
              label="Choose a Scenario"
              variant="outlined"
              density="compact"
              item-value="id"
              item-title="description"
              :items="pricingRun.pricing_config"
              return-object
              @update:modelValue="loadScenario"
            ></v-select>
          </v-col>
        </v-row>
        <loading-indicator :loadingData="loadingData" />
        <v-row v-if="data.length > 0">
          <v-col>
            <v-btn size="small" rounded class="primary">Generate PDF</v-btn>
            <v-btn size="small" rounded class="primary ml-4" @click="downloadControlFile"
              >Download Control Results</v-btn
            >
            <v-btn
              v-if="selectedScenario"
              size="small"
              rounded
              class="primary ml-4"
              @click="deleteScenario"
              >Delete Scenario</v-btn
            >
          </v-col>
        </v-row>
        <div id="result-pane">
          <v-row v-if="options" id="chart-results" class="result-box mb-9 mt-6">
            <v-col cols="9">
              <ag-charts v-if="options" :options="options"></ag-charts>
            </v-col>
            <v-col cols="3">
              <v-table>
                <thead>
                  <tr class="table-row">
                    <th class="table-col text-left">Name</th>
                    <th class="table-col text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in data" :key="item.label">
                    <td>{{ item.label }}</td>
                    <td>{{ reduceDecimal(item.value) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
          <v-row v-if="filteredData.length > 0">
            <v-col>
              <data-grid
                :tableTitle="'Annual Premium Distribution'"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :rowSelection="rowSelection"
                :pagination="true"
                :chartTitle="'Annual Premium Distribution'"
                :chartXAxisTitle="'Age'"
                :chartYAxisTitle="'Annual Premium'"
              />
            </v-col>
          </v-row>
          <v-row v-if="aggPoints.length > 0">
            <v-col>
              <data-grid
                :tableTitle="'Aggregated Pricing Projections'"
                :columnDefs="aggPointColumnDefs"
                :rowData="aggPoints"
                :rowSelection="aggRowSelection"
                :pagination="true"
              />
            </v-col>
          </v-row>
          <h3 v-if="data.length > 0">Pricing Run details</h3>
          <v-row v-if="data.length > 0">
            <v-col>
              <v-table>
                <thead>
                  <tr>
                    <th>Run Name</th>
                    <th>Goal Seek</th>
                    <th>Single Model Point</th>
                    <th>Model Point Version</th>
                    <th>Profit Signature</th>
                    <th>Shock Basis</th>
                    <th>Parameter Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ pricingRun.name }}</td>
                    <td>{{ pricingRun.run_goal_seek }}</td>
                    <td>{{ pricingRun.run_single }}</td>
                    <td>{{ emptyStringNone(pricingRun.mp_version) }}</td>
                    <td>{{ pricingRun.profit_signature }}</td>
                    <td>{{ emptyStringNone(pricingRun.shock_basis) }}</td>
                    <td>{{ emptyStringNone(pricingRun.parameter_basis) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
          <h3 v-if="selectedScenario" class="mt-5">Pricing Scenario details</h3>
          <v-row v-if="selectedScenario">
            <v-col>
              <v-table>
                <thead>
                  <tr class="table-row">
                    <th class="table-col">Name</th>
                    <th class="table-col">Model Point Version</th>
                    <th class="table-col">Parameter Basis</th>
                    <th class="table-col">Cashback on Death</th>
                    <th class="table-col">Cashback on Survival</th>
                    <th class="table-col">Critical Illness</th>
                    <th class="table-col">Cow</th>
                    <th class="table-col">Child</th>
                    <th class="table-col">Funeral</th>
                    <th class="table-col">Death</th>
                    <th class="table-col">Paidup on Survival</th>
                    <th class="table-col">Parameter Basis</th>
                    <th class="table-col">Permanent Disability</th>
                    <th class="table-col">Premium Waiver on Death</th>
                    <th class="table-col">Repatriation</th>
                    <th class="table-col">Retrenchment</th>
                    <th class="table-col">Shock Basis</th>
                    <th class="table-col">Spouse</th>
                    <th class="table-col">Temporary Disability</th>
                    <th class="table-col">Tombstone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ selectedScenario.description }}</td>
                    <td>{{ selectedScenario.mp_version }}</td>
                    <td>{{ selectedScenario.parameter_basis }}</td>
                    <td>{{ selectedScenario.cashback_on_death }}</td>
                    <td>{{ selectedScenario.cashback_on_survival }}</td>
                    <td>{{ selectedScenario.critical_illness }}</td>
                    <td>{{ selectedScenario.cow }}</td>
                    <td>{{ selectedScenario.child_ind }}</td>
                    <td>{{ selectedScenario.funeral }}</td>
                    <td>{{ selectedScenario.death }}</td>
                    <td>{{ selectedScenario.paidup_on_survival }}</td>
                    <td>{{ selectedScenario.parameter_basis }}</td>
                    <td>{{ selectedScenario.perm_disability }}</td>
                    <td>{{ selectedScenario.premium_waiver_on_death }}</td>
                    <td>{{ selectedScenario.repatriation }}</td>
                    <td>{{ selectedScenario.retrenchment }}</td>
                    <td>{{ selectedScenario.shock_basis }}</td>
                    <td>{{ selectedScenario.spouse }}</td>
                    <td>{{ selectedScenario.temp_disability }}</td>
                    <td>{{ selectedScenario.tombstone }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import PricingService from '@/renderer/api/PricingService'
import ProductService from '@/renderer/api/ProductService'
import { AgCharts } from 'ag-charts-vue3'
// import { jsPDF } from 'jspdf'
// import html2canvas from 'html2canvas'
// import autoTable from 'jspdf-autotable'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
// require('@gouch/to-title-case')

// data
const $route = useRoute()
const runId: any = ref(0)
const rowData: any = ref([])
const rowSelection: any = ref(null)
const aggRowSelection: any = ref(null)
const columnDefs = ref([])
const aggPointColumnDefs = ref([])
const headers = ref([])
// const aggPointHeaders = ref([])
const aggPoints = ref([])
const pdfHeaders: any = ref([])
const backButton = ref('<')
const selectedScenario: any = ref(null)
const pricingRun: any = ref([])
const product: any = ref(null)
const options: any = ref(null)
const profitabilities: any = ref(null)
const pricingDistribution: any = ref(null)
const runDetails = ref(null)
const data: any = ref([])
const filteredData = ref([])
const loadingData = ref(false)
// const tableData = ref([])

// transform methods
// const transformText = (text) => {
//   text = text.replace(/_/g, ' ')
//   // text = text.toTitleCase()
//   return text
// }
const reduceDecimal = (number) => {
  return number.toFixed(2)
}
const emptyStringNone = (value) => {
  if (value === '') {
    return 'N/A'
  } else {
    return value
  }
}

onMounted(async () => {
  runId.value = $route.params.id
  const res = await PricingService.getPricing(runId.value)
  pricingRun.value = res.data

  const resp = await ProductService.getProductById(pricingRun.value.product_id)
  product.value = resp.data

  console.log('Product', product.value)
  console.log('Pricing Run', pricingRun.value)

  // .then((res) => {
  //   pricingRun.value = res.data
  //   ProductService.getProductById(pricingRun.value.product_id).then((res) => {
  //     product.value = res.data
  //     console.log('Product', product.value)
  //   })
  //   // product.value = $store.getters.getProductById(pricingRun.value.product_id)
  // })
})

// methods
const deleteScenario = () => {
  console.log('Deleting scenario', selectedScenario.value)
  PricingService.deleteScenario(runId.value, selectedScenario.value.id).then((res) => {
    console.log('Scenario deleted', res)
    pricingRun.value.pricing_config = pricingRun.value.pricing_config.filter(
      (item) => item.id !== selectedScenario.value.id
    )
    selectedScenario.value = null
    filteredData.value = []
    aggPoints.value = []
    data.value = []
    options.value = null
  })
}

const downloadControlFile = () => {
  // selectedScenario.value.id, runId.value, product.value.product_code
  PricingService.getPricingExcelControlResults(
    runId.value,
    selectedScenario.value.id,
    product.value.product_code
  ).then((response) => {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const fileLink = document.createElement('a')

    fileLink.href = fileURL
    fileLink.setAttribute(
      'download',
      'pricing-control-' + runId.value + '-' + selectedScenario.value.description + '.xlsx'
    )
    document.body.appendChild(fileLink)

    fileLink.click()
  })
}

// const generatePdf = () => {
//   const canvas: any = document.getElementById('chart-results')
//   html2canvas(canvas).then((canvas) => {
//     const imgData = canvas.toDataURL('image/png')
//     // eslint-disable-next-line new-cap
//     const doc = new jsPDF('p', 'mm', 'a4')
//     doc.setFontSize(18)
//     doc.text(
//       'Pricing Analysis ( ' +
//         product.value.product_code +
//         ') - ' +
//         selectedScenario.value.description +
//         ' Scenario',
//       10,
//       10
//     )

//     const width = doc.internal.pageSize.getWidth()
//     const imgProps = doc.getImageProperties(imgData)
//     const imgHeight = (imgProps.height * width) / imgProps.width
//     // var height = doc.internal.pageSize.getHeight();
//     doc.addImage(imgData, 'PNG', 10, 15, width - 20, imgHeight - 10)
//     const headers: any = [pdfHeaders]
//     const body: any = []
//     pricingDistribution.value.forEach((item) => {
//       const row = [
//         item.age,
//         item['5000_male'],
//         item['5000_female'],
//         item['10000_male'],
//         item['10000_female'],
//         item['20000_male'],
//         item['20000_female'],
//         item['50000_male'],
//         item['50000_female']
//       ]
//       body.push(row)
//     })
//     doc.setFontSize(10)
//     autoTable(doc, { head: headers, body, startY: imgHeight + 10, theme: 'grid' })

//     doc.save(product.value.product_code + '_' + selectedScenario.value.description + '.pdf')
//   })
// }
const customSort = (arr) => {
  // Separate the array into two subarrays: one for alphabet strings and one for numeric strings
  const alphabetStrings = arr.filter((str) => isNaN(Number(str[0])))
  const numericStrings = arr.filter((str) => !isNaN(Number(str[0])))

  // Sort the alphabetStrings in ascending order
  alphabetStrings.sort()

  // Sort the numericStrings based on their numeric value
  numericStrings.sort((a, b) => {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    return numA - numB
  })

  // Concatenate the two sorted arrays to get the final result
  const sortedArray = alphabetStrings.concat(numericStrings)

  return sortedArray
}

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const loadScenario = () => {
  loadingData.value = true
  data.value = []
  pricingDistribution.value = null
  options.value = null
  PricingService.getScenarioData(selectedScenario.value.id, runId).then((res) => {
    profitabilities.value = res.data.profitability
    pricingDistribution.value = res.data.pricing_distribution
    filteredData.value = res.data.filtered
    pdfHeaders.value = res.data.headers
    runDetails.value = res.data.pricing_run
    pdfHeaders.value.unshift('Age\\SumAssured')
    headers.value = customSort(Object.keys(filteredData.value[0]))
    rowData.value = filteredData.value
    rowSelection.value = 'single'

    // columnDefs = createColumnDefs(filteredData[0])
    columnDefs.value = createColumnDefs(headers.value)

    if (res.data.aggregated_points !== null && res.data.aggregated_points.length > 0) {
      aggPoints.value = res.data.aggregated_points
      aggPointColumnDefs.value = createColumnDefs(Object.keys(aggPoints.value[0]))
      aggRowSelection.value = 'single'
    }

    let totalValue = 0
    Object.entries(profitabilities.value).forEach(([key, value]) => {
      if (key.startsWith('weighted_')) {
        key = toTitleCase(key.replace('weighted_discounted_', '').replace(/_/g, ' '))

        // check the type of value and console log
        if (typeof value === 'number') {
          totalValue = totalValue + value
        }

        data.value.push({ label: key, value })
      }
    })

    options.value = {
      data,
      shadow: {
        xOffset: 10
      },
      legend: {
        position: 'right',
        enabled: true,
        item: {
          label: {
            color: 'red',
            formatter: function (params) {
              console.log('item:', params)
              return `${params.value}`
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          calloutLabelKey: 'label',
          calloutLabel: {
            color: 'black',
            formatter: function (params) {
              console.log(params)
              return `${params.datum.label} - ${((params.datum.value / totalValue) * 100).toFixed(2)}%`
              // return `${((params.datum.value / totalValue) * 100).toFixed(2)}%`
            }
          },
          legendItemKey: 'label',
          fills: [
            '#f3622d',
            '#fba71b',
            '#57b757',
            '#41a9c9',
            '#4258c9',
            '#9a42c8',
            '#c84164',
            '#888888',
            '#8acbe5',
            '#6c62bd',
            '#d23c3b',
            '#d24c5b'
          ]
        }
      ]
    }
    loadingData.value = false
  })
}

const createColumnDefs = (headers) => {
  const cDefs: any = []
  if (typeof headers !== 'undefined' && headers !== null && headers.length > 0) {
    headers.forEach((element) => {
      const column: any = {}

      if (element === 'Age/Sum Assured' || element === 'projection_month') {
        column.headerName = element
        column.field = element
        column.chartDataType = 'category'
        column.pinned = 'left'
        column.minWidth = 200
        cDefs.push(column)
      } else {
        column.headerName = element
        column.field = element
        column.chartDataType = 'series'
        column.minWidth = 200
        cDefs.push(column)
      }
    })
  }
  return cDefs
}

// export default {
//   filters: {
//     transformText(text) {
//       text = text.replace(/_/g, ' ')
//       text = text.toTitleCase()
//       return text
//     },
//     reduceDecimal(number) {
//       return number.toFixed(2)
//     },
//     emptyStringNone(value) {
//       if (value === '') {
//         return 'N/A'
//       } else {
//         return value
//       }
//     }
//   },
//   components: {
//     'ag-charts-vue': AgChartsVue
//   },
//   data: () => {
//     return {
//       runId: 0,
//       rowData: [],
//       rowSelection: null,
//       aggRowSelection: null,
//       columnDefs: [],
//       aggPointColumnDefs: [],
//       headers: [],
//       aggPointHeaders: [],
//       aggPoints: [],
//       pdfHeaders: [],
//       backButton: '<',
//       selectedScenario: null,
//       pricingRun: [],
//       product: null,
//       options: null,
//       profitabilities: null,
//       pricingDistribution: null,
//       runDetails: null,
//       data: [],
//       filteredData: [],
//       loadingData: false,
//       tableData: [
//         { name: 'Alice', age: 30 },
//         { name: 'Bob', age: 25 },
//         { name: 'Charlie', age: 20 }
//       ]
//     }
//   },

//   mounted() {},

//   beforeMount() {
//     runId = $route.params.id
//     PricingService.getPricing(this.runId).then((res) => {
//       this.pricingRun = res.data
//       this.product = this.$store.getters.getProductById(this.pricingRun.product_id)
//     })
//   },

//   methods: {
//     deleteScenario() {
//       console.log('Deleting scenario', this.selectedScenario)
//       PricingService.deleteScenario(this.runId, this.selectedScenario.id).then((res) => {
//         console.log('Scenario deleted', res)
//         this.pricingRun.pricing_config = this.pricingRun.pricing_config.filter(
//           (item) => item.id !== this.selectedScenario.id
//         )
//         this.selectedScenario = null
//         this.filteredData = []
//         this.aggPoints = []
//         this.data = []
//         this.options = null
//       })
//     },
//     downloadControlFile() {
//       // this.selectedScenario.id, this.runId, this.product.product_code
//       PricingService.getPricingExcelControlResults(
//         this.runId,
//         this.selectedScenario.id,
//         this.product.product_code
//       ).then((response) => {
//         const fileURL = window.URL.createObjectURL(new Blob([response.data]))
//         const fileLink = document.createElement('a')

//         fileLink.href = fileURL
//         fileLink.setAttribute(
//           'download',
//           'pricing-control-' + this.runId + '-' + this.selectedScenario.description + '.xlsx'
//         )
//         document.body.appendChild(fileLink)

//         fileLink.click()
//       })
//     },
//     generatePdf() {
//       const canvas = document.getElementById('chart-results')
//       html2canvas(canvas).then((canvas) => {
//         const imgData = canvas.toDataURL('image/png')
//         const doc = new jsPDF('p', 'mm', 'a4')
//         doc.setFontSize(18)
//         doc.text(
//           'Pricing Analysis ( ' +
//             this.product.product_code +
//             ') - ' +
//             this.selectedScenario.description +
//             ' Scenario',
//           10,
//           10
//         )

//         const width = doc.internal.pageSize.getWidth()
//         const imgProps = doc.getImageProperties(imgData)
//         const imgHeight = (imgProps.height * width) / imgProps.width
//         // var height = doc.internal.pageSize.getHeight();
//         doc.addImage(imgData, 'PNG', 10, 15, width - 20, imgHeight - 10)
//         const headers = [this.pdfHeaders]
//         const body = []
//         this.pricingDistribution.forEach((item) => {
//           const row = [
//             item.age,
//             item['5000_male'],
//             item['5000_female'],
//             item['10000_male'],
//             item['10000_female'],
//             item['20000_male'],
//             item['20000_female'],
//             item['50000_male'],
//             item['50000_female']
//           ]
//           body.push(row)
//         })
//         doc.setFontSize(10)
//         autoTable(doc, { head: headers, body, startY: imgHeight + 10, theme: 'grid' })

//         doc.save(this.product.product_code + '_' + this.selectedScenario.description + '.pdf')
//       })
//     },
//     customSort(arr) {
//       // Separate the array into two subarrays: one for alphabet strings and one for numeric strings
//       const alphabetStrings = arr.filter((str) => isNaN(Number(str[0])))
//       const numericStrings = arr.filter((str) => !isNaN(Number(str[0])))

//       // Sort the alphabetStrings in ascending order
//       alphabetStrings.sort()

//       // Sort the numericStrings based on their numeric value
//       numericStrings.sort((a, b) => {
//         const numA = parseFloat(a)
//         const numB = parseFloat(b)
//         return numA - numB
//       })

//       // Concatenate the two sorted arrays to get the final result
//       const sortedArray = alphabetStrings.concat(numericStrings)

//       return sortedArray
//     },

//     loadScenario() {
//       this.loadingData = true
//       this.data = []
//       this.pricingDistribution = null
//       this.options = null
//       PricingService.getScenarioData(this.selectedScenario.id, this.runId).then((res) => {
//         this.profitabilities = res.data.profitability
//         this.pricingDistribution = res.data.pricing_distribution
//         this.filteredData = res.data.filtered
//         this.pdfHeaders = res.data.headers
//         this.runDetails = res.data.pricing_run
//         this.pdfHeaders.unshift('Age\\SumAssured')
//         this.headers = this.customSort(Object.keys(this.filteredData[0]))
//         this.rowData = this.filteredData
//         this.rowSelection = 'single'

//         // this.columnDefs = this.createColumnDefs(this.filteredData[0])
//         this.columnDefs = this.createColumnDefs(this.headers)

//         if (res.data.aggregated_points !== null && res.data.aggregated_points.length > 0) {
//           this.aggPoints = res.data.aggregated_points
//           this.aggPointColumnDefs = this.createColumnDefs(Object.keys(this.aggPoints[0]))
//           this.aggRowSelection = 'single'
//         }

//         let totalValue = 0
//         Object.entries(this.profitabilities).forEach(([key, value]) => {
//           if (key.startsWith('weighted_')) {
//             key = key.replace('weighted_discounted_', '').replace(/_/g, ' ').toTitleCase()

//             // check the type of value and console log
//             if (typeof value === 'number') {
//               totalValue = totalValue + value
//             }

//             this.data.push({ label: key, value })
//           }
//         })

//         this.options = {
//           data: this.data,
//           shadow: {
//             xOffset: 10
//           },
//           series: [
//             {
//               type: 'pie',
//               angleKey: 'value',
//               calloutLabelKey: 'label',
//               calloutLabel: {
//                 color: 'black',
//                 formatter: function (params) {
//                   console.log(params)
//                   return `${params.datum.label} - ${((params.datum.value / totalValue) * 100).toFixed(2)}%`
//                   // return `${((params.datum.value / totalValue) * 100).toFixed(2)}%`
//                 }
//               },
//               legendItemKey: 'label',
//               fills: [
//                 '#f3622d',
//                 '#fba71b',
//                 '#57b757',
//                 '#41a9c9',
//                 '#4258c9',
//                 '#9a42c8',
//                 '#c84164',
//                 '#888888',
//                 '#8acbe5',
//                 '#6c62bd',
//                 '#d23c3b',
//                 '#d24c5b'
//               ]
//             }
//           ]
//         }
//         this.loadingData = false
//       })
//     },
//     createColumnDefs(headers) {
//       const cDefs = []
//       if (typeof headers !== 'undefined' && headers !== null && headers.length > 0) {
//         headers.forEach((element) => {
//           const column = {}

//           if (element == 'Age/Sum Assured' || element == 'projection_month') {
//             column.headerName = element
//             column.field = element
//             column.chartDataType = 'category'
//             column.pinned = 'left'
//             column.minWidth = 200
//             cDefs.push(column)
//           } else {
//             column.headerName = element
//             column.field = element
//             column.chartDataType = 'series'
//             column.minWidth = 200
//             cDefs.push(column)
//           }
//         })
//       }
//       return cDefs
//     }
//   }
// }
</script>

<style scoped>
.result-box {
  border: 1px solid black;
}

#result-pane {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.results-table-header > tr {
  color: black !important;
}

thead.results-table-header > tr > th {
  color: black !important;
  height: 50px !important;
}

#table-results > div > table > thead > tr > th {
  color: black !important;
}
</style>
