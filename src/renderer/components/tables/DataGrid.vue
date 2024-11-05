<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <v-container>
    <v-row v-if="tableTitle">
      <v-col cols="12">
        <h4 style="width: 100%; border-bottom: 1px solid #b4b3b3">{{ tableTitle }} Data</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-btn
          v-if="showExport"
          size="small"
          color="primary"
          rounded
          class="custom-btn primary white--text mt-4"
          @click="exportDataCsv"
          >Export to Csv</v-btn
        >
        <v-btn
          v-if="showDeleteButton"
          size="small"
          variant="outlined"
          rounded
          color="red"
          class="custom-btn primary white--text ml-4 mt-4"
          @click="deleteRow"
          >Delete Selected</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ag-grid-vue
          :enableRangeSelection="enableRangeSelection"
          :enableCharts="enableCharts"
          :statusBar="statusBar"
          style="height: 500px"
          class="ag-theme-quartz"
          :rowData="localRowData"
          :columnDefs="localColumnDefs"
          @row-selected="onRowSelected"
          @grid-ready="onGridReady"
        >
        </ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import 'ag-grid-community/styles/ag-grid.css' // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css' // Theme
import { AgGridVue } from 'ag-grid-vue3' // Vue Grid Logic
import { ref, watch, computed } from 'vue'

const props = defineProps([
  'rowData',
  'columnDefs',
  'rowModel',
  'pagination',
  'rowSelection',
  'tableTitle',
  'rowCount',
  'tableName',
  'chartTitle',
  'chartXAxisTitle',
  'chartYAxisTitle',
  'showExport'
])

// const emit = defineEmits(['delete-row'])

const emit = defineEmits<{
  (e: 'update:row-deleted', value: any): void
}>()

// Grid variables
const showDeleteButton = ref(false)
const selectedRow = ref(null)

// const localRowData = ref(props.rowData)
// const localColumnDefs = ref(props.columnDefs)
const localRowData = computed(() => props.rowData)
const localColumnDefs = computed(() => props.columnDefs)

const localShowExport = ref(true)

const gridApi = ref(null)
const columnApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
  columnApi.value = params.columnApi
}

// watch(
//   () => props.rowData,
//   (newVal) => {
//     localRowData.value = newVal
//     // emit('update:rowData', newVal);
//   }
// )

// watch(
//   () => props.columnDefs,
//   (newVal) => {
//     localColumnDefs.value = newVal
//     // emit('update:columnDefs', newVal);
//   }
// )

watch(
  () => props.showExport,
  (newVal) => {
    localShowExport.value = newVal
    // emit('update:showExport', newVal);
  }
)

const enableRangeSelection = true
const enableCharts = true
const statusBar = {
  statusPanels: [
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
    {
      statusPanel: 'agAggregationComponent',
      statusPanelParams: {
        // possible values are: 'count', 'sum', 'min', 'max', 'avg'
        aggFuncs: ['avg', 'sum']
      }
    }
  ]
}

const exportDataCsv = () => {
  // gridApi.exportDataAsCsv({
  //   // suppressQuotes: true,
  //   allColumns: true,
  // });
}

const onRowSelected = (event) => {
  if (event.api.getSelectedRows().length > 0) {
    showDeleteButton.value = true
    selectedRow.value = event.api.getSelectedRows()[0]
  } else {
    showDeleteButton.value = false
    selectedRow.value = null
  }
}

const deleteRow = () => {
  if (selectedRow.value == null) return
  // this.gridApi.applyTransaction({ remove: [this.selectedRow] });
  // emit event to parent component
  emit('update:row-deleted', selectedRow.value)
}
</script>

<style scoped></style>
