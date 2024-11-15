<template>
  <base-card :show-actions="false">
    <template #header>
      {{ title }}
    </template>
    <template #default>
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-select
              v-model="selectedComponent"
              variant="outlined"
              flat
              density="compact"
              label="Select a component"
              :items="incomeComponents"
              item-value="code"
              item-title="name"
              return-object
              @update:model-value="updateGraph"
            ></v-select> </v-col
          ><v-col cols="3">
            <v-select
              v-model="timeSpan"
              variant="outlined"
              flat
              density="compact"
              label="Period"
              :items="periodItems"
              item-value="period"
              item-title="period"
              @update:model-value="setTimeSpan"
            ></v-select>
            <!-- <v-btn :class="`text--white mr-4 ` + yearActive" @click="setTimeSpan('year')">Year</v-btn>
            <v-btn :class="`text--white mr-4 ` + monthActive" @click="setTimeSpan('month')">Month</v-btn> -->
          </v-col>
          <v-col cols="5">
            <v-checkbox
              v-if="timeSpan == 'Month'"
              v-model="showFirstYear"
              class="mt-0"
              dense
              label="Show first year only"
              @change="updateGraph"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <Chart class="chart" :options="chartOptions" :update-args="updateArgs"></Chart>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductService from '../../api/ProductService'
import { Chart } from 'highcharts-vue'
import BaseCard from '../BaseCard.vue'
// data
const timeSpan = ref('Month')
const monthActive = ref('month-active')
const yearActive = ref('')
const periodItems = ref([{ period: 'Year' }, { period: 'Month' }])
const selectedComponent = ref({ code: 'prem_', name: 'Premiums' })
const showFirstYear = ref(false)
const incomeComponents = ref([
  { code: 'prem_', name: 'Premiums' },
  { code: 'exp_', name: 'Expenses' },
  { code: 'binder_', name: 'Binder' },
  { code: 'claim_', name: 'Claims' },
  { code: 'comm_', name: 'Commissions' }
])

const title = ref('Monthly Income Statement Components (Actual vs Expected)')
const updateArgs = ref([true, true, { duration: 1000 }])
const chartOptions: any = ref({
  credits: {
    enabled: false
  },
  chart: { type: 'column' },
  title: { text: '' },
  xAxis: { categories: [], title: { text: 'Month' } },
  yAxis: { title: { text: 'Amount' } },
  series: []
})
const monthlyData = ref([])
const annualData = ref([])

// methods
const setTimeSpan = () => {
  updateGraph()
}

const updateGraph = () => {
  // Monthly
  if (timeSpan.value === 'Month') {
    chartOptions.value.xAxis.categories = []
    chartOptions.value.series = []
    const series1: any = { name: 'Actual', color: '#edc356', data: [] }
    const series2: any = { name: 'Budget', color: '#777eda', data: [] }
    if (showFirstYear.value) {
      monthlyData.value.forEach((item: any) => {
        if (series1.data.length < 12) {
          chartOptions.value.xAxis.categories.push(item.month)
          series1.data.push(item[selectedComponent.value.code + 'actual'])
          series2.data.push(item[selectedComponent.value.code + 'budget'])
        }
      })
    } else {
      monthlyData.value.forEach((item: any) => {
        chartOptions.value.xAxis.categories.push(item.month)
        series1.data.push(item[selectedComponent.value.code + 'actual'])
        series2.data.push(item[selectedComponent.value.code + 'budget'])
      })
    }
    chartOptions.value.xAxis.title.text = 'Month'
    chartOptions.value.series.push(series1, series2)
    monthActive.value = 'primary'
    yearActive.value = ''
  }

  // Annual
  if (timeSpan.value === 'Year') {
    chartOptions.value.xAxis.categories = []
    chartOptions.value.series = []
    const series1: any = { name: 'Actual', color: '#edc356', data: [] }
    const series2: any = { name: 'Budget', color: '#777eda', data: [] }
    annualData.value.forEach((item: any) => {
      chartOptions.value.xAxis.categories.push(item.year)
      series1.data.push(item.prem_actual)
      series2.data.push(item.prem_budget)
    })
    chartOptions.value.series.push(series1, series2)
    chartOptions.value.xAxis.title.text = 'Year'
    monthActive.value = ''
    yearActive.value = 'primary'
  }
}

const getReports = () => {
  ProductService.getMonthlyResults()
    .then((res) => {
      monthlyData.value = res.data
      chartOptions.value.xAxis.categories = []
      chartOptions.value.series = []
      const series1: any = { name: 'Actual', color: '#edc356', data: [] }
      const series2: any = { name: 'Budget', color: '#777eda', data: [] }
      monthlyData.value.forEach((item: any) => {
        chartOptions.value.xAxis.categories.push(item.month)
        series1.data.push(item.prem_actual)
        series2.data.push(item.prem_budget)
      })
      chartOptions.value.series.push(series1, series2)
      monthActive.value = 'primary'
      yearActive.value = ''
    })
    .catch((err) => {
      console.log(err)
    })
  ProductService.getAnnualResults()
    .then((res) => {
      annualData.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

onMounted(() => {
  getReports()
})
</script>

<style>
.month-active,
.year-active {
  background-color: green !important;
}
</style>
