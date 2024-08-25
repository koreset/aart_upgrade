<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header> Upload Assumption Tables </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col>
                  <v-table>
                    <tbody>
                      <tr v-for="item in gmmTables" :key="item.name">
                        <td style="width: 70%">{{ item.name }}</td>
                        <td style="text-align: center">
                          <v-btn depressed rounded size="small" @click.stop="viewTable(item)">
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>
                        </td>
                        <td style="text-align: center">
                          <bulk-file-updater :tableType="item.name"></bulk-file-updater>
                        </td>
                        <td style="text-align: center">
                          <v-btn depressed rounded size="small" @click.stop="confirmDelete(item)">
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-container></template
          >
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../../../components/BaseCard.vue'
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import formatValues from '../../../utils/format_values.js'
import { ref, onMounted } from 'vue'

const items = ref([])
const tableDialog = ref(false)
const deleteTableDialog = ref(false)
const tableData = ref([])
const columnDefs: any = ref([])
const rowData = ref([])
const gmmTables: any = ref([])
const modelPoints = ref(null)
const file = ref(null)
const selectedType = ref(null)
const selectedTable = ref(null)
const uploadSuccess = ref(false)
const availableTypes = ref([{ name: 'Shocks' }])
const timeout = ref(3000)
const snackbar = ref(false)
const text = ref('')

onMounted(() => {
  ModifiedGMMService.getTableMetaData().then((res) => {
    gmmTables.value = res.data.associated_tables
    modelPoints.value = res.data.model_points
  })
})

const confirmTableDelete = (tableType) => {
  selectedTable.value = tableType
  deleteTableDialog.value = true
}

const deleteTable = (value) => {
  if (value) {
    ModifiedGMMService.deleteTable(selectedTable.value).then(() => {
      text.value = 'Table was successfully deleted'
      snackbar.value = true
      deleteTableDialog.value = false
    })
  } else {
    text.value = 'Table was not deleted'
    snackbar.value = true
    deleteTableDialog.value = false
  }
}

const dismissTableDialog = (value) => {
  tableDialog.value = value
}

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

const loadData = (tableName: any) => {
  ModifiedGMMService.getDataForTable(tableName).then((res) => {
    tableData.value = res.data
    if (tableData.value !== null) {
      items.value = []
      columnDefs.value = []
      rowData.value = []
      createColumnDefs(tableData.value)
      rowData.value = tableData.value
    }
    tableDialog.value = true
  })
  tableDialog.value = true
}

const showTableData = (tableType) => {
  selectedTable.value = tableType
  tableType = tableType.replace(/ /g, '')
  loadData(tableType.toLowerCase())
}

const uploadFile = () => {
  if (selectedType.value !== null && file.value !== null) {
    const formdata = new FormData()
    formdata.append('file', file.value)
    formdata.append('table_type', selectedType.value)
    ModifiedGMMService.uploadTables(formdata)
      .then((res) => {
        if (res.status === 200) {
          file.value = null
          selectedType.value = null
          text.value = 'The data has been successfully updated'
          timeout.value = 3000
          snackbar.value = true
        }
      })
      .catch(() => {})
  }
}

// export default {
//   data() {
//     return {
//       tableDialog: false,
//       deleteTableDialog: false,
//       tableData: [],
//       columnDefs: [],
//       rowData: [],
//       gmmTables: [],
//       modelPoints: null,
//       file: null,
//       selectedType: null,
//       selectedTable: null,
//       uploadSuccess: false,
//       availableTypes: [{ name: 'Shocks' }],
//       timeout: 3000,
//       snackbar: false,
//       text: ''
//     }
//   },
//   mounted() {
//     ModifiedGMMService.getTableMetaData().then((res) => {
//       this.gmmTables = res.data.associated_tables
//       this.modelPoints = res.data.model_points
//     })
//   },
//   methods: {
//     confirmTableDelete(tableType) {
//       this.selectedTable = tableType
//       this.deleteTableDialog = true
//     },

//     deleteTable(value) {
//       if (value) {
//         ModifiedGMMService.deleteTable(this.selectedTable).then(() => {
//           // this.text = res.data.message;
//           this.text = 'Table was successfully deleted'
//           this.snackbar = true
//           // this.gmmTables = res.data.associated_tables;
//           this.deleteTableDialog = false
//         })
//       } else {
//         this.text = 'Table was not deleted'
//         this.snackbar = true
//         this.deleteTableDialog = false
//       }
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
//     loadData(tableName) {
//       ModifiedGMMService.getDataForTable(tableName).then((res) => {
//         this.tableData = res.data
//         if (this.tableData !== null) {
//           this.items = []
//           this.columnDefs = []
//           this.rowData = []
//           this.createColumnDefs(this.tableData)
//           this.rowData = this.tableData
//         }
//         this.tableDialog = true
//       })
//       this.tableDialog = true
//     },
//     getModelPoints() {},
//     showTableData(tableType) {
//       // remove spaces for model points
//       this.selectedTable = tableType
//       tableType = tableType.replace(/ /g, '')
//       this.loadData(tableType.toLowerCase())
//     },
//     uploadFile() {
//       if (this.selectedType !== null && this.file !== null) {
//         const formdata = new FormData()
//         formdata.append('file', this.file)
//         formdata.append('table_type', this.selectedType)
//         ModifiedGMMService.uploadTables(formdata)
//           .then((res) => {
//             if (res.status === 200) {
//               this.file = null
//               this.selectedType = null
//               this.text = 'The data has been successfully updated'
//               this.timeout = 3000
//               this.snackbar = true
//             }
//           })
//           .catch(() => {})
//       }
//     }
//   }
// }
</script>

<style scoped></style>
