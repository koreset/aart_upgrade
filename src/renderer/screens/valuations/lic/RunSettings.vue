<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :showActions="false">
          <template #header>
            <span class="headline">LIC Run Settings</span>
          </template>
          <template #default>
            <v-form ref="form">
              <v-row class="mt-9">
                <v-col cols="6">
                  <v-text-field
                    v-model="runName"
                    variant="outlined"
                    density="compact"
                    label="Enter a name for this run"
                    :rules="[() => !!runName || 'Run name is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="runConfig"
                    variant="outlined"
                    density="compact"
                    placeholder="Select a run configuration"
                    label="Run Configuration"
                    :items="runConfigs"
                    item-title="configuration_name"
                    item-value="id"
                    return-object
                    :rules="[() => !!runConfig || 'Run configuration is required']"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="6">
                  <v-date-input
                    v-model="runDate"
                    readonly
                    hide-actions
                    view-mode="month"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    variant="outlined"
                    density="compact"
                    label="Run Date"
                    :rules="[() => !!runDate || 'Run date is required']"
                    required
                  ></v-date-input>
                </v-col>
                <v-col cols="6">
                  <v-date-input
                    v-model="openingBalanceDate"
                    readonly
                    hide-actions
                    view-mode="month"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    variant="outlined"
                    density="compact"
                    label="Opening Balance Date"
                    :rules="[() => !!openingBalanceDate || 'Opening balance date is required']"
                    required
                  ></v-date-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="selectedParameterYear"
                    variant="outlined"
                    density="compact"
                    placeholder="Parameter Year"
                    label="Select a parameter Year"
                    :items="availableParameterYears"
                    required
                    :rules="[() => !!selectedParameterYear || 'Parameter year is required']"
                    @update:modelValue="getAvailableParameterVersions"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="selectedParameterVersion"
                    variant="outlined"
                    density="compact"
                    placeholder="Parameter Version"
                    label="Select a version"
                    required
                    :rules="[() => !!selectedParameterVersion || 'Parameter version is required']"
                    :items="availableParameterVersions"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn size="small" variant="outlined" rounded class="primary" @click="addJob"
                    >Add Job</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="runJobs.length > 0">
                <v-col>
                  <v-table class="trans-tables">
                    <thead>
                      <tr class="table-row">
                        <th class="table-col">Run Name</th>
                        <th class="table-col">Run Date</th>
                        <th class="table-col">Opening Balance Date</th>
                        <th class="table-col">Run Configuration</th>
                        <th class="table-col">Lic Parameter Year</th>
                        <th class="table-col">Lic Parameter Version</th>
                        <th class="table-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in runJobs" :key="item.run_name">
                        <td>{{ item.run_name }}</td>
                        <td>{{ item.run_date }}</td>
                        <td>{{ item.opening_balance_date }}</td>
                        <td>{{ item.lic_configuration_name }}</td>
                        <td>{{ item.lic_parameter_year }}</td>
                        <td>{{ item.lic_parameter_version }}</td>
                        <td>
                          <v-btn variant="text" size="small" icon @click="removeFromJobs(item)">
                            <v-icon color="red">mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-form>

            <v-row v-if="runJobs.length > 0">
              <v-col>
                <v-btn size="small" rounded variant="outlined" class="primary" @click="executeRun"
                  >Run Job</v-btn
                >
              </v-col>
            </v-row>
            <confirmation-dialog ref="confirm" />

            <v-dialog v-model="dialog" persistent max-width="400">
              <v-card>
                <v-card-title class="headline">Existing run parameters encountered</v-card-title>
                <v-card-text
                  >There is at least one existing run with the specified run parameters. Continuing
                  this run will overwrite the existing runs. Is this what you want to
                  do?</v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    rounded
                    color="primary darken-1"
                    variant="plain"
                    @click="confirmOverride(false)"
                    >No</v-btn
                  >
                  <v-btn
                    rounded
                    color="primary darken-1"
                    variant="plain"
                    @click="confirmOverride(true)"
                    >Yes</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar" :timeout="timeout" :multi-line="true">
              {{ text }}
              <v-btn rounded color="red" variant="plain" @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LicService from '@/renderer/api/LicService'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { VDateInput } from 'vuetify/labs/VDateInput'
import formatDateString from '@/renderer/utils/helpers'

const form = ref()
const $router = useRouter()
const dialog = ref(false)
const overrideRun = ref(false)
const runJobs: any = ref([])
const errorMessages = ref([])
const runName = ref(null)
const runConfig: any = ref(null)
const runConfigs: any = ref([])
const text = ref<string>('')
const snackbar = ref<boolean>(false)
const timeout = ref(3000)
const selectedParameterYear = ref(null)
const selectedParameterVersion = ref(null)
const availableParameterYears = ref([])
const availableParameterVersions = ref([])
const openingBalanceDate = ref(null)
const runDate = ref(null)

onMounted(() => {
  LicService.getRunConfigs().then((res) => {
    runConfigs.value = res.data
  })
  LicService.getAvailableParameterYears().then((res) => {
    availableParameterYears.value = res.data
  })
})

const removeFromJobs = (item) => {
  console.log(item)
  // remove the item from the runJobs list
  runJobs.value = runJobs.value.filter((elem) => {
    return elem.run_name !== item.run_name
  })
}

const getAvailableParameterVersions = () => {
  LicService.getAvailableParameterVersions(selectedParameterYear.value).then((res) => {
    availableParameterVersions.value = res.data
  })
}

const addJob = async () => {
  const isValid = await form.value.validate()
  console.log('isvalid', isValid)
  if (!isValid.valid) {
    return
  }
  console.log(form.value)

  const job = {
    run_name: runName.value,
    run_date: formatDateString(runDate.value, true, true, false),
    opening_balance_date: formatDateString(openingBalanceDate.value, true, true, false),
    lic_configuration_name: runConfig.value.configuration_name,
    lic_config: runConfig.value.configuration_name,
    lic_configuration_id: runConfig.value.id,
    lic_parameter_year: selectedParameterYear.value,
    lic_parameter_version: selectedParameterVersion.value
  }

  runJobs.value.push(job)
  runName.value = null
  runDate.value = null
  openingBalanceDate.value = null
}

const executeRun = () => {
  LicService.executeLicRun(runJobs.value).then(() => {
    // errorMessages.value = res.data.error_messages;
    if (errorMessages.value.length === 0) {
      snackbar.value = true
      text.value = 'Run successfully executed'
      setTimeout(() => {
        $router.push({ path: '/valuations/lic/run-results' })
      }, 3000)
    } else {
      snackbar.value = true
      text.value = 'Run failed'
    }
  })
}

const confirmOverride = (value) => {
  overrideRun.value = value
  dialog.value = false
}

// const runNameErrors = () => {
//   const errors = []
//   if (!runName.value) return errors
//   !required(runName.value) && errors.push('run name is required.')
//   return errors
// }

// const runNameDuplicate = async (value) => {
//   if (value) {
//     let result
//     result = await LicService.checkLicRunName(value)
//     return !result.data
//   }
// }

// const exists = async (value) => {
//   if (value) {
//     let result
//     result = await LicService.checkExistingLicRun(value)
//     return result.data
//   }
// }

// export default {
//   data() {
//     return {
//       dialog: false,
//       overrideRun: false,
//       runJobs: [],
//       errorMessages: [],
//       runName: null,
//       runConfig: null,
//       runConfigs: [],
//       text: null,
//       snackbar: false,
//       timeout: 3000,
//       selectedParameterYear: null,
//       selectedParameterVersion: null,
//       availableParameterYears: [],
//       availableParameterVersions: []
//     }
//   },
//   computed: {
//     runNameErrors() {
//       const errors = []
//       if (!this.$v.runName.$dirty) return errors
//       !this.$v.runName.required && errors.push('run name is required.')
//       !this.$v.runName.runNameDuplicate && errors.push('The run name already exists')
//       return errors
//     }
//   },
//   mounted() {
//     LicService.getRunConfigs().then((res) => {
//       this.runConfigs = res.data
//     })
//     LicService.getAvailableParameterYears().then((res) => {
//       this.availableParameterYears = res.data
//     })
//   },
//   methods: {
//     getAvailableParameterVersions() {
//       LicService.getAvailableParameterVersions(this.selectedParameterYear).then((res) => {
//         this.availableParameterVersions = res.data
//       })
//     },
//     removeFromJobs(item) {
//       console.log(item)
//       // remove the item from the runJobs list
//       this.runJobs = this.runJobs.filter((elem) => {
//         return elem.run_name !== item.run_name
//       })
//     },
//     async addJob() {
//       this.$v.$touch()
//       if (this.$v.$invalid) {
//         return
//       }
//       const job = {
//         run_name: this.runName,
//         run_date: this.$refs.runDate.valDate,
//         opening_balance_date: this.$refs.openingBalanceDate.valDate,
//         lic_configuration_name: this.runConfig.configuration_name,
//         lic_config: this.runConfig.configuration_name,
//         lic_configuration_id: this.runConfig.id,
//         lic_parameter_year: this.selectedParameterYear,
//         lic_parameter_version: this.selectedParameterVersion
//       }

//       const exists = await LicService.checkExistingLicRun(job)
//       if (exists.data.result) {
//         const res = await this.$refs.confirm.open(
//           'Existing run parameters encountered',
//           `There is at least one existing run with the specified run
//                   parameters. Continuing this run will overwrite the existing
//                   runs. Is this what you want to do?`
//         )

//         if (!res) return
//       }

//       this.runJobs.push(job)
//       this.runName = null
//       this.$refs.runDate.valDate = null
//       this.$refs.openingBalanceDate.valDate = null
//       this.runConfig = null
//       this.$v.$reset()
//     },

//     executeRun() {
//       LicService.executeLicRun(this.runJobs).then(() => {
//         // this.errorMessages = res.data.error_messages;
//         if (this.errorMessages.length === 0) {
//           this.snackbar = true
//           this.text = 'Run successfully executed'
//           setTimeout(() => {
//             this.$router.push({ path: '/lic-buildup-runs' })
//           }, 3000)
//         } else {
//           this.snackbar = true
//           this.text = 'Run failed'
//         }
//       })
//     }
//   },
//   validations: {
//     runName: {
//       required,
//       runNameDuplicate: async function (value) {
//         if (value) {
//           let result
//           result = await LicService.checkLicRunName(value)
//           return !result.data
//         }
//       }
//     }
//   }
// }
</script>

<style scoped></style>
