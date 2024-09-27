<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">IBNR Run Settings</span>
          </template>
          <template #default>
            <v-row class="mt-9">
              <v-col cols="6">
                <v-text-field
                  v-model="runName"
                  variant="outlined"
                  density="compact"
                  :error-messages="runNameErrors"
                  label="Enter a name for this run"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-date-input
                  v-model="runDate"
                  readonly
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
                  v-model="selectedPortfolio"
                  variant="outlined"
                  density="compact"
                  label="Select a Portfolio"
                  placeholder="Portfolio"
                  :items="portfolios"
                  item-title="name"
                  item-value="name"
                  return-object
                  @update:model-value="getPortfolioClaimsYears"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedInputYear"
                  variant="outlined"
                  density="compact"
                  label="Claims Input Year"
                  placeholder="Select a claims input year"
                  :items="availableYears"
                  @update:model-value="getAvailableInputVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedInputVersion"
                  variant="outlined"
                  density="compact"
                  label="Claims Input Version"
                  placeholder="Select a claims input version"
                  :items="availableInputVersions"
                  item-title="version_name"
                  item-value="version_name"
                ></v-select>
              </v-col>

              <v-col cols="3">
                <v-select
                  v-model="selectedParameterYear"
                  variant="outlined"
                  density="compact"
                  placeholder="Parameter Year"
                  label="Select a parameter Year"
                  :items="availableParameterYears"
                  @update:model-value="getAvailableParameterBases"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="calculationInterval"
                  variant="outlined"
                  density="compact"
                  label="Calculation Interval"
                  placeholder="Calculation Interval"
                  :items="calculationIntervals"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedParameterBasis"
                  variant="outlined"
                  density="compact"
                  placeholder="Select Parameter Basis"
                  :items="availableParameterBases"
                  item-title="Basis"
                  item-value="Basis"
                  label="Parameter Basis"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedYieldCurveYear"
                  :disabled="selectedParameterBasis === null"
                  variant="outlined"
                  density="compact"
                  placeholder="Select Yield Curve year"
                  :items="availableYieldCurveYears"
                  label="Yield Curve Year"
                  @update:model-value="getYieldCurveMonths"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedYieldCurveMonth"
                  :disabled="selectedParameterBasis === null"
                  :error-messages="selectedYieldCurveMonthErrors"
                  variant="outlined"
                  density="compact"
                  placeholder="Select Yield Month"
                  :items="availableYieldCurveMonths"
                  label="Yield Curve Month"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-date-input
                  v-model="dataInputStartDate"
                  readonly
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Claims Input Start Date"
                ></v-date-input>
              </v-col>
              <v-col cols="3">
                <v-date-input
                  v-model="dataInputEndDate"
                  readonly
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Claims Input End Date"
                ></v-date-input>
              </v-col>
              <v-col v-if="inflationIndicator" cols="3">
                <v-date-input
                  v-model="inflationDate"
                  readonly
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Inflation Date"
                ></v-date-input>
              </v-col>

              <v-col cols="3">
                <v-checkbox
                  v-model="inflationIndicator"
                  class="mt-1"
                  :label="`Use Inflated Claims`"
                  @click="toggleInflationIndicator"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedIbnrMethod"
                  variant="outlined"
                  density="compact"
                  label="IBNR Method"
                  placeholder="Select an IBNR Method"
                  :items="ibnrMethods"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="bootStrapIndicator" cols="3">
                <v-text-field
                  v-model="simulationNumber"
                  variant="outlined"
                  density="compact"
                  type="number"
                  label="Simulations"
                  placeholder="Simulations"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="bootStrapIndicator"
                  class="mt-1"
                  :label="`Use Bootstrapping`"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="distributionIndicator" cols="3">
                <v-text-field
                  v-model="distributionSimulationNumber"
                  variant="outlined"
                  density="compact"
                  type="number"
                  label="Number of Mack Model Simulations"
                  placeholder="Simulations"
                >
                </v-text-field>
              </v-col>
              <v-col v-if="distributionIndicator" cols="3">
                <v-select
                  v-model="selectedDistributionModel"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a Statistical Distribution"
                  :items="availableModels"
                  label="Statistical Distribution"
                  item-title="name"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="distributionIndicator"
                  class="mt-1"
                  :label="`Use Mack Model`"
                ></v-checkbox>
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
            <v-row v-if="runJobs.length > 0" class="mx-9">
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="minwidth-name">Run Name</th>
                      <th class="minwidth">Portfolio</th>
                      <th class="minwidth">Run Date</th>
                      <th class="minwidth">Claims Data Year</th>
                      <th class="minwidth">Claims Input Version</th>
                      <th class="minwidth">Parameter Year</th>
                      <th class="minwidth">Yield Curve Year</th>
                      <th class="minwidth">Yield Curve Month</th>
                      <th class="minwidth">IBNR Method</th>
                      <th class="minwidth">Calculation Interval</th>
                      <th class="minwidth">Inflation Indicator</th>
                      <th class="minwidth">Inflation Date</th>
                      <th class="minwidth">Data Input Start Date</th>
                      <th class="minwidth">Data Input End Date</th>
                      <th class="minwidth">Bootstrap Indicator</th>
                      <th class="minwidth">Simulations</th>
                      <th class="minwidth">Manual Rerun</th>
                      <th class="minwidth">Mack Model Indicator</th>
                      <th class="minwidth">Mack Model Simulations</th>
                      <th class="minwidth">Mack Model Distribution</th>
                      <th class="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in runJobs" :key="item.run_name">
                      <td>{{ item.run_name }}</td>
                      <td>{{ item.portfolio_name }}</td>
                      <td>{{ item.run_date }}</td>
                      <td>{{ item.claims_data_year }}</td>
                      <td>{{ item.claims_input_version }}</td>
                      <td>{{ item.parameter_year }}</td>
                      <td>{{ item.yield_curve_year }}</td>
                      <td>{{ item.yield_curve_month }}</td>
                      <td>{{ item.ibnr_method.text }}</td>
                      <td>{{ item.calculation_interval }}</td>
                      <td>{{ item.inflation_indicator }}</td>
                      <td>{{ item.inflation_date }}</td>
                      <td>{{ item.data_input_start_date }}</td>
                      <td>{{ item.data_input_end_date }}</td>
                      <td>{{ item.bootstrap_indicator }}</td>
                      <td>{{ item.simulations }}</td>
                      <td>{{ item.rerun_indicator }}</td>
                      <td>{{ item.mack_model_indicator }}</td>
                      <td>{{ item.mack_model_simulations }}</td>
                      <td>{{ item.distribution_model }}</td>
                      <td>
                        <v-btn variant="text" icon @click="removeFromRunJobs(item.name)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-if="runJobs.length > 0" class="mx-9">
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
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackBarText }}
      <v-btn rounded color="red" variant="text" @click="closeSnackBar">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { ref, onMounted } from 'vue'
import IbnrService from '@/renderer/api/IbnrService'
import { VDateInput } from 'vuetify/labs/VDateInput'
import _ from 'lodash'
import formatDateString from '@/renderer/utils/helpers'
import { useRouter } from 'vue-router'

const $router = useRouter()

const runName = ref('')
const runNameErrors = ref([])
const selectedPortfolio: any = ref(null)
const portfolios = ref([])
const selectedInputYear = ref(null)
const availableYears = ref([])
const selectedInputVersion = ref(null)
const availableInputVersions = ref([])
const selectedParameterYear = ref(null)
const availableParameterYears = ref([])
const selectedParameterBasis = ref(null)
const availableParameterBases = ref([])
const dataInputStartDate = ref(null)
const dataInputEndDate = ref(null)
const calculationInterval = ref(null)
const calculationIntervals = [
  { text: 'Monthly', value: 'monthly' },
  { text: 'Quarterly', value: 'quarterly' },
  { text: 'Annual', value: 'annual' }
]

const availableModels = [
  { name: 'Normal', value: 'normal' },
  { name: 'Lognormal', value: 'lognormal' },
  { name: 'Gamma', value: 'gamma' },
  { name: 'Resampling', value: 'resampling' }
]

const selectedYieldCurveYear = ref(null)
const availableYieldCurveYears = ref([])
const selectedYieldCurveMonth = ref(null)
const availableYieldCurveMonths = ref([])
const selectedIbnrMethod = ref(null)
const ibnrMethods = [
  { text: 'BornHuetter-Ferguson', value: 'bornhuetter-ferguson' },
  { text: 'Chain-Ladder', value: 'chain-ladder' },
  {
    text: 'Chain-Ladder-Average Cost per Claim',
    value: 'chain-ladder-average-cost-per-claim'
  },
  {
    text: 'Cape-Cod',
    value: 'Cape-Cod'
  }
]
const inflationIndicator = ref(false)
const inflationDate = ref(null)
const bootStrapIndicator = ref(false)
const simulationNumber = ref(null)
const distributionIndicator = ref(false)
const distributionSimulationNumber = ref(null)
const selectedDistributionModel = ref(null)
const runJobs: any = ref([])
const runDate = ref(null)
const timeout = ref(0)
const snackbar = ref(false)
const snackBarText = ref('')

const selectedYieldCurveMonthErrors: any = ref([])

// methods
const closeSnackBar = () => {
  snackbar.value = false
}

onMounted(() => {
  IbnrService.getValidPortfolios().then((res) => {
    portfolios.value = res.data
  })
  IbnrService.getYieldCurveYears().then((res) => {
    availableYieldCurveYears.value = res.data
  })
})
const getPortfolioClaimsYears = () => {
  IbnrService.getParameterYears(selectedPortfolio.value.name).then((res) => {
    availableParameterYears.value = res.data
  })
  IbnrService.getClaimsYears(selectedPortfolio.value.name).then((res) => {
    availableYears.value = res.data
  })
}
const getAvailableInputVersions = () => {
  IbnrService.getAvailableInputVersions(selectedPortfolio.value.name, selectedInputYear.value).then(
    (res) => {
      availableInputVersions.value = res.data
    }
  )
}
const getAvailableParameterBases = () => {
  IbnrService.getAvailableParameterBases(
    selectedPortfolio.value.name,
    selectedParameterYear.value
  ).then((res) => {
    availableParameterBases.value = res.data
  })
}
const getYieldCurveMonths = () => {
  availableYieldCurveMonths.value = []
  selectedYieldCurveMonth.value = null
  selectedYieldCurveMonthErrors.value = []
  IbnrService.getYieldCurveMonths(
    selectedYieldCurveYear.value,
    selectedParameterBasis.value,
    selectedParameterYear.value,
    selectedPortfolio.value.id
  ).then((res) => {
    if (res.data.length === 0) {
      selectedYieldCurveMonthErrors.value = [
        'No valid yield curve months available for this year. This run will not be able to be executed.'
      ]
    } else {
      selectedYieldCurveMonthErrors.value = []
      availableYieldCurveMonths.value = res.data
    }
  })
}
const toggleInflationIndicator = () => {}
const addToRunJobs = () => {
  if (selectedYieldCurveMonthErrors.value.length > 0) {
    return
  }
  if (runName.value !== null && runName.value !== undefined && runName.value !== '') {
    const job: any = {}
    job.run_name = runName.value
    job.portfolio_name = selectedPortfolio.value.name
    job.portfolio_id = selectedPortfolio.value.id
    job.run_date = formatDateString(runDate.value, true, true, false)
    job.claims_data_year = selectedInputYear.value
    job.claims_input_version = selectedInputVersion.value
    job.parameter_year = selectedParameterYear.value
    job.yield_curve_year = selectedYieldCurveYear.value
    job.yield_curve_month = Number(selectedYieldCurveMonth.value)
    job.inflation_indicator = inflationIndicator.value
    job.bootstrap_indicator = bootStrapIndicator.value
    job.calculation_interval = calculationInterval.value
    job.simulations = Number(simulationNumber.value)

    job.inflation_date = formatDateString(inflationDate.value, true, true, false)

    job.data_input_start_date = formatDateString(dataInputStartDate.value, true, true, false)
    job.data_input_end_date = formatDateString(dataInputEndDate.value, true, true, false)
    job.ibnr_method = selectedIbnrMethod.value
    job.mack_model_indicator = distributionIndicator.value
    job.distribution_model = selectedDistributionModel.value
    job.basis = selectedParameterBasis.value
    job.mack_model_simulations = Number(distributionSimulationNumber.value)
    runJobs.value.push(job)

    runName.value = ''
    selectedPortfolio.value = null
    selectedIbnrMethod.value = null
    selectedInputYear.value = null
    selectedInputVersion.value = null
    selectedParameterYear.value = null
    inflationIndicator.value = false
    bootStrapIndicator.value = false
    simulationNumber.value = null
    selectedParameterBasis.value = null
    distributionIndicator.value = false
    selectedDistributionModel.value = null
    distributionSimulationNumber.value = null
    runDate.value = null
    inflationDate.value = null

    dataInputStartDate.value = null
    dataInputEndDate.value = null
    selectedYieldCurveYear.value = null
    selectedYieldCurveMonth.value = null
  }
}
const removeFromRunJobs = (jobName) => {
  runJobs.value = _.remove(runJobs.value, function (item) {
    return item.name !== jobName
  })
}
const executeJobs = () => {
  console.log('payload', runJobs.value)
  IbnrService.runJobs(runJobs.value).then((res) => {
    timeout.value = 3000
    snackbar.value = true
    snackBarText.value = res.data.message
    setTimeout(() => {
      $router.push({ name: 'valuations-ibnr-run-results' })
    }, 2000)
  })
}
</script>

<style scoped>
.v-table {
  border: 1px solid grey;
}

.minwidth {
  min-width: 120px;
  font-size: 12px;
  white-space: nowrap;
}

.table-row {
  background-color: grey;
  color: white;
}
</style>
