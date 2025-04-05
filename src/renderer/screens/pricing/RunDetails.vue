<template>
  <v-container>
    <base-card :show-actions="false" class="rounded-lg">
      <template #header>
        <span v-if="product" class="headline"
          >{{ product.product.product_name }} [{{ product.product.product_code }}] Pricing Analysis
          - Run: {{ pricingRun.name }}
        </span>
      </template>
      <template #default>
        <v-row
          ><v-col>
            <v-btn variant="plain" :to="'/pricing/run-results'">
              {{ backButton }} Back to Pricing Jobs
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
            <v-btn size="small" variant="outlined" rounded class="primary" @click="generatePdf"
              >Generate PDF</v-btn
            >
            <v-btn
              size="small"
              variant="outlined"
              rounded
              :loading="loadingXls"
              class="primary ml-4"
              @click="downloadControlFile"
              >Download Control Results</v-btn
            >
            <v-btn
              v-if="selectedScenario"
              size="small"
              variant="outlined"
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
              <div style="display: grid; width: 100%; height: 100%">
                <ag-charts v-if="options" :options="options"></ag-charts>
              </div>
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
                :show-export="true"
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
                  <tr class="table-row">
                    <th class="table-col">Run Name</th>
                    <th class="table-col">Goal Seek</th>
                    <th class="table-col">Single Model Point</th>
                    <th class="table-col">Profit Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ pricingRun.name }}</td>
                    <td>{{ pricingRun.run_goal_seek }}</td>
                    <td>{{ pricingRun.run_single }}</td>
                    <td>{{ pricingRun.profit_signature }}</td>
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
      </template>
    </base-card>
  </v-container>
</template>
<script setup lang="ts">
import PricingService from '@/renderer/api/PricingService'
import ProductService from '@/renderer/api/ProductService'
import { AgCharts } from 'ag-charts-vue3'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
// require('@gouch/to-title-case')

// data
const $route = useRoute()
const runId: any = ref(0)
const rowData: any = ref([])
const rowSelection: any = ref(null)
const aggRowSelection: any = ref(null)
const columnDefs = ref([])
const aggPointColumnDefs = ref([])
const headers: any = ref([])
// const aggPointHeaders = ref([])
const aggPoints = ref([])
const pdfHeaders: any = ref([])
const backButton = ref('< ')
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
const loadingXls = ref(false)
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

onMounted(async () => {
  runId.value = $route.params.id
  const res = await PricingService.getPricing(runId.value)
  pricingRun.value = res.data

  const resp = await ProductService.getProductById(pricingRun.value.product_id)
  product.value = resp.data

  console.log('Product', product.value)
  console.log('Pricing Run', pricingRun.value)
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
  loadingXls.value = true
  // selectedScenario.value.id, runId.value, product.value.product_code
  PricingService.getPricingExcelControlResults(
    runId.value,
    selectedScenario.value.id,
    product.value.product.product_code
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
    loadingXls.value = false
  })
}

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
    console.log('Scenario data', res.data)
    profitabilities.value = res.data.profitability
    pricingDistribution.value = res.data.pricing_distribution
    filteredData.value = res.data.filtered
    pdfHeaders.value = res.data.headers
    runDetails.value = res.data.pricing_run
    pdfHeaders.value.unshift('Age\\SumAssured')
    headers.value = customSort(Object.keys(filteredData.value[0]))
    rowData.value = filteredData.value
    rowSelection.value = 'single'

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
        position: 'bottom',
        enabled: true,
        item: {
          label: {
            color: 'red',
            formatter: function (params) {
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
              return `${params.datum.label}  ${((params.datum.value / totalValue) * 100).toFixed(2)}%`
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

type RateRecord = Record<string, number>

const rearrangeRates = (data: RateRecord[]): RateRecord[] => {
  if (data.length === 0) return []

  // Step 1: Extract all keys except "Age/Sum Assured"
  const sample = data[0]
  const sumAssuredKeys = Object.keys(sample).filter((key) => key !== 'Age/Sum Assured')

  // Step 2: Extract unique sum assured amounts
  const sumAssuredSet = new Set<number>()
  for (const key of sumAssuredKeys) {
    const match = key.match(/^(\d+)\s+\([MF]\)$/)
    if (match) {
      sumAssuredSet.add(parseInt(match[1]))
    }
  }

  // Step 3: Sort sum assured amounts numerically
  const sortedSumAssureds = Array.from(sumAssuredSet).sort((a, b) => a - b)

  // Step 4: Define final ordered keys
  const orderedKeys = [
    'Age/Sum Assured',
    ...sortedSumAssureds.flatMap((sa) => [`${sa} (F)`, `${sa} (M)`])
  ]

  // Step 5: Rearrange each object
  return data.map((entry) => {
    const newObj: RateRecord = {}
    for (const key of orderedKeys) {
      newObj[key] = entry[key]
    }
    return newObj
  })
}

const generatePdf = () => {
  const canvas: any = document.getElementById('chart-results')
  html2canvas(canvas).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('l', 'mm', 'a4')
    doc.setFontSize(12)
    doc.text(
      'Pricing Analysis ( ' +
        product.value.product_code +
        ') - ' +
        selectedScenario.value.description +
        ' Scenario',
      10,
      10
    )

    const width = doc.internal.pageSize.getWidth()
    const imgProps = doc.getImageProperties(imgData)
    const imgHeight = (imgProps.height * width) / imgProps.width
    // var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 10, 15, width - 20, imgHeight - 10)
    doc.addPage('l')
    console.log('PDF Headers', headers.value)
    console.log('Filtered Data', filteredData.value)
    // const headers = [pdfHeaders]
    const body: any = []
    const reorderedData = rearrangeRates(filteredData.value)
    reorderedData.forEach((item) => {
      const row: any = []
      Object.entries(item).forEach(([key, value]) => {
        // console.log('Key', key)
        // console.log('Value', value)
        row.push(value)
        // if (key !== 'age') {

        // } else {
        //   row.unshift(item.age)
        // }
      })
      body.push(row)
    })
    doc.setFontSize(10)
    autoTable(doc, { head: [headers.value], body, startY: 10, theme: 'grid' })

    doc.save(
      pricingRun.value.name +
        '_' +
        product.value.product.product_code +
        '_' +
        selectedScenario.value.description +
        '.pdf'
    )
  })
}

const createColumnDefs = (headers) => {
  const cDefs: any = []
  if (typeof headers !== 'undefined' && headers !== null && headers.length > 0) {
    headers.forEach((element) => {
      const header: any = {}

      if (element === 'Age/Sum Assured' || element === 'projection_month') {
        header.headerName = element
        header.field = element
        header.chartDataType = 'category'
        header.pinned = 'left'
        header.minWidth = 200
        header.sortable = true
        header.filter = true
        header.resizable = true

        cDefs.push(header)
      } else {
        header.headerName = element
        header.field = element
        header.chartDataType = 'series'
        header.minWidth = 200
        header.sortable = true
        header.filter = true
        header.resizable = true

        cDefs.push(header)
      }
    })
  }
  return cDefs
}
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
