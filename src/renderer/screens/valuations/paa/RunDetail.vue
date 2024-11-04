<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">PAA Run Results ({{ runSettings.name }}) </span>
          </template>
          <template #default>
            <v-row class="mb-3">
              <v-col>
                <v-btn variant="plain" :to="'/valuations/paa/run-results'">
                  {{ backButtonTitle }}
                </v-btn>
              </v-col>
            </v-row>

            <base-card>
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
            <base-card>
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

const runId: any = ref(null)
const loadingComplete = ref(false)
const rowData: any = ref([])
const scopedRowData: any = ref([])
const groupList: any = ref([])
const runSettings: any = ref({})
const cDefs: any = ref([])
const spCDefs: any = ref([])
const gridOptions: any = ref(null)
const backButtonTitle = 'Back to Projection Runs'

onMounted(() => {
  console.log('mounted')
  const route = useRoute()
  console.log(route)
  runId.value = route.params.id
  loadingComplete.value = false
  gridOptions.value = {}

  ModifiedGMMService.getProjections(runId.value).then((res: any) => {
    console.log(res.data)
    rowData.value = res.data.results
    scopedRowData.value = res.data.scoped_results
    groupList.value = res.data.groups
    runSettings.value = res.data.run_settings
    console.log('runSettings.value', runSettings.value)

    if (scopedRowData.value.length > 0) {
      console.log(scopedRowData.value)
      spCDefs.value = createColumnDefs(scopedRowData.value)
    }

    if (rowData.value.length > 0) {
      console.log(rowData.value)
      cDefs.value = createColumnDefs(rowData.value)
    }

    loadingComplete.value = true
  })
})

// const createColumnDefs = (data: any) => {
//   const columnDefs: any = [];
//   Object.keys(data).forEach((element) => {
//     const column: any = {};
//     column.headerName = element;
//     column.field = element;
//     column.valueFormatter = formatValues;
//     column.minWidth = 200;
//     columnDefs.push(column);
//   });
//   gridOptions.value.columnDefs = columnDefs;

//   return columnDefs;
// }

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

// const createScopedColumnDefs = (rowData: any) => {
//   if (rowData === null || rowData.length === 0) {
//     return [];
//   }
//   if (rowData !== null && rowData.length > 0) {
//     const columnDefs: any = [];
//     const keys = Object.keys(rowData[0]);
//     keys.forEach((key) => {
//       columnDefs.push({
//         headerName: key,
//         field: key,
//         sortable: true,
//         filter: true,
//         resizable: true,
//         width: 150,
//       });
//     });
//     gridOptions.value.columnDefs = columnDefs;
//     return columnDefs;
//   }
// }
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
