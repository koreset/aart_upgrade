<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Valuation Run Settings</span>
          </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <v-select
                    v-model="settingWorkflow"
                    variant="outlined"
                    density="compact"
                    label="Setting workflow"
                    placeholder="Choose a workflow"
                    :items="settingWorkflows"
                    item-title="name"
                    item-value="type"
                    @update:model-value="displayFlow"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="settingWorkflow == 'existing'">
                <v-col cols="4">
                  <v-select
                    v-model="selectedTemplate"
                    variant="outlined"
                    density="compact"
                    label="Choose a saved template"
                    :items="jobTemplates"
                    item-title="name"
                    item-value="id"
                    clearable
                    return-object
                    @update:model-value="loadTemplate"
                  ></v-select>
                </v-col>
                <v-col v-if="selectedTemplate" class="d-flex" cols="6">
                  <v-text-field
                    v-model="runNameSuffix"
                    label="Run Name Suffix"
                    placeholder="Add a suffix to existing run name"
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                  <v-btn
                    rounded
                    class="mt-2 ml-5"
                    color="primary"
                    size="small"
                    @click="updateRunSuffix"
                    >Update Run Name</v-btn
                  >
                </v-col>
              </v-row>
              <form @submit.prevent="addToRunJobs">
                <v-row v-if="settingWorkflow == 'new'">
                  <v-col cols="6">
                    <v-text-field
                      v-model="settingRunName"
                      :error-messages="errors.settingRunName"
                      v-bind="settingRunNameAttrs"
                      variant="outlined"
                      density="compact"
                      label="Enter a name for this run"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-date-input
                      v-model="runDate"
                      readonly
                      hide-actions
                      locale="en-in"
                      view-mode="month"
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      variant="outlined"
                      density="compact"
                      label="Run Date"
                    ></v-date-input>
                  </v-col>
                </v-row>
                <v-row v-if="settingWorkflow == 'new'">
                  <v-col>
                    <v-textarea
                      v-model="settingDescription"
                      variant="outlined"
                      rows="3"
                      placeholder="Enter a description for this run"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row v-if="settingWorkflow == 'new'">
                  <v-col>
                    <v-combobox
                      v-model="selectedProducts"
                      v-bind="setSelectedProducts"
                      variant="outlined"
                      density="compact"
                      label="Available Products"
                      :items="availableProducts"
                      :clearable="true"
                      placeholder="Choose products to run"
                      multiple
                      chips
                      closable-chips
                      return-object
                      item-title="product_name"
                      @update:model-value="validateProduct"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row v-if="settingWorkflow == 'new'">
                  <v-col cols="4">
                    <v-select
                      v-model="selectedModelPointYear"
                      v-bind="setSelectedModelPointYear"
                      density="compact"
                      variant="outlined"
                      label="Select Model Point Year"
                      :items="availableModelPointYears"
                      item-title="Year"
                      item-value="Year"
                      @update:model-value="getModelPointVersions"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedModelPointVersion"
                      density="compact"
                      variant="outlined"
                      label="Select Model Point Version"
                      :items="availableModelPointVersions"
                      item-text="Year"
                      item-value="Year"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedParameterYear"
                      density="compact"
                      variant="outlined"
                      label="Select Parameter Year"
                      :items="availableParameterYears"
                      item-title="Year"
                      item-value="Year"
                      @update:model-value="getRunBasis"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedYieldYear"
                      density="compact"
                      variant="outlined"
                      label="Select Yield Curve Year"
                      :items="availableYieldYears"
                      item-title="Year"
                      item-value="Year"
                      @update:model-value="getYieldCurveCodes"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedYieldCurveCode"
                      density="compact"
                      variant="outlined"
                      label="Select Yield Curve Code"
                      :items="availableYieldYears"
                      item-title="code"
                      item-value="code"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedMorbidityYear"
                      density="compact"
                      variant="outlined"
                      label="Select Morbidity Year"
                      :items="availableMorbidityYears"
                      item-title="Year"
                      item-value="Year"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedRetrenchmentYear"
                      density="compact"
                      variant="outlined"
                      label="Select Retrenchment Year"
                      :items="availableRetrenchmentYears"
                      item-title="Year"
                      item-value="Year"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedLapseYear"
                      density="compact"
                      variant="outlined"
                      label="Select Lapse Year"
                      :items="availableLapseYears"
                      item-title="Year"
                      item-value="Year"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedMortalityYear"
                      density="compact"
                      variant="outlined"
                      label="Select Mortality Year"
                      :items="availableMortalityYears"
                      item-title="Year"
                      item-value="Year"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedShock"
                      density="compact"
                      variant="outlined"
                      label="Select Applicable Shock"
                      :items="shockData"
                      item-title="name"
                      item-value="name"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedYieldCurveBasis"
                      density="compact"
                      variant="outlined"
                      label="Select Yield Curve Basis"
                      :items="availableYieldCurveBases"
                      item-title="basis"
                      item-value="basis"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedLapseMarginYear"
                      density="compact"
                      variant="outlined"
                      label="Select Lapse Margin Years"
                      :items="availableLapseMarginYears"
                      item-title="Year"
                      item-value="Year"
                    ></v-select>
                  </v-col>
                  <v-col cols="4"
                    ><v-text-field
                      v-model="aggPeriod"
                      density="compact"
                      variant="outlined"
                      type="number"
                      label="Aggregation Period"
                      placeholder="Enter Aggregation period in months"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4"
                    ><v-text-field
                      v-model="yearEndMonth"
                      density="compact"
                      variant="outlined"
                      type="number"
                      max="12"
                      min="1"
                      label="Year End Month"
                      placeholder="Enter Year End Month (1 - 12)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="selectedBasis"
                      density="compact"
                      variant="outlined"
                      label="Run Basis"
                      placeholder="Select a Run Basis"
                      :items="availableBases"
                      item-title="name"
                      item-value="name"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row v-if="settingWorkflow == 'new'">
                  <v-col cols="3">
                    <v-checkbox
                      v-model="runSingle"
                      :label="`Use a Single Model Point`"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox
                      v-model="ifrs17Indicator"
                      :label="`IFRS17 Indicator`"
                      @change="toggleIndicators('ifrs17')"
                    ></v-checkbox
                  ></v-col>
                  <v-col cols="3">
                    <v-checkbox
                      v-model="licIndicator"
                      :label="`LIC Indicator`"
                      @change="toggleIndicators('lic')"
                    ></v-checkbox
                  ></v-col>
                  <v-col cols="3">
                    <v-checkbox
                      v-model="noIndicator"
                      :label="`Use No Indicators`"
                      @change="toggleIndicators('none')"
                    ></v-checkbox
                  ></v-col>
                </v-row>
                <v-row v-if="settingWorkflow == 'new'">
                  <v-col>
                    <v-btn rounded type="submit" color="primary" size="small" class="primary"
                      >Add to Run Jobs</v-btn
                    >
                  </v-col>
                </v-row>
              </form>
              <v-row v-if="runJobs.length > 0">
                <v-divider></v-divider>
              </v-row>

              <v-row v-if="runJobs.length > 0">
                <v-col>
                  <v-table class="trans-tables">
                    <thead>
                      <tr class="table-row">
                        <th class="text-left table-col">Run Name</th>
                        <th class="text-left table-col">Valuation Date</th>
                        <th class="text-left table-col">Description</th>
                        <th class="text-left table-col"
                          >Model Points
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('modelpoint_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col"
                          >Parameters
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('parameter_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col"
                          >Yield Curve
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('yieldcurve_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col"
                          >Lapse
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('lapse_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col"
                          >Lapse Margin
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('lapse_margin_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col"
                          >Mortality
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('mortality_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col"
                          >Morbidity
                          <v-btn
                            v-if="settingWorkflow === 'existing'"
                            size="small"
                            variant="plain"
                            icon
                            @click="openEditDialog('morbidity_year')"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn></th
                        >
                        <th class="text-left table-col">Shock</th>
                        <th class="text-left table-col">IFRS Indicator</th>
                        <th class="text-left table-col">Yield Curve Basis</th>
                        <th class="text-left table-col">Run Basis</th>
                        <th class="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in runJobs" :key="item.run_name">
                        <td>{{ item.run_name }}</td>
                        <td>{{ item.run_date }}</td>
                        <td>{{ item.run_description }}</td>
                        <td>{{ item.modelpoint_year }}</td>
                        <td>{{ item.parameter_year }}</td>
                        <td>{{ item.yieldcurve_year }}</td>
                        <td>{{ item.lapse_year }}</td>
                        <td>{{ item.lapse_margin_year }}</td>
                        <td>{{ item.mortality_year }}</td>
                        <td>{{ item.morbidity_year }}</td>
                        <td>
                          {{ item.shock_settings !== null ? item.shock_settings.name : 'N/A' }}
                        </td>
                        <td>{{ item.ifrs17_indicator }}</td>
                        <td>{{ item.yield_curve_basis }}</td>
                        <td>{{ item.run_basis }}</td>
                        <td>
                          <v-btn
                            color="red"
                            size="small"
                            variant="plain"
                            icon
                            @click="removeFromRunJobs(item.run_name)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template #actions>
            <v-btn v-if="runJobs.length > 0" color="primary" @click="saveTemplate"
              >Save as template</v-btn
            >
            <v-btn v-if="runJobs.length > 0" color="primary" @click="executeJobs"
              >Run Valuations</v-btn
            >
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="closeSnackBar">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Edit Column</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newColumnValue"
            variant="outlined"
            density="compact"
            label="New Value"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateColumn">Save</v-btn>
          <v-btn @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { ref, onMounted, computed } from 'vue'
import ValuationService from '@/renderer/api/ValuationService'
import { VDateInput } from 'vuetify/labs/VDateInput'
import ProductService from '@/renderer/api/ProductService'
import _ from 'lodash'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import formatDateString from '@/renderer/utils/helpers'

const validationSchema = yup.object({
  settingRunName: yup.string().required('Run name is required'),
  selectedProducts: yup.array().min(1, 'You need to select at least one product'),
  selectedModelPointYear: yup.string().required('Model point year is required')
})

const { defineField, values, errors } = useForm({
  validationSchema
})

console.log('Values', values)

const [settingRunName, settingRunNameAttrs] = defineField('settingRunName')
const [selectedProducts, setSelectedProducts] = defineField('selectedProducts')
const [selectedModelPointYear, setSelectedModelPointYear] = defineField('selectedModelPointYear')

const snackbarText = ref('')
const timeout = ref(0)
const snackbar = ref(false)

const dialog = ref(false)
const newColumnValue = ref('')
const currentColumn = ref('')
const runType = ref('')
const runSingle = ref(false)

const ifrs17Indicator = ref(false)
const licIndicator = ref(false)
const noIndicator = ref(false)

const selectedModelPointVersion: any = ref(null)
const selectedYieldYear: any = ref(null)
const selectedYieldCurveCode: any = ref(null)
const selectedParameterYear: any = ref(null)
const selectedMorbidityYear: any = ref(null)
const selectedRetrenchmentYear: any = ref(null)
const selectedLapseYear: any = ref(null)
const selectedMortalityYear: any = ref(null)
const selectedShock: any = ref(null)
const selectedYieldCurveBasis: any = ref(null)
const selectedLapseMarginYear: any = ref(null)
const aggPeriod: any = ref(null)
const yearEndMonth: any = ref(null)
const availableBases: any = ref([])
const availableModelPointYears: any = ref([])
const availableYieldYears: any = ref([])
const availableMorbidityYears: any = ref([])
const availableLapseYears: any = ref([])
const availableRetrenchmentYears: any = ref([])
const availableParameterYears: any = ref([])
const availableMortalityYears: any = ref([])
const availableLapseMarginYears: any = ref([])
const availableModelPointVersions: any = ref([])
const availableYieldCurveCodes: any = ref([])

const availableYieldCurveBases = [
  { basis: 'N/A' },
  { basis: 'Current' },
  { basis: 'Locked in Rates' }
]

const selectedBasis: any = ref(null)
const productsList = ref([])
const runDate = ref(null)
const jobTemplates = ref([])
const jobTemplate: any = ref(null)
const selectedTemplate: any = ref(null)
const shockData: any = ref([])
const runNameSuffix = ref('')
const runJobs: any = ref([])
const settingDescription = ref('')
const settingWorkflow = ref(null)
const settingWorkflows = [
  { name: 'Create from existing template', type: 'existing' },
  { name: 'Create new run', type: 'new' }
]

const availableProducts = computed(() => {
  const results: any = []
  productsList.value.forEach((family: any) => {
    family.products.forEach((product) => {
      if (product.product_state !== 'pending') {
        results.push(product)
      }
    })
  })
  return results
})

const updateRunSuffix = () => {
  console.log('Update Run Suffix', runNameSuffix.value)
  runJobs.value.forEach((item) => {
    if (runNameSuffix.value !== '') {
      item.run_name = item.run_name + '-' + runNameSuffix.value
    }
  })
}

const updateColumn = () => {
  runJobs.value = runJobs.value.map((item) => {
    if (currentColumn.value === 'shock_settings') {
      item[currentColumn.value].name = newColumnValue.value
    } else {
      item[currentColumn.value] = newColumnValue.value
    }
    return item
  })
  dialog.value = false
}

const toggleIndicators = (trigger) => {
  if (trigger === 'ifrs17') {
    licIndicator.value = !ifrs17Indicator.value
    noIndicator.value = !ifrs17Indicator.value
  } else if (trigger === 'lic') {
    ifrs17Indicator.value = !licIndicator.value
    noIndicator.value = !licIndicator.value
  } else if (trigger === 'none') {
    licIndicator.value = !noIndicator.value
    ifrs17Indicator.value = !noIndicator.value
  }
}

const openEditDialog = (column) => {
  newColumnValue.value = ''
  currentColumn.value = column
  dialog.value = true
}

const closeSnackBar = () => {
  snackbar.value = false
}

const saveTemplate = () => {
  const payload: any = {}

  payload.jobs = runJobs.value
  payload.name = settingRunName.value // Template name
  payload.description = settingDescription.value
  console.log('Payload', payload)
  ValuationService.saveJobTemplate(payload).then((resp) => {
    timeout.value = 3000
    snackbar.value = true
    snackbarText.value = resp.data.message
  })
}

const loadTemplate = async () => {
  const resp = await ValuationService.getJobTemplate(selectedTemplate.value.id)
  const jobstemplate = JSON.parse(resp.data.content)
  runJobs.value = jobstemplate.jobs
}

const displayFlow = () => {
  runJobs.value = []
  if (settingWorkflow.value === null) {
    return
  }
  console.log('Display Flow', settingWorkflow.value)
}

const removeFromRunJobs = (runName) => {
  runJobs.value = runJobs.value.filter((item) => item.run_name !== runName)
}

const executeJobs = () => {
  runProjections()
}

const returnValidationError = (text) => {
  snackbarText.value = text
  timeout.value = 3000
  snackbar.value = true
  selectedProducts.value.pop()

  if (selectedProducts.value.length === 0) {
    availableLapseYears.value = []
    availableYieldYears.value = []
    availableMorbidityYears.value = []
    availableModelPointYears.value = []
    availableRetrenchmentYears.value = []
    availableParameterYears.value = []
    availableMortalityYears.value = []
    availableLapseMarginYears.value = []
    availableModelPointVersions.value = []
  }
}

const getModelPointVersions = async () => {
  if (selectedModelPointYear.value !== null) {
    availableModelPointVersions.value = []
    selectedModelPointVersion.value = null
    ValuationService.getModelPointVersionsForProduct(
      selectedProducts.value[0].id,
      selectedModelPointYear.value
    ).then((resp) => {
      if (resp.data !== null) {
        availableModelPointVersions.value = resp.data
      }
    })
  }
}

const getYieldCurveCodes = async () => {
  if (selectedYieldYear.value !== null) {
    selectedYieldCurveCode.value = null
    ValuationService.getYieldCurveCodes(selectedYieldYear.value).then((resp) => {
      if (resp.data !== null) {
        availableYieldCurveCodes.value = resp.data
      }
    })
  }
}

const getRunBasis = async () => {
  const res = await ValuationService.getAvailableBases(
    selectedProducts.value[selectedProducts.value.length - 1].product_code,
    selectedParameterYear.value
  )

  if (res.data !== null) {
    if (availableBases.value.length > 0) {
      const intersection = _.intersectionBy(res.data, availableBases.value, 'Basis')
      if (intersection.length < 1) {
        returnValidationError('There are differences in the available bases')
        return
      }

      availableBases.value = intersection
    } else {
      availableBases.value = res.data
    }
  }
}

const validateProduct = async () => {
  if (selectedProducts.value.length === 0) {
    selectedBasis.value = null
    returnValidationError('You need to provide model points for this product to run')
    return
  }
  try {
    if (selectedProducts.value.length > 0) {
      let res

      res = await ProductService.getModelPointCountForProduct(
        selectedProducts.value[selectedProducts.value.length - 1].id
      )

      if (res.data.results !== null && res.data.results < 1) {
        returnValidationError('There are no model points available for this product')
        return
      }

      res = await ValuationService.getAvailableModelPointYears(
        selectedProducts.value[selectedProducts.value.length - 1].product_code
      )

      console.log('Available Model Point Years', res.data)

      if (availableModelPointYears.value.length > 0) {
        const intersection = _.intersectionBy(availableModelPointYears.value, res.data, 'Year')

        if (intersection.length < 1) {
          returnValidationError(
            'The available number of model point years must be the same with the previously selected products'
          )
          return
        } else {
          availableModelPointYears.value = intersection
        }
      } else {
        availableModelPointYears.value = res.data
      }

      console.log('Available Model Point Years', availableModelPointYears.value)

      // Get available yield years
      res = await ValuationService.getAvailableYieldYears()

      if (availableYieldYears.value.length === 0 && res.data !== null) {
        availableYieldYears.value = res.data
      } else {
        const intersection = _.intersectionBy(availableYieldYears.value, res.data, 'Year')
        if (intersection.length < 1) {
          // find something to do here
        } else {
          if (intersection !== null) {
            availableYieldYears.value = intersection
          }
        }
      }

      // Get available parameter years
      res = await ValuationService.getAvailableParameterYears(
        selectedProducts.value[selectedProducts.value.length - 1].product_code
      )

      if (availableParameterYears.value.length > 0) {
        const intersection = _.intersectionBy(availableParameterYears.value, res.data, 'Year')

        if (intersection.length < 1) {
          returnValidationError('There are differences in the available parameter points in years')
          return
        }
        availableParameterYears.value = intersection
      } else {
        availableParameterYears.value = res.data
      }

      // Get available lapse years
      res = await ValuationService.getAvailableLapseYears(
        selectedProducts.value[selectedProducts.value.length - 1].product_code
      )

      if (res.data !== null) {
        if (availableLapseYears.value.length > 0) {
          const intersection = _.intersectionBy(availableLapseYears.value, res.data, 'Year')
          if (intersection.length < 1) {
            returnValidationError(
              'There are differences in the available lapse assumptions in years'
            )
            return
          }

          availableLapseYears.value = intersection
        } else {
          availableLapseYears.value = res.data
        }
      }

      // Get available lapse margin years
      if (availableLapseYears.value.length > 0) {
        res = await ValuationService.getAvailableLapseMarginYears(
          selectedProducts.value[selectedProducts.value.length - 1].product_code
        )

        if (res.data !== null) {
          if (availableLapseMarginYears.value.length > 0) {
            const intersection = _.intersectionBy(res.data, availableLapseMarginYears.value, 'Year')
            if (intersection < 1) {
              returnValidationError(
                'There are differences in the available lapse margin assumptions in years'
              )
              return
            }

            availableLapseMarginYears.value = intersection
          } else {
            availableLapseMarginYears.value = res.data
          }
        }
      }

      // Get available retrenchment years
      res = await ValuationService.getAvailableRetrenchmentYears(
        selectedProducts.value[selectedProducts.value.length - 1].product_code
      )

      if (res.data !== null) {
        if (availableRetrenchmentYears.value.length > 0) {
          const intersection = _.intersectionBy(res.data, availableRetrenchmentYears.value, 'Year')

          if (intersection.length < 1) {
            returnValidationError(
              'There are differences in the available retrenchment assumptions in years'
            )
            return
          }
          availableRetrenchmentYears.value = intersection
        } else {
          availableRetrenchmentYears.value = res.data
        }
      }

      // Get available mortality years
      res = await ValuationService.getAvailableMortalityYears(
        selectedProducts.value[selectedProducts.value.length - 1].product_code
      )

      if (res.data !== null) {
        if (availableMortalityYears.value.length > 0) {
          const intersection = _.intersectionBy(res.data, availableMortalityYears.value, 'Year')

          if (intersection.length < 1) {
            returnValidationError(
              'There are differences in the available mortality assumptions in years'
            )
            return
          }
          availableMortalityYears.value = intersection
        } else {
          availableMortalityYears.value = res.data
        }
      }

      res = await ValuationService.getAvailableDisabilityYears(
        selectedProducts.value[selectedProducts.value.length - 1].product_code
      )

      if (res.data !== null) {
        if (availableMorbidityYears.value.length > 0) {
          const intersection = _.intersectionBy(res.data, availableMortalityYears.value, 'Year')

          if (intersection.length < 1) {
            returnValidationError(
              'There are differences in the available morbidity assumptions in years'
            )
            return
          }
          availableMorbidityYears.value = intersection
        } else {
          availableMorbidityYears.value = res.data
        }
      }

      if (availableMortalityYears.value.length === 0) {
        availableMortalityYears.value.unshift({ Year: 'N/A' })
      }

      if (availableMorbidityYears.value.length === 0) {
        availableMorbidityYears.value.unshift({ Year: 'N/A' })
      }

      if (availableLapseYears.value.length === 0) {
        availableLapseYears.value.unshift({ Year: 'N/A' })
      }

      if (availableLapseMarginYears.value.length === 0) {
        availableLapseMarginYears.value.unshift({ Year: 'N/A' })
      }

      if (availableParameterYears.value.length === 0) {
        availableParameterYears.value.unshift({ Year: 'N/A' })
      }

      if (availableYieldYears.value.length === 0) {
        availableYieldYears.value.unshift({ Year: 'N/A' })
      }

      if (availableModelPointYears.value.length === 0) {
        availableModelPointYears.value.unshift({ Year: 'N/A' })
      }

      if (availableRetrenchmentYears.value.length === 0) {
        availableRetrenchmentYears.value.unshift({ Year: 'N/A' })
      }
    }
  } catch (error) {
    returnValidationError('An error occurred while validating the product')
    console.log(error)
  }
}

const addToRunJobs = async () => {
  const job: any = {}
  const ids: any = []
  const names: any = []
  if (selectedProducts.value.length > 0) {
    selectedProducts.value.forEach((prod) => {
      ids.push(prod.id)
      names.push(prod.product_name)
    })
  }
  job.prod_ids = ids
  job.prod_names = names
  if (jobTemplate.value === null) {
    job.jobs_template_id = 0
  } else {
    job.jobs_template_id = jobTemplate.value.id
  }
  job.run_type = runType.value
  job.run_name = settingRunName.value
  job.run_description = settingDescription.value
  job.run_single = runSingle.value
  job.run_date = formatDateString(runDate.value, true, true, false)
  job.modelpoint_year = selectedModelPointYear.value
  job.mp_version = selectedModelPointVersion.value
  job.yieldcurve_year = selectedYieldYear.value

  if (selectedParameterYear.value === 'N/A') {
    job.parameter_year = 0
  } else {
    job.parameter_year = selectedParameterYear.value
  }

  if (selectedMorbidityYear.value !== 'N/A') {
    job.morbidity_year = selectedMorbidityYear.value
  } else {
    job.morbidity_year = 0
  }
  if (selectedRetrenchmentYear.value !== 'N/A') {
    job.retrenchment_year = selectedRetrenchmentYear.value
  } else {
    job.retrenchment_year = 0
  }

  if (selectedMortalityYear.value !== 'N/A') {
    job.mortality_year = selectedMortalityYear.value
  } else {
    job.mortality_year = 0
  }

  if (selectedLapseYear.value !== 'N/A') {
    job.lapse_year = selectedLapseYear.value
  } else {
    job.lapse_year = 0
  }

  if (selectedLapseMarginYear.value !== 'N/A') {
    job.lapse_margin_year = selectedLapseMarginYear.value
  } else {
    job.lapse_margin_year = 0
  }

  job.shock_settings = selectedShock.value
  job.ifrs17_indicator = ifrs17Indicator.value
  job.lic_indicator = licIndicator.value
  job.yield_curve_basis = selectedYieldCurveBasis.value
  if (parseInt(aggPeriod.value) !== null && parseInt(aggPeriod.value) > 0) {
    if (parseInt(aggPeriod.value) > 1440) {
      job.aggregation_period = 1440
    } else {
      job.aggregation_period = parseInt(aggPeriod.value)
    }
  }
  job.year_end_month = yearEndMonth.value

  job.run_basis = selectedBasis.value

  console.log('Added job', job)

  runJobs.value.push(job)
  resetFields()
  // settingRunName.value = '';
  // runDate.value = null;
}

const resetFields = () => {
  settingRunName.value = ''
  runDate.value = null
  selectedProducts.value = []
  selectedModelPointYear.value = null
  selectedModelPointVersion.value = null
  selectedYieldYear.value = null
  selectedParameterYear.value = null
  selectedMorbidityYear.value = null
  selectedRetrenchmentYear.value = null
  selectedLapseYear.value = null
  selectedMortalityYear.value = null
  selectedShock.value = null
  selectedYieldCurveBasis.value = null
  selectedLapseMarginYear.value = null
  aggPeriod.value = null
  yearEndMonth.value = null
  selectedBasis.value = null
  settingDescription.value = ''
  settingRunName.value = ''
  runSingle.value = false
  ifrs17Indicator.value = false
  licIndicator.value = false
  noIndicator.value = false
}

const runProjections = () => {
  const payload: any = {}

  payload.jobs = runJobs.value
  if (jobTemplate.value === null) {
    payload.jobs_template_id = 0
  } else {
    payload.jobs_template_id = jobTemplate.value.id
  }

  ProductService.runProjections(payload).then((resp) => {
    timeout.value = 3000
    snackbar.value = true
    snackbarText.value = resp.data.message
    // setTimeout(() => {
    //   this.$router.push({ path: "/valuation-jobs" });
    // }, 2000);
  })
}

onMounted(async () => {
  ValuationService.getJobTemplates().then((resp) => {
    if (resp.data.length > 0) {
      jobTemplates.value = resp.data
      console.log(jobTemplates.value)
    }
  })

  ValuationService.getShockSettings().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      console.log(response.data)
      shockData.value = []
      shockData.value = response.data
      const obj: any = {}
      obj.name = 'N/A'
      shockData.value.unshift(obj)
    } else {
      shockData.value = []
      const obj: any = {}
      obj.name = 'N/A'
      shockData.value.unshift(obj)
    }
  })

  const prodResponse = await ProductService.getProducts()
  productsList.value = prodResponse.data
  console.log('Products', productsList.value)
})
</script>

<style scoped>
.responsive-table {
  display: inline-block;
}

.table-col {
  min-width: 120px;
  font-size: 12px;
  white-space: nowrap;
}

.table-row {
  background-color: grey;
  color: white;
}

.v-table {
  border: 1px solid grey;
}
</style>
