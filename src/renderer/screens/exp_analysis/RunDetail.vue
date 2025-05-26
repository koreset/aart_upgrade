<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
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
              <v-col v-if="resultType == 'exp_actuals_expected'" cols="5">
                <v-btn class="mr-4 mt-2" color="primary" rounded size="small" @click="showActuals"
                  >Show Actuals</v-btn
                >
                <v-btn class="mt-2" rounded size="small" color="primary" @click="showSummaries"
                  >Show Summaries</v-btn
                >
              </v-col>
              <v-col v-if="resultType == 'exp_lapse_crude_results'" cols="5">
                <v-btn
                  class="mr-4 mt-2"
                  color="primary"
                  rounded
                  size="small"
                  @click="showLapseActuals"
                  >Show Actual/Expected</v-btn
                >
                <v-btn class="mt-2" rounded size="small" color="primary" @click="showLapseSummaries"
                  >Show Summaries</v-btn
                >
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
                    v-if="displayActuals || displayLapseActuals"
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
                        v-if="displayActuals"
                        :chartXAxisTitle="'Year'"
                        :chartTitle="data.table_name"
                        :tableName="data.table_name"
                        :columnDefs="data.column_defs"
                        :rowData="data.row_data"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="maleRowData.length > 0 && displaySummaries"
                        :show-title="true"
                        :table-title="'Male Summary'"
                        :columnDefs="processedColumnDefs"
                        :rowData="maleRowData"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="femaleRowData.length > 0 && displaySummaries"
                        :table-title="'Female Summary'"
                        :columnDefs="processedColumnDefs"
                        :rowData="femaleRowData"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="combinedRowData.length > 0 && displaySummaries"
                        :table-title="'Combined Gender Summary'"
                        :columnDefs="processedColumnDefs"
                        :rowData="combinedRowData"
                        :pagination="true"
                      />
                      <data-grid
                        v-if="lapseSummaryRowData.length > 0 && displayLapseSummaries"
                        :table-title="'Lapse Crude Summary'"
                        :columnDefs="lapseSummaryColumnDefs"
                        :rowData="lapseSummaryRowData"
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
                              <Chart
                                class="chart"
                                :options="chartOptions"
                                :updateArgs="updateArgs"
                              ></Chart>
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
              <v-divider class="my-4"></v-divider>
              <h4>Run Settings</h4>
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="table-col minwidth-name">Run Group Name</th>
                      <th class="minwidth table-col">Run Name</th>
                      <th class="minwidth table-col">Run Date</th>
                      <th class="minwidth table-col">Configuration Used</th>
                      <th class="minwidth table-col">Age Band Version</th>
                      <th class="minwidth table-col">Period Start </th>
                      <th class="minwidth table-col">Period End</th>
                      <th class="minwidth table-col">Exposure Year</th>
                      <th class="minwidth table-col">Exposure Version</th>
                      <th class="minwidth table-col">Lapse Year</th>
                      <th class="minwidth table-col">Lapse Version</th>
                      <th class="minwidth table-col">Mortality Year</th>
                      <th class="minwidth table-col">Mortality Version</th>
                      <th class="minwidth table-col">Run By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="runSetting in runSettings" :key="runSetting.run_id">
                      <td>{{ runSetting.run_group_name }}</td>
                      <td>{{ runSetting.run_name }}</td>
                      <td>{{ runSetting.run_date }}</td>
                      <td>{{ runSetting.exp_configuration_name }}</td>
                      <td>{{ runSetting.age_band_version }}</td>
                      <td>{{ runSetting.period_start_date }}</td>
                      <td>{{ runSetting.period_end_date }}</td>
                      <td>{{ runSetting.exposure_data_year }}</td>
                      <td>{{ runSetting.exposure_data_version }}</td>
                      <td>{{ runSetting.lapse_data_year }}</td>
                      <td>{{ runSetting.lapse_data_version }}</td>
                      <td>{{ runSetting.mortality_data_year }}</td>
                      <td>{{ runSetting.mortality_data_version }}</td>
                      <td>{{ runSetting.user_name }}</td>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { Chart } from 'highcharts-vue'

// data
// const showTable = ref(true)
const displayActuals = ref(true)
const displaySummaries = ref(false)
const displayLapseActuals = ref(true)
const displayLapseSummaries = ref(false)

const backButton = '< Back to Run Results'
const $route = useRoute()
const tab = ref(null)
const otherResultTypes = ref(false)
const rerunDialog = ref(false)
const errorMessage: any = ref([])
const loadingResults = ref(false)
const selectedProduct = ref(null)
const productList: any = ref([])
const analysisColumnDefs: any = ref([])
const lapseSummaryColumnDefs: any = ref([])
const lapseSummaryRowData: any = ref([])

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

onMounted(() => {
  // console.log('mounted')
  console.log($route.params)
  // get run settings
  ExpService.getRunSettings($route.params.id).then((res) => {
    runSettings.value = res.data
    console.log('run settings:', runSettings.value)
    if (runSettings.value === null) {
      errorMessage.value = ['No run settings found for the selected run']
    }
  })
})
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

const universalValueFormatter = (params) => {
  if (params.value == null || params.data == null || params.data.metric == null) {
    return '' // Return empty string for null/undefined values
  }
  const metric = params.data.metric // Relies on 'metric' field being in rowData
  const value = parseFloat(params.value)

  if (isNaN(value)) {
    return params.value != null ? String(params.value) : ''
  }

  switch (metric) {
    case 'A/E - Lives':
    case 'A/E - Lives Basis':
      return value.toFixed(9) // 9 decimal places
    case 'Lives Exposure':
    case 'Expected # Claims':
    case 'Actual # Claims':
      return Math.round(value).toLocaleString() // Integer, locale-specific formatting
    case 'Crude Rate - Lives':
      return value.toFixed(5)
    case 'Expected Crude mortality rate':
    case 'Actual Crude mortality rate':
      return value.toFixed(2)
    default:
      if (typeof value === 'number') {
        return value.toLocaleString() // Generic number formatting
      }
      return String(params.value)
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
  displayLapseActuals.value = true
  displaySummaries.value = false
}
const showSummaries = () => {
  displayActuals.value = false
  displayLapseActuals.value = false
  displaySummaries.value = true
}
const showLapseActuals = () => {
  displayLapseActuals.value = true
  displayActuals.value = true
  displayLapseSummaries.value = false
}

const showLapseSummaries = () => {
  displayLapseActuals.value = false
  displayActuals.value = false
  displayLapseSummaries.value = true
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
  displayActuals.value = true
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
        console.log('lapse crude results:', res.data)
        if (res.data.table_data.length > 0) {
          res.data.table_data.forEach((item) => {
            const tableDef: any = {}
            tableDef.row_data = item.data
            tableDef.column_defs = createColumnDefs(item.data[0], item.table_name)
            tableDef.table_name = item.table_name
            tableData.value.push(tableDef)
          })
        }

        if (res.data.summary_data.length > 0) {
          lapseSummaryColumnDefs.value = createColumnDefs(res.data.summary_data[0], '')
          lapseSummaryRowData.value = res.data.summary_data
          console.log('lapse summary data:', lapseSummaryRowData.value)
          console.log('lapse summary column defs:', lapseSummaryColumnDefs.value)
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
        console.log('actuals vs expected:', res.data)
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

const processedColumnDefs = computed(() => {
  if (!analysisColumnDefs.value) return []
  return analysisColumnDefs.value.map((apiColDef) => {
    const colDef = { ...apiColDef } // Start with properties from API

    // Apply the universal formatter to all columns that are not the 'metric' display column
    if (apiColDef.field !== 'metric') {
      colDef.valueFormatter = universalValueFormatter
    }

    // You can add other client-side AG-Grid column properties here:
    // - cellClassRules for conditional styling (e.g., borders for 'Lives Exposure' row)
    // - sorting, filtering options, etc.
    // Example:
    // if (apiColDef.field === 'Total') {
    //   colDef.cellStyle = { fontWeight: 'bold', ...apiColDef.cellStyle }; // API already sends this, but you could override/add
    // }

    return colDef
  })
})
</script>

<style>
.minwidth {
  min-width: 150px !important;
}

.minwidth-name {
  min-width: 200px !important;
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
