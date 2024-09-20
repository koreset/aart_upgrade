<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header><span class="headline">IFRS17 Engine Tables</span> </template>
          <template #default>
            <v-container fluid>
              <v-table>
                <tbody>
                  <tr v-for="item in ifrs17EngineTables" :key="item.table_type">
                    <td style="width: 70%">{{ item.table_type }}</td>
                    <td style="text-align: center">
                      <v-btn
                        size="small"
                        variant="outlined"
                        rounded
                        @click.stop="showTableData(item.table_type)"
                        ><v-icon color="accent">mdi-information</v-icon><span>Info</span></v-btn
                      >
                    </td>
                    <td style="text-align: center">
                      <file-updater
                        :uploadComplete="uploadComplete"
                        :tableType="item.table_type"
                        @uploadFile="handleUpload"
                      ></file-updater>
                    </td>
                    <td style="text-align: center">
                      <v-btn
                        variant="outlined"
                        size="small"
                        rounded
                        @click.stop="confirmTableDelete(item.table_type)"
                        ><v-icon color="red">mdi-delete</v-icon>
                        <span>Delete</span>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-row>
                <v-col>
                  <file-info
                    :tableTitle="selectedTable"
                    :rowData="rowData"
                    :columnDefs="columnDefs"
                    :onUpdate:isInfoDialogOpen="closeInfoBox"
                    :isDialogOpen="infoDialog"
                  />

                  <!-- <gmm-file-info
                    :tableDialog="tableDialog"
                    :tableType="selectedTable"
                    :selectedRowData="rowData"
                    :selectedColumnDefs="columnDefs"
                    @resetTableDialog="dismissTableDialog"
                  /> -->
                </v-col>
              </v-row>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <base-card>
          <template #header><span class="headline">Manual SAP Data Tables</span></template>
          <template #default>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-file-input
                  v-model="file"
                  variant="outlined"
                  density="compact"
                  show-size
                  accept=".csv"
                  placeholder="Click to choose a SAP resultsfile"
                  label="SAP Results File"
                  prepend-icon="mdi-paperclip"
                >
                </v-file-input>
                <v-btn
                  rounded
                  variant="outlined"
                  size="small"
                  class="primary ml-7"
                  @click="uploadSAPFile"
                  >Upload</v-btn
                >
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="Search Run Name"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr>
                      <th>Run Name</th>
                      <th>Run Date</th>
                      <th>Creation Date</th>
                      <th>Uploader</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in filteredSapList" :key="item.run_name">
                      <td>{{ item.run_name }}</td>
                      <td>{{ item.run_date }}</td>
                      <td>{{ removeTimePortion(item.created_at) }}</td>
                      <td>{{ item.user }}</td>
                      <td class="d-flex justify-center">
                        <v-btn
                          class="mr-4 mt-2"
                          size="small"
                          rounded
                          variant="outlined"
                          @click.stop="showSapData(item.run_name)"
                          ><v-icon color="accent">mdi-information</v-icon><span>Info</span></v-btn
                        >
                        <v-btn
                          class="mt-2"
                          size="small"
                          rounded
                          variant="outlined"
                          @click.stop="confirmSapDelete(item.run_name)"
                          ><v-icon color="red">mdi-delete</v-icon>
                          <span>Delete</span>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>

    <!-- <v-dialog v-model="deleteSapDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          <v-icon color="red" size="50">mdi-alert-circle</v-icon> Delete Confirmation</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                Are you sure you want to delete data for {{ selectedSap }}? This will delete all
                data and is no undoable.
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded color="primary darken-1" text @click="deleteSapData(false)">No</v-btn>
          <v-btn rounded color="primary darken-1" text @click="deleteSapData(true)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ text }}
      <v-btn rounded color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <confirmation-dialog ref="confirmDelete" />
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import { computed, onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import FileUpdater from '@/renderer/components/FileUpdater.vue'
import FileInfo from '@/renderer/components/FileInfo.vue'
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
// import createColumnDefs from "../../utils/format_values";

// data
const confirmDelete = ref()
const infoDialog = ref(false)
const uploadComplete = ref(false)
const searchQuery = ref('')
const tableDialog = ref(false)
const loaderSize = ref(0)
const deleteSapDialog = ref(false)
// const selectedSap = ref(null)
const tableData = ref([])
const columnDefs: any = ref([])
const rowData: any = ref([])
const ifrs17EngineTables = ref([
  { table_type: 'Finance File' },
  { table_type: 'PAA Finance' },
  { table_type: 'RA Factors' },
  { table_type: 'Transition Adjustments' }
])
// const modelPoints = ref(null)
const file: any = ref(null)
// const selectedType = ref(null)
const selectedTable: any = ref(null)
// const uploadSuccess = ref(false)
// const availableTypes = ref([{ name: 'Shocks' }])
const timeout = ref(3000)
const snackbar = ref(false)
const text = ref('')
const sapFileList = ref([])
const selectedRun = ref(null)

const filteredSapList: any = computed(() => {
  return sapFileList.value.filter((item: any) => {
    return item.run_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

onMounted(() => {
  CsmEngine.getSapFileList().then((res) => {
    if (res.data) {
      sapFileList.value = res.data
    }
  })
})

const closeInfoBox = (value: boolean) => {
  infoDialog.value = value
}

const handleUpload = (payload: any) => {
  console.log(payload)
  // uploadComplete.value = false
  // const formdata = new FormData()
  // formdata.append('file', payload.file)
  // formdata.append('table_type', payload.selectedType)
  // CsmEngine.uploadIfrs17EngineTables(formdata)
  //   .then((res) => {
  //     if (res.status === 200) {
  //       file.value = null
  //       // selectedType.value = null
  //       text.value = 'The data has been successfully updated'
  //       timeout.value = 3000
  //       snackbar.value = true
  //     }
  //   })
  //   .catch(() => {})
}

const removeTimePortion = (value: string) => {
  if (value) {
    const [datePart, timePartWithOffset] = value.split('T')
    const timePart = timePartWithOffset.split('+')[0] // Assuming the offset is always positive for simplicity
    const result = `${datePart} - ${timePart}`
    return result
  }
}

const confirmTableDelete = async (tableType: string) => {
  try {
    const result = await confirmDelete.value.open(
      'Delete Confirmationsssss',
      `Are you sure you want to delete ${tableType}? This will delete all data and is no undoable.`
    )

    if (result) {
      const tableType = selectedTable.value.replace(/ /g, '')
      CsmEngine.deleteTable(tableType.toLowerCase()).then(() => {
        text.value = 'Table was successfully deleted'
        snackbar.value = true
        // deleteTableDialog.value = false
      })
    } else {
      text.value = 'Table was not deleted'
      snackbar.value = true
      // deleteTableDialog.value = false
    }

    // selectedTable.value = tableType
    // deleteTableDialog.value = true
  } catch (e) {
    console.log(e)
  }
}

const confirmSapDelete = async (runName: string) => {
  try {
    const value = await confirmDelete.value.open(
      'Delete Confirmation',
      `Are you sure you want to delete ${runName}? This will delete all data and is no undoable.`
    )

    if (value) {
      CsmEngine.deleteSapData(selectedRun.value).then(() => {
        text.value = 'SAP Data was successfully deleted'
        sapFileList.value = sapFileList.value.filter(
          (item: any) => item.run_name !== selectedRun.value
        )
        snackbar.value = true
        deleteSapDialog.value = false
      })
    } else {
      text.value = 'SAP Data was not deleted'
      snackbar.value = true
      deleteSapDialog.value = false
    }
  } catch (e) {
    console.log(e)
  }
}

// const deleteSapData = (value: boolean) => {
//   if (value) {
//     CsmEngine.deleteSapData(selectedRun.value).then(() => {
//       text.value = 'SAP Data was successfully deleted'
//       sapFileList.value = sapFileList.value.filter(
//         (item: any) => item.run_name !== selectedRun.value
//       )
//       snackbar.value = true
//       deleteSapDialog.value = false
//     })
//   } else {
//     text.value = 'SAP Data was not deleted'
//     snackbar.value = true
//     deleteSapDialog.value = false
//   }
// }

// const dismissTableDialog = (value: boolean) => {
//   tableDialog.value = value
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

const loadData = (tableName: string) => {
  CsmEngine.getDataForTable(tableName).then((res) => {
    tableData.value = res.data.table_data
    console.log('table data: ', tableData.value)
    if (tableData.value !== null) {
      rowData.value = []
      createColumnDefs(tableData.value)
      tableData.value.forEach((item: any) => {
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
    }
    infoDialog.value = true
    tableDialog.value = true
  })
  infoDialog.value = true
  tableDialog.value = true
}

const loadSapData = (runName: string) => {
  rowData.value = []
  selectedTable.value = runName
  CsmEngine.getSapResultsForRun(runName).then((res) => {
    tableData.value = res.data
    console.log('table data: ', tableData.value)

    if (tableData.value !== null) {
      rowData.value = []
      createColumnDefs(tableData.value)
      tableData.value.forEach((item: any) => {
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
    }
    infoDialog.value = true
    tableDialog.value = true
  })
  infoDialog.value = true
}

// const getModelPoints = () => {}

const showTableData = (tableType: string) => {
  selectedTable.value = tableType
  tableType = tableType.replace(/ /g, '')
  console.log('table type: ', tableType)
  loadData(tableType.toLowerCase())
}

const showSapData = (runName: string) => {
  tableData.value = []
  loadSapData(runName)
}

const uploadSAPFile = () => {
  const formdata = new FormData()
  formdata.append('file', file.value)
  loaderSize.value = 20
  CsmEngine.uploadSAPFile(formdata)
    .then((res) => {
      loaderSize.value = 0
      file.value = null
      if (res.status === 201) {
        sapFileList.value = res.data
      }
    })
    .catch(() => {
      loaderSize.value = 0
    })
}

// const uploadFile = () => {
//   if (selectedType.value !== null && file.value !== null) {
//     const formdata = new FormData()
//     formdata.append('file', file.value)
//     formdata.append('table_type', selectedType.value)
//     CsmEngine.uploadIfrs17EngineTables(formdata)
//       .then((res) => {
//         if (res.status === 200) {
//           file.value = null
//           selectedType.value = null
//           text.value = 'The data has been successfully updated'
//           timeout.value = 3000
//           snackbar.value = true
//         }
//       })
//       .catch(() => {})
//   }
// }

// export default {
//   filters: {
//     removeTimePortion(value) {
//       if (value) {
//         const [datePart, timePartWithOffset] = value.split('T')
//         const timePart = timePartWithOffset.split('+')[0] // Assuming the offset is always positive for simplicity
//         const result = `${datePart} - ${timePart}`
//         return result
//       }
//     }
//   },
//   data() {
//     return {
//       searchQuery: '',
//       tableDialog: false,
//       loaderSize: 0,
//       deleteTableDialog: false,
//       deleteSapDialog: false,
//       selectedSap: null,
//       tableData: [],
//       columnDefs: [],
//       rowData: [],
//       ifrs17EngineTables: [
//         { table_type: 'Finance File' },
//         { table_type: 'PAA Finance' },
//         { table_type: 'RA Factors' },
//         { table_type: 'Transition Adjustments' }
//       ],
//       modelPoints: null,
//       file: null,
//       selectedType: null,
//       selectedTable: null,
//       uploadSuccess: false,
//       availableTypes: [{ name: 'Shocks' }],
//       timeout: 3000,
//       snackbar: false,
//       text: '',
//       sapFileList: []
//     }
//   },
//   computed: {
//     filteredSapList() {
//       return this.sapFileList.filter((item) => {
//         return item.run_name.toLowerCase().includes(this.searchQuery.toLowerCase())
//       })
//     }
//   },
//   mounted() {
//     //   CsmEngine.getTableMetaData().then((res) => {
//     //     this.ifrs17EngineTables = res.data.associated_tables;
//     //     this.modelPoints = res.data.model_points;
//     //   });
//     CsmEngine.getSapFileList().then((res) => {
//       if (res.data) {
//         this.sapFileList = res.data
//       }
//     })
//   },
//   methods: {
//     confirmTableDelete(tableType) {
//       this.selectedTable = tableType
//       this.deleteTableDialog = true
//     },
//     confirmSapDelete(runName) {
//       this.selectedRun = runName
//       this.deleteSapDialog = true
//     },

//     deleteSapData(value) {
//       if (value) {
//         CsmEngine.deleteSapData(this.selectedRun).then(() => {
//           this.text = 'SAP Data was successfully deleted'
//           this.sapFileList = this.sapFileList.filter((item) => item.run_name !== this.selectedRun)
//           this.snackbar = true
//           this.deleteSapDialog = false
//         })
//       } else {
//         this.text = 'SAP Data was not deleted'
//         this.snackbar = true
//         this.deleteSapDialog = false
//       }
//     },
//     deleteTable(value) {
//       if (value) {
//         const tableType = this.selectedTable.replace(/ /g, '')

//         CsmEngine.deleteTable(tableType.toLowerCase()).then(() => {
//           // this.text = res.data.message;
//           this.text = 'Table was successfully deleted'
//           this.snackbar = true
//           // this.ifrs17EngineTables = res.data.associated_tables;
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
//       CsmEngine.getDataForTable(tableName).then((res) => {
//         this.tableData = res.data.table_data
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
//         this.tableDialog = true
//       })
//       this.tableDialog = true
//     },

//     loadSapData(runName) {
//       this.rowData = []
//       CsmEngine.getSapResultsForRun(runName).then((res) => {
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

//     showSapData(runName) {
//       this.tableData = []
//       this.loadSapData(runName)
//     },
//     uploadSAPFile() {
//       const formdata = new FormData()
//       formdata.append('file', this.file)
//       this.loaderSize = 20
//       CsmEngine.uploadSAPFile(formdata)
//         .then((res) => {
//           this.loaderSize = 0
//           this.file = null
//           if (res.status === 201) {
//             this.sapFileList = res.data
//           }
//         })
//         .catch(() => {
//           this.loaderSize = 0
//         })
//     },

//     uploadFile() {
//       if (this.selectedType !== null && this.file !== null) {
//         const formdata = new FormData()
//         formdata.append('file', this.file)
//         formdata.append('table_type', this.selectedType)
//         CsmEngine.uploadIfrs17EngineTables(formdata)
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

<style>
.borderline {
  border: 1px solid #9aaaba;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

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
</style>
