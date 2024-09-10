<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :showActions="false">
          <template #header> {{ viewHeader }} </template>
          <template #default>
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-table>
                    <tbody>
                      <tr v-for="item in tables" :key="item.table_type">
                        <td style="width: 70%">{{ item.table_type }}</td>
                        <td style="text-align: center">
                          <v-btn
                            variant="outlined"
                            rounded
                            size="small"
                            @click.stop="viewTable(item)"
                          >
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>
                        </td>
                        <td style="text-align: center">
                          <bulk-file-updater
                            :uploadComplete="uploadComplete"
                            :tableType="item.table_type"
                            @uploadFile="handleUpload"
                          ></bulk-file-updater>
                        </td>
                        <td style="text-align: center">
                          <v-btn
                            variant="outlined"
                            rounded
                            size="small"
                            @click.stop="deleteTableData(item)"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-row v-if="tableData.length > 0 && !loadingData">
                <v-col>
                  <data-grid
                    :columnDefs="columnDefs"
                    :rowData="tableData"
                    :table-title="selectedTable"
                    :pagination="true"
                    :rowCount="rowCount"
                  />
                </v-col>
              </v-row>
              <v-row v-if="loadingData">
                <v-col>
                  <p class="mt-3">Loading...</p>
                  <v-progress-linear
                    buffer-value="20"
                    color="primary"
                    stream
                    value="10"
                  ></v-progress-linear>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ text }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="yieldCurveDataDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="header-title accent white--text"
          >Select Yield Curve data to delete</v-card-title
        >
        <v-card-text
          ><v-row v-if="yieldCurveYears.length > 0" class="mt-5">
            <v-col>
              <v-select
                v-model="selectedYieldCurveYear"
                variant="outlined"
                density="compact"
                label="Yield Curve Year"
                :items="yieldCurveYears"
                item-title="Year"
                item-value="Year"
                @update:model-value="getYieldCurveCodes"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="yieldCurveCodes.length > 0">
            <v-col>
              <v-select
                v-model="selectedYieldCurveCode"
                variant="outlined"
                density="compact"
                placeholder="Select an existing Yield Curve Code"
                label="Yield Curve Code"
                :items="yieldCurveCodes"
                @update:model-value="getYieldCurveMonths"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="yieldCurveMonths.length > 0">
            <v-col>
              <v-select
                v-model="selectedYieldCurveMonth"
                variant="outlined"
                density="compact"
                placeholder="Select an existing Yield Curve Month"
                label="Yield Curve Month"
                :items="yieldCurveMonths"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="selectedYieldCurveMonth !== null">
            <v-col>
              <p
                >Clicking on Delete will delete any available Yield curve data for the selected
                criteria</p
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="text" @click="deleteYieldCurveData()"
            >Delete</v-btn
          >
          <v-btn color="primary darken-1" variant="text" @click="clearYieldDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <confirmation-dialog ref="confirmDeleteDialog" />
  </v-container>
</template>

<script setup lang="ts">
import ConfirmationDialog from '../../../components/ConfirmDialog.vue'
import DataGrid from '../../../components/tables/DataGrid.vue'
import BulkFileUpdater from '../../../components/BulkFileUpdater.vue'
import BaseCard from '../../../components/BaseCard.vue'

import IbnrService from '../../../api/IbnrService'
// import ModifiedGMMService from '../../../api/ModifiedGMMService'
import formatValues from '../../../utils/format_values'
import { ref, onMounted } from 'vue'
import { DataPayload } from '../../../components/types'

// data
const viewHeader: string = 'IBNR Tables'
const confirmDeleteDialog: any = ref()
const selectedYieldCurveYear: any = ref(null)
const selectedYieldCurveCode: any = ref(null)
const selectedYieldCurveMonth: any = ref(null)
const yieldCurveMonths: any = ref([])
const yieldCurveCodes: any = ref([])
const yieldCurveYears: any = ref([])
const loadingData: any = ref(false)
const rowCount: any = ref(0)
const tableData: any = ref([])
const selectedTable: any = ref('')
const tables: any = ref([
  { name: 'Parameters' },
  { name: 'Yield Curve' },
  { name: 'Margins' },
  { name: 'Shocks' }
])

const text: any = ref('')
const yieldCurveDataDialog: any = ref(false)
const columnDefs: any = ref([])
const dialog: any = ref(false)

const uploadComplete = ref(false)
const snackbarText: any = ref(null)
const timeout: any = ref(3000)
const snackbar: any = ref(false)

onMounted(() => {
  loadingData.value = true
  IbnrService.getLicTableMetaData().then((res) => {
    tables.value = res.data.lic_tables
    console.log(tables.value)
    loadingData.value = false
  })
})

// methods
const handleUpload = (payload: DataPayload) => {
  console.log(payload)
  uploadComplete.value = false
  const formdata: any = new FormData()
  formdata.append('file', payload.file)
  formdata.append('table_type', payload.selectedType)
  formdata.append('year', payload.selectedYear)
  formdata.append('month', payload.selectedMonth)
  formdata.append('yield_curve_code', payload.yieldCurveCode)
  IbnrService.uploadTables(formdata)
    .then((res: any) => {
      if (res.status === 200) {
        snackbarText.value = 'File uploaded successfully'
        snackbar.value = true
        timeout.value = 3000
        uploadComplete.value = true
      }
    })
    .catch(() => {
      snackbarText.value = 'An error occurred while uploading the file'
      snackbar.value = true
      timeout.value = 3000
      uploadComplete.value = true
    })
}

const deleteTableData = async (table: any) => {
  if (table.table_type === 'Yield Curve') {
    IbnrService.getAvailableIbnrYieldYears().then((response) => {
      yieldCurveYears.value = response.data
      selectedTable.value = table.table_type
      if (yieldCurveYears.value === null) {
        yieldCurveYears.value = []
      }
      if (yieldCurveYears.value.length > 0) {
        yieldCurveDataDialog.value = true
      }
    })
  } else {
    try {
      const result = await confirmDeleteDialog.value.open(
        'Deleting Data for ' + table.table_type + ' table',
        'Are you sure you want to delete this data?'
      )
      console.log(result)
      if (result) {
        console.log('Deleting data')

        IbnrService.deleteTable(table.table_type).then((response) => {
          text.value = response.data
          snackbar.value = true
          dialog.value = false
          tableData.value = []
          selectedTable.value = ''
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const viewTable = (item: any) => {
  loadingData.value = true
  tableData.value = []

  const tableType = item.table_type.replace(/ /g, '').toLowerCase()
  IbnrService.getDataForTable(tableType).then((res) => {
    if (res.data === null) {
      res.data = []
    }

    if (res.data.length === 0) {
      text.value = 'No data available for this table'
      snackbar.value = true
    } else {
      tableData.value = res.data
      console.log('table data value', tableData.value)
      if (tableData.value.length > 0) {
        createColumnDefs(tableData.value)
      }
      selectedTable.value = item.table_type
    }
    loadingData.value = false
  })
}

// Yield curve specfic methods

const deleteYieldCurveData = () => {
  console.log(selectedYieldCurveMonth.value)
  IbnrService.deleteYieldCurveData(
    selectedYieldCurveYear.value,
    selectedYieldCurveCode.value,
    selectedYieldCurveMonth.value
  ).then(() => {
    text.value = 'yield curve data deleted successfully'
    snackbar.value = true
    clearYieldDialog()
  })
}

const clearYieldDialog = () => {
  selectedYieldCurveYear.value = null
  selectedYieldCurveCode.value = null
  selectedYieldCurveMonth.value = null
  yieldCurveMonths.value = []
  yieldCurveCodes.value = []
  yieldCurveDataDialog.value = false
}

const getYieldCurveCodes = () => {
  console.log(selectedYieldCurveYear)
  IbnrService.getYieldCurveCodes(selectedYieldCurveYear.value).then((response) => {
    yieldCurveCodes.value = response.data
  })
}

const getYieldCurveMonths = () => {
  IbnrService.getYieldCurveMonths(selectedYieldCurveYear.value, selectedYieldCurveCode.value).then(
    (response) => {
      yieldCurveMonths.value = response.data
    }
  )
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    columnDefs.value.push(header)
  })
}
</script>
