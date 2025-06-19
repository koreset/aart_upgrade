<template>
  <v-dialog v-model="dialog" max-width="1024px">
    <base-card :show-actions="false">
      <template #header>
        <span class="headline">Historical Credibility Data</span>
        <v-btn
          size="small"
          color="primary"
          icon
          class="float-right"
          style="position: absolute; top: 8px; right: 8px; z-index: 2"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #default>
        <div v-if="loading" class="text-center my-4">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else>
          <v-row class="mb-2">
            <v-col cols="12" md="8">
              <v-slider
                v-model="experiencePeriodRange"
                :min="experiencePeriodMin"
                :max="experiencePeriodMax"
                :step="1"
                range
                label="Experience Period Range"
                thumb-label
                class="mt-2"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedYear"
                variant="outlined"
                density="compact"
                :items="yearOptions"
                label="Year"
                clearable
                class="mt-2"
              />
            </v-col>
          </v-row>
          <v-btn-toggle v-model="selectedView" class="mb-4" mandatory>
            <v-btn value="credibility">Credibility Scatter</v-btn>
            <v-btn value="schemes">Scheme Member Count</v-btn>
          </v-btn-toggle>
          <ag-charts
            v-if="chartOptions"
            :options="chartOptions"
            style="height: 500px; width: 100%"
          />
          <div v-else class="text-center">No data available.</div>
        </div>
      </template>
      <template #actions>
        <v-spacer></v-spacer>
        <v-btn rounded variant="text" @click="close">Close</v-btn>
      </template>
    </base-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { AgCharts } from 'ag-charts-vue3'
// import type { Options } from 'ag-charts-types'
import BaseCard from '../BaseCard.vue'
import GroupPricingService from '../../api/GroupPricingService'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const dialog = ref(props.modelValue)
const loading = ref(false)
const chartOptions: any = ref(null)
const selectedView = ref('credibility')
let allData: any[] = []

const experiencePeriodRange: any = ref(0)
const experiencePeriodMin = ref(1)
const experiencePeriodMax = ref(10)
const selectedYear = ref<number | null>(null)
const yearOptions = ref<number[]>([])

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
    if (val) fetchData()
  }
)
watch(dialog, (val) => emit('update:modelValue', val))
watch(selectedView, () => {
  updateChartOptions()
})
watch(experiencePeriodRange, () => {
  filterData()
})
watch(selectedYear, () => {
  filterData()
})

function getFilteredData() {
  const minPeriod = experiencePeriodMin.value
  const maxPeriod = experiencePeriodRange.value
  const year = selectedYear.value
  console.log('Filtering Data:', {
    minPeriod,
    maxPeriod,
    year,
    allDataLength: allData.length
  })
  if (!allData || allData.length === 0) return []
  // Filter data based on experience period and selected year
  if (minPeriod > maxPeriod) return []
  if (minPeriod < experiencePeriodMin.value || maxPeriod > experiencePeriodMax.value) {
    return []
  }
  // if (selectedYear.value !== null && !yearOptions.value.includes(selectedYear.value)) {
  //   return []
  // }
  // Return filtered data
  if (selectedYear.value === null && experiencePeriodRange.value === experiencePeriodMax.value) {
    return allData
  }
  // Filter based on experience period and year
  const filteredData = allData.filter(
    (d) =>
      d.experience_period >= minPeriod &&
      d.experience_period <= experiencePeriodRange.value &&
      (selectedYear.value === null || d.year === selectedYear.value)
  )
  console.log('Filtered Data:', filteredData)
  return filteredData
}

async function fetchData() {
  loading.value = true
  chartOptions.value = null
  try {
    const res = await GroupPricingService.getHistoricalCredibilityData()
    allData = res.data || []
    // Populate year options from data
    yearOptions.value = Array.from(new Set(allData.map((d) => d.year))).sort((a, b) => b - a)
    // Set min/max for experience period from data
    const periods = allData.map((d) => d.experience_period)
    experiencePeriodMin.value = Math.min(...periods)
    experiencePeriodMax.value = Math.max(...periods)
    experiencePeriodRange.value = experiencePeriodMax.value
    updateChartOptions()
  } catch (e) {
    chartOptions.value = null
  } finally {
    loading.value = false
  }
}

function filterData() {
  const filteredData = getFilteredData()
  chartOptions.value.data = filteredData
  updateChartOptions()
}

function updateChartOptions() {
  const filteredData = getFilteredData()
  if (selectedView.value === 'credibility') {
    chartOptions.value = {
      title: { text: 'Member Count vs Credibility' },
      data: filteredData,
      series: [
        {
          type: 'scatter',
          xKey: 'member_count',
          yKey: 'calculated_credibility',
          marker: { size: 8, fill: '#1976d2' },
          labelKey: 'member_count',
          yName: 'Calculated Credibility'
        },
        {
          type: 'scatter',
          xKey: 'member_count',
          yKey: 'manually_added_credibility',
          marker: { size: 8, fill: '#e53935', shape: 'square' },
          labelKey: 'member_count',
          yName: 'Manual Credibility'
        }
      ],
      axes: [
        {
          type: 'number',
          position: 'bottom',
          title: { text: 'Member Count' },
          key: 'member_count'
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Credibility' },
          key: 'calculated_credibility'
        }
      ]
    }
  } else if (selectedView.value === 'schemes') {
    chartOptions.value = {
      title: { text: 'Scheme vs Member Count' },
      data: filteredData,
      series: [
        {
          type: 'bar',
          xKey: 'scheme_name',
          yKey: 'member_count',
          yName: 'Member Count',
          fill: '#1976d2'
        }
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: { text: 'Scheme' },
          key: 'scheme_name'
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Member Count' },
          key: 'member_count'
        }
      ]
    }
  }
}

function close() {
  dialog.value = false
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
.my-4 {
  margin: 1.5rem 0;
}
</style>
