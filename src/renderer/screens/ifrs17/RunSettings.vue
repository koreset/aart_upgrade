<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Run IFRS17 Engine</span>
          </template>
          <template #default>
            <form @submit.prevent="addToJobs">
              <v-row class="mx-6">
                <v-col cols="6">
                  <v-text-field
                    v-model="runName.value.value"
                    variant="outlined"
                    density="compact"
                    label="Enter a name for this run"
                    :error-messages="runName.errorMessage.value"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-date-input
                    v-model="runDate.value.value"
                    readonly
                    view-mode="month"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    variant="outlined"
                    density="compact"
                    label="Run Date"
                    :error-messages="runDate.errorMessage.value"
                  ></v-date-input>
                </v-col>
              </v-row>
              <v-row class="mx-6">
                <v-col cols="4">
                  <v-select
                    v-model="selectedMeasure.value.value"
                    variant="outlined"
                    density="compact"
                    label="Measurement Model"
                    placeholder="Select a Measurement Model"
                    :items="measures"
                    clearable
                    :error-messages="selectedMeasure.errorMessage.value"
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
                    v-model="selectedConfig.value.value"
                    variant="outlined"
                    density="compact"
                    placeholder="Select an AoS Configuration"
                    :items="aosConfigs"
                    item-title="configuration_name"
                    item-value="configuration_name"
                    clearable
                    return-object
                    :error-messages="selectedConfig.errorMessage.value"
                    @update:modelValue="checkManualSap"
                  ></v-select>
                </v-col>
                <v-col v-if="showGMMBlocks" cols="4">
                  <v-select
                    v-model="selectedTransitionType.value.value"
                    variant="outlined"
                    density="compact"
                    placeholder="Select a Transition Type"
                    :items="transitionTypes"
                    item-title="trans_type"
                    item-value="trans_type"
                    :error-messages="selectedTransitionType.errorMessage.value"
                    clearable
                  ></v-select>
                </v-col>
              </v-row>
              <v-row class="mx-6">
                <v-col v-if="showGMMBlocks || showPAAFinance" cols="4">
                  <v-select
                    v-model="selectedFinanceYear.value.value"
                    variant="outlined"
                    density="compact"
                    placeholder="Select Finance Year"
                    label="Finance Year"
                    :items="availableFinanceYears"
                    clearable
                    :error-messages="selectedFinanceYear.errorMessage.value"
                    @update:modelValue="getAvailableFinanceVersions"
                  ></v-select>
                </v-col>
                <v-col v-if="selectedFinanceYear.value.value && showFinanceVersion">
                  <v-select
                    v-model="financeVersion.value.value"
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
                    v-model="openingBalDate.value.value"
                    readonly
                    view-mode="month"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    variant="outlined"
                    density="compact"
                    label="Opening Balance Date"
                    :error-messages="openingBalDate.errorMessage.value"
                  ></v-date-input>
                </v-col>
              </v-row>
              <v-row class="mx-6">
                <v-col>
                  <v-btn type="submit" rounded size="small" variant="outlined"
                    >Add to Run Jobs</v-btn
                  >
                </v-col>
              </v-row>
            </form>

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
              <v-col v-if="noError && selectedMeasure.value.value === 'GMM'">
                {{ returnText }}
                <v-btn :to="'/csm-aos-run-reports/' + completedRunId" text>Here</v-btn>
              </v-col>
              <v-col v-if="noError && selectedMeasure.value.value === 'PAA'">
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
          </template>
        </base-card>
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
import BaseCard from '@/renderer/components/BaseCard.vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  runName: yup.string().required('A valid run name is required'),
  runDate: yup.date().required('A valid run date is required'),
  selectedMeasure: yup.string().required('A valid measurement model is required'),
  selectedConfig: yup
    .object()
    .nullable()
    .when('selectedMeasure', ([selectedMeasure], schema) => {
      if (selectedMeasure === 'GMM' || selectedMeasure === 'VFA') {
        return schema.required('An Aos configuration is required')
      }
      return schema
    }),
  selectedTransitionType: yup
    .string()
    .nullable()
    .when('selectedMeasure', ([selectedMeasure], schema) => {
      if (selectedMeasure === 'GMM' || selectedMeasure === 'VFA') {
        return schema.required('A valid transition type is required')
      }
      return schema
    }),
  selectedPAARun: yup.object().nullable(),
  paaEligibilityTest: yup.boolean().nullable(),
  selectedFinanceYear: yup
    .number()
    .nullable()
    .when('selectedMeasure', ([selectedMeasure], schema) => {
      if (selectedMeasure === 'GMM' || selectedMeasure === 'VFA') {
        return schema.required('A valid finance year is required')
      }
      return schema
    }),
  selectedRiskAdjustmentYear: yup.number().nullable(),
  financeVersion: yup
    .string()
    .nullable()
    .when('selectedMeasure', ([selectedMeasure], schema) => {
      if (selectedMeasure === 'GMM' || selectedMeasure === 'VFA') {
        return schema.required('A valid finance version is required')
      }
      return schema
    }),
  openingBalDate: yup
    .date()
    .nullable()
    .when('selectedMeasure', ([selectedMeasure], schema) => {
      if (selectedMeasure === 'GMM' || selectedMeasure === 'VFA') {
        return schema.required('A valid opening balance date is required')
      }
      return schema
    })
})

// Initialize the form with schema
const { handleSubmit, handleReset } = useForm({
  validationSchema: schema
})

// data
const runName = useField('runName')
const runDate = useField('runDate')
const selectedMeasure = useField('selectedMeasure')
const openingBalDate = useField('openingBalDate')
const selectedConfig = useField('selectedConfig')
const selectedTransitionType = useField('selectedTransitionType')
const selectedFinanceYear = useField('selectedFinanceYear')
const financeVersion = useField('financeVersion')

const $router = useRouter()
// const openingBalDate = ref(null)
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
// const runDate = ref(null)
// const runName = ref(null)
const productList = ref([])
// const selectedMeasure = ref(null)
const measures = ref(['GMM', 'PAA', 'VFA'])
const groups: any = ref([])
const stepResults: any = ref([])
const selectedProduct = ref(null)
const selectedGroup = ref(null)
const financeVariables = ref([])
// const financeVersion = ref(null)
const returnText = ref('')
const isRunning = ref(false)
const noError = ref(true)
const paaRuns = ref([])
const csmRuns: any = ref([])
const selectedPAARun: any = ref(null)
// const selectedFinanceYear = ref(null)
const selectedRiskAdjustmentYear = ref(null)
const availableFinanceYears = ref([])
const availableRiskAdjustmentYears = ref([])
const availableVersions = ref([])
const aosConfigs = ref([])
// const selectedConfig: any = ref(null)
// const selectedTransitionType = ref(null)
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
  if (selectedMeasure.value.value === 'PAA') {
    CsmEngine.getAvailableFinanceVersions(selectedFinanceYear.value.value).then((res) => {
      availableVersions.value = res.data
      showFinanceVersion.value = true
    })
  }
  if (selectedMeasure.value.value === 'GMM' || selectedMeasure.value.value === 'VFA') {
    CsmEngine.getAvailableGMMFinanceVersions(selectedFinanceYear.value.value).then((res) => {
      availableVersions.value = res.data
      showFinanceVersion.value = true
    })
  }
}

const checkManualSap = () => {
  const selectedConfigValue: any = selectedConfig.value.value
  if (selectedConfigValue.external_sap) {
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
  CsmEngine.getAvailableFinanceAndRaYears(selectedMeasure.value.value, paaRunId).then((res) => {
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
  if (selectedMeasure.value.value === 'PAA' && selectedPAARun.value !== null) {
    getAvailableFinanceAndRaYears()
    showPAAFinance.value = true
  } else {
    showPAAFinance.value = false
  }
}

const showFinanceFile = () => {
  if (selectedMeasure.value !== null) {
    if (selectedMeasure.value.value === 'GMM' || selectedMeasure.value.value === 'VFA') {
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
    selectedFinanceYear.value.value = null
    selectedRiskAdjustmentYear.value = null
    selectedPAARun.value = null
    selectedTransitionType.value.value = null
    selectedConfig.value.value = null
  }
}

const addToJobs = handleSubmit(async (values) => {
  // console.log('values', values)
  // console.log('selectedConfig', selectedConfig.value.value)
  const body: any = {}
  body.run_date = formatDateString(runDate.value.value, true, true, false)
  body.name = runName.value.value
  body.measurement_type = selectedMeasure.value.value
  if (selectedConfig.value) {
    body.configuration_name = (
      selectedConfig.value.value as { configuration_name: string }
    ).configuration_name
  }

  body.transition_type = selectedTransitionType.value.value
  if (selectedPAARun.value !== null) {
    body.paa_run_id = selectedPAARun.value.id
    body.paa_run_name = selectedPAARun.value.name
  }

  body.paa_eligibility_test = paaEligibilityTest.value
  body.finance_year = selectedFinanceYear.value.value
  if (externalSAP.value) {
    body.risk_adjustment_year = 0
  } else {
    body.risk_adjustment_year = selectedRiskAdjustmentYear.value
  }
  if (openingBalDate.value.value !== null) {
    body.opening_bal_date = formatDateString(openingBalDate.value.value, true, true, false)
  }
  body.finance_version = financeVersion.value.value

  // Check for finance and RA years
  if (
    selectedMeasure.value.value === 'GMM' ||
    selectedMeasure.value.value === 'PAA' ||
    selectedMeasure.value.value === 'VFA'
  ) {
    if (selectedFinanceYear.value === null) {
      text.value =
        'This job cannot be run without a valid finance year. Please select a finance year'
      snackbar.value = true
      timeout.value = 3000

      return
    }
  }

  if (selectedMeasure.value.value === 'GMM' || selectedMeasure.value.value === 'VFA') {
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
})

const resetForm = () => {
  handleReset()
  externalSAP.value = false
  selectedConfig.value.value = null
  selectedTransitionType.value.value = null
  selectedPAARun.value = null
  openingBalDate.value.value = null
  showPAARuns.value = false
  showPAAFinance.value = false
  showFinanceVersion.value = false
  financeVersion.value.value = null
  showGMMBlocks.value = false
  selectedFinanceYear.value.value = null
  selectedRiskAdjustmentYear.value = null
  selectedPAARun.value = null
  selectedTransitionType.value.value = null
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
