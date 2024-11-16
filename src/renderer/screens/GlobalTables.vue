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
                      <tr v-for="item in tables" :key="item.name">
                        <td style="width: 70%">{{ item.name }}</td>
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
                            :tableType="item.name"
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
                    :show-close-button="true"
                    :columnDefs="columnDefs"
                    :rowData="tableData"
                    :table-title="selectedTable"
                    :pagination="true"
                    :rowCount="rowCount"
                    @update:clear-data="clearData"
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
                >Clicking on Proceed will delete any available Yield curve data for the selected
                criteria</p
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="text" @click="deleteYieldCurveData()"
            >Proceed</v-btn
          >
          <v-btn color="primary darken-1" variant="text" @click="clearYieldDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="shocksDialog" persistent max-width="600">
      <base-card>
        <template #header><span class="headline">Available Shock Bases</span></template>
        <template #default>
          <v-row v-if="availableShockBases.length > 0" class="mt-5">
            <v-col>
              <v-select
                v-model="selectedShockBasis"
                variant="outlined"
                density="compact"
                label="Shock Basis"
                placeholder="Select an existing Shock Basis"
                :items="availableShockBases"
                item-title="name"
                return-object
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <template #actions>
          <v-btn color="primary darken-1" variant="text" @click="deleteShockData()">Proceed</v-btn>
          <v-btn color="primary darken-1" variant="text" @click="cancelShockDialog()">Cancel</v-btn>
        </template>
      </base-card>
    </v-dialog>
    <v-dialog v-model="otherTableDialog" persistent max-width="600">
      <base-card>
        <template #header
          ><span class="headline">Available years for {{ otherTable }}</span></template
        >
        <template #default>
          <v-row v-if="availableTableYears.length > 0" class="mt-5">
            <v-col>
              <v-select
                v-model="selectedTableYear"
                variant="outlined"
                density="compact"
                label="Year Data"
                placeholder="Select an existing Year"
                :items="availableTableYears"
                item-title="Year"
                item-value="Year"
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <template #actions>
          <v-btn color="primary darken-1" variant="text" @click="deleteOtherTableData()"
            >Proceed</v-btn
          >
          <v-btn color="primary darken-1" variant="text" @click="cancelOtherTableDialog()"
            >Cancel</v-btn
          >
        </template>
      </base-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <confirmation-dialog ref="confirmDeleteDialog" />
  </v-container>
</template>

<script setup lang="ts">
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import BulkFileUpdater from '@/renderer/components/BulkFileUpdater.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

import ProductService from '@/renderer/api/ProductService'
import ValuationService from '@/renderer/api/ValuationService'
import formatValues from '@/renderer/utils/format_values'
import { ref } from 'vue'
import { DataPayload } from '@/renderer/components/types'

// data
const availableTableYears: any = ref([])
const selectedTableYear: any = ref(null)

const shocksDialog: any = ref(false)
const availableShockBases: any = ref([])
const selectedShockBasis: any = ref(null)
const viewHeader: string = 'Global Assumption Tables'
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
const otherTableDialog: any = ref(false)
const otherTable: any = ref('')
const tables: any = ref([
  { name: 'Parameters' },
  { name: 'Yield Curve' },
  { name: 'Margins' },
  { name: 'Shocks' }
])

const text: any = ref('')
const yieldCurveDataDialog: any = ref(false)
const columnDefs: any = ref([])
// const dialog: any = ref(false)

const uploadComplete = ref(false)
const snackbarText: any = ref(null)
const timeout: any = ref(3000)
const snackbar: any = ref(false)

// methods
const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
}

const cancelOtherTableDialog = () => {
  otherTableDialog.value = false
  selectedTableYear.value = null
}

const deleteOtherTableData = async () => {
  try {
    const result = await confirmDeleteDialog.value.open(
      'Deleting Data for ' + otherTable.value + ' table',
      'Are you sure you want to delete this data?'
    )
    console.log(result)
    if (result) {
      console.log('Deleting data')
      ProductService.deleteGlobalTableDataWithKey(otherTable.value, selectedTableYear.value).then(
        (response) => {
          text.value = response.data
          snackbar.value = true
          otherTableDialog.value = false
          tableData.value = []
          selectedTable.value = ''
          selectedTableYear.value = null
        }
      )
    }
  } catch (error) {
    console.log(error)
    otherTableDialog.value = false
  }
}

const cancelShockDialog = () => {
  shocksDialog.value = false
  selectedShockBasis.value = null
}

const deleteShockData = () => {
  ProductService.deleteGlobalTableDataWithKey('Shocks', selectedShockBasis.value.Basis).then(() => {
    text.value = 'Shock data deleted successfully'
    snackbar.value = true
    shocksDialog.value = false
  })
}

const handleUpload = (payload: DataPayload) => {
  console.log(payload)
  uploadComplete.value = false
  const formdata: any = new FormData()
  formdata.append('file', payload.file)
  formdata.append('assumption_type', payload.selectedType)
  formdata.append('year', payload.selectedYear)
  formdata.append('month', payload.selectedMonth)
  formdata.append('yield_curve_code', payload.yieldCurveCode)
  ProductService.uploadBulkAssumptions({ formdata })
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
  try {
    let tableName = table.name.toLowerCase()
    tableName = tableName.replace(/\s/g, '-')
    console.log(tableName)

    let resp: any = null
    if (tableName === 'shocks') {
      resp = await ValuationService.getAvailableShockBases()
      console.log(resp.data)
      availableShockBases.value = resp.data
      shocksDialog.value = true
    } else {
      resp = await ValuationService.getAvailableYears(tableName)
      console.log(resp)

      if (table.name === 'Yield Curve') {
        yieldCurveYears.value = resp.data
        if (yieldCurveYears.value.length > 0) {
          yieldCurveDataDialog.value = true
        }
      } else {
        otherTable.value = table.name
        availableTableYears.value = resp.data
        otherTableDialog.value = true
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const viewTable = (item: any) => {
  loadingData.value = true
  tableData.value = []
  ProductService.getGlobalTableData(item.name)
    .then((response) => {
      console.log(response.data.data)
      if (response.data.data === null) {
        response.data.data = []
      }

      if (response.data.data.length === 0) {
        text.value = 'No data available for this table'
        snackbar.value = true
      } else {
        tableData.value = response.data.data
        rowCount.value = response.data.row_count
        selectedTable.value = item.name
        createColumnDefs(tableData.value)
      }
      loadingData.value = false
    })
    .catch(() => {
      loadingData.value = false
    })
}

// Yield curve specfic methods

const deleteYieldCurveData = async () => {
  try {
    const result = await confirmDeleteDialog.value.open(
      'Deleting Data for Yield Curve table',
      'Are you sure you want to delete this data?'
    )
    console.log(result)
    if (result) {
      console.log('Deleting data')
      ProductService.deleteYieldCurveData(
        selectedYieldCurveYear.value,
        selectedYieldCurveCode.value,
        selectedYieldCurveMonth.value
      ).then(() => {
        text.value = 'yield curve data deleted successfully'
        snackbar.value = true
        clearYieldDialog()
      })
    }
  } catch (error) {
    console.log(error)
    clearYieldDialog()
  }
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
  ProductService.getYieldCurveCodes(selectedYieldCurveYear.value).then((response) => {
    yieldCurveCodes.value = response.data
  })
}

const getYieldCurveMonths = () => {
  ProductService.getYieldCurveMonths(
    selectedYieldCurveYear.value,
    selectedYieldCurveCode.value
  ).then((response) => {
    yieldCurveMonths.value = response.data
  })
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    header.sortable = true
    header.filter = true
    header.resizable = true

    columnDefs.value.push(header)
  })
}
</script>
