<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Valuation Result Detail</span>
          </template>
          <template #default>
            <v-row class="mb-3">
              <v-col>
                <v-btn variant="plain" :to="'/valuations/gmm/run-results'">
                  {{ backButtonTitle }}
                </v-btn>
              </v-col>
            </v-row>
            <loading-indicator class="mb-5" :loading-data="loadingData"></loading-indicator>
            <base-card v-if="!loadingData">
              <template #header>
                <span class="headline">Aggregated Results</span>
              </template>
              <template #default>
                <v-row v-if="showSpCodeSelect">
                  <v-col cols="3">
                    <v-select
                      v-model="selectedSpCode"
                      variant="outlined"
                      density="compact"
                      placeholder="Select an SP Code"
                      label="SP Code"
                      :items="spCodes"
                      @update:modelValue="displayAggDataForSpCode"
                    ></v-select>
                  </v-col>
                </v-row>
                <loading-indicator :loadingData="loadingSpCodeData"></loading-indicator>
                <data-grid
                  v-if="rowData.length > 0"
                  :product-code="rowData[0].product_code"
                  :run-name="runName"
                  :run-id="runId"
                  :show-full-export="true"
                  :showExport="true"
                  :rowData="rowData"
                  :columnDefs="cDefs"
                ></data-grid>
              </template>
            </base-card>
            <base-card v-if="sapRowData.length > 0 && !loadingData">
              <template #header>
                <span class="headline">Scoped Aggregated Results</span>
              </template>
              <template #default>
                <v-row v-if="showSapSpCodeSelect">
                  <v-col cols="3">
                    <v-select
                      v-model="selectedIfrs17Group"
                      variant="outlined"
                      density="compact"
                      placeholder="Select a group"
                      label="IFRS17 Group"
                      :items="ifrs17groups"
                      @update:modelValue="displaySapAggDataForIFRS17Group"
                    ></v-select>
                  </v-col>
                </v-row>

                <data-grid
                  :showExport="showExport"
                  :rowData="sapRowData"
                  :columnDefs="spCDefs"
                ></data-grid>
              </template>
            </base-card>
            <base-card v-if="!loadingData">
              <template #header>
                <span class="headline">Reserves</span>
              </template>
              <template #default>
                <v-row class="mt-5">
                  <v-col cols="4">
                    <v-select
                      v-model="selectedSpCode"
                      variant="outlined"
                      density="compact"
                      placeholder="Select a SP Code"
                      label="SP Code"
                      :items="spCodes"
                    ></v-select>
                  </v-col>
                  <v-col v-if="selectedSpCode !== null" cols="4">
                    <v-select
                      v-model="selectedVariable"
                      variant="outlined"
                      density="compact"
                      :items="variableItems"
                      label="Select a Variable"
                    ></v-select>
                  </v-col>
                  <v-col v-if="selectedSpCode !== null" cols="4">
                    <v-btn variant="plain" rounded color="primary" @click="generateGraph">Go</v-btn>
                  </v-col>
                </v-row>

                <!-- <v-skeleton-loader :loading="loading" height="300px" transition="scale-transition" type="image"> -->
                <v-row v-if="chartSeries.data.length > 0">
                  <v-col>
                    <Chart class="chart" :options="chartOptions" :update-args="updateArgs"></Chart>
                  </v-col>
                </v-row>
              </template>
            </base-card>
            <base-card v-if="!loadingData" :showActions="false">
              <template #header>
                <span class="headline">Model Point Stats</span>
              </template>
              <template #default>
                <data-grid
                  :show-export="true"
                  :rowData="modelpointStats"
                  :columnDefs="mpColDefs"
                ></data-grid>
              </template>
            </base-card>
            <base-card v-if="runSettings !== null && !loadingData" :showActions="false">
              <template #header>
                <span class="headline">Run Settings</span>
              </template>
              <template #default>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="text-left table-col">Run Name</th>
                      <th class="text-left table-col">Run Date</th>
                      <th class="text-left table-col">Model Points</th>
                      <th class="text-left table-col">Model Point Version</th>
                      <th class="text-left table-col">Yield Curve</th>
                      <th class="text-left table-col">Yield Curve Month</th>
                      <th class="text-left table-col">Parameters</th>
                      <th class="text-left table-col">Transitions</th>
                      <th class="text-left table-col">Morbidity</th>
                      <th class="text-left table-col">Mortality</th>
                      <th class="text-left table-col">Lapse</th>
                      <th class="text-left table-col">Lapse Margin</th>
                      <th class="text-left table-col">Retrenchment</th>
                      <th class="text-left table-col">IFRS17</th>
                      <th class="text-left table-col">Shock Setting</th>
                      <th class="text-left table-col">Yield Curve Basis</th>
                      <th class="text-left table-col">Run Basis</th>
                      <th class="text-left table-col">Single Run</th>
                      <th class="text-left table-col">Aggregation Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ runSettings.run_name }}</td>
                      <td>{{ runSettings.run_date }}</td>
                      <td>{{ runSettings.modelpoint_year }}</td>
                      <td>{{ runSettings.mp_version }}</td>
                      <td>{{ runSettings.yieldcurve_year }}</td>
                      <td>{{ runSettings.yieldcurve_month }}</td>
                      <td>{{ runSettings.parameter_year }}</td>
                      <td>{{ runSettings.transition_year }}</td>
                      <td>{{ runSettings.morbidity_year }}</td>
                      <td>{{ runSettings.mortality_year }}</td>
                      <td>{{ runSettings.lapse_year }}</td>
                      <td>{{ runSettings.lapse_margin_year }}</td>
                      <td>{{ runSettings.retrenchment_year }}</td>
                      <td>{{ runSettings.ifrs17_indicator }}</td>
                      <td>{{ runSettings.shock_setting_name }}</td>
                      <td>{{ runSettings.yield_curve_basis }}</td>
                      <td>{{ runSettings.run_basis }}</td>
                      <td>{{ runSettings.run_single }}</td>
                      <td>{{ runSettings.aggregation_period }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </base-card>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { onMounted, ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import ProductService from '@/renderer/api/ProductService'
import { Chart } from 'highcharts-vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

const route = useRoute()

const runName: any = ref(null)
const showExport = ref(true)
const backButtonTitle = '<  Back to Valuation Run List'
const runId: any = ref(null)
const loadingData = ref(false)
const gridOptions: any = ref(null)
const rowData: any = ref([])
const sapRowData: any = ref([])
const runSettings: any = ref(null)
const spCodes: any = ref([])
const runErrors: any = ref(null)
const prodId: any = ref(null)
const prodName: any = ref(null)
const modelpointStats: any = ref(null)
const cDefs = ref([])
const spCDefs = ref([])
const selectedVariable: any = ref('reserves')
const selectedSpCode = ref(null)
const aggData: any = ref([])
const sapAggData: any = ref([])
const showSpCodeSelect = ref(false)
const showSapSpCodeSelect = ref(false)
const selectedIfrs17Group = ref(null)
const ifrs17groups: any = ref([])
const loadingSpCodeData = ref(false)
const variableItems = [
  'reserves',
  'death_outgo',
  'premium_income',
  'profit',
  'initial_policy',
  'commission',
  'premium_not_received_lapse',
  'clawback',
  'accidental_death_outgo',
  'cash_back_on_survival',
  'cash_back_on_death',
  'rider',
  'expenses'
]

const mpColDefs = [
  {
    headerName: 'Variable',
    field: 'variable',
    sortable: true,
    filter: true,
    resizable: true,
    valueFormatter: (params) => transformText(params.value)
  },

  { headerName: 'Min', field: 'min', sortable: true, filter: true, resizable: true },
  { headerName: 'Max', field: 'max', sortable: true, filter: true, resizable: true },
  { headerName: 'Sum', field: 'sum', sortable: true, filter: true, resizable: true },
  {
    headerName: 'Average',
    field: 'average',
    sortable: true,
    filter: true,
    resizable: true,
    valueFormatter: (params) => reduceDecimal(params)
  },
  { headerName: 'Male', field: 'male', sortable: true, filter: true, resizable: true },
  { headerName: 'Female', field: 'female', sortable: true, filter: true, resizable: true },
  {
    headerName: 'Number of Zeroes',
    field: 'number_of_zeroes',
    sortable: true,
    filter: true,
    resizable: true
  },
  {
    headerName: 'Number of Lives',
    field: 'number_of_lives',
    sortable: true,
    filter: true,
    resizable: true
  }
]

const updateArgs: any = ref([true, true, { duration: 1000 }])

const chartSeries: any = ref({
  data: [],
  name: null,
  color: null
})

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

const transformText = (text: string) => {
  text = text.replace(/_/g, ' ')
  text = text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return text
}

const reduceDecimal = (number) => {
  return Math.round(number.value)
}

const displayAggDataForSpCode = () => {
  rowData.value = []
  cDefs.value = []
  loadingSpCodeData.value = true
  ProductService.getValuationJobWithSpCode(runId.value, selectedSpCode.value).then((resp) => {
    rowData.value = resp.data.projections
    cDefs.value = createColumnDefs(rowData.value)
    loadingSpCodeData.value = false
  })
  // rowData.value = aggData.value.filter((item: any) => item.sp_code === spCodes.value[0])
  // cDefs.value = createColumnDefs(rowData.value)
}

const displaySapAggDataForIFRS17Group = () => {
  sapRowData.value = []
  sapRowData.value = sapAggData.value.filter(
    (item: any) => item.IFRS17Group === selectedIfrs17Group.value
  )
  spCDefs.value = createSapColumnDefs(sapRowData.value)
}

// const camelToSnakeCase = (str: String) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const generateGraph = () => {
  // let variable = camelToSnakeCase(selectedVariable.value);
  // if (variable[0] === "_") {
  //   variable = variable.substring(1);
  // }
  getAggregatedVariableV2(selectedVariable.value, selectedSpCode.value)
}

const createColumnDefs = (rowData: any) => {
  if (rowData === null || rowData.length === 0) {
    return []
  }
  if (rowData !== null && rowData.length > 0) {
    const columnDefs: any = []
    const keys = Object.keys(rowData[0])
    keys.forEach((key) => {
      columnDefs.push({
        headerName: key,
        field: key,
        sortable: true,
        filter: true,
        resizable: true,
        width: 150
      })
    })
    gridOptions.value.columnDefs = columnDefs
    return columnDefs
  }
}

const createSapColumnDefs = (rowData: any) => {
  const columnDefs: any = []
  const keys = Object.keys(rowData[0])
  keys.forEach((key) => {
    columnDefs.push({
      headerName: key,
      field: key,
      sortable: true,
      filter: true,
      resizable: true,
      width: 150
    })
  })
  gridOptions.value.sapColumnDefs = columnDefs
  return columnDefs
}

const getModelPointStats = () => {
  ProductService.getProductModelPointStats(prodId.value, runId.value).then((resp) => {
    modelpointStats.value = resp.data
  })
}

const getAggregatedVariableV2 = (variable, spcode) => {
  chartSeries.value.data = []
  if (aggData.value !== null) {
    aggData.value.forEach((elem: any) => {
      if (
        chartOptions.value.xAxis.categories.indexOf(elem.ProjectionMonth) === -1 &&
        elem.sp_code === spcode
      ) {
        chartOptions.value.xAxis.categories.push(elem.ProjectionMonth)
      }
      if (elem.sp_code === spcode) {
        chartSeries.value.data.push(elem[variable])
      }
    })
    chartSeries.value.name = prodName.value
    chartSeries.value.color = generateHexColorExcludingWhite()
    chartOptions.value.series = []
    chartOptions.value.series.push(chartSeries.value)
    chartOptions.value.yAxis.title.text = selectedVariable.value
  }
}

const generateHexColorExcludingWhite = () => {
  const hexChars = '0123456789ABCDEF'
  let color
  do {
    color = '#'
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * hexChars.length)
      color += hexChars[randomIndex]
    }
  } while (color === '#FFFFFF')
  return color
}

onBeforeMount(() => {
  getAggregatedVariableV2('reserves', null)
})

onMounted(() => {
  runId.value = route.params.id
  prodId.value = route.params.prodId
  prodName.value = route.params.prod_name
  runName.value = route.params.run_name

  console.log('runId', runId.value)
  console.log('prodId', prodId.value)
  console.log('prodName', prodName.value)
  console.log('runName', runName.value)

  loadingData.value = true
  gridOptions.value = {}
  ProductService.getValuationJob(runId.value).then((resp) => {
    aggData.value = resp.data.projections
    spCodes.value = resp.data.spcodes
    // spCodes.value = Array.from(spCodes.value)

    if (spCodes.value.length > 1) {
      showSpCodeSelect.value = true
      selectedSpCode.value = spCodes.value[0]
      rowData.value = aggData.value
    } else {
      showSpCodeSelect.value = false
      rowData.value = aggData.value
    }

    if (rowData.value.length > 0) {
      cDefs.value = createColumnDefs(rowData.value)
    }

    // scoped data
    sapAggData.value = resp.data.scopedProjections
    ifrs17groups.value = new Set(sapAggData.value.map((item) => item.IFRS17Group))
    ifrs17groups.value = Array.from(ifrs17groups.value)

    if (sapAggData.value.length > 5000) {
      showSapSpCodeSelect.value = true
      sapRowData.value = sapAggData.value.filter(
        (item: any) => item.IFRS17Group === ifrs17groups.value[0]
      )
    } else {
      showSapSpCodeSelect.value = false
      sapRowData.value = sapAggData.value
    }

    if (sapRowData.value.length > 0) {
      spCDefs.value = createSapColumnDefs(sapRowData.value)
    }

    runSettings.value = resp.data.settings
    spCodes.value = resp.data.spcodes
    if (resp.data.errors) {
      runErrors.value = resp.data.errors
    }
    loadingData.value = false
  })

  getModelPointStats()
  getAggregatedVariableV2('reserves', null)
})
</script>

<style scoped>
.table-col {
  min-width: 120px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
