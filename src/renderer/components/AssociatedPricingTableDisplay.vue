<template>
  <v-container>
    <v-row>
      <v-col>
        <v-table>
          <tbody>
            <tr v-for="item in product.product_pricing_tables" :key="item.id">
              <td :class="{ unpopulated: !item.populated }">{{ item.table }}</td>
              <td style="text-align: center">
                <v-btn
                  depressed
                  rounded
                  size="small"
                  @click.stop="showTableData(item.id, item.table, product.product_code)"
                >
                  <v-icon left color="primary">mdi-information</v-icon>
                  <span>Info</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <v-btn depressed rounded size="small" @click.stop="openDialog(item)">
                  <v-icon left color="primary">mdi-file-upload</v-icon>
                  <span>Upload</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <v-btn
                  depressed
                  rounded
                  size="small"
                  @click.stop="deleteTableData(product.id, item)"
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
    <v-row>
      <v-col>
        <file-upload-dialog
          :yearLabel="yearLabel"
          :isDialogOpen="isDialogOpen"
          :showModelPoint="showModelPoint"
          :mpLabel="mpLabel"
          :uploadTitle="uploadTitle"
          :years="years"
          @upload="handleUpload"
          @update:isDialogOpen="updateDialog"
        />
        <file-info
          :tableTitle="selectedTableName"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :onUpdate:isInfoDialogOpen="closeInfoBox"
          :isDialogOpen="infoDialog"
        />
      </v-col>
    </v-row>
    <confirmation-dialog ref="confirm" />
  </v-container>
</template>

<script setup lang="ts">
import ProductService from '@/renderer/api/ProductService'
import PricingService from '@/renderer/api/PricingService'
import formatValues from '@/renderer/utils/format_values'
import { ref } from 'vue'
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
import FileInfo from '@/renderer/components/FileInfo.vue'
import FileUploadDialog from './FileUploadDialog.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const product = ref(props.product)
console.log('pricing product', product.value)

// data
const infoDialog = ref(false)
const confirm = ref()
const tableData: any = ref([])
const columnDefs: any = ref([])
const rowData: any = ref([])
const loadingComplete = ref(false)
const selectedTableName: any = ref('')
const selectedTableId: any = ref(0)
const loading = ref(false)

// file upload dialog props
const showModelPoint = ref(false)
const yearLabel = ref('') // 'Select a year'
const uploadTitle = ref('')
const mpLabel = ref('')
const isDialogOpen = ref(false)
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k))
const updateDialog = (value: boolean) => {
  isDialogOpen.value = value
}

const openDialog = (item: any) => {
  selectedTableId.value = item.id
  yearLabel.value = 'Select a year'
  uploadTitle.value = 'Upload File Data for ' + item.table + ' Table (csv)'
  isDialogOpen.value = true
}

const handleUpload = async (file: any) => {
  console.log(file)
  const formdata = new FormData()
  formdata.append('file', file.file)
  formdata.append('table_id', selectedTableId.value)
  formdata.append('product_id', product.value.id)
  formdata.append('product_code', product.value.product_code)
  loading.value = true
  PricingService.uploadProductPricingTable(formdata, product.value.id)
    .then(() => {
      // uploadSuccess.value = true
      loading.value = false
      updatePopulatedTables(selectedTableId.value)
    })
    .catch((err) => {
      console.log(err)

      // uploadSuccess = false
      loading.value = false
    })

  // const formData = new FormData()
  // formData.append('file', file)
  // formData.append('table_id', selectedTableId.value)
  // formData.append('product_code', product.value.product_code)
  // const res = await ProductService.uploadPricingProductTable(formData)
  // if (res.status === 200) {
  //   infoDialog.value = false
  //   // updatePopulatedTables(selectedTableId.value)
  // }
}
// end file upload dialog props

// methods
const updatePopulatedTables = (itemId: number) => {
  props.product.product_pricing_tables.forEach((item: any) => {
    if (item.id === itemId) {
      item.populated = true
    }
  })
}

const updateUnpopulatedTables = (itemId: number) => {
  props.product.product_pricing_tables.forEach((item: any) => {
    if (item.id === itemId) {
      item.populated = false
    }
  })
}

const closeInfoBox = (value: boolean) => {
  infoDialog.value = value
}

// const confirmDelete = (item: any) => {
//   console.log(item)
//   console.log('confirmDelete')
// }

// const dismissTableDialog = (value: boolean) => {
//   tableDialog.value = value
// }

// const checkItemTable = (item) => {
//   if (
//     item.table === 'Margins' ||
//     item.table === 'Yield_Curve' ||
//     item.table === 'Parameters' ||
//     item.table === 'Shocks'
//   ) {
//     return false
//   }
//   return true
// }

const createColumnDefs = (data: any) => {
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

const deleteTableData = async (productId: number, item: any) => {
  const res = await confirm.value.open(
    `Deleting ${item.table} Table`,
    'Are you sure you want to delete this table data? This action is not undoable.'
  )

  if (!res) return
  ProductService.deletePricingProductTable(productId, item.id).then((res) => {
    console.log(res)
    updateUnpopulatedTables(item.id)
  })
}

const showTableData = (itemId: number, itemTable: string, prodCode: string) => {
  infoDialog.value = true
  rowData.value = []
  columnDefs.value = []
  loadingComplete.value = false
  ProductService.getProductPricingTable({
    table_id: itemId,
    product_code: prodCode
  }).then((res) => {
    tableData.value = res.data
    if (tableData.value !== null) {
      tableData.value.forEach((item) => {
        const transformed: any = {}
        const keys = Object.keys(item)
        keys.forEach((i) => {
          if (isNaN(item[i])) {
            transformed[i] = item[i]
          } else {
            const value = Number(item[i])
            transformed[i] = value
          }
        })
        rowData.value.push(transformed)
      })
      createColumnDefs(tableData.value)
    }
    selectedTableName.value = itemTable
    loadingComplete.value = true
    infoDialog.value = true
  })
}

// export default {
//   props: ['product'],
//   data() {
//     return {
//       tableDialog: false,
//       selectedTableId: null,
//       selectedTableName: null,
//       selectedProductCode: null,
//       tableData: [],
//       columnDefs: [],
//       rowData: [],
//       loadingComplete: false
//     }
//   },
//   methods: {
//     updatePopulatedTables(itemId) {
//       this.product.product_pricing_tables.forEach((item) => {
//         if (item.id === itemId) {
//           item.populated = true
//         }
//       })
//     },
//     dismissTableDialog(value) {
//       this.tableDialog = value
//     },

//     createColumnDefs(data) {
//       this.columnDefs = []
//       Object.keys(data[0]).forEach((element) => {
//         const header = {}
//         header.headerName = element
//         header.field = element
//         header.valueFormatter = formatValues
//         header.minWidth = 220
//         header.filter = true
//         header.resizable = true
//         header.sortable = true
//         this.columnDefs.push(header)
//       })
//     },

//     loadData() {
//       this.rowData = []
//       this.columnDefs = []
//       this.loadingComplete = false
//       ProductService.getProductPricingTable({
//         table_id: this.selectedTableId,
//         product_code: this.selectedProductCode
//       }).then((res) => {
//         this.tableData = res.data
//         if (this.tableData !== null) {
//           this.items = []
//           this.columnDefs = []
//           this.rowData = []
//           this.createColumnDefs(this.tableData)
//           this.tableData.forEach((item) => {
//             const transformed = {}
//             const keys = Object.keys(item)
//             keys.forEach((i) => {
//               if (isNaN(item[i])) {
//                 transformed[i] = item[i]
//               } else {
//                 const value = Number(item[i])
//                 transformed[i] = value
//               }
//             })
//             this.rowData.push(transformed)
//           })
//         }
//         this.loadingComplete = true
//       })
//     },
//     async deleteTableData(productId, item) {
//       const res = await this.$refs.confirm.open(
//         `Deleting ${item.table} Table`,
//         'Are you sure you want to delete this table data? This action is not undoable.'
//       )

//       if (!res) return
//       ProductService.deletePricingProductTable(productId, item.id).then(() => {
//         this.updatePopulatedTables()
//       })
//     },

//     showTableData(itemId, itemTable, prodCode) {
//       this.selectedTableId = itemId
//       this.selectedTableName = itemTable
//       this.selectedProductCode = prodCode
//       this.loadData()
//       this.tableDialog = true
//     }
//   }
// }
</script>

<style>
.unpopulated {
  color: red;
}

.borderline {
  border-bottom: 1px solid#2E566E;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* .table-container {
    background-color: #96abbc;
    margin: 20px;
    border-radius: 24px;
    padding: 0;
  } */

.table-container {
  background: #ffffff 35%;
  /* background-color: #96ABBC; */
  margin: 20px;
  border-radius: 24px;
  padding: 0;
}

div.row.table-container > div > div > div {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.unpopulated {
  color: red;
}
</style>
