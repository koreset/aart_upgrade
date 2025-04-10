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
                            :show-version="true"
                            :show-year="true"
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
                            @click.stop="chooseYear(item)"
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
                    :show-close-button="true"
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
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <confirmation-dialog ref="confirmDeleteDialog" />
    <v-dialog v-model="yearsDialog" persistent max-width="550px">
      <base-card>
        <template #header>
          <span class="headline">Choose the relevant data year</span>
        </template>
        <template #default>
          <v-row>
            <v-col>
              <v-select
                v-model="selectedYear"
                variant="outlined"
                density="compact"
                label="Select a year for this data set"
                :items="availableDataYears"
                item-title="year"
                item-value="year"
                @update:model-value="getRiskRateCodes"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="selectedRiskRateCode"
                variant="outlined"
                density="compact"
                label="Select a risk rate code"
                :items="availableRiskRateCodes"
                item-title="year"
                item-value="year"
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <template #actions>
          <v-spacer></v-spacer>
          <v-btn rounded variant="text" @click="closeDialog">Ok</v-btn>
        </template>
      </base-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
// import BulkFileUpdater from '@/renderer/components/BulkFileUpdater.vue'
import FileUpdater from '@/renderer/components/FileUpdater.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

import GroupPricingService from '@/renderer/api/GroupPricingService'
import formatValues from '@/renderer/utils/format_values'
import { ref, onMounted } from 'vue'
import { DataPayload } from '@/renderer/components/types'

// data
const yearsDialog: any = ref(false)
const availableDataYears: any = ref([])
const selectedYear: any = ref('')
const viewHeader: string = 'Group Pricing Rating Tables'
const confirmDeleteDialog: any = ref()
const loadingData: any = ref(false)
const rowCount: any = ref(0)
const tableData: any = ref([])
const selectedTable: any = ref('')
const selectedTableText: any = ref('')
const tables: any = ref([
  { name: 'Parameters' },
  { name: 'Yield Curve' },
  { name: 'Margins' },
  { name: 'Shocks' }
])

// const text: any = ref('')
const columnDefs: any = ref([])
// const dialog: any = ref(false)

const uploadComplete = ref(false)
const snackbarText: any = ref(null)
const timeout: any = ref(3000)
const snackbar: any = ref(false)
const availableRiskRateCodes: any = ref([])
const selectedRiskRateCode: any = ref('')

onMounted(() => {
  GroupPricingService.getTableMetaData().then((res) => {
    tables.value = res.data.associated_tables
    console.log('tables', tables.value)
  })
})

const closeDialog = () => {
  yearsDialog.value = false
  deleteTableData()
}

// methods
const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
}

const getRiskRateCodes = async () => {
  const tableType = selectedTable.value.replace(/\s+/g, '').toLowerCase()
  const response = await GroupPricingService.getRiskRateCodes(tableType, selectedYear.value)
  availableRiskRateCodes.value = response.data
  console.log('availableRiskRateCodes', availableRiskRateCodes.value)
}

const chooseYear = async (item: any) => {
  availableDataYears.value = []
  selectedYear.value = null
  selectedRiskRateCode.value = null

  if (item !== null) {
    console.log('item', item)
    selectedTableText.value = item.table_type
    selectedTable.value = item.table_type.replace(/\s+/g, '').toLowerCase()
    const response = await GroupPricingService.getTableYears(selectedTable.value)
    availableDataYears.value = response.data
    yearsDialog.value = true
  }

  // if (
  //   item.table === 'Accidental_Mortality' ||
  //   item.table === 'Mortality' ||
  //   item.table === 'Lapse' ||
  //   item.table === 'Lapse_Margins' ||
  //   item.table === 'Disability' ||
  //   item.table === 'Retrenchment'
  // ) {
  //   ProductService.getProductTableYears(
  //     props.product.product.id,
  //     item.table,
  //     'valuations',
  //     item.table_class
  //   ).then((response) => {
  //     availableDataYears.value = response.data
  //   })

  //   selectedItem.value = item

  //   yearsDialog.value = true
  // } else {
  //   selectedYear.value = 0
  //   confirmDelete(item)
  // }
}

const handleUpload = (payload: DataPayload) => {
  console.log('payload', payload)
  uploadComplete.value = false
  const formdata: any = new FormData()
  formdata.append('file', payload.file)
  formdata.append('table_type', payload.selectedType)
  formdata.append('year', payload.selectedYear)
  formdata.append('version', payload.version)
  GroupPricingService.uploadTables(formdata)
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

const deleteTableData = async () => {
  try {
    const result = await confirmDeleteDialog.value.open(
      'Deleting Data for ' + selectedTableText.value + ' table',
      'Are you sure you want to delete this data?'
    )
    if (result) {
      // const tableType = table.table_type.replace(/\s+/g, '').toLowerCase()
      GroupPricingService.deleteTable(
        selectedTable.value,
        selectedYear.value,
        selectedRiskRateCode.value
      ).then((response) => {
        snackbarText.value = 'Data deleted successfully'
        // dialog.value = false
        snackbar.value = true
        timeout.value = 3000
        tableData.value = []
        selectedTable.value = ''
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const viewTable = (item: any) => {
  loadingData.value = true
  tableData.value = []

  const tableType = item.table_type.replace(/ /g, '').toLowerCase()
  GroupPricingService.getDataForTable(tableType).then((res) => {
    if (res.data === null) {
      res.data = []
    }

    if (res.data.length === 0) {
      snackbarText.value = 'No data available for this table'
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

<style scoped></style>
