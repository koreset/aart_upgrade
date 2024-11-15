<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">PAA Run Results ({{ portfolioName }}) </span>
          </template>
          <template #default>
            <v-row class="mb-3">
              <v-col>
                <v-btn variant="plain" :to="'/valuations/paa/run-results'">
                  {{ backButtonTitle }}
                </v-btn>
              </v-col>
            </v-row>
            <loading-indicator :loading-data="loadingData"></loading-indicator>

            <base-card v-if="!loadingData" :show-actions="false">
              <template #header>
                <span class="headline">Aggregated Results</span>
              </template>
              <template #default>
                <v-row>
                  <v-col>
                    <data-grid :showExport="true" :columnDefs="cDefs" :rowData="rowData" />
                  </v-col>
                </v-row>
              </template>
            </base-card>
            <base-card v-if="scopedRowData.length > 0 && !loadingData" :show-actions="false">
              <template #header>
                <span class="headline">Scoped Aggregated Results</span>
              </template>
              <template #default>
                <v-row>
                  <v-col>
                    <data-grid :showExport="true" :columnDefs="spCDefs" :rowData="scopedRowData" />
                  </v-col>
                </v-row>
              </template>
            </base-card>
            <base-card v-if="runSettings !== null && !loadingData" :show-actions="false">
              <template #header>
                <span class="headline">Run Settings</span>
              </template>
              <template #default>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="text-left table-col">Run Name</th>
                      <th class="text-left table-col">Run Date</th>
                      <th class="text-left table-col">Portfolio Name</th>
                      <th class="text-left table-col">Model Points</th>
                      <th class="text-left table-col">Model Point Version</th>
                      <th class="text-left table-col">Parameters</th>
                      <th class="text-left table-col">Premium Earning</th>
                      <th class="text-left table-col">Year End Month</th>
                      <th class="text-left table-col">Shock Setting</th>
                      <th class="text-left table-col">IFRS17 Aggregation</th>
                      <th class="text-left table-col">Individual Results</th>
                      <th class="text-left table-col">User</th>
                      <th class="text-left table-col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ runSettings.name }}</td>
                      <td>{{ runSettings.run_date }}</td>
                      <td>{{ runSettings.portfolio_name }}</td>
                      <td>{{ runSettings.model_point }}</td>
                      <td>{{ runSettings.model_point_version }}</td>

                      <td>{{ runSettings.parameter_year }}</td>
                      <td>{{ runSettings.premium_earning }}</td>
                      <td>{{ runSettings.year_end_month }}</td>
                      <td>{{ checkSetting(runSettings.shock_setting.name) }}</td>
                      <td>{{ runSettings.ifrs17_aggregation }}</td>
                      <td>{{ runSettings.individual_results }}</td>
                      <td>{{ runSettings.user_name }}</td>
                      <td>{{ runSettings.user_email }}</td>
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
import BaseCard from '../../../components/BaseCard.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import formatValues from '../../../utils/format_values.js'
import DataGrid from '../../../components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

const runId: any = ref(null)
const loadingComplete = ref(false)
const rowData: any = ref([])
const scopedRowData: any = ref([])
const groupList: any = ref([])
const runSettings: any = ref(null)
const cDefs: any = ref([])
const spCDefs: any = ref([])
const gridOptions: any = ref(null)
const backButtonTitle = 'Back to Projection Runs'
const portfolioName = ref('')
const loadingData = ref(false)

onMounted(() => {
  console.log('mounted')
  const route = useRoute()
  console.log(route)
  runId.value = route.params.id
  loadingComplete.value = false
  gridOptions.value = {}
  loadingData.value = true
  ModifiedGMMService.getProjections(runId.value).then((res: any) => {
    console.log(res.data)
    rowData.value = res.data.results
    scopedRowData.value = res.data.scoped_results
    groupList.value = res.data.groups
    runSettings.value = res.data.run_settings
    portfolioName.value = runSettings.value.name
    console.log('runSettings.value', runSettings.value)
    console.log('portfolioName.value', portfolioName.value)

    if (rowData.value.length > 0) {
      console.log('rowData.value', rowData.value)
      cDefs.value = createColumnDefs(rowData.value)
    }

    if (scopedRowData.value.length > 0) {
      console.log('scopedRowData.value', scopedRowData.value)
      spCDefs.value = createScopedColumnDefs(scopedRowData.value)
    }

    loadingComplete.value = true
    loadingData.value = false
  })
})

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
        width: 150,
        valueFormatter: formatValues
      })
    })
    gridOptions.value.columnDefs = columnDefs
    return columnDefs
  }
}

const createScopedColumnDefs = (rowData: any) => {
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

const checkSetting = (setting: string) => {
  if (setting === '') {
    return 'None'
  }
  return setting
}
</script>

<style scoped>
.full-width-underline {
  position: relative;
  display: block;
}

.full-width-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  /* Adjust as needed */
  width: 100%;
  height: 2px;
  /* Adjust as needed */
  background-color: grey;
  /* Uses the color of the text */
}
</style>
