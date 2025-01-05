<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-table>
          <tbody>
            <tr v-for="item in associatedTables" :key="item.table">
              <td :class="{ unpopulated: !item.populated }">{{ item.table }}</td>
              <td style="text-align: center">
                <v-btn depressed rounded size="small" @click.stop="viewTable(item)">
                  <v-icon left color="primary">mdi-information</v-icon>
                  <span>Info</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <v-btn
                  v-if="checkItemTable(item)"
                  depressed
                  rounded
                  size="small"
                  @click.stop="openDialog(item)"
                >
                  <v-icon left color="primary">mdi-file-upload</v-icon>
                  <span>Upload</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <v-btn
                  v-if="checkItemTable(item)"
                  depressed
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
    <file-upload-dialog
      :yearLabel="yearLabel"
      :isDialogOpen="isDialogOpen"
      :showModelPoint="showModelPoint"
      :mpLabel="mpLabel"
      :table="selectedTableName"
      :uploadTitle="uploadTitle"
      :years="years"
      @upload="handleUpload"
      @update:isDialogOpen="updateDialog"
    />
    <file-info
      :tableTitle="tableTitle"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :onUpdate:isInfoDialogOpen="closeInfoBox"
      :isDialogOpen="infoDialog"
    />
    <confirmation-dialog ref="confirmAction" />
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
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
// import ProductService from "../api/ProductService";
import { ref, defineProps, watch } from 'vue'
import FileUploadDialog from '../components/FileUploadDialog.vue'
import ProductService from '../api/ProductService'
import FileInfo from '../components/FileInfo.vue'
import formatValues from '../utils/format_values.js'
import ConfirmationDialog from './ConfirmDialog.vue'
import BaseCard from './BaseCard.vue'

const props = defineProps({
  product: {
    type: Object as () => any | null,
    required: true
  }
})

const snackbar = ref(false)
const snackbarMessage = ref('')
const timeout = 3000

const confirmAction: any = ref()
const infoDialog = ref(false)
const rowData: any = ref([])
const columnDefs: any = ref([])
const tableTitle = ref('Table Info')
const yearsDialog = ref(false)
const selectedYear: any = ref(null)
const availableDataYears = ref([])

const selectedTableId: any = ref(0)
const selectedTable: any = ref(null)
const selectedTableName: any = ref('')
const selectedItem: any = ref({})
// file upload dialog props
const showModelPoint = ref(false)
const yearLabel = ref('') // 'Select a year'
const uploadTitle = ref('')
const mpLabel = ref('')
const isDialogOpen = ref(false)
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k))
const associatedTables: any = ref({})

const updateDialog = (value: boolean) => {
  isDialogOpen.value = value
}

const closeDialog = () => {
  yearsDialog.value = false
  if (selectedYear.value) {
    confirmDelete(selectedItem.value)
  }
}

const openDialog = (item: any) => {
  selectedTable.value = item
  selectedTableName.value = item.table
  selectedTableId.value = item.id
  yearLabel.value = 'Select a year'
  uploadTitle.value = 'Upload File Data for ' + item.table + ' Table (csv)'
  isDialogOpen.value = true
}
// end file upload dialog props

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 220
    header.filter = true
    header.resizable = true
    header.sortable = true
    columnDefs.value.push(header)
  })
}

const checkItemTable = (item) => {
  if (
    item.table === 'Margins' ||
    item.table === 'Yield_Curve' ||
    item.table === 'Parameters' ||
    item.table === 'Shocks'
  ) {
    return false
  }
  return true
}

const closeInfoBox = (value: boolean) => {
  infoDialog.value = value
}

const handleUpload = (data: {
  file: File | null
  fileName: string
  productCode: string
  year: number | null
}) => {
  const formdata = new FormData()
  formdata.append('file', data?.file as File)
  formdata.append('year', data.year?.toString() as string)
  formdata.append('table_id', selectedTableId.value)
  formdata.append('product_code', props.product.product.product_code)
  console.log(selectedTableId)

  ProductService.uploadProductTable({
    formdata,
    productId: props.product.product.id
  }).then((response) => {
    if (response.status === 200) {
      // update populated status
      console.log('response', response)
      const index = associatedTables.value.findIndex((table) => table.id === selectedTableId.value)
      associatedTables.value[index].populated = true

      snackbarMessage.value = 'Data uploaded successfully'
      snackbar.value = true
    } else {
      snackbarMessage.value = 'Error uploading data'
      snackbar.value = true
    }
  })
}

associatedTables.value = props.product.product.product_tables

// watch for changes in the props.product.product_tables
watch(
  () => props.product.product.product_tables,
  (newValue) => {
    // console.log('Updating associated tables', newValue)
    // associatedTables.value = []
    // associatedTables.value = newValue
    //   .map((table) => ({
    //     ...table,
    //     readonly: !!(
    //       table.table === 'Margins' ||
    //       table.table === 'Yield_Curve' ||
    //       table.table === 'Parameters' ||
    //       table.table === 'Shocks'
    //     )
    //   }))
    //   .filter((table) => table.table !== 'Shocks' && table.table !== 'Yield_Curve')
    //   .sort((a, b) => a.readonly - b.readonly)
  }
)

associatedTables.value = associatedTables.value
  .map((table) => ({
    ...table,
    readonly: !!(
      table.table === 'Margins' ||
      table.table === 'Yield_Curve' ||
      table.table === 'Parameters' ||
      table.table === 'Shocks'
    )
  }))
  .filter((table) => table.table !== 'Shocks' && table.table !== 'Yield_Curve')
  .sort((a, b) => a.readonly - b.readonly)

const chooseYear = (item: any) => {
  if (
    item.table === 'Accidental_Mortality' ||
    item.table === 'Mortality' ||
    item.table === 'Lapse' ||
    item.table === 'Lapse_Margins' ||
    item.table === 'Disability' ||
    item.table === 'Retrenchment'
  ) {
    availableDataYears.value = []
    selectedYear.value = null
    ProductService.getProductTableYears(
      props.product.product.id,
      item.table,
      'valuations',
      item.table_class
    ).then((response) => {
      availableDataYears.value = response.data
    })

    selectedItem.value = item

    yearsDialog.value = true
  } else {
    selectedYear.value = 0
    confirmDelete(item)
  }
}

const confirmDelete = async (item: any) => {
  try {
    const result = await confirmAction.value.open(
      'Deleting Data for ' + item.table + ' table',
      'Are you sure you want to delete this data?'
    )
    if (result) {
      deleteTable(item, selectedYear.value)
    }
  } catch (error) {
    console.log('error', error)
  }
}

const deleteTable = (item: any, year: any) => {
  ProductService.deleteProductTablev2(props.product.product.id, item.id, year).then((response) => {
    if (response.status === 200) {
      const index = associatedTables.value.findIndex((table) => table.id === item.id)
      associatedTables.value[index].populated = false
      snackbarMessage.value = 'Data deleted successfully'
      snackbar.value = true
    } else {
      snackbarMessage.value = 'Error deleting data'
      snackbar.value = true
    }
  })
}

const viewTable = (item: any) => {
  tableTitle.value = item.table
  loadData(item)
}

const loadData = (item) => {
  try {
    ProductService.getProductTable({
      product_code: props.product.product.product_code,
      table_id: item.id
    }).then((response) => {
      rowData.value = response.data
      if (response.data !== null && response.data.length > 0) {
        createColumnDefs(response.data)
        infoDialog.value = true
      } else {
        infoDialog.value = false
        snackbarMessage.value = 'No data available for ' + item.table
        snackbar.value = true
      }
    })
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<style scoped>
.table-row {
  border-bottom: 1px solid;
  border-color: #eee;
}

.unpopulated {
  color: red;
}
</style>
