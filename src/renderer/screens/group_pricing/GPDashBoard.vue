<!-- eslint-disable no-use-before-define -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Group Pricing Dashboard</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="selectedYear"
                  variant="outlined"
                  density="compact"
                  :items="availableYears"
                  label="Select Year"
                  placeholder="Select Year"
                  @update:model-value="refreshDashboard"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="mb-5 mt-n6"></v-divider>
            <v-row class="d-flex justify-center">
              <v-col v-for="card in cards" :key="card.title" :cols="card.flex">
                <v-card variant="tonal" color="primary" class="dash-card">
                  <v-card-subtitle
                    ><h5>{{ card.title }}</h5></v-card-subtitle
                  >
                  <v-card-text>
                    <v-row>
                      <v-col class="d-flex justify-center">
                        <h1>{{ addFormat(card) }}</h1>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- <v-row class="d-flex justify-center">
              <v-col v-for="card in cards" :key="card.title" :cols="card.flex">
                <base-card :show-actions="false">
                  <template #header>
                    <span class="headline d-flex justify-center">{{ card.title }}</span>
                  </template>
                  <template #default>
                    <v-row>
                      <v-col class="d-flex justify-center">
                        <h2>{{ card.value }}</h2>
                      </v-col>
                    </v-row>
                  </template>
                </base-card>
              </v-col>
            </v-row> -->
            <v-divider class="my-5"></v-divider>
            <v-row>
              <v-col class="pane-bg pa-5 ma-3">
                <v-row class="mb-n12">
                  <v-col cols="3">
                    View by:
                    <v-select
                      v-model="selectedDataView"
                      placeholder="Select a data view"
                      variant="outlined"
                      density="compact"
                      :items="['Annual Premium', 'Count']"
                      @update:model-value="changeChartDataSource"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col cols="3">
                    <ag-charts v-if="conversionOptions" :options="conversionOptions"></ag-charts>
                  </v-col>
                  <v-col cols="3">
                    <ag-charts
                      v-if="inForceSchemesOptions"
                      :options="inForceSchemesOptions"
                    ></ag-charts>
                  </v-col>
                  <v-col cols="3">
                    <ag-charts v-if="newQuoteOptions" :options="newQuoteOptions"></ag-charts>
                  </v-col>
                  <v-col cols="3">
                    <ag-charts v-if="renewalsOptions" :options="renewalsOptions"></ag-charts>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="my-5"></v-divider>

            <v-row class="mt-5 d-flex justify-center">
              <v-col cols="5" class="card-bg mx-3">
                <v-btn icon color="primary" variant="plain" size="small" @click="downloadGicChart">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <ag-charts
                  v-if="conversionOptions"
                  ref="gicCharts"
                  :options="gicOptions"
                ></ag-charts>
              </v-col>
              <v-col cols="5" class="card-bg mx-3">
                <v-btn icon color="primary" variant="plain" size="small" @click="downloadRevChart">
                  <v-icon>mdi-download</v-icon>
                </v-btn>

                <ag-charts
                  v-if="conversionOptions"
                  ref="revenueCharts"
                  :options="revenueOptions"
                ></ag-charts>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedBenefit"
                  :items="benefitList"
                  variant="outlined"
                  density="compact"
                  label="Benefit"
                  placeholder="Select Benefit"
                  @update:model-value="getExposureData"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-style" cols="6">
                <ag-charts v-if="conversionOptions" :options="exposureOptions"></ag-charts>
              </v-col>
              <v-col cols="6">
                <ag-charts v-if="conversionOptions" :options="exposureGenderOptions"></ag-charts>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { AgChartOptions } from 'ag-charts-types'
import { AgCharts } from 'ag-charts-vue3'
import { computed, onMounted, ref } from 'vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'

const paperTheme = {
  palette: {
    fills: ['#006f9b', '#ff7faa', '#00994d', '#000000', '#00a0dd'],
    strokes: ['#003f58', '#934962', '#004a25', '#914d1d', '#006288']
  }
}

const selectedYear = ref<string | null>(null)
const selectedDataView = ref<string | null>(null)

const availableYears = computed(() => {
  const years: any = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear; i >= new Date().getFullYear() - 5; i--) {
    years.push(i.toString())
  }
  return years
})

const selectedBenefit = ref<string | null>(null)
const gicCharts: any = ref(null)
const revenueCharts: any = ref(null)
const newQuotesTotalCount: any = ref(0)
let data: any = null

const benefitList = ['All', 'GLA', 'SGLA', 'PTD', 'CI', 'PHI', 'TTD']
const inForceInnerLabel: any = ref<string>('')

onMounted(() => {
  // set the selected year to the current year
  selectedYear.value = new Date().getFullYear().toString()
  selectedBenefit.value = 'All'
  selectedDataView.value = 'Annual Premium'
  refreshDashboard()
  getExposureData()
})

const downloadGicChart = () => {
  if (gicCharts.value) {
    gicCharts.value.chart.download()
  }
}
const downloadRevChart = () => {
  if (revenueCharts.value) {
    revenueCharts.value.chart.download()
  }
}

const formatWithCommas = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const addFormat = (card: any) => {
  console.log('Adding format for:', card)
  if (card.data_type === 'currency') {
    return `R${formatWithCommas(card.value)}`
  }
  return card.value
}

const changeChartDataSource = () => {
  console.log('Getting data for:', selectedDataView.value)
  let convertedQuotes = 0
  let unconvertedQuotes = 0
  let totalQuotes = 0

  let inForceSchemesRenewal = 0
  let inForceSchemesNew = 0
  let inForceSchemesTotal = ''

  let newQuotesInProgress = 0
  let newQuotesApproved = 0
  let newQuotesAccepted = 0
  let totalnewQuotes = 0

  let renewalQuotesInProgress = 0
  let renewalQuotesApproved = 0
  let renewalQuotesAccepted = 0
  let totalrenewalQuotes = 0

  // let inForceInnerLabel = ''

  if (data) {
    if (selectedDataView.value === 'Annual Premium') {
      convertedQuotes = data.new_quotes_converted_premium
      unconvertedQuotes = data.new_quotes_unconverted_premium
      totalQuotes = data.new_quotes_total_premium
    
      inForceSchemesRenewal = data.renewals_in_force_premium
      inForceSchemesNew = data.new_business_in_force_premium
      inForceSchemesTotal = roundUpToTwoDecimals(data.total_in_force_premium/1000000)

      newQuotesInProgress =  data.new_quotes_in_progress_premium/1000000
      newQuotesApproved = data.new_quotes_approved_premium/1000000
      newQuotesAccepted = data.new_quotes_in_force_premium/1000000
      totalnewQuotes  = newQuotesInProgress + newQuotesApproved + newQuotesAccepted

      renewalQuotesInProgress =  data.renewals_quotes_in_progress_premium/1000000
      renewalQuotesApproved = data.renewals_quotes_approved_premium/1000000
      renewalQuotesAccepted = data.renewals_quotes_in_force_premium/1000000
      totalrenewalQuotes  = renewalQuotesInProgress + renewalQuotesApproved + renewalQuotesAccepted
    } else {
      convertedQuotes = data.new_quotes_converted_count
      unconvertedQuotes = data.new_quotes_unconverted_count
      totalQuotes = data.new_quotes_total_count

      inForceSchemesRenewal = data.renewals_in_force_count
      inForceSchemesNew = data.new_business_in_force_count
      inForceSchemesTotal = data.total_in_force_count

      newQuotesInProgress = data.new_quotes_in_progress_count
      newQuotesApproved = data.new_quotes_approved_count
      newQuotesAccepted = data.new_quotes_in_force_count
      totalnewQuotes  = newQuotesInProgress + newQuotesApproved + newQuotesAccepted

      renewalQuotesInProgress =  data.renewals_quotes_in_progress_count
      renewalQuotesApproved = data.renewals_quotes_approved_count
      renewalQuotesAccepted = data.renewals_quotes_in_force_count
      totalrenewalQuotes  = renewalQuotesInProgress + renewalQuotesApproved + renewalQuotesAccepted
    }
  }


  conversionOptions.value = {
    ...conversionOptions.value,
    data: [
      { asset: 'Converted', amount: convertedQuotes },
      { asset: 'Unconverted', amount: unconvertedQuotes }
    ],
    series: [
      {
        ...conversionOptions.value.series[0],
        innerLabels: [
          {
            text: `${(convertedQuotes / totalQuotes) * 100}%`,
            spacing: 4,
            fontSize: 14,
            color: 'black'
          }
        ]
      }
    ]
  }

  inForceSchemesOptions.value = {
    ...inForceSchemesOptions.value,
    data: [
      { asset: 'Renewal', amount: inForceSchemesRenewal },
      { asset: 'New Business', amount: inForceSchemesNew }
    ],
    series: [
      {
        ...inForceSchemesOptions.value.series[0],
        innerLabels: [
          {
            text: `Total ${inForceSchemesTotal}m`,
            spacing: 4,
            fontSize: 14,
            color: 'black'
          }
        ]
      }
    ]
  }

  newQuoteOptions.value = {
    ...newQuoteOptions.value,
    data: [
      { asset: 'InProgress', amount: newQuotesInProgress },
      { asset: 'Approved', amount: newQuotesApproved },
      { asset: 'Accepted', amount: newQuotesAccepted }
    ],
    series: [
      {
        type: 'donut',
        calloutLabelKey: 'asset',
        calloutLabel: {
          enabled: false
        },
        angleKey: 'amount',
        innerRadiusRatio: 0.6,
        innerLabels: [
          {
            text: totalnewQuotes,
            spacing: 4,
            fontSize: 14,
            color: 'black'
          }
        ],
        innerCircle: {
          fill: '#c9fdc9'
        },
        showInLegend: true
      }
    ]
  }

  renewalsOptions.value = {
    ...renewalsOptions.value,
    data: [
      { asset: 'InProgress', amount: newQuotesInProgress },
      { asset: 'Approved', amount: newQuotesApproved },
      { asset: 'Accepted', amount: newQuotesAccepted }
    ],
    series: [
      {
        type: 'donut',
        calloutLabelKey: 'asset',
        calloutLabel: {
          enabled: false
        },
        angleKey: 'amount',
        innerRadiusRatio: 0.6,
        innerLabels: [
          {
            text: totalrenewalQuotes,
            spacing: 4,
            fontSize: 14,
            color: 'black'
          }
        ],
        innerCircle: {
          fill: '#c9fdc9'
        },
        showInLegend: true
      }
    ]
  }
}

const getExposureData = async () => {
  try {
    console.log(
      'Getting exposure data for:',
      selectedBenefit.value,
      ' and year:',
      selectedYear.value
    )
    if (selectedBenefit.value && selectedYear.value) {
      console.log('Getting exposure data for:', selectedBenefit.value)
      const res = await GroupPricingService.getExposureData(
        selectedYear.value,
        selectedBenefit.value
      )
      console.log(res.data)
      exposureOptions.value = {
        ...exposureOptions.value,
        title: {
          text: `${selectedBenefit.value} Exposure (${selectedYear.value})`,
          fontSize: 14,
          fontWeight: 'bold'
        },
        background: {
          fill: 'aliceblue'
        },
        data: res.data
      }
      exposureGenderOptions.value = {
        ...exposureGenderOptions.value,
        title: {
          text: `${selectedBenefit.value} Exposure (${selectedYear.value})`,
          fontSize: 14,
          fontWeight: 'bold'
        },
        background: {
          fill: 'aliceblue'
        },
        data: res.data
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const conversionOptions: any = ref<AgChartOptions>({
  // Data: Data to be displayed in the chart
  data: [
    { asset: 'Converted', amount: 39 },
    { asset: 'Unconverted', amount: 61 }
  ],
  title: {
    text: 'Quote Conversion',
    fontSize: 14,
    fontWeight: 'bold'
  },
  // Series: Defines which chart type and data to use
  series: [
    {
      type: 'donut',
      calloutLabelKey: 'asset',
      calloutLabel: {
        enabled: false
      },
      angleKey: 'amount',
      innerRadiusRatio: 0.6,
      innerLabels: [
        {
          text: 'Total Quotes',
          fontWeight: 'bold'
        },
        {
          text: `100`,
          spacing: 4,
          fontSize: 14,
          color: 'black'
        }
      ],
      innerCircle: {
        fill: '#c9fdc9'
      },
      showInLegend: true
    }
  ]
})

const inForceSchemesOptions: any = ref<AgChartOptions>({
  // Data: Data to be displayed in the chart
  data: [
    { asset: 'Converted', amount: 39 },
    { asset: 'Unconverted', amount: 61 }
  ],
  title: {
    text: 'Inforce Schemes',
    fontSize: 14,
    fontWeight: 'bold'
  },
  // Series: Defines which chart type and data to use
  series: [
    {
      type: 'donut',
      calloutLabelKey: 'asset',
      calloutLabel: {
        enabled: false
      },
      angleKey: 'amount',
      innerRadiusRatio: 0.6,
      innerLabels: [
        {
          text: 'Total Quotes',
          fontWeight: 'bold'
        },
        {
          text: `${inForceInnerLabel.value}`,
          spacing: 4,
          fontSize: 14,
          color: 'black'
        }
      ],
      innerCircle: {
        fill: '#c9fdc9'
      },
      showInLegend: true
    }
  ]
})

const newQuoteOptions: any = ref<AgChartOptions>({
  // Data: Data to be displayed in the chart
  data: [
    { asset: 'InProgress', amount: 39 },
    { asset: 'Approved', amount: 61 },
    { asset: 'Accepted', amount: 20 }
  ],
  title: {
    text: 'New Quotes',
    fontSize: 14,
    fontWeight: 'bold'
  },
  // Series: Defines which chart type and data to use
  series: [
    {
      type: 'donut',
      calloutLabelKey: 'asset',
      calloutLabel: {
        enabled: false
      },
      angleKey: 'amount',
      innerRadiusRatio: 0.6,
      innerLabels: [
        {
          text: 'Total Quotes',
          fontWeight: 'bold'
        },
        {
          text: `${newQuotesTotalCount.value}`,
          spacing: 4,
          fontSize: 14,
          color: 'black'
        }
      ],
      innerCircle: {
        fill: '#c9fdc9'
      },
      showInLegend: true
    }
  ]
})

const renewalsOptions: any = ref<AgChartOptions>({
  // Data: Data to be displayed in the chart
  data: [
    { asset: 'InProgress', amount: 39 },
    { asset: 'Approved', amount: 61 },
    { asset: 'Accepted', amount: 20 }
  ],
  title: {
    text: 'Renewals',
    fontSize: 14,
    fontWeight: 'bold'
  },
  // Series: Defines which chart type and data to use
  series: [
    {
      type: 'donut',
      calloutLabelKey: 'asset',
      calloutLabel: {
        enabled: false
      },
      angleKey: 'amount',
      innerRadiusRatio: 0.6,
      innerLabels: [
        {
          text: 'Total Quotes',
          fontWeight: 'bold'
        },
        {
          text: `${newQuotesTotalCount.value}`,
          spacing: 4,
          fontSize: 14,
          color: 'black'
        }
      ],
      innerCircle: {
        fill: '#c9fdc9'
      },
      showInLegend: true
    }
  ]
})

const revenueOptions: any = ref<AgChartOptions>({
  data: [
    { type: 'GLA', revenue: 420000, claims: 252000 },
    { type: 'PTD', revenue: 120000, claims: 72000 },
    { type: 'CI', revenue: 60000, claims: 36000 },
    { type: 'SGLA', revenue: 180000, claims: 108000 },
    { type: 'PHI', revenue: 252000, claims: 151200 },
    { type: 'TTD', revenue: 120000, claims: 72000 },
    { type: 'GFF', revenue: 48000, claims: 28000 }
  ],
  title: {
    text: 'Total Revenue by Benefit',
    fontSize: 14,
    fontWeight: 'bold'
  },
  series: [
    {
      type: 'bar',
      xKey: 'type',
      yKey: 'revenue',
      yName: 'Revenue'
    },
    {
      type: 'bar',
      xKey: 'type',
      yKey: 'claims',
      yName: 'Claims'
    }
  ]
})

const gicOptions: any = ref<AgChartOptions>({
  data: [
    { type: 'GLA', expected: 420000, actual: 252000 },
    { type: 'PTD', expected: 120000, actual: 72000 },
    { type: 'CI', expected: 60000, actual: 36000 },
    { type: 'SGLA', expected: 180000, actual: 108000 },
    { type: 'PHI', expected: 252000, actual: 151200 },
    { type: 'TTD', expected: 120000, actual: 72000 },
    { type: 'GFF', expected: 48000, actual: 28000 }
  ],
  title: {
    text: 'Income Statement Components',
    fontSize: 14,
    fontWeight: 'bold'
  },
  series: [
    {
      type: 'bar',
      xKey: 'type',
      yKey: 'expected',
      yName: 'Expected'
    },
    {
      type: 'bar',
      xKey: 'type',
      yKey: 'actual',
      yName: 'Actual'
    }
  ]
})

const exposureOptions: any = ref<AgChartOptions>({
  theme: paperTheme,
  data: [],
  title: {
    text: `${selectedBenefit.value} Exposure`,
    fontSize: 14,
    fontWeight: 'bold'
  },
  legend: {
    enabled: true
  },
  series: [
    {
      type: 'bar',
      xKey: 'age_band',
      xName: 'Age Band',
      yKey: 'total_sum_assured',
      yName: 'Total Sum Assured',
      stroke: '#000000',
      strokeWidth: 1
    }
  ]
})

const exposureGenderOptions: any = ref<AgChartOptions>({
  data: [],
  title: {
    text: `${selectedBenefit.value} Exposure`,
    fontSize: 14,
    fontWeight: 'bold'
  },
  series: [
    {
      type: 'bar',
      xKey: 'age_band',
      xName: 'Age Band',
      yKey: 'male_sum_assured',
      yName: 'Male Sum Assured'
    },
    {
      type: 'bar',
      xKey: 'age_band',
      xName: 'Age Band',
      yKey: 'female_sum_assured',
      yName: 'Female Sum Assured'
    }
  ]
})

const cards = ref([
  { title: 'Annual Premium', value: '100 M', flex: 3 },
  { title: 'Scheme Count', value: '24', flex: 3 },
  { title: 'Expected Claims', value: '218', flex: 3 },
  { title: 'Expense Recovery', value: '20', flex: 3 },
  { title: 'Commissions', value: '340002.4', flex: 3 },
  { title: 'Gross Profit', value: '200 M', flex: 3 }
])

const roundUpToTwoDecimals = (num) => {
  const roundedNum = Math.ceil(num * 100) / 100 // Round up to two decimal places
  return roundedNum
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    .replace(/,/g, ' ') // Replace commas with spaces for accounting format }
}

const refreshDashboard = async () => {
  if (selectedYear.value) {
    console.log('Refreshing Dashboard for year:', selectedYear.value)
    const res = await GroupPricingService.getDashboardData(selectedYear.value)
    console.log(res.data)
    data = res.data

    // newQuotesTotalPremium.value = res.data.new_quotes_total_premium
    // newQuotesTotalCount.value = res.data.new_quotes_total_count
    // newQuotesConvertedPremium.value = res.data.in_force_quotes
    // get the following data for the selected year
    // 1. Quote Conversion

    changeChartDataSource()

    // 2. Total Revenue by Benefit
    gicOptions.value = {
      ...gicOptions.value,
      data: res.data.income_statement_components
    }

    revenueOptions.value = {
      ...revenueOptions.value,
      data: res.data.revenue_benefits
    }
    // 3. Annual Premium
    cards.value = res.data.card_data
    // 4. Scheme Count
    // 5. Expected Claims
    // 6. Expense Recovery
    // 7. Commissions
    // 8. Gross Profit

    // if (selectedYear.value === '2024') {
    //   console.log('Setting data for 2024')
    //   options.value = {
    //     ...options.value,
    //     data: [
    //       { asset: 'Converted', amount: 19 },
    //       { asset: 'Unconverted', amount: 81 }
    //     ]
    //   }

    //   console.log(options.value)

    //   revenueOptions.value.data = [
    //     { category: 'GLA', revenue: 420000, claims: 252000 },
    //     { category: 'PTD', revenue: 120000, claims: 72000 },
    //     { category: 'CI', revenue: 60000, claims: 36000 },
    //     { category: 'SGLA', revenue: 180000, claims: 108000 },
    //     { category: 'PHI', revenue: 252000, claims: 151200 },
    //     { category: 'TTD', revenue: 120000, claims: 72000 },
    //     { category: 'GFF', revenue: 48000, claims: 28000 }
    //   ]
    // }
    getExposureData()
  }
}
// const roundUpToTwoDecimals = (num) => {
//   const roundedNum = Math.ceil(num * 100) / 100 // Round up to two decimal places
//   return roundedNum
//     .toLocaleString('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     })
//     .replace(/,/g, ' ') // Replace commas with spaces for accounting format }
// }
</script>
<style lang="css" scoped>
.card-bg {
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
  border-radius: 3px;
  margin: 0px;
  margin-bottom: 16px;
  padding: 0px;
}

.col-style {
  border: 1px solid green;
  padding: 0px;
  border-radius: 10px;
}

.pane-bg {
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
  border-radius: 3px;
  margin: 0px;
  padding: 0px;
}

.dash-card {
  border-radius: 10px;
  border: 1px solid #b2cbe1;
}
</style>
