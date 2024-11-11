<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :showActions="false">
          <template #header>
            <span class="headline">IBNR Projection Runs</span>
          </template>
          <template #default>
            <v-row
              ><v-col>
                <v-btn class="custom-btn" variant="text" :to="'/valuations/ibnr/run-results'">
                  Back to Projection Run List
                </v-btn></v-col
              ></v-row
            >
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="resultType"
                  placeholder="Select a result type"
                  label="Result Type"
                  variant="outlined"
                  density="compact"
                  :items="resultList"
                  item-title="text"
                  item-value="value"
                  @update:model-value="getResults"
                ></v-select>
              </v-col>
              <v-col v-if="otherResultTypes" cols="3">
                <v-select
                  v-model="selectedProduct"
                  placeholder="Select a product"
                  label="Product"
                  variant="outlined"
                  density="compact"
                  :error-messages="errorMessage"
                  :items="productList"
                  item-title="product_name"
                  item-value="product_code"
                  @update:model-value="getResultsByProduct"
                ></v-select>
              </v-col>
              <v-col
                v-if="
                  resultType == 'intermediary_base_results' &&
                  selectedProduct !== null &&
                  runSettings !== null
                "
                ><v-btn class="primary" @click="rerunManualDevelopmentFactors"
                  >Rerun {{ runSettings.run_name }} for {{ selectedProduct }}</v-btn
                ></v-col
              >
              <v-col v-if="loadingResults" cols="1">
                <v-progress-circular :width="3" indeterminate></v-progress-circular>
              </v-col>
            </v-row>
            <v-row v-if="tableData.length > 0">
              <v-col>
                <v-tabs
                  v-model="tab"
                  center-active
                  dark
                  background-color="primary tab-rounded"
                  class="white--text"
                  @update:modelValue="checkDataSummaries"
                >
                  <v-tab v-for="item in tableData" :key="item.table_name" class="custom-btn">
                    {{ convertSnakeCaseToSpace(item.table_name) }}
                  </v-tab>
                </v-tabs>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item
                    v-for="data in tableData"
                    :key="data.table_name"
                    active-class="active-tab"
                    class="tab-item-border"
                  >
                    <v-row>
                      <v-col>
                        <data-grid
                          :show-export="true"
                          :columnDefs="data.column_defs"
                          :rowData="data.row_data"
                          :pagination="true"
                        >
                        </data-grid>
                      </v-col>
                    </v-row>
                    <v-row v-if="tableHasGraphs(data.table_name)">
                      <v-col
                        ><base-card class="mx-4" :show-actions="false"
                          ><template #header
                            ><span class="headline">{{ data.table_name }}</span></template
                          ><template #default
                            ><v-row
                              ><v-col
                                ><ag-charts
                                  :options="options"
                                ></ag-charts></v-col></v-row></template
                        ></base-card>
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="
                        data.table_name === 'IBNR Frequency' ||
                        data.table_name === 'Mack Model Frequency Results'
                      "
                    >
                      <v-col>
                        <base-card class="mx-4" :show-actions="false"
                          ><template #header
                            ><span class="headline">{{ data.table_name }}</span></template
                          ><template #default>
                            <Chart class="chart" :options="chartOptions"></Chart> </template
                        ></base-card>
                      </v-col>
                    </v-row>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-col>
            </v-row>
            <v-row v-if="runSettings !== null" class="mx-1">
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="minwidth table-col">Run Name</th>
                      <th class="minwidth table-col">Portfolio</th>
                      <th class="minwidth table-col">Run Date</th>
                      <th class="minwidth table-col">Claims Data Year</th>
                      <th class="minwidth table-col">Claims Data Version</th>
                      <th class="minwidth table-col">Parameter Year</th>
                      <th class="minwidth table-col">Yield Curve Year</th>
                      <th class="minwidth table-col">Yield Curve Month</th>
                      <th class="minwidth table-col">IBNR Method</th>
                      <th class="minwidth table-col">Calculation Interval</th>
                      <th class="minwidth table-col">Inflation Indicator</th>
                      <th class="minwidth table-col">Inflation Date</th>
                      <th class="minwidth table-col">Data Input Start Date</th>
                      <th class="minwidth table-col">Data Input End Date</th>
                      <th class="minwidth table-col">Bootstrap Indicator</th>
                      <th class="minwidth table-col">Simulations</th>
                      <th class="minwidth table-col">Manual Rerun</th>
                      <th class="minwidth table-col">Mack Model Indicator</th>
                      <th class="minwidth table-col">Mack Model Simulations</th>
                      <th class="minwidth table-col">Mack Model Distribution</th>
                      <th class="minwidth table-col">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ runSettings.run_name }}</td>
                      <td>{{ runSettings.portfolio_name }}</td>
                      <td>{{ runSettings.run_date }}</td>
                      <td>{{ runSettings.claims_data_year }}</td>
                      <td>{{ runSettings.claims_input_version }}</td>
                      <td>{{ runSettings.parameter_year }}</td>
                      <td>{{ runSettings.yield_curve_year }}</td>
                      <td>{{ runSettings.yield_curve_month }}</td>
                      <td>{{ runSettings.ibnr_method }}</td>
                      <td>{{ runSettings.calculation_interval }}</td>
                      <td>{{ runSettings.inflation_indicator }}</td>
                      <td>{{ runSettings.inflation_date }}</td>
                      <td>{{ runSettings.data_input_start_date }}</td>
                      <td>{{ runSettings.data_input_end_date }}</td>
                      <td>{{ runSettings.bootstrap_indicator }}</td>
                      <td>{{ runSettings.simulations }}</td>
                      <td>{{ runSettings.rerun_indicator }}</td>
                      <td>{{ runSettings.mack_model_indicator }}</td>
                      <td>{{ runSettings.mack_model_simulations }}</td>
                      <td>{{ runSettings.distribution_model }}</td>
                      <td>{{ runSettings.user_name }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-dialog v-model="rerunDialog" max-width="800" persistent>
                  <v-card>
                    <v-card-title class="header white--text accent">Manual Rerun</v-card-title>
                    <v-card-text>
                      <v-row class="mt-5">
                        <v-col>
                          <v-file-input
                            v-model="rerunFile"
                            outlined
                            dense
                            show-size
                            accept=".csv"
                            placeholder="Click to select a valid csv data file"
                            prepend-icon="mdi-file-upload"
                          >
                          </v-file-input>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn small rounded class="primary" @click="executeManualRun">Run</v-btn>
                      <v-btn small rounded class="primary" @click="rerunDialog = false"
                        >Cancel</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import IbnrService from '@/renderer/api/IbnrService'
import formatValues from '@/renderer/utils/format_values'
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { AgCharts } from 'ag-charts-vue3'
// import type { AgChartOptions } from 'ag-charts-community'
import { Chart } from 'highcharts-vue'

const $route = useRoute()
const $router = useRouter()

const rerunDialog = ref(false)
const rerunFile = ref(null)
const errorMessage: any = ref([])
const tab = ref(null)
const selectedProduct: any = ref(null)
const productList: any = ref([])
const runSettings: any = ref(null)
const tableData: any = ref([])
const loadingResults: any = ref(false)
const otherResultTypes: any = ref(false)
const resultType: any = ref(null)
const resultList = [
  { text: 'IBNR Model Points', value: 'lic_modelpoints' },
  {
    text: 'Data Summaries',
    value: 'data_summaries'
  },

  {
    text: 'Intermediary Base Results',
    value: 'intermediary_base_results'
  },
  {
    text: 'Intermediary Average Cost Per Claim Results',
    value: 'intermediary_average_cost_per_claim_results'
  },
  {
    text: 'Bootstrap Results',
    value: 'bootstrap_results'
  },
  {
    text: 'IBNR Results',
    value: 'ibnr_results'
  },
  {
    text: 'Mack Models',
    value: 'mack_models'
  }
]

const chartOptions: any = ref({
  credits: {
    enabled: false
  },
  lang: {
    thousandsSep: ','
  },
  chart: { type: 'column' },
  title: { text: 'My Chart' },
  xAxis: { categories: [], title: { text: 'Reserves' } },
  yAxis: { title: { text: 'Frequency' } },
  series: [
    {
      name: 'Frequency',
      data: []
    }
  ]
})

// const updateArgs = ref([true, true, { duration: 1000 }])
// const sampleData = ref([
//   { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
//   { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
//   { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
//   { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
//   { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
//   { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 }
// ])
// const sampleSeries = ref([[{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }]])

// const options = ref<AgChartOptions>({
//   // Data: Data to be displayed in the chart
//   data: [
//     { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
//     { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
//     { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
//     { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
//     { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
//     { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 }
//   ],
//   // Series: Defines which chart type and data to use
//   series: [{ type: 'line', yName: 'Ice cream sales', xKey: 'month', yKey: 'iceCreamSales' }],
//   title: { text: 'Ice Cream Sales' }
// })

const options: any = ref({
  contextMenu: {
    enabled: true
  },
  data: [],
  title: {
    text: 'Weighted Succession Average Ratio'
  },
  series: [
    {
      type: 'line',
      xKey: 'reporting_delay',
      yKey: 'value',
      yName: 'Reporting Delay'
    }
  ]
})

onMounted(() => {
  // options.value.series = sampleSeries.value
  // options.value.data = sampleData.value
})

const convertSnakeCaseToSpace = (str) => {
  return str.replace(/_/g, ' ')
}

const checkDataSummaries = () => {
  if (tab.value === 'Data Summaries') {
    getProductsForPortfolio()
  }
}

const getResultsByProduct = () => {
  tableData.value = []
  errorMessage.value = []
  loadingResults.value = true
  IbnrService.getProjectionRunResults(
    $route.params.id,
    resultType.value,
    selectedProduct.value
  ).then((res) => {
    runSettings.value = res.data.run_settings
    console.log('getting results by product')
    if (res.data.table_data.length > 0) {
      res.data.table_data.forEach((item) => {
        const tableDef: any = {}
        tableDef.row_data = item.data
        tableDef.column_defs = createColumnDefs(item.data[0], item.table_name)
        tableDef.table_name = item.table_name
        tableData.value.push(tableDef)
        // Weighted factors
        if (item.graphData !== undefined && item.table_name === 'Development Factors') {
          options.value.data = []
          console.log('Development Factors', item.graphData)
          const entries = Object.entries(item.graphData).map(function ([key, value]) {
            return { reporting_delay: key, value }
          })
          entries.shift() // this removes the first variable
          // // options.value = { ...options }
          options.value.data = entries.slice(0, 30)
          options.value.title.text =
            'Weighted Succession Average Ratio' + ' - ' + selectedProduct.value
          // console.log('Options:', options.value)
          // options = options
        }

        // IBNR Frequencies
        if (
          item.table_name === 'IBNR Frequency' ||
          (item.table_name === 'Mack Model Frequency Results' && selectedProduct.value !== null)
        ) {
          options.value.data = []
          console.log('IBNR Frequencies', item.data)

          const transformedData = item.data.map((item: any) => ({
            x: item.reserve,
            y: item.frequency
          }))

          console.log('Transformed Data:', transformedData)

          // Update the chart's series data
          // chartOptions.value.series[0].data = transformedData
          chartOptions.value.title.text = 'Mack Model Frequencies' + ' - ' + selectedProduct.value
          chartOptions.value.xAxis.labels = {
            formatter: function () {
              return this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
          }

          chartOptions.value.series = [
            {
              name: 'Frequency',
              data: item.data.map((item) => item.frequency)
            }
          ]

          chartOptions.value.xAxis.categories = item.data.map((item) => Math.round(item.reserve))

          // ------ We are working in this section --------
          // const options = { ...chartOptions }
          // if (item.table_name === 'Mack Model Frequency Results') {
          //   chartOptions.value.title.text = 'Mack Model Frequencies' + ' - ' + selectedProduct.value
          // } else {
          //   chartOptions.value.title.text = 'IBNR Frequencies' + ' - ' + selectedProduct.value
          // }
          // chartOptions.value.xAxis.categories = item.data.map((item) => Math.round(item.reserve))
          // // make the Axis labels to comma separated
          // chartOptions.value.xAxis.labels = {
          //   formatter: function () {
          //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          //   }
          // }
          // options.value.series = [
          //   {
          //     name: 'Frequency',
          //     data: item.data.map((item) => item.frequency)
          //   }
          // ]
          // chartOptions.value = options
        }
      })
      loadingResults.value = false
    } else {
      loadingResults.value = false
      errorMessage.value = ['No results found for the selected product and result type']
    }
  })
}
const rerunManualDevelopmentFactors = () => {
  rerunDialog.value = true
}

const getProductsForPortfolio = () => {
  productList.value = []
  selectedProduct.value = null
  IbnrService.getProductsForPortfolio($route.params.id).then((response) => {
    // runSettings = response.data.run_settings;
    productList.value = response.data
    console.log(productList.value)
    if (resultType.value === 'ibnr_results') {
      selectedProduct.value = null
      productList.value.unshift({ product_name: 'All Products', product_code: 'All Products' })
    }
  })
}

const getResults = () => {
  tableData.value = []
  if (resultType.value === 'lic_modelpoints') {
    otherResultTypes.value = false
    loadingResults.value = true
    IbnrService.getProjectionRunResults($route.params.id, resultType.value, null).then((res) => {
      console.log(res)
      runSettings.value = res.data.run_settings
      const tableDef: any = {}
      tableDef.row_data = res.data.table_data[0].data
      tableDef.column_defs = createColumnDefs(tableDef.row_data[0], 'IBNR Model Points')
      tableDef.table_name = 'IBNR Model Points'
      tableData.value.push(tableDef)
      loadingResults.value = false
    })
  } else {
    loadingResults.value = false
    otherResultTypes.value = true
    getProductsForPortfolio()
    if (resultType.value === 'ibnr_results') {
      console.log('ibnr results')
    }
  }
}

const tableHasGraphs = (tableName) => {
  console.log(tableName)
  if (tableName === 'IBNR Frequency' || tableName === 'Development Factors') {
    return true
  } else {
    return false
  }
}
const executeManualRun = () => {
  if (rerunFile.value !== null) {
    const formdata = new FormData()
    formdata.append('file', rerunFile.value)
    formdata.append('run_id', runSettings.value.id)
    formdata.append('prod_code', selectedProduct)

    IbnrService.executeManualRun(formdata).then(() => {
      rerunDialog.value = false
      $router.push({
        name: 'ibnr-runs'
        // params: { id: $route.params.id },
      })
    })
  }
}

const createColumnDefs = (data, tableName) => {
  const cDefs: any = []
  if (typeof data !== 'undefined') {
    Object.keys(data).forEach((element) => {
      // for the given table name, we process the columns for categories and series data
      // for the graph
      const header: any = {}

      switch (tableName) {
        case 'Average Claim Amount':
        case 'Paid vs Outstanding Claims':
        case 'Percentage Outstanding Claims':
        case 'Claim History Summary':
        case 'Incurred Claims':
          if (element === 'accident_year') {
            header.headerName = element
            header.field = element
            header.width = 200
            header.sortable = true
    header.filter = true
    header.resizable = true

            header.chartDataType = 'category'
            // column.valueFormatter = formatValues;
            cDefs.push(header)
          } else {
            header.headerName = element
            header.field = element
            header.chartDataType = 'series'
            header.valueFormatter = formatValues
            header.width = 150
            header.sortable = true
    header.filter = true
    header.resizable = true

            cDefs.push(header)
          }
          break
        default:
          header.headerName = element
          header.field = element
          if (element.includes('rd') || element.includes('earned')) {
            if (element.includes('rd')) {
              header.width = 100
              header.cellClass = 'triangulation-rd-cell'
            } else {
              header.cellClass = 'triangulation-cell'
              header.width = 175
            }
            header.valueFormatter = formatValues
          } else {
            if (element.includes('product_code') || element.includes('accident')) {
              header.cellClass = 'triangulation-cell'
              header.width = 175
            } else {
              header.cellClass = 'triangulation-cell'
              header.width = 175
              header.valueFormatter = formatValues
            }
          }

          cDefs.push(header)
          break
      }

      // incurred claims
    })
  }
  return cDefs
}
</script>
<style lang="css" scoped>
.v-table {
  border: 1px solid grey;
}

.minwidth {
  min-width: 140px;
  font-size: 10px;
  white-space: nowrap;
}
</style>
