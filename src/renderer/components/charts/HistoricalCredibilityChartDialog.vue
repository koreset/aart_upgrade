<template>
  <v-dialog v-model="dialog" max-width="1024px">
    <base-card :show-actions="false">
      <template #header>
        <span class="headline">Historical Credibility Data</span>
      </template>
      <template #default>
        <div v-if="loading" class="text-center my-4">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else>
          <v-btn-toggle v-model="selectedView" class="mb-4" mandatory>
            <v-btn value="credibility">Credibility Scatter</v-btn>
            <v-btn value="schemes">Scheme Member Count</v-btn>
          </v-btn-toggle>
          <ag-charts
            v-if="chartOptions"
            :options="chartOptions"
            style="height: 600px; width: 100%"
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
  quoteId: string | number
}>()
const emit = defineEmits(['update:modelValue'])

const dialog = ref(props.modelValue)
const loading = ref(false)
const chartOptions: any = ref(null)
const selectedView = ref('credibility')
let allData: any[] = []

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

async function fetchData() {
  loading.value = true
  chartOptions.value = null
  try {
    const res = await GroupPricingService.getHistoricalCredibilityData()
    allData = res.data || []
    updateChartOptions()
  } catch (e) {
    chartOptions.value = null
  } finally {
    loading.value = false
  }
}

function updateChartOptions() {
  if (selectedView.value === 'credibility') {
    chartOptions.value = {
      title: { text: 'Member Count vs Credibility' },
      data: allData,
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
      data: allData,
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
