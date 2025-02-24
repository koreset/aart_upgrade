<!-- eslint-disable no-use-before-define -->
<template>
  <v-container fluid>
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
            <v-row class="d-flex justify-center">
              <v-col class="card-bg mr-6" cols="3">
                <ag-charts v-if="options" :options="options"></ag-charts>
              </v-col>
              <v-col class="card-bg mr-6" cols="3">
                <ag-charts v-if="options" :options="options"></ag-charts>
              </v-col>
              <v-col class="card-bg mr-6" cols="3">
                <ag-charts v-if="options" :options="options"></ag-charts>
              </v-col>
              <v-col class="card-bg mr-6" cols="3">
                <ag-charts v-if="options" :options="options"></ag-charts>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col v-for="card in cards" :key="card.title" :cols="card.flex">
                <base-card :show-actions="false">
                  <template #header>
                    <span class="headline">{{ card.title }}</span>
                  </template>
                  <template #default>
                    <v-row>
                      <v-col class="d-flex justify-center">
                        <h3>{{ card.value }}</h3>
                      </v-col>
                    </v-row>
                  </template>
                </base-card>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <v-col cols="6" class="card-bg">
                <ag-charts v-if="options" :options="revenueOptions"></ag-charts>
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

const selectedYear = ref<string | null>(null)

const availableYears = computed(() => {
  const years: any = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear; i >= new Date().getFullYear() - 5; i--) {
    years.push(i.toString())
  }
  return years
})

const allQuotes: any = ref(0)
const convertedQuotes: any = ref(0)
// const unconvertedQuotes: any = ref(0)

// const getTotalQuotes = () => {
//   return allQuotes.value
// }

onMounted(() => {
  // set the selected year to the current year
  selectedYear.value = new Date().getFullYear().toString()
  refreshDashboard()
})

const options: any = ref<AgChartOptions>({
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
          text: `${allQuotes.value}`,
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

const cards = ref([
  { title: 'Annual Premium', value: '100 M', flex: 3 },
  { title: 'Scheme Count', value: '24', flex: 3 },
  { title: 'Expected Claims', value: '218', flex: 3 },
  { title: 'Expense Recovery', value: '20', flex: 3 },
  { title: 'Commissions', value: '340002.4', flex: 3 },
  { title: 'Gross Profit', value: '200 M', flex: 3 }
])

const refreshDashboard = async () => {
  if (selectedYear.value) {
    console.log('Refreshing Dashboard for year:', selectedYear.value)
    const res = await GroupPricingService.getDashboardData(selectedYear.value)
    console.log(res.data)
    allQuotes.value = res.data.all_quotes
    convertedQuotes.value = res.data.in_force_quotes
    // get the following data for the selected year
    // 1. Quote Conversion
    options.value = {
      ...options.value,
      data: [
        { asset: 'Converted', amount: convertedQuotes.value },
        { asset: 'Unconverted', amount: allQuotes.value - convertedQuotes.value }
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
              text: 'Total Quotes',
              fontWeight: 'bold'
            },
            {
              text: `${allQuotes.value}`,
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
    // 2. Total Revenue by Benefit
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
  }
}
</script>
<style lang="css" scoped>
.card-bg {
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
  border-radius: 3px;
  margin: 1px;
  margin-bottom: 16px;
  padding: 1px;
}
</style>
