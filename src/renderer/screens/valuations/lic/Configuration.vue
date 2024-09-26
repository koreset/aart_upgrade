<template>
  <v-container>
    <v-row>
      <v-col
        ><base-card>
          <template #header>
            <span class="headline">LIC Configuration</span>
          </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col>
                  <v-table>
                    <thead>
                      <tr class="table-row">
                        <th class="table-col">Configuration Name</th>
                        <th class="table-col">Run Type</th>
                        <th class="table-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in licConfigs" :key="item.id">
                        <td>{{ item.configuration_name }}</td>
                        <td>{{ item.run_type }}</td>
                        <td>
                          <v-btn
                            size="small"
                            variant="outlined"
                            rounded
                            @click="showTableData(item)"
                          >
                            <v-icon color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>

                          <v-btn
                            class="ml-6"
                            color="red"
                            variant="outlined"
                            size="small"
                            rounded
                            @click="deleteConfig(item)"
                          >
                            <v-icon color="red">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-divider class="mb-9 mt-9"></v-divider>
              <v-row>
                <v-col>
                  <v-btn
                    rounded
                    size="small"
                    variant="outlined"
                    class="primary"
                    @click="showConfigurationForm = true"
                    >Create Lic Configuration</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="showConfigurationForm">
                <v-col>
                  <v-text-field
                    v-model="configurationName"
                    variant="outlined"
                    density="compact"
                    placeholder="Enter a name for this configuration"
                    label="Configuration Name"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    v-model="selectedRunType"
                    variant="outlined"
                    density="compact"
                    label="Run Type"
                    placeholder="Select a Run Type"
                    :items="runTypes"
                    item-title="text"
                    item-value="value"
                    @update:modelValue="setRunOptions"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row v-if="showConfigurationForm">
                <v-col>
                  <v-table class="trans-tables">
                    <thead>
                      <tr class="table-row">
                        <th class="minwidth table-col">Variable</th>
                        <th class="minwidth table-col">Run Name</th>
                        <th class="table-col">Assumption Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in licVars" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td>
                          <v-select
                            v-model="item.run_id"
                            :disabled="licRuns.length === 0 || licRuns === null"
                            class="mt-7"
                            density="compact"
                            clearable
                            variant="outlined"
                            label="Select a Run"
                            :items="licRuns"
                            :item-title="getItemTitle(item)"
                            item-value="id"
                            placeholder="Select a Run"
                            @update:modelValue="uniqueRuns"
                          ></v-select>
                        </td>
                        <td>{{ item.assumption_basis }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-row v-if="showConfigurationForm">
                <v-col>
                  <v-btn
                    rounded
                    size="small"
                    variant="outlined"
                    class="primary"
                    @click="saveConfiguration"
                  >
                    Save Configuration
                  </v-btn>
                  <v-btn
                    rounded
                    size="small"
                    variant="outlined"
                    class="ml-9 primary"
                    @click="cancelConfiguration"
                  >
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
              <v-snackbar v-model="snackbar" :timeout="timeout" :multi-line="true">
                {{ text }}
                <v-btn rounded color="red" text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmationDialog" />
    <file-info
      :tableTitle="configItemName"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :onUpdate:isInfoDialogOpen="closeInfoBox"
      :isDialogOpen="infoDialog"
    />
  </v-container>
</template>

<script setup lang="ts">
import ProductService from '@/renderer/api/ProductService'
import LicService from '@/renderer/api/LicService'
import IbnrService from '@/renderer/api/IbnrService'
import formatValues from '@/renderer/utils/format_values'
import { onMounted, ref } from 'vue'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/renderer/components/BaseCard.vue'
import FileInfo from '@/renderer/components/FileInfo.vue'

const $router = useRouter()

// data
const configItemName = ref('')
const infoDialog = ref(false)
const confirmationDialog: any = ref()
const showConfigurationForm = ref(false)
const text: any = ref(null)
const timeout = ref(3000)
const snackbar = ref(false)
const licConfigs: any = ref([])
const licRuns: any = ref([])
const columnDefs: any = ref([])
const rowData: any = ref([])
// const tableDialog = ref(false)
const selectedRunType = ref(null)
const configurationName = ref(null)
const filteredRuns: any = ref([])
const licVars: any = ref([])
const runTypes = ref([
  {
    text: 'IBNR',
    value: 'ibnr'
  },
  {
    text: 'Cash Flows',
    value: 'cash_flows'
  }
])

// methods
onMounted(async () => {
  const response = await LicService.getLicVariables()
  licVars.value = response.data
  licVars.value.forEach((item) => {
    item.run_id = null
  })
  const response2 = await LicService.getLicConfigs()
  licConfigs.value = response2.data
  console.log(licConfigs.value)
})

const closeInfoBox = (value) => {
  infoDialog.value = value
}

const getItemTitle = (item) => {
  console.log(item)
  return (item: any) => {
    return `${item.run_name} - [ Run date: ${item.run_date} ] `
  }
}

const deleteConfig = async (item) => {
  const res = await confirmationDialog.value.open(
    'Deleting LIC Confiuration',
    `Are you sure you want to delete this configuration, ${item.configuration_name} ?`
  )
  if (res) {
    LicService.deleteConfiguration(item.id).then(() => {
      snackbar.value = true
      text.value = 'Configuration Deleted Successfully'
      timeout.value = 3000
      licConfigs.value = licConfigs.value.filter((config) => config.id !== item.id)
    })
  }
}

const setRunOptions = async () => {
  licRuns.value = []

  if (selectedRunType.value === 'ibnr') {
    const res = await IbnrService.getProjectionJobs()
    licRuns.value = res.data
  } else if (selectedRunType.value === 'cash_flows') {
    const res = await ProductService.getValuationJobs()
    licRuns.value = res.data
  }
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

const showTableData = (item) => {
  loadData(item)
  configItemName.value = item.configuration_name
  infoDialog.value = true
}

const loadData = (item) => {
  columnDefs.value = []
  rowData.value = []

  if (item.lic_variables.length > 0) {
    createColumnDefs(item.lic_variables)
    item.lic_variables.forEach((item) => {
      const transformed: any = {}
      const keys = Object.keys(item)
      keys.forEach((i) => {
        if (isNaN(item[i]) || typeof item[i] === 'string') {
          transformed[i] = item[i]
        } else {
          const value = Number(item[i])
          transformed[i] = value
        }
      })
      rowData.value.push(transformed)
    })
  }
}

const saveConfiguration = () => {
  const payload: any = {}
  payload.configuration_name = configurationName.value
  payload.lic_variables = licVars.value
  payload.run_type = selectedRunType.value
  LicService.saveRunConfig(payload).then((res) => {
    if (res.status === 201) {
      text.value = 'LIC Configuration saved successfully'
      timeout.value = 3000
      snackbar.value = true
      showConfigurationForm.value = false
      setTimeout(() => {
        $router.push({ path: '/lic-run-settings' })
      }, 2000)
    }
  })
}

const cancelConfiguration = () => {
  configurationName.value = null
  selectedRunType.value = null
  showConfigurationForm.value = false
}

// const mustNotBeNull = (value) => value !== null

const uniqueRuns = () => {
  filteredRuns.value = []
  licVars.value.forEach((item) => {
    if (item.run_id !== null && item.run_id > 0) {
      const found = licRuns.value.find((obj) => obj.id === item.run_id)
      if (filteredRuns.value.indexOf(found) === -1) {
        filteredRuns.value.push(found)
      }
    }
  })
  console.log(filteredRuns.value)
}

// export default {
//   data: () => {
//     return {
//       selectedConfigId: 0,
//       selectedConfigName: '',
//       deleteDialog: false,
//       coverageUnitOption: null,
//       showConfigurationForm: false,
//       coverageUnitOptions: [
//         {
//           text: 'Undiscounted Coverage Units',
//           value: 'UndiscountedCoverageUnits'
//         },
//         { text: 'Discounted Coverage Units', value: 'DiscountedCoverageUnits' }
//       ],
//       text: null,
//       timeout: 3000,
//       snackbar: false,
//       licConfigs: [],
//       licRuns: [],
//       columnDefs: [],
//       rowData: [],
//       tableDialog: false,
//       selectedRun: null,
//       selectedChangeType: null,
//       selectedRunType: null,
//       aosList: [],
//       configurationName: null,
//       filteredRuns: [],
//       licVars: [],
//       runTypes: [
//         {
//           text: 'IBNR',
//           value: 'ibnr'
//         },
//         {
//           text: 'Cash Flows',
//           value: 'cash_flows'
//         }
//       ],
//       changeTypes: [
//         { change_type: 'Not Applicable' },
//         { change_type: 'Current Service' },
//         { change_type: 'Future Service' }
//       ]
//     }
//   },

//   computed: {
//     runTypeErrors() {
//       const errors = []
//       if (!this.$v.selectedRunType.$dirty) return errors
//       !this.$v.selectedRunType.required && errors.push('Run Type is required.')
//       return errors
//     },
//     configurationNameErrors() {
//       const errors = []
//       if (!this.$v.configurationName.$dirty) return errors
//       !this.$v.configurationName.required && errors.push('Configuration Name is required.')
//       !this.$v.configurationName.configurationNameDuplicate &&
//         errors.push('This name already exists')
//       return errors
//     },

//     varHeaders: function () {
//       return [
//         { text: 'Variable', value: 'duration_in_force_months' },
//         { text: 'Description', value: 'current_year' },
//         { text: 'Run Name', value: 'past_year' },
//         { text: 'Notes', value: 'variance' },
//         { text: 'Assumption Basis', value: 'change' }
//       ]
//     }
//   },
//   watch: {
//     resetValidation: function (val) {
//       if (val) {
//         this.$v.$reset()
//       }
//     }
//   },
//   validations: {
//     selectedRunType: {
//       required,
//       mustNotBeNull
//     },
//     configurationName: {
//       required,
//       configurationNameDuplicate: async function (value) {
//         if (value) {
//           let result
//           result = await LicService.checkConfigName(value)
//           return !result.data
//         }
//       }
//     }
//   },
//   async mounted() {
//     let response = await LicService.getLicVariables()
//     this.licVars = response.data
//     response = await LicService.getLicConfigs()
//     this.licConfigs = response.data
//     // this.uniqueRuns();
//   },
//   methods: {
//     async deleteConfig(item) {
//       const res = await this.$refs.confirm.open(
//         'Deleting LIC Confiuration',
//         `Are you sure you want to delete this configuration, ${item.configuration_name} ?`
//       )
//       if (res) {
//         LicService.deleteConfiguration(item.id).then(() => {
//           this.snackbar = true
//           this.text = 'Configuration Deleted Successfully'
//           this.timeout = 3000
//           this.licConfigs = this.licConfigs.filter((config) => config.id !== item.id)
//         })
//       }
//     },
//     async setRunOptions() {
//       this.licRuns = []

//       if (this.selectedRunType === 'ibnr') {
//         const res = await IbnrService.getProjectionJobs()
//         this.licRuns = res.data
//       } else if (this.selectedRunType === 'cash_flows') {
//         const res = await ProductService.getValuationJobs()
//         this.licRuns = res.data
//       }
//     },
//     dismissTableDialog(value) {
//       this.tableDialog = value
//     },
//     showTableData(item) {
//       this.loadData(item)
//       this.tableDialog = true
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

//     loadData(item) {
//       this.columnDefs = []
//       this.rowData = []

//       if (item.lic_variables.length > 0) {
//         this.createColumnDefs(item.lic_variables)
//         item.lic_variables.forEach((item) => {
//           const transformed = {}
//           const keys = Object.keys(item)
//           keys.forEach((i) => {
//             if (isNaN(item[i]) || typeof item[i] === 'string') {
//               transformed[i] = item[i]
//             } else {
//               const value = Number(item[i])
//               transformed[i] = value
//             }
//           })
//           this.rowData.push(transformed)
//         })
//       }
//     },

//     uniqueRuns() {
//       // this.filteredRuns = [];
//       // this.licVars.forEach(item => {
//       //   if (item.run_id !== null && item.run_id > 0) {
//       //     let found = this.licRuns.find(obj => obj.id == item.run_id);
//       //     if (this.filteredRuns.indexOf(found) === -1) {
//       //       this.filteredRuns.push(found);
//       //     }
//       //   }
//       // });
//     },
//     cancelConfiguration() {
//       this.configurationName = null
//       this.selectedRunType = null
//       this.showConfigurationForm = false
//     },
//     saveConfiguration() {
//       this.$v.$touch()
//       if (this.$v.$invalid) {
//         this.text = 'Please fill out all required fields.'
//         this.snackbar = true
//         return
//       }
//       const payload = {}
//       payload.configuration_name = this.configurationName
//       payload.lic_variables = this.licVars
//       payload.run_type = this.selectedRunType
//       LicService.saveRunConfig(payload).then((res) => {
//         if (res.status === 201) {
//           this.text = 'LIC Configuration saved successfully'
//           this.timeout = 3000
//           this.snackbar = true
//           this.showConfigurationForm = false
//           setTimeout(() => {
//             this.$router.push({ path: '/lic-run-settings' })
//           }, 2000)
//         }
//       })
//     }
//   }
// }
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
.minwidth {
  min-width: 200px;
}
</style>
