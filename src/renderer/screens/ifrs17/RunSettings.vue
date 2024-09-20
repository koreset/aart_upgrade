<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-title class="mb-4 header-title accent white--text"
            >Run IFRS17 Engine</v-card-title
          >
          <v-card-text>
            <v-row class="mx-6">
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
            <v-row class="mx-6">
              <v-col cols="4">
                <v-select
                  v-model="selectedMeasure"
                  variant="outlined"
                  density="compact"
                  label="Measurement Model"
                  placeholder="Select a Measurement Model"
                  :items="measures"
                  clearable
                  @update:modelValue="showFinanceFile"
                ></v-select>
              </v-col>
              <v-col v-if="showPAARuns" cols="4">
                <v-select
                  v-model="selectedPAARun"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a PAA Run"
                  label="PAA Run"
                  :items="paaRuns"
                  item-title="name"
                  item-value="id"
                  clearable
                  return-object
                  @update:modelValue="showPAAFinanceBlock"
                ></v-select>
              </v-col>
              <v-col v-if="showPAARuns" cols="4">
                <v-checkbox
                  v-model="paaEligibilityTest"
                  class="mt-1"
                  :label="`Run PAA Eligibility Test`"
                ></v-checkbox>
              </v-col>
              <v-col v-if="showGMMBlocks" cols="4">
                <v-select
                  v-model="selectedConfig"
                  variant="outlined"
                  density="compact"
                  placeholder="Select an AoS Configuration"
                  :items="aosConfigs"
                  item-title="configuration_name"
                  item-value="configuration_name"
                  clearable
                  return-object
                  @update:modelValue="checkManualSap"
                ></v-select>
              </v-col>
              <v-col v-if="showGMMBlocks" cols="4">
                <v-select
                  v-model="selectedTransitionType"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a Transition Type"
                  :items="transitionTypes"
                  item-title="trans_type"
                  item-value="trans_type"
                  clearable
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="mx-6">
              <v-col v-if="showGMMBlocks || showPAAFinance" cols="4">
                <v-select
                  v-model="selectedFinanceYear"
                  variant="outlined"
                  density="compact"
                  placeholder="Select Finance Year"
                  label="Finance Year"
                  :items="availableFinanceYears"
                  clearable
                  @update:modelValue="getAvailableFinanceVersions"
                ></v-select>
              </v-col>
              <v-col v-if="selectedFinanceYear && showFinanceVersion">
                <v-select
                  v-model="financeVersion"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a finance version"
                  label="Finance File Version"
                  :items="availableVersions"
                ></v-select>
              </v-col>
              <v-col v-if="showGMMBlocks && !externalSAP" cols="4">
                <v-select
                  v-model="selectedRiskAdjustmentYear"
                  variant="outlined"
                  density="compact"
                  placeholder="Select Risk Adjustment Year"
                  label="Risk Adjustment Year"
                  :items="availableRiskAdjustmentYears"
                  clearable
                ></v-select>
              </v-col>
              <v-col v-if="showGMMBlocks || showPAARuns" cols="4">
                <v-date-input
                  v-model="openingBalDate"
                  readonly
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Opening Balance Date"
                ></v-date-input>
              </v-col>
            </v-row>
            <v-row class="mx-6">
              <v-col>
                <v-btn
                  :disabled="runName === null && selectedMeasure === null"
                  rounded
                  size="small"
                  variant="outlined"
                  @click="addToJobs"
                  >Add to Run Jobs</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="csmRuns.length > 0" class="mx-6">
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="table-col">Run Name</th>
                      <th class="table-col">Run Date</th>
                      <th class="table-col">Measurement Type</th>
                      <th class="table-col">Configuration Name</th>
                      <th class="table-col">Transition Type</th>
                      <th class="table-col">PAA Run Name</th>
                      <th class="table-col">PAA Eligibility Test</th>
                      <th class="table-col">Opening Balance Date</th>
                      <th class="table-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in csmRuns" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.run_date }}</td>
                      <td>{{ item.measurement_type }}</td>
                      <td>{{ item.configuration_name }}</td>
                      <td>{{ item.transition_type }}</td>
                      <td>{{ item.paa_run_name }}</td>
                      <td>{{ item.paa_eligibility_test }}</td>
                      <td>{{ item.opening_bal_date }}</td>
                      <td>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          class="red--text"
                          @click="removeFromJobs(item)"
                        >
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-if="csmRuns.length > 0" class="mx-6">
              <v-col class="d-flex">
                <v-btn rounded size="small" variant="outlined" @click="runCsm">Run Jobs</v-btn>
                <v-progress-circular
                  v-if="isRunning"
                  indeterminate
                  color="primary"
                  class="ml-9"
                  :width="3"
                ></v-progress-circular>
              </v-col>
            </v-row>
            <v-row v-if="returnText !== ''" class="mx-6">
              <v-col v-if="noError && selectedMeasure === 'GMM'">
                {{ returnText }}
                <v-btn :to="'/csm-aos-run-reports/' + completedRunId" text>Here</v-btn>
              </v-col>
              <v-col v-if="noError && selectedMeasure === 'PAA'">
                {{ returnText }}
                <v-btn :to="'/csm-paa-run-reports/' + completedRunId" text>Here</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="productList.length > 0">
              <v-col cols="6">
                <v-select
                  v-model="selectedProduct"
                  dense
                  outlined
                  label="Product"
                  :items="productList"
                  item-title="product_code"
                  item-value="product_code"
                  @update:modelValue="getProductSteps"
                ></v-select>
              </v-col>
              <v-col v-if="groups.length > 0">
                <v-select
                  v-model="selectedGroup"
                  dense
                  outlined
                  label="IFRS17 Groups"
                  :items="groups"
                  item-title="ifrs17_group"
                  item-value="ifrs17_group"
                  @update:modelValue="getGroupSteps"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="stepResults.length > 0">
              <v-col>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="table-row">Product Code</th>
                      <th class="table-row">Name</th>
                      <th class="table-row">BEL Change</th>
                      <th class="table-row">RA Change</th>
                      <th class="table-row">CSM Change</th>
                      <th class="table-row">Liability Change</th>
                      <th class="table-row">LC Change</th>
                      <th class="table-row">PNL Change</th>
                      <th class="table-row">CSM Buildup</th>
                      <th class="table-row">RA Buildup</th>
                      <th class="table-row">LC Buildup</th>
                      <th class="table-row">BEL</th>
                      <th class="table-row">BEL(12)</th>
                      <th class="table-row">RA</th>
                      <th class="table-row">RA(12)</th>
                      <th class="table-row">Expected RA Net of LC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in stepResults" :key="item.id">
                      <td>{{ item.product_code }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.best_estimate_liability_change }}</td>
                      <td>{{ item.risk_adjustment_change }}</td>
                      <td>{{ item.csm_change }}</td>
                      <td>{{ item.liability_change }}</td>
                      <td>{{ item.loss_component_change }}</td>
                      <td>{{ item.pnl_change }}</td>
                      <td>{{ item.csm_buildup }}</td>
                      <td>{{ item.risk_adjustment_buildup }}</td>
                      <td>{{ item.loss_component_buildup }}</td>
                      <td>{{ item.bel }}</td>
                      <td>{{ item.bel_at_12 }}</td>
                      <td>{{ item.riskadjustment }}</td>
                      <td>{{ item.riskadjustment_at_12 }}</td>
                      <td>{{ item.expected_ra_net_of_lc }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Existing run parameters encountered</v-card-title>
        <v-card-text
          >There is a duplicate run with the specified run parameters. Overriding the existing run
          will delete all data with the same run parameters. Do you want to override?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded color="primary darken-1" text @click="confirmOverride(false)">No</v-btn>
          <v-btn rounded color="primary darken-1" text @click="confirmOverride(true)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :multi-line="multiLine" :timeout="timeout">
      {{ text }}

      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import { onMounted, ref } from 'vue'
import { VDateInput } from 'vuetify/lib/labs/components.mjs'
import { useRouter } from 'vue-router'
import formatDateString from '@/renderer/utils/helpers'
// data
const $router = useRouter()
const openingBalDate = ref(null)
const externalSAP = ref(false)
const snackbar = ref(false)
const text = ref('')
const timeout = ref(2000)
const multiLine = ref(true)
const dialog = ref(false)
const existingBody: any = ref(null)
const paaEligibilityTest = ref(false)
const showGMMBlocks = ref(false)
const showFinanceVersion = ref(false)
const showPAARuns = ref(false)
const showPAAFinance = ref(false)
const runDate = ref(null)
const runName = ref(null)
const productList = ref([])
const selectedMeasure = ref(null)
const measures = ref(['GMM', 'PAA', 'VFA'])
const groups: any = ref([])
const stepResults: any = ref([])
const selectedProduct = ref(null)
const selectedGroup = ref(null)
const financeVariables = ref([])
const financeVersion = ref(null)
const returnText = ref('')
const isRunning = ref(false)
const noError = ref(true)
const paaRuns = ref([])
const csmRuns: any = ref([])
const selectedPAARun: any = ref(null)
const selectedFinanceYear = ref(null)
const selectedRiskAdjustmentYear = ref(null)
const availableFinanceYears = ref([])
const availableRiskAdjustmentYears = ref([])
const availableVersions = ref([])
const aosConfigs = ref([])
const selectedConfig: any = ref(null)
const selectedTransitionType = ref(null)
const completedRunId = ref(null)
const transitionTypes = ref([
  { trans_type: 'PostTransition' },
  { trans_type: 'FullyRetrospective' },
  { trans_type: 'ModifiedRetrospective' },
  { trans_type: 'FairValue' }
])

onMounted(() => {
  CsmEngine.getFinanceFile().then((res) => {
    financeVariables.value = res.data
  })
  CsmEngine.getExistingConfigs().then((res) => {
    aosConfigs.value = res.data
  })
  CsmEngine.getPAARuns().then((res) => {
    paaRuns.value = res.data
  })
})

// methods
const removeFromJobs = (item: any) => {
  csmRuns.value.splice(csmRuns.value.indexOf(item), 1)
}

const getAvailableFinanceVersions = () => {
  availableVersions.value = []
  if (selectedMeasure.value === 'PAA') {
    CsmEngine.getAvailableFinanceVersions(selectedFinanceYear.value).then((res) => {
      availableVersions.value = res.data
      showFinanceVersion.value = true
    })
  }
  if (selectedMeasure.value === 'GMM' || selectedMeasure.value === 'VFA') {
    CsmEngine.getAvailableGMMFinanceVersions(selectedFinanceYear.value).then((res) => {
      availableVersions.value = res.data
      showFinanceVersion.value = true
    })
  }
}

const checkManualSap = () => {
  if (selectedConfig.value.external_sap) {
    externalSAP.value = true
  } else {
    externalSAP.value = false
  }
}

const getAvailableFinanceAndRaYears = () => {
  availableFinanceYears.value = []
  availableRiskAdjustmentYears.value = []
  let paaRunId = 0
  if (selectedPAARun.value !== null) {
    paaRunId = selectedPAARun.value.id
  }
  CsmEngine.getAvailableFinanceAndRaYears(selectedMeasure.value, paaRunId).then((res) => {
    if (res.data.finance !== null) {
      availableFinanceYears.value = res.data.finance
    } else {
      availableFinanceYears.value = []
    }

    if (res.data.ra !== null) {
      availableRiskAdjustmentYears.value = res.data.ra
    } else {
      availableRiskAdjustmentYears.value = []
    }
  })
}

const showPAAFinanceBlock = () => {
  if (selectedMeasure.value === 'PAA' && selectedPAARun.value !== null) {
    getAvailableFinanceAndRaYears()
    showPAAFinance.value = true
  } else {
    showPAAFinance.value = false
  }
}

const showFinanceFile = () => {
  if (selectedMeasure.value !== null) {
    if (selectedMeasure.value === 'GMM' || selectedMeasure.value === 'VFA') {
      showGMMBlocks.value = true
      showPAARuns.value = false
      showPAAFinance.value = false
      selectedPAARun.value = null
      getAvailableFinanceAndRaYears()
    } else {
      showPAARuns.value = true
      showGMMBlocks.value = false
      if (selectedPAARun.value !== null) {
        showGMMBlocks.value = false
        getAvailableFinanceAndRaYears()
      }
    }
  } else {
    showGMMBlocks.value = false
    showPAARuns.value = false
    showPAAFinance.value = false
    showFinanceVersion.value = false
    selectedFinanceYear.value = null
    selectedRiskAdjustmentYear.value = null
    selectedPAARun.value = null
    selectedTransitionType.value = null
    selectedConfig.value = null
  }
}

const addToJobs = async () => {
  const body: any = {}
  body.run_date = formatDateString(runDate.value, true, true, false)
  body.name = runName.value
  body.measurement_type = selectedMeasure.value
  if (selectedConfig.value) {
    body.configuration_name = selectedConfig.value.configuration_name
  }

  body.transition_type = selectedTransitionType.value
  if (selectedPAARun.value !== null) {
    body.paa_run_id = selectedPAARun.value.id
    body.paa_run_name = selectedPAARun.value.name
  }

  body.paa_eligibility_test = paaEligibilityTest.value
  body.finance_year = selectedFinanceYear.value
  if (externalSAP.value) {
    body.risk_adjustment_year = 0
  } else {
    body.risk_adjustment_year = selectedRiskAdjustmentYear.value
  }
  if (openingBalDate.value !== null) {
    body.opening_bal_date = formatDateString(openingBalDate.value)
  }
  body.finance_version = financeVersion.value

  // Check for finance and RA years
  if (
    selectedMeasure.value === 'GMM' ||
    selectedMeasure.value === 'PAA' ||
    selectedMeasure.value === 'VFA'
  ) {
    if (selectedFinanceYear.value === null) {
      text.value =
        'This job cannot be run without a valid finance year. Please select a finance year'
      snackbar.value = true
      timeout.value = 3000

      return
    }
  }

  if (selectedMeasure.value === 'GMM' || selectedMeasure.value === 'VFA') {
    if (selectedRiskAdjustmentYear.value == null && !externalSAP.value) {
      text.value =
        'This job cannot be run without a valid risk adjustment year. Please select a risk adjustment year'
      snackbar.value = true
      timeout.value = 3000
      return
    }
  }

  // Check if run_name, measurement_type already exists
  console.log('body', body)
  const exists = await CsmEngine.checkExistingRun(body)
  if (exists.data.result) {
    existingBody.value = body
    console.log('existingBody', existingBody)
    dialog.value = true
  } else {
    csmRuns.value.push(body)
    resetForm()
  }
}

const resetForm = () => {
  runDate.value = null
  runName.value = null
  selectedMeasure.value = null
  externalSAP.value = false
  selectedConfig.value = null
  selectedTransitionType.value = null
  selectedPAARun.value = null
  openingBalDate.value = null
  showPAARuns.value = false
  showPAAFinance.value = false
  showGMMBlocks.value = false
  selectedFinanceYear.value = null
  selectedRiskAdjustmentYear.value = null
  selectedPAARun.value = null
  selectedTransitionType.value = null
  selectedConfig.value = null
}

const getGroupSteps = () => {
  if (selectedGroup.value !== 'All Groups') {
    CsmEngine.getGroupSteps(selectedGroup.value).then((res) => {
      stepResults.value = res.data.steps
    })
  } else {
    CsmEngine.getProductSteps(selectedProduct.value).then((res) => {
      groups.value = []
      stepResults.value = res.data.steps
      groups.value = res.data.groups
      groups.value.unshift('All Groups')
    })
  }
}

const getProductSteps = () => {
  CsmEngine.getProductSteps(selectedProduct.value).then((res) => {
    stepResults.value = res.data.steps
    groups.value = res.data.groups
    groups.value.unshift('All Groups')
  })
}

const confirmOverride = (value: boolean) => {
  if (value) {
    csmRuns.value.push(existingBody.value)
    resetForm()
  }
  existingBody.value = null
  dialog.value = false
}

const runCsm = () => {
  isRunning.value = true
  CsmEngine.runCsmProcess(csmRuns.value).then((res) => {
    timeout.value = 3000
    snackbar.value = true
    text.value = res.data.message
    setTimeout(() => {
      $router.push({ name: 'ifrs17-run-results' })
    }, 2000)
  })
}

// export default {
//   data() {
//     return {
//       externalSAP: false,
//       snackbar: false,
//       text: '',
//       timeout: 2000,
//       multiLine: true,
//       dialog: false,
//       existingBody: null,
//       paa_eligibility_test: false,
//       overrideRun: false,
//       showGMMBlocks: false,
//       showFinanceVersion: false,
//       loading: false,
//       showFinanceBlock: false,
//       showPAARuns: false,
//       showPAAFinance: false,
//       fromDateMenu: false,
//       valDate: null,
//       runName: null,
//       runDateError: null,
//       csmFile: null,
//       productList: [],
//       selectedMeasure: null,
//       measures: ['GMM', 'PAA', 'VFA'],
//       groupList: [],
//       groups: [],
//       stepResults: [],
//       selectedProduct: null,
//       selectedGroup: null,
//       financeVariables: [],
//       financeVersion: null,
//       returnText: '',
//       showFinanceVariables: false,
//       isRunning: false,
//       noError: true,
//       paaRuns: [],
//       csmRuns: [],
//       selectedPAARun: null,
//       selectedFinanceYear: null,
//       selectedRiskAdjustmentYear: null,
//       availableFinanceYears: [],
//       availableRiskAdjustmentYears: [],
//       availableVersions: [],
//       aosConfigs: [],
//       selectedConfig: null,
//       selectedTransitionType: null,
//       completedRunId: null,
//       transitionTypes: [
//         { trans_type: 'PostTransition' },
//         { trans_type: 'FullyRetrospective' },
//         { trans_type: 'ModifiedRetrospective' },
//         { trans_type: 'FairValue' }
//       ]
//     }
//   },
//   mounted() {
//     CsmEngine.getFinanceFile().then((res) => {
//       this.financeVariables = res.data
//     })
//     CsmEngine.getExistingConfigs().then((res) => {
//       this.aosConfigs = res.data
//     })
//     CsmEngine.getPAARuns().then((res) => {
//       this.paaRuns = res.data
//     })
//   },
//   computed: {
//     runNameErrors() {
//       const errors = []
//       if (!this.$v.runName.$dirty) return errors
//       !this.$v.runName.required && errors.push('run name is required.')
//       !this.$v.runName.runNameDuplicate &&
//         errors.push('The run name already exists or is part of the current run list.')
//       return errors
//     },
//     valDateErrors() {
//       const errors = []
//       if (!this.$v.valDate.$dirty) return errors
//       !this.$v.valDate.required && errors.push('run date is required.')
//       return errors
//     },

//     valuationDate: function () {
//       return this.valDate
//       // format date, apply validations, etc. Example below.
//       // return this.valDate ? this.formatDate(this.valDate) : "";
//     }
//   },
//   validations: {
//     valDate: {
//       required
//     },
//     runName: {
//       required,
//       runNameDuplicate: async function (value) {
//         if (value) {
//           const obj = this.csmRuns.find((x) => x.name == value)
//           if (obj) {
//             return false
//           }

//           let result
//           result = await CsmEngine.checkRunName(value)
//           return !result.data.result
//         }
//       }
//     }
//   },

//   methods: {
//     clearErrorState() {
//       this.$v.$reset()
//     },
//     removeFromJobs(item) {
//       this.csmRuns.splice(this.csmRuns.indexOf(item), 1)
//     },
//     getAvailableFinanceVersions() {
//       this.availableVersions = []
//       if (this.selectedMeasure == 'PAA') {
//         CsmEngine.getAvailableFinanceVersions(this.selectedFinanceYear).then((res) => {
//           this.availableVersions = res.data
//           this.showFinanceVersion = true
//         })
//       }
//       if (this.selectedMeasure == 'GMM' || this.selectedMeasure == 'VFA') {
//         CsmEngine.getAvailableGMMFinanceVersions(this.selectedFinanceYear).then((res) => {
//           this.availableVersions = res.data
//           this.showFinanceVersion = true
//         })
//       }
//     },
//     checkManualSap() {
//       if (this.selectedConfig.external_sap) {
//         this.externalSAP = true
//       } else {
//         this.externalSAP = false
//       }
//     },
//     async addToJobs() {
//       this.$v.$touch()

//       if (this.$v.$invalid) {
//         return
//       }

//       const body = {}
//       body.run_date = this.valDate
//       body.name = this.runName
//       body.measurement_type = this.selectedMeasure
//       if (this.selectedConfig) {
//         body.configuration_name = this.selectedConfig.configuration_name
//       }

//       body.transition_type = this.selectedTransitionType
//       if (this.selectedPAARun !== null) {
//         body.paa_run_id = this.selectedPAARun.id
//         body.paa_run_name = this.selectedPAARun.name
//       }

//       body.paa_eligibility_test = this.paa_eligibility_test
//       body.finance_year = this.selectedFinanceYear
//       if (this.externalSAP) {
//         body.risk_adjustment_year = 0
//       } else {
//         body.risk_adjustment_year = this.selectedRiskAdjustmentYear
//       }
//       if (this.$refs.openingBalDate.valDate !== null) {
//         body.opening_bal_date = this.$refs.openingBalDate.valDate
//       }
//       body.finance_version = this.financeVersion

//       // Check for finance and RA years
//       if (
//         this.selectedMeasure == 'GMM' ||
//         this.selectedMeasure == 'PAA' ||
//         this.selectedMeasure == 'VFA'
//       ) {
//         if (this.selectedFinanceYear == null) {
//           this.text =
//             'This job cannot be run without a valid finance year. Please select a finance year'
//           this.snackbar = true
//           this.timeout = 3000

//           return
//         }
//       }

//       if (this.selectedMeasure == 'GMM' || this.selectedMeasure == 'VFA') {
//         if (this.selectedRiskAdjustmentYear == null && !this.externalSAP) {
//           this.text =
//             'This job cannot be run without a valid risk adjustment year. Please select a risk adjustment year'
//           this.snackbar = true
//           this.timeout = 3000
//           return
//         }
//       }

//       // Check if run_name, measurement_type already exists
//       const exists = await CsmEngine.checkExistingRun(body)
//       if (exists.data.result) {
//         this.existingBody = body
//         this.dialog = true
//       } else {
//         this.csmRuns.push(body)
//         this.resetForm()
//       }
//     },
//     resetForm() {
//       this.valDate = null
//       this.runName = null
//       this.selectedMeasure = null
//       this.externalSAP = false
//       this.selectedConfig = null
//       this.selectedTransitionType = null
//       this.selectedPAARun = null
//       this.paa_eligibility_test = null
//       this.showFinanceBlock = false
//       this.$refs.openingBalDate.valDate = null
//       this.showPAARuns = false
//       this.showPAAFinance = false
//       this.showGMMBlocks = false
//       this.selectedFinanceYear = null
//       this.selectedRiskAdjustmentYear = null
//       this.$v.$reset()
//     },
//     getAvailableFinanceAndRaYears() {
//       this.availableFinanceYears = []
//       this.availableRiskAdjustmentYears = []
//       let paaRunId = 0
//       if (this.selectedPAARun !== null) {
//         paaRunId = this.selectedPAARun.id
//       }
//       CsmEngine.getAvailableFinanceAndRaYears(this.selectedMeasure, paaRunId).then((res) => {
//         if (res.data.finance !== null) {
//           this.availableFinanceYears = res.data.finance
//         } else {
//           this.availableFinanceYears = []
//         }

//         if (res.data.ra !== null) {
//           this.availableRiskAdjustmentYears = res.data.ra
//         } else {
//           this.availableRiskAdjustmentYears = []
//         }
//       })
//     },
//     showPAAFinanceBlock() {
//       if (this.selectedMeasure == 'PAA' && this.selectedPAARun !== null) {
//         this.getAvailableFinanceAndRaYears()
//         this.showPAAFinance = true
//       } else {
//         this.showPAAFinance = false
//       }
//     },
//     showFinanceFile() {
//       if (this.selectedMeasure !== null) {
//         if (this.selectedMeasure == 'GMM' || this.selectedMeasure == 'VFA') {
//           this.showGMMBlocks = true
//           this.showPAARuns = false
//           this.showPAAFinance = false
//           this.selectedPAARun = null
//           this.getAvailableFinanceAndRaYears()
//         } else {
//           this.showPAARuns = true
//           this.showGMMBlocks = false
//           if (this.selectedPAARun !== null) {
//             this.showGMMBlocks = false
//             this.getAvailableFinanceAndRaYears()
//           }
//         }
//       } else {
//         this.showGMMBlocks = false
//         this.showPAARuns = false
//         this.showPAAFinance = false
//         this.showFinanceVersion = false
//         this.selectedFinanceYear = null
//         this.selectedRiskAdjustmentYear = null
//         this.selectedPAARun = null
//         this.selectedTransitionType = null
//         this.selectedConfig = null
//       }
//     },
//     showVariables(value) {
//       this.showFinanceVariables = value
//     },
//     uploadFinanceFile() {
//       if (this.csmFile !== null) {
//         const formdata = new FormData()
//         formdata.append('file', this.csmFile)
//         this.loading = true
//         CsmEngine.uploadFinanceFile(formdata)
//           .then((res) => {
//             this.csmFile = null
//             this.financeVariables = res.data
//             this.loading = false
//           })
//           .catch(() => {
//             this.loading = false
//           })
//       }
//     },
//     getGroupSteps() {
//       if (this.selectedGroup !== 'All Groups') {
//         CsmEngine.getGroupSteps(this.selectedGroup).then((res) => {
//           this.stepResults = res.data.steps
//         })
//       } else {
//         CsmEngine.getProductSteps(this.selectedProduct).then((res) => {
//           this.groups = []
//           this.stepResults = res.data.steps
//           this.groups = res.data.groups
//           this.groups.unshift('All Groups')
//         })
//       }
//     },
//     confirmOverride(value) {
//       if (value) {
//         this.csmRuns.push(this.existingBody)
//         this.resetForm()
//       }
//       this.existingBody = null
//       this.dialog = false
//     },

//     async executeRun(body) {
//       this.isRunning = true
//       if (this.csmFile !== null) {
//         const formdata = new FormData()
//         formdata.append('file', this.csmFile)
//         await CsmEngine.uploadFinanceFile({ form: formdata })
//       }

//       try {
//         const response = await CsmEngine.runCsmProcess(body)
//         this.returnText = 'Processing is now complete. View the results '
//         this.selectedConfig = null
//         this.isRunning = false
//         this.noError = true
//         if (this.selectedMeasure == 'GMM' || this.selectedMeasure == 'VFA') {
//           this.completedRunId = response.data.run.id
//         }
//         if (this.selectedMeasure == 'PAA') {
//           this.completedRunId = response.data.run.paa_run_id
//         }
//       } catch (err) {
//         this.returnText = 'Error: ' + err
//         this.selectedConfig = null
//         this.isRunning = false
//         this.noError = false
//       }
//     },
//     getProductSteps() {
//       CsmEngine.getProductSteps(this.selectedProduct).then((res) => {
//         this.stepResults = res.data.steps
//         this.groups = res.data.groups
//         this.groups.unshift('All Groups')
//         this.selectedGroup = 'All Groups'
//       })
//     },
//     async runCsm() {
//       this.isRunning = true
//       CsmEngine.runCsmProcess(this.csmRuns).then((res) => {
//         this.timeout = 3000
//         this.snackbar = true
//         this.text = res.data.message
//         setTimeout(() => {
//           this.$router.push({ name: 'csm-runs' })
//         }, 2000)
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

.custom-btn {
  text-transform: unset !important;
}
</style>
