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
                          <file-updater
                            :show-year="true"
                            :show-yield-curve-code="item.table_type === 'Yield Curve'"
                            :show-month="item.table_type === 'Yield Curve'"
                            :uploadComplete="uploadComplete"
                            :tableType="item.table_type"
                            @uploadFile="handleUpload"
                          ></file-updater>
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
    <!-- <v-dialog v-model="otherTableDialog" persistent max-width="600">
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
    </v-dialog> -->
  </v-container>
</template>

<script setup lang="ts">
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import FileUpdater from '@/renderer/components/FileUpdater.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

import ModifiedGMMService from '@/renderer/api/ModifiedGMMService'
import formatValues from '@/renderer/utils/format_values'
import { ref, onMounted } from 'vue'
import { DataPayload } from '@/renderer/components/types'

// data
// const otherTableDialog: any = ref(false)
const viewHeader: string = 'PAA Assumption Tables'
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

const modelPoints: any = ref([])

const text: any = ref('')
const yieldCurveDataDialog: any = ref(false)
const columnDefs: any = ref([])
// const dialog: any = ref(false)

const uploadComplete = ref(false)
const snackbarText: any = ref(null)
const timeout: any = ref(3000)
const snackbar: any = ref(false)

onMounted(() => {
  ModifiedGMMService.getTableMetaData().then((res) => {
    tables.value = res.data.associated_tables
    modelPoints.value = res.data.model_points
  })
})

// methods
const handleUpload = (payload: DataPayload) => {
  uploadComplete.value = false
  const formdata: any = new FormData()
  formdata.append('file', payload.file)
  formdata.append('table_type', payload.selectedType)
  formdata.append('year', payload.selectedYear)
  formdata.append('month', payload.selectedMonth)
  formdata.append('yield_curve_code', payload.yieldCurveCode)
  ModifiedGMMService.uploadTables(formdata)
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

// const deleteTableData = async (table: any) => {
//   try {
//     let tableName = table.name.toLowerCase()
//     tableName = tableName.replace(/\s/g, '-')

//     let resp: any = null
//     if (tableName === 'shocks') {
//       resp = await ValuationService.getAvailableShockBases()
//       availableShockBases.value = resp.data
//       shocksDialog.value = true
//     } else {
//       resp = await ValuationService.getAvailableYears(tableName)

//       if (table.name === 'Yield Curve') {
//         yieldCurveYears.value = resp.data
//         if (yieldCurveYears.value.length > 0) {
//           yieldCurveDataDialog.value = true
//         }
//       } else {
//         otherTable.value = table.name
//         availableTableYears.value = resp.data
//         otherTableDialog.value = true
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

const deleteTableData = async (table: any) => {
  console.log('deleting table data for', table)

  if (table.table_type === 'Yield Curve') {
    console.log('deleting yield curve data')
    yieldCurveDataDialog.value = true
  }
  if (table.table_type === 'Shocks') {
    console.log('deleting shocks data')
    // shocksDialog.value = true
  }

  if (table.table_type !== 'Yield Curve' && table.table_type !== 'Shocks') {
    try {
      const result = await confirmDeleteDialog.value.open(
        'Deleting Data for ' + table.table_type + ' table',
        'Are you sure you want to delete this data?'
      )
      if (result) {
        ModifiedGMMService.deleteTable(table.table_type).then((response) => {
          text.value = response.data
          snackbar.value = true
          tableData.value = []
          selectedTable.value = ''
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // if (table.tableType !== 'Shocks' && table.tableType !== 'Yield Curve') {
  //   try {
  //     const res = await ModifiedGMMService.getTableYears(table.table_name)
  //     if (res.data !== null) {
  //       console.log('table year versions', res.data)
  //     }

  //     const result = await confirmDeleteDialog.value.open(
  //       'Deleting Data for ' + table.table_type + ' table',
  //       'Are you sure you want to delete this data?'
  //     )
  //     if (result) {
  //       ModifiedGMMService.deleteTable(table.table_type).then((response) => {
  //         text.value = response.data
  //         snackbar.value = true
  //         dialog.value = false
  //         tableData.value = []
  //         selectedTable.value = ''
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   return
  // }

  // if (table.table_type === 'Yield Curve') {
  //   ModifiedGMMService.getYieldCurveYears().then((response) => {
  //     yieldCurveYears.value = response.data
  //     selectedTable.value = table.table_type
  //     if (yieldCurveYears.value === null) {
  //       yieldCurveYears.value = []
  //     }
  //     if (yieldCurveYears.value.length > 0) {
  //       yieldCurveDataDialog.value = true
  //     }
  //   })
  // } else {
  //   try {
  //     const result = await confirmDeleteDialog.value.open(
  //       'Deleting Data for ' + table.table_type + ' table',
  //       'Are you sure you want to delete this data?'
  //     )
  //     if (result) {
  //       ModifiedGMMService.deleteTable(table.table_type).then((response) => {
  //         text.value = response.data
  //         snackbar.value = true
  //         dialog.value = false
  //         tableData.value = []
  //         selectedTable.value = ''
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

// methods
const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
}

const viewTable = (item: any) => {
  loadingData.value = true
  tableData.value = []

  const tableType = item.table_type.replace(/ /g, '').toLowerCase()
  ModifiedGMMService.getDataForTable(tableType).then((res) => {
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
  ModifiedGMMService.deletePAAYieldTable(
    selectedTable.value,
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
  ModifiedGMMService.getYieldCurveCodes(selectedYieldCurveYear.value).then((response) => {
    yieldCurveCodes.value = response.data
  })
}

const getYieldCurveMonths = () => {
  ModifiedGMMService.getYieldCurveMonths(
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

<!-- <template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :showActions="false">
          <template #header> PAA Tables </template>
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
                            @click.stop="viewTableData(item)"
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
                            @click.stop="confirmDelete(item)"
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
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title
        >
        <v-card-text>Are you sure you want to delete data from {{ selectedTable }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="text" @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" variant="text" @click="deleteTableData(selectedTable)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                outlined
                dense
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
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import BulkFileUpdater from '@/renderer/components/BulkFileUpdater.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import ProductService from '@/renderer/api/ProductService'
import ModifiedGMMService from '@/renderer/api/ModifiedGMMService'
import ValuationService from '@/renderer/api/ValuationService'
import formatValues from '@/renderer/utils/format_values'

import { ref, onMounted } from 'vue'
import { DataPayload } from '../../../components/types'

// data
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
const tables: any = ref([])
const modelPoints: any = ref([])
const text: any = ref('')
const yieldCurveDataDialog: any = ref(false)
const columnDefs: any = ref([])
const dialog: any = ref(false)

const uploadComplete = ref(false)
const snackbarText: any = ref(null)
const timeout: any = ref(3000)
const snackbar: any = ref(false)

// methods
onMounted(() => {
  ModifiedGMMService.getTableMetaData().then((res) => {
    tables.value = res.data.associated_tables
    modelPoints.value = res.data.model_points
  })
})

const handleUpload = (payload: DataPayload) => {
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

const deleteTableData = (table: any) => {
  ProductService.deleteGlobalTableData(table).then((response) => {
    text.value = response.data
    snackbar.value = true
    dialog.value = false
    tableData.value = []
    selectedTable.value = ''
  })
}

const viewTableData = (item: any) => {
  loadingData.value = true
  tableData.value = []
  const tableType = item.table_type.replace(/ /g, '').toLowerCase()

  ModifiedGMMService.getDataForTable(tableType).then((res) => {
    if (res.data === null) {
      res.data = []
    }

    tableData.value = res.data
    if (tableData.value.length > 0) {
      createColumnDefs(tableData.value)
    }
    loadingData.value = false
  })
}

// Yield curve specfic methods

const deleteYieldCurveData = () => {
  ProductService.deleteYieldCurveData(
    selectedYieldCurveYear,
    selectedYieldCurveCode,
    selectedYieldCurveMonth
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
  ProductService.getYieldCurveCodes(selectedYieldCurveYear).then((response) => {
    yieldCurveCodes.value = response.data
  })
}

const getYieldCurveMonths = () => {
  ProductService.getYieldCurveMonths(selectedYieldCurveYear, selectedYieldCurveCode).then(
    (response) => {
      yieldCurveMonths.value = response.data
    }
  )
}

const getYieldCurveYears = () => {
  ValuationService.getAvailableYieldYears().then((response) => {
    yieldCurveYears.value = response.data
    if (yieldCurveYears.value === null) {
      yieldCurveYears.value = []
    }
  })
}

const confirmDelete = (item: any) => {
  if (item.name === 'Yield Curve') {
    getYieldCurveYears()
    if (yieldCurveYears.value.length > 0) {
      yieldCurveDataDialog.value = true
    }
  } else {
    selectedTable.value = item.name
    dialog.value = true
  }
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
</script> -->
