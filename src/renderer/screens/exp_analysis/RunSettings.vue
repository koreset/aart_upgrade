<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Experience Analysis Run Settings</span>
          </template>
          <template #default>
            <v-row class="mt-9">
              <v-col cols="6">
                <v-text-field
                  v-model="runName"
                  variant="outlined"
                  density="compact"
                  label="Enter a name for this run"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-date-input
                  v-model="runDate"
                  hide-actions
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Run Date"
                ></v-date-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedConfiguration"
                  variant="outlined"
                  density="compact"
                  label="Select a Configuration"
                  placeholder="Configuration"
                  :items="configurations"
                  item-title="name"
                  item-value="name"
                  return-object
                  @update:modelValue="getExposureAndActualYears"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-date-input
                  v-model="periodStartDate"
                  hide-actions
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Period Start Date"
                ></v-date-input>
              </v-col>
              <v-col cols="3">
                <v-date-input
                  v-model="periodEndDate"
                  hide-actions
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Period End Date"
                ></v-date-input>
              </v-col>
              <!-- <v-col cols="3">
                <v-select
                  v-model="selectedRunType"
                  variant="outlined"
                  density="compact"
                  label="Select a Run Type"
                  placeholder="Run Type"
                  :items="runTypes"
                  item-title="name"
                  item-value="name"
                  return-object
                ></v-select>
              </v-col> -->
              <v-col cols="3">
                <v-select
                  v-model="selectedExposureYear"
                  variant="outlined"
                  density="compact"
                  label="Exposure Data Period"
                  placeholder="Select a claims input year"
                  :items="availableExposureYears"
                  @update:modelValue="getAvailableExposureVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedExposureVersion"
                  variant="outlined"
                  density="compact"
                  label="Exposure Data Version"
                  placeholder="Select a version"
                  :items="availableExposureVersions"
                ></v-select>
              </v-col>
              <!-- <v-col cols="3">
                <v-select
                  v-model="selectedActualYear"
                  variant="outlined"
                  density="compact"
                  label="Actual Data Period"
                  placeholder="Select a claims input year"
                  :items="availableActualYears"
                  @update:modelValue="getAvailableActualVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedActualVersion"
                  variant="outlined"
                  density="compact"
                  label="Actual Data Version"
                  placeholder="Select a claims input version"
                  :items="availableActualVersions"
                  item-text="version_name"
                  item-value="version_name"
                ></v-select>
              </v-col> -->
              <v-col cols="3">
                <v-select
                  v-model="selectedMortalityYear"
                  variant="outlined"
                  density="compact"
                  label="Mortality Data Period"
                  placeholder="Select a Mortality year"
                  :items="availableMortalityYears"
                  @update:modelValue="getAvailableMortalityVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedMortalityVersion"
                  variant="outlined"
                  density="compact"
                  label="Mortality Data Version"
                  placeholder="Select a version"
                  :items="availableMortalityVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedLapseYear"
                  variant="outlined"
                  density="compact"
                  label="Lapse Data Period"
                  placeholder="Select a lapse year version"
                  :items="availableLapseYears"
                  @update:modelValue="getAvailableLapseVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedLapseVersion"
                  variant="outlined"
                  density="compact"
                  label="Lapse Data Version"
                  placeholder="Select a lapse year version"
                  :items="availableLapseVersions"
                  item-title="version_name"
                  item-value="version_name"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedAgeBand"
                  variant="outlined"
                  density="compact"
                  label="Age Band Version"
                  placeholder="Select an age band version"
                  :items="availableAgeBands"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn
                  rounded
                  width="200"
                  size="small"
                  variant="outlined"
                  class="primary"
                  @click="addToRunJobs"
                  >Add to Run Jobs</v-btn
                >
              </v-col>
            </v-row>
            <v-divider v-if="runJobs.length > 0" class="my-5"></v-divider>
            <v-row v-if="runJobs.length > 0">
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="table-col minwidth-name">Run Name</th>
                      <th class="table-col minwidth">Configuration</th>
                      <th class="table-col minwidth">Run Date</th>
                      <th class="table-col minwidth">Period Start Date</th>
                      <th class="table-col minwidth">Period End Date</th>
                      <th class="table-col minwidth">Exposure Data Year</th>
                      <th class="table-col minwidth">Exposure Data Version</th>
                      <th class="table-col min-width">Lapse Data Year</th>
                      <th class="table-col min-width">Lapse Data Version</th>
                      <th class="table-col min-width">Mortality Data Year</th>
                      <th class="table-col min-width">Mortality Data Version</th>
                      <th class="table-col text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in runJobs" :key="item.run_name">
                      <td>{{ item.run_name }}</td>
                      <td>{{ item.exp_configuration_name }}</td>
                      <td>{{ item.run_date }}</td>
                      <td>{{ item.period_start_date }}</td>
                      <td>{{ item.period_end_date }}</td>
                      <td>{{ item.exposure_data_year }}</td>
                      <td>{{ item.exposure_data_version }}</td>
                      <td>{{ item.lapse_data_year }}</td>
                      <td>{{ item.lapse_data_version }}</td>
                      <td>{{ item.mortality_data_year }}</td>
                      <td>{{ item.mortality_data_version }}</td>
                      <td>
                        <v-btn
                          variant="text"
                          size="small"
                          icon
                          @click="removeFromRunJobs(item.run_name)"
                        >
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-if="runJobs.length > 0">
              <v-col>
                <v-btn class="primary" size="small" variant="outlined" rounded @click="executeJobs"
                  >Run Jobs</v-btn
                >
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout" :multi-line="true">
      {{ text }}
      <v-btn rounded color="red" variant="plain" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import _ from 'lodash'
// import { getUser } from '../../utils/get_user'

import IbnrService from '@/renderer/api/IbnrService'
import ExpService from '@/renderer/api/ExpAnalysisService'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { VDateInput } from 'vuetify/labs/VDateInput'
import BaseCard from '@/renderer/components/BaseCard.vue'
import formatDateString from '@/renderer/utils/helpers'

// data
const $router = useRouter()
// const runTypes = ref([
//   { name: 'Mortality', type: 'mortality' },
//   { name: 'Disability', type: 'disability' },
//   { name: 'Lapse', type: 'lapse' }
// ])

const configurations = ref([])
const runName = ref(null)
const runDate = ref(null)
const periodStartDate = ref(null)
const periodEndDate = ref(null)
const runJobs: any = ref([])
const availableActualYears = ref([])
const availableExposureYears = ref([])
const availableYieldCurveYears = ref([])
const availableMortalityYears = ref([])
const availableLapseYears = ref([])
const availableMortalityVersions = ref([])
const availableLapseVersions = ref([])
const selectedMortalityYear = ref(null)
const selectedMortalityVersion = ref(null)
const selectedLapseYear = ref(null)
const selectedLapseVersion = ref(null)
const selectedExposureVersion = ref(null)
const availableExposureVersions = ref([])
const availableActualVersions = ref([])
const selectedExposureYear = ref(null)
const selectedRunType: any = ref(null)
const availableAgeBands: any = ref([])
const selectedAgeBand = ref(null)
const selectedConfiguration: any = ref(null)
const snackbar = ref(false)
const timeout = ref(5000)
const text = ref('')

onMounted(() => {
  ExpService.getConfigurations().then((res) => {
    configurations.value = res.data
  })
  IbnrService.getYieldCurveYears().then((res) => {
    availableYieldCurveYears.value = res.data
  })
  getAgeBands()
})

// methods
// const getAvailableActualVersions = () => {
//   ExpService.getAvailableActualVersions(
//     selectedConfiguration.value.id,
//     selectedActualYear.value
//   ).then((res) => {
//     availableActualVersions.value = res.data
//   })
// }

const getAgeBands = () => {
  ExpService.getAgeBands().then((res) => {
    availableAgeBands.value = res.data
    console.log('availableAgeBands', availableAgeBands.value)
  })
}

const getAvailableExposureVersions = () => {
  ExpService.getAvailableExposureVersions(
    selectedConfiguration.value.id,
    selectedExposureYear.value
  ).then((res) => {
    availableExposureVersions.value = res.data
  })
}

const getAvailableMortalityVersions = () => {
  ExpService.getAvailableMortalityVersions(selectedMortalityYear.value).then((res) => {
    availableMortalityVersions.value = res.data
  })
}

const getAvailableLapseVersions = () => {
  ExpService.getAvailableLapseVersions(selectedLapseYear.value).then((res) => {
    availableLapseVersions.value = res.data
  })
}
const getExposureAndActualYears = () => {
  availableActualVersions.value = []
  availableExposureVersions.value = []
  availableActualYears.value = []
  availableExposureYears.value = []
  ExpService.getExposureAndActualYears(selectedConfiguration.value.id).then((res) => {
    availableActualYears.value = res.data.actual_years
    availableExposureYears.value = res.data.exposure_years
    availableLapseYears.value = res.data.lapse_years
    availableMortalityYears.value = res.data.mortality_years
  })
}

const addToRunJobs = () => {
  if (runName.value !== null) {
    const job: any = {}
    job.run_name = runName.value
    job.exp_configuration_name = selectedConfiguration.value.name
    job.exp_configuration_id = selectedConfiguration.value.id
    job.run_date = formatDateString(runDate.value, true, true, false)
    job.period_start_date = formatDateString(periodStartDate.value, true, true, true)
    job.period_end_date = formatDateString(periodEndDate.value, true, true, true)
    job.exposure_data_year = selectedExposureYear.value
    job.exposure_data_version = selectedExposureVersion.value
    job.mortality_data_year = selectedMortalityYear.value
    job.mortality_data_version = selectedMortalityVersion.value
    job.lapse_data_year = selectedLapseYear.value
    job.lapse_data_version = selectedLapseVersion.value
    job.age_band_version = selectedAgeBand.value

    runJobs.value.push(job)

    // runName.value = null
    selectedConfiguration.value = null
    // runDate.value = null
    periodStartDate.value = null
    periodEndDate.value = null
    selectedExposureYear.value = null
    selectedExposureVersion.value = null
    selectedRunType.value = null
    availableActualVersions.value = []
    availableExposureVersions.value = []
    availableActualYears.value = []
    availableExposureYears.value = []
    selectedMortalityYear.value = null
    selectedMortalityVersion.value = null
    selectedLapseYear.value = null
    selectedLapseVersion.value = null
    selectedAgeBand.value = null
    availableMortalityVersions.value = []
    availableLapseVersions.value = []
  }
}
const removeFromRunJobs = (jobName) => {
  runJobs.value = _.remove(runJobs, function (item) {
    return item.run_name !== jobName
  })
}
const executeJobs = () => {
  ExpService.runAnalysis(runJobs.value).then((res) => {
    timeout.value = 3000
    snackbar.value = true
    text.value = res.data.message
    setTimeout(() => {
      $router.push({ path: '/exp-analysis/run-results' })
    }, 2000)
  })
}
</script>

<style scoped>
.minwidth {
  min-width: 110px !important;
}

.minwidth-name {
  min-width: 150px !important;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
