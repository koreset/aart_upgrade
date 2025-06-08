<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <v-container>
    <v-row v-if="tableTitle">
      <v-col cols="12">
        <h4 class="h4-title title-display"
          ><span>{{ tableTitle }} Data</span
          ><span v-if="showCloseButton" class="text-left"
            ><v-btn variant="plain" size="small" @click="clearRowData">Close</v-btn></span
          ></h4
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
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
          v-if="showFullExport"
          size="small"
          color="primary"
          rounded
          :loading="exportLoader"
          class="custom-btn ml-4 primary white--text mt-4"
          @click="exportDataExcel"
          >Export All</v-btn
        >
        <p v-if="exportLoader" class="mt-4">processing data. this will take a while...</p>

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
          :readOnlyEdit="true"
          :enableRangeSelection="enableRangeSelection"
          :enableCharts="enableCharts"
          :statusBar="statusBar"
          style="height: 500px"
          class="ag-theme-quartz"
          :rowData="localRowData"
          :columnDefs="localColumnDefs"
          :autoSizeStrategy="autoSizeStrategy"
          @row-selected="onRowSelected"
          @grid-ready="onGridReady"
          @cell-edit-request="OnCellEditRequest"
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
import ValuationService from '@/renderer/api/ValuationService'

const props = defineProps<{
  rowData?: any[]
  columnDefs: any[]
  rowModel?: string
  pagination?: boolean
  rowSelection?: string | null
  tableTitle?: string | null
  rowCount?: number
  tableName?: string | null
  chartTitle?: string | null
  chartXAxisTitle?: string | null
  chartYAxisTitle?: string | null
  showExport?: boolean
  showCloseButton?: boolean
  showFullExport?: boolean
  runId?: string
  productCode?: string
  runName?: string
}>()

// const emit = defineEmits(['delete-row'])

const emit = defineEmits<{
  (e: 'update:row-deleted', value: any): void
  (e: 'update:clear-data', value: any): void
  (e: 'update-column', value: { colId: string; newValue: any }): void
}>()

// Grid variables
const showDeleteButton = ref(false)
const selectedRow = ref(null)
const exportLoader = ref(false)

// const localRowData = ref(props.rowData)
// const localColumnDefs = ref(props.columnDefs)
const localRowData = computed(() => props.rowData)
const localColumnDefs = computed(() => props.columnDefs)

const localShowExport = ref(true)

const gridApi: any = ref(null)
const columnApi: any = ref(null)

// Define the autoSizeStrategy
const autoSizeStrategy = ref({
  type: 'fitCellContents'
  // You can also provide 'skipHeader: false' here, but it's the default.
  // skipHeader: false
})

const autoSizeAll = (skipHeader: boolean) => {
  const allColumnIds: string[] = []
  gridApi.value!.getColumns()!.forEach((column) => {
    allColumnIds.push(column.getId())
  })
  gridApi.value!.autoSizeColumns(allColumnIds, skipHeader)
}

const onGridReady = (params) => {
  gridApi.value = params.api
  columnApi.value = params.columnApi
  gridApi.value.autoSizeAllColumns()

  autoSizeAll(false)
}

const OnCellEditRequest = (event) => {
  const colId = event.column.getColId()
  const newValue = event.newValue

  console.log(`Request to update entire '${colId}' column to '${newValue}'`)

  // 3. Emit the change request to the parent component
  emit('update-column', { colId, newValue })
}

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
  gridApi.value.exportDataAsCsv({
    suppressQuotes: true,
    allColumns: true
  })
}

const exportDataExcel = async () => {
  exportLoader.value = true
  const response = await ValuationService.getExcelResults(props.runId, null)
  exportLoader.value = false

  const fileURL = window.URL.createObjectURL(new Blob([response.data]))
  const fileLink = document.createElement('a')

  fileLink.href = fileURL
  fileLink.setAttribute(
    'download',
    'agg-results_' + props.runName + '_' + props.productCode + '.xlsx'
  )
  document.body.appendChild(fileLink)

  fileLink.click()

  // PricingService.getPricingExcelControlResults(
  //   runId.value,
  //   selectedScenario.value.id,
  //   product.value.product_code
  // ).then((response) => {
  //   const fileURL = window.URL.createObjectURL(new Blob([response.data]))
  //   const fileLink = document.createElement('a')

  //   fileLink.href = fileURL
  //   fileLink.setAttribute(
  //     'download',
  //     'pricing-control-' + runId.value + '-' + selectedScenario.value.description + '.xlsx'
  //   )
  //   document.body.appendChild(fileLink)

  //   fileLink.click()
  // })
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

const clearRowData = () => {
  emit('update:clear-data', null)
}
</script>

<style scoped>
.title-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.h4-title {
  width: 100%;
  border-bottom: 1px solid #b4b3b3;
}
</style>
