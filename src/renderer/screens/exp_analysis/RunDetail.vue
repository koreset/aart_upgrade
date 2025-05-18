<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Experience Analysis Run Results</span>
          </template>
          <template #default>
            <v-row
              ><v-col>
                <v-btn class="custom-btn" variant="text" :to="'/exp-analysis/run-results'">
                  {{ backButton }}
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
                  @update:modelValue="getResults"
                ></v-select>
              </v-col>
              <v-col v-if="resultType == 'exp_actuals_expected'" cols="3">
                <v-btn class="mr-4" rounded size="small" @click="showActuals">Button 1</v-btn>
                <v-btn rounded size="small" @click="showSummaries">Button 2</v-btn>
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
                  @update:modelValue="getResultsByProduct"
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
            <v-container v-if="tableData.length > 0">
              <v-row>
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
                      <data-grid
                        :chartXAxisTitle="'Year'"
                        :chartTitle="data.table_name"
                        :tableName="data.table_name"
                        :columnDefs="data.column_defs"
                        :rowData="data.row_data"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="maleRowData.length > 0"
                        :tableName="data.table_name"
                        :columnDefs="analysisColumnDefs"
                        :rowData="maleRowData"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="femaleRowData.length > 0"
                        :tableName="data.table_name"
                        :columnDefs="analysisColumnDefs"
                        :rowData="femaleRowData"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="combinedRowData.length > 0"
                        :tableName="data.table_name"
                        :columnDefs="analysisColumnDefs"
                        :rowData="combinedRowData"
                        :pagination="true"
                      />

                      <v-row
                        v-if="
                          options.data.length > 0 &&
                          selectedProduct !== null &&
                          checkCandidateGraphTable(data.table_name)
                        "
                      >
                        <v-col>
                          <v-card outlined>
                            <v-card-title class="header--title white--text accent"
                              >Development Factors - {{ options.title.text }}</v-card-title
                            >
                            <v-card-text>
                              <!-- <ag-charts-vue :options="options" /> -->
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="
                          chartOptions.series.length > 0 &&
                          selectedProduct !== null &&
                          checkCandidateGraphTable(data.table_name)
                        "
                        class="mt-5 mb-5"
                      >
                        <v-col>
                          <v-card>
                            <v-card-text>
                              <highcharts
                                class="chart"
                                :options="chartOptions"
                                :updateArgs="updateArgs"
                              ></highcharts>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </v-col>
              </v-row>
            </v-container>
            <v-row v-if="runSettings !== null" class="mx-1">
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="table-col minwidth-name">Run Name</th>
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
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import IbnrService from '@/renderer/api/IbnrService'
import ExpService from '@/renderer/api/ExpAnalysisService'
// import { AgChartsVue } from 'ag-charts-vue3'
import formatValues from '@/renderer/utils/format_values'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
// data
// const showTable = ref(true)
const displayActuals = ref(false)
const displaySummaries = ref(false)
const backButton = '< Back to Run Results'
const $route = useRoute()
const tab = ref(null)
const otherResultTypes = ref(false)
const rerunDialog = ref(false)
const errorMessage: any = ref([])
const loadingResults = ref(false)
const selectedProduct = ref(null)
const productList: any = ref([])
const analysisColumnDefs = ref([])
const maleRowData = ref([])
const femaleRowData = ref([])
const combinedRowData = ref([])
// const columnDefs = ref([])
const tableData: any = ref([])
// const developmentFactorGraph = ref('')
const resultType = ref(null)
const runSettings: any = ref(null)
// const rerunFile = ref(null)
const resultList = ref([
  { text: 'Model Points', value: 'exp_modelpoints' },
  { text: 'Mortality Crude Results', value: 'exp_crude_results' },
  { text: 'Lapse Crude Results', value: 'exp_lapse_crude_results' },
  { text: 'Mortality: Actuals vs Expected', value: 'exp_actuals_expected' }
])
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
  yAxis: { title: { text: 'Count' } },
  series: []
})

const updateArgs = ref([true, true, { duration: 1000 }])

const options: any = ref({
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

// methods
const digit9Formatter = (params) => {
  if (params.value > 0) {
    return params.value.toFixed(9)
  } else {
    return params.value
  }
}

// const digit6Formatter = (params) => {
//   return params.value.toFixed(6)
// }

const digit3Formatter = (params) => {
  if (params.value > 0) {
    return params.value.toFixed(3)
  } else {
    return params.value
  }
}

const checkDataSummaries = (e) => {
  console.log('event:', e)
  // console.log(tableData[e].table_name)
}
const convertSnakeCaseToSpace = (str) => {
  return str.replace(/_/g, ' ')
}
const checkCandidateGraphTable = (tableName) => {
  if (
    tableName === 'IBNR Frequency' ||
    tableName === 'Mack Model Frequency Results' ||
    tableName === 'Development Factors'
  ) {
    return true
  } else {
    return false
  }
}

const showActuals = () => {
  displayActuals.value = true
  displaySummaries.value = false
}
const showSummaries = () => {
  displayActuals.value = false
  displaySummaries.value = true
}

const getProductsForPortfolio = () => {
  productList.value = []
  selectedProduct.value = null
  IbnrService.getProductsForPortfolio($route.params.id).then((response) => {
    // runSettings = response.data.run_settings;
    productList.value = response.data
    if (resultType.value === 'ibnr_results') {
      selectedProduct.value = null
      productList.value.unshift({ product_name: 'All Products', product_code: 'All Products' })
    }
  })
}
const getResultsByProduct = () => {
  tableData.value = []
  errorMessage.value = []
  loadingResults.value = true
  IbnrService.getProjectionRunResults($route.params.id, resultType, selectedProduct).then((res) => {
    runSettings.value = res.data.run_settings
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
          const entries: any = Object.entries(item.graphData).map(function ([key, value]) {
            return { reporting_delay: key, value }
          })
          entries.shift() // this removes the first variable
          // const options = { ...options }
          options.value.data = entries.slice(0, 30)
          options.value.title.text =
            'Weighted Succession Average Ratio' + ' - ' + selectedProduct.value

          // options = options
        }

        // IBNR Frequencies
        if (
          item.table_name === 'IBNR Frequency' ||
          (item.table_name === 'Mack Model Frequency Results' && selectedProduct.value !== null)
        ) {
          // ------ We are working in this section --------
          // const options = { ...chartOptions }
          if (item.table_name === 'Mack Model Frequency Results') {
            chartOptions.value.title.text = 'Mack Model Frequencies' + ' - ' + selectedProduct.value
          } else {
            chartOptions.value.title.text = 'IBNR Frequencies' + ' - ' + selectedProduct.value
          }
          chartOptions.value.xAxis.categories = item.data.map((item) => Math.round(item.reserve))

          // make the Axis labels to comma separated
          // chartOptions.value.xAxis.labels = {
          //   formatter: function () {
          //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          //   }
          // }

          options.value.series = [
            {
              name: 'Frequency',
              data: item.data.map((item) => item.frequency)
            }
          ]
          chartOptions.value = options
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
const getResults = () => {
  tableData.value = []
  if (
    resultType.value === 'exp_modelpoints' ||
    resultType.value === 'exp_crude_results' ||
    resultType.value === 'exp_lapse_crude_results' ||
    resultType.value === 'exp_actuals_expected'
  ) {
    otherResultTypes.value = false
    loadingResults.value = true
    if (resultType.value === 'exp_modelpoints') {
      analysisColumnDefs.value = []
      maleRowData.value = []
      femaleRowData.value = []
      combinedRowData.value = []

      ExpService.getExpModelPointsByRunId($route.params.id).then((res) => {
        if (res.data.table_data.length > 0) {
          res.data.table_data.forEach((item) => {
            const tableDef: any = {}
            tableDef.row_data = item.data
            tableDef.column_defs = createColumnDefs(item.data[0], item.table_name)
            tableDef.table_name = item.table_name
            tableData.value.push(tableDef)
          })
        }
        loadingResults.value = false
      })
    }
    if (resultType.value === 'exp_crude_results') {
      analysisColumnDefs.value = []
      maleRowData.value = []
      femaleRowData.value = []
      combinedRowData.value = []

      ExpService.getExpCrudeResultsByRunId($route.params.id).then((res) => {
        if (res.data.table_data.length > 0) {
          res.data.table_data.forEach((item) => {
            const tableDef: any = {}
            tableDef.row_data = item.data
            tableDef.column_defs = createColumnDefs(item.data[0], item.table_name)
            tableDef.table_name = item.table_name
            tableData.value.push(tableDef)
          })
        }
        loadingResults.value = false
      })
    }
    if (resultType.value === 'exp_lapse_crude_results') {
      analysisColumnDefs.value = []
      maleRowData.value = []
      femaleRowData.value = []
      combinedRowData.value = []

      ExpService.getExpLapseCrudeResultsByRunId($route.params.id).then((res) => {
        if (res.data.table_data.length > 0) {
          res.data.table_data.forEach((item) => {
            const tableDef: any = {}
            tableDef.row_data = item.data
            tableDef.column_defs = createColumnDefs(item.data[0], item.table_name)
            tableDef.table_name = item.table_name
            tableData.value.push(tableDef)
          })
        }
        loadingResults.value = false
      })
    }
    if (resultType.value === 'exp_actuals_expected') {
      analysisColumnDefs.value = []
      maleRowData.value = []
      femaleRowData.value = []
      combinedRowData.value = []
      ExpService.getExpActualsVsExpectedByRunId($route.params.id).then((res) => {
        analysisColumnDefs.value = res.data.summary_data.columnDefs
        maleRowData.value = res.data.summary_data.maleRowData
        femaleRowData.value = res.data.summary_data.femaleRowData
        combinedRowData.value = res.data.summary_data.combinedRowData
        if (res.data.table_data.length > 0) {
          res.data.table_data.forEach((item) => {
            const tableDef: any = {}
            tableDef.row_data = item.data
            tableDef.column_defs = createColumnGroupDefs(item.data[0])
            tableDef.table_name = item.table_name
            tableData.value.push(tableDef)
          })
        }
        showActuals()
        loadingResults.value = false
      })
    }
  } else {
    loadingResults.value = false
    otherResultTypes.value = true
    getProductsForPortfolio()
  }
}
const createColumnGroupDefs = (data) => {
  const cDefs = [
    {
      headerName: 'Male',
      children: [
        { headerName: 'Age Next Birthday', field: 'age_next', filter: true },
        { headerName: '#Deaths', field: 'num_deaths_male' },
        { headerName: 'Expected Num Deaths', field: 'expected_num_deaths_male' },
        {
          headerName: 'Lives Exposure',
          field: 'lives_exposure_male',
          filter: true,
          valueFormatter: digit9Formatter
        },
        {
          headerName: 'Crude Rate',
          field: 'crude_rate_male',
          filter: true,
          valueFormatter: digit9Formatter
        },
        {
          headerName: 'Expected Rate',
          field: 'expected_rate_male',
          filter: true,
          valueFormatter: digit9Formatter
        },
        { headerName: 'AvE', field: 'ave_male', filter: true, valueFormatter: digit3Formatter }
      ]
    },
    {
      headerName: 'Female',
      children: [
        { headerName: 'Age Next Birthday', field: 'age_next', filter: true },
        { headerName: '#Deaths', field: 'num_deaths_female', filter: true },
        { headerName: 'Expected Num Deaths', field: 'expected_num_deaths_female', filter: true },
        {
          headerName: 'Lives Exposure',
          field: 'lives_exposure_female',
          filter: true,
          valueFormatter: digit9Formatter
        },
        {
          headerName: 'Crude Rate',
          field: 'crude_rate_female',
          filter: true,
          valueFormatter: digit9Formatter
        },
        {
          headerName: 'Expected Rate',
          field: 'expected_rate_female',
          filter: true,
          valueFormatter: digit9Formatter
        },
        { headerName: 'AvE', field: 'ave_female', filter: true, valueFormatter: digit3Formatter }
      ]
    },
    {
      headerName: 'Total',
      children: [
        { headerName: 'Age Next Birthday', field: 'age_next', filter: true },
        { headerName: '#Deaths', field: 'num_deaths_total', filter: true },
        { headerName: 'Expected Num Deaths', field: 'expected_num_deaths_total', filter: true },
        {
          headerName: 'Lives Exposure',
          field: 'lives_exposure_total',
          filter: true,
          valueFormatter: digit9Formatter
        },
        {
          headerName: 'Crude Rate',
          field: 'crude_rate_total',
          filter: true,
          valueFormatter: digit9Formatter
        },
        {
          headerName: 'Expected Rate',
          field: 'expected_rate_total',
          filter: true,
          valueFormatter: digit9Formatter
        },

        { headerName: 'AvE', field: 'ave_total', filter: true, valueFormatter: digit3Formatter }
      ]
    }
  ]
  return cDefs
}
const createColumnDefs = (data, tableName) => {
  const cDefs: any = []
  if (typeof data !== 'undefined') {
    Object.keys(data).forEach((element) => {
      // for the given table name, we process the columns for categories and series data
      // for the graph
      const column: any = {}

      switch (tableName) {
        case 'Incurred Claims':
          if (element === 'accident_year') {
            column.headerName = element
            column.field = element
            column.width = 200
            column.chartDataType = 'category'
            column.sortable = true
            column.filter = true
            column.resizable = true

            // column.valueFormatter = formatValues;
            cDefs.push(column)
          } else {
            column.headerName = element
            column.field = element
            column.chartDataType = 'series'
            column.valueFormatter = formatValues
            column.width = 150
            column.sortable = true
            column.filter = true
            column.resizable = true

            cDefs.push(column)
          }

          break
        default:
          column.headerName = element
          column.field = element
          if (element.includes('rd') || element.includes('earned')) {
            if (element.includes('rd')) {
              column.width = 100
              column.cellClass = 'triangulation-rd-cell'
            } else {
              column.cellClass = 'triangulation-cell'
              column.width = 175
            }
            column.valueFormatter = formatValues
          } else {
            if (element.includes('product_code') || element.includes('accident')) {
              column.cellClass = 'triangulation-cell'
              column.width = 175
            } else {
              column.cellClass = 'triangulation-cell'
              column.width = 175
              column.valueFormatter = formatValues
            }
          }
          column.sortable = true
          column.filter = true

          cDefs.push(column)
          break
      }

      // incurred claims
    })
  }
  return cDefs
}
</script>

<style>
.minwidth {
  min-width: 110px !important;
}

.minwidth-name {
  min-width: 150px !important;
}

.tab-rounded {
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
}

.triangulation-cell {
  font-size: 0.8rem !important;
  height: 50 !important;
}

.triangulation-rd-cell {
  display: flex;
  font-size: 0.8rem !important;
  height: 50 !important;
  justify-content: right !important;
}

/* .tab-item-border{
  border: 1px solid #170808 !important;
} */

/* .v-tab--active {
  background-color: #72a2c0 !important;
  color: rgb(255, 255, 255) !important;
} */
</style>
