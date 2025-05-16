<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Modified GMM Settings</span>
          </template>
          <template #default>
            <v-row class="mx-9 mt-9">
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
            <v-row class="mx-9">
              <v-col>
                <v-combobox
                  v-model="selectedPortfolios"
                  variant="outlined"
                  density="compact"
                  label="Select a Portfolio"
                  :items="portfolios"
                  item-title="name"
                  item-value="name"
                  return-object
                  multiple
                  chips
                  closable-chips
                  @update:model-value="validatePortfolios"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row class="mx-9">
              <v-col cols="4">
                <v-select
                  v-model="selectedYear"
                  variant="outlined"
                  density="compact"
                  label="Select a Model Point Year"
                  :items="availableYears"
                  @update:model-value="checkPaaFinanceYear"
                ></v-select>
              </v-col>
              <v-col v-if="selectedYear !== null" cols="4">
                <v-select
                  v-model="selectedMpVersion"
                  variant="outlined"
                  density="compact"
                  label="Select a Model Point Version"
                  :items="availableMpVersions"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="selectedPremiumEarningYear"
                  variant="outlined"
                  density="compact"
                  label="Select a Premium Earning Pattern"
                  :items="availablePremiumYears"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="selectedParameterYear"
                  variant="outlined"
                  density="compact"
                  label="Select Parameter Year"
                  :items="availableParameterYears"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="selectedShock"
                  variant="outlined"
                  density="compact"
                  label="Select Shock Settings"
                  :items="availableShocks"
                  item-text="name"
                  item-title="name"
                  return-object
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="selectedAggregationOption"
                  variant="outlined"
                  density="compact"
                  label="Aggregate for IFRS17"
                  :items="availableAggregateOptions"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="mx-9"> </v-row>
            <v-row class="mx-9">
              <v-col cols="4"
                ><v-text-field
                  v-model="yearEndMonth"
                  variant="outlined"
                  density="compact"
                  type="number"
                  max="12"
                  min="1"
                  label="Year End Month"
                  placeholder="Enter Year End Month (1 - 12)"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mx-9">
              <v-col cols="4">
                <v-checkbox v-model="runSingle" :label="`Use a single model point`"></v-checkbox>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="useIndividualResults"
                  :label="`Produce individual model point results`"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row class="mx-9">
              <v-col>
                <v-btn rounded width="200" size="small" color="primary" @click="addToRunJobs"
                  >Add to Run Jobs</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="mt-4 mb-4"></v-divider>
            <v-row v-if="runJobs.length > 0" class="mx-9">
              <v-col>
                <base-card :showActions="false">
                  <template #header>
                    <span class="headline">Run Jobs</span>
                  </template>
                  <template #default>
                    <v-table class="trans-tables">
                      <thead>
                        <tr>
                          <th class="text-left table-col">Name</th>
                          <th class="text-left table-col">Run Date</th>
                          <th class="text-left table-col">Premium Earning Pattern</th>
                          <th class="text-left table-col">Parameter Year</th>
                          <th class="text-left table-col">Model Point Year</th>
                          <th class="text-left table-col">IFRS17 Aggregation</th>
                          <th class="text-left table-col">Projection Period</th>
                          <th class="text-left table-col">Individual Results</th>
                          <th class="text-left table-col">Shock Setting</th>
                          <th class="text-left table-col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in runJobs" :key="item.name">
                          <td>{{ item.name }}</td>
                          <td>{{ item.run_date }}</td>
                          <td>{{ item.premium_earning }}</td>
                          <td>{{ item.parameter_year }}</td>
                          <td>{{ item.model_point }}</td>
                          <td>{{ item.ifrs17_aggregation }}</td>
                          <td>{{ item.projection_period }}</td>
                          <td>{{ item.individual_results }}</td>
                          <td>{{ item.shock_setting.name }}</td>
                          <td>
                            <v-btn variant="text" icon @click="removeFromRunJobs(item.name)">
                              <v-icon color="red">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </template>
                </base-card>
              </v-col>
            </v-row>
            <v-row v-if="runJobs.length > 0" class="mx-9">
              <v-col>
                <v-btn
                  color="primary"
                  class="primary"
                  size="small"
                  variant="plain"
                  rounded
                  @click="executeJobs"
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
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import _ from 'lodash'
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import { onMounted, ref } from 'vue'
import BaseCard from '../../../components/BaseCard.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import formatDateString from '@/renderer/utils/helpers'

import { useRouter } from 'vue-router'

const $router = useRouter()
// const error = ref(null);
const runSingle = ref(false)
const useIndividualResults = ref(false)
const portfolios = ref([])
const runName = ref(null)
const runDate: any = ref(null)
const runJobs: any = ref([])
const availableYears = ref([])
const availableParameterYears: any = ref([])
const availablePremiumYears: any = ref([])
const availableShocks: any = ref([])
const availableAggregateOptions = ref([
  { text: 'Yes', value: true },
  { text: 'No', value: false }
])
const availableMpVersions = ref([])
const selectedAggregationOption = ref(null)
const selectedYear = ref(null)
const selectedMpVersion = ref(null)
const selectedParameterYear = ref(null)
const selectedPremiumEarningYear = ref(null)
const selectedPortfolios: any = ref([])
const selectedShock: any = ref(null)
const snackbar = ref(false)
const timeout = ref(5000)
const text = ref('')
const yearEndMonth = ref(12)

// const formattedDate = computed(() => {
//   if (!runDate.value) return ''
//   const date = new Date(runDate.value)
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure two digits
//   return `${year}-${month}`
// })

// const formattedDate = computed(() => {
//   if (!runDate.value) return ''
//   const date = new Date(runDate.value)
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure two digits
//   return `${year}-${month}`
// })

const removeFromRunJobs = (name: string) => {
  runJobs.value = runJobs.value.filter((item: any) => item.name !== name)
}

const executeJobs = () => {
  ModifiedGMMService.runJobs(runJobs.value).then((res) => {
    timeout.value = 3000
    snackbar.value = true
    text.value = res.data.message
    setTimeout(() => {
      $router.push({ path: '/valuations/paa/run-results' })
    }, 2000)
  })
}

const validatePortfolios = async () => {
  console.log('Validating portfolios')
  if (selectedPortfolios.value.length === 0) {
    // clear the fields
    availableParameterYears.value = []
    availablePremiumYears.value = []
    availableYears.value = []
    selectedYear.value = null
    selectedMpVersion.value = null
    selectedParameterYear.value = null
    selectedPremiumEarningYear.value = null
    selectedShock.value = null
    selectedAggregationOption.value = null
    runSingle.value = false
    useIndividualResults.value = false

    return false
  }

  if (selectedPortfolios.value.length > 0) {
    const res = await ModifiedGMMService.getModelPointYears(
      selectedPortfolios.value[selectedPortfolios.value.length - 1].id
    )
    const resparams = await ModifiedGMMService.getAvailableParameterYears(
      selectedPortfolios.value[selectedPortfolios.value.length - 1].name
    )

    const resprem = await ModifiedGMMService.getAvailablePremiumPatternYears(
      selectedPortfolios.value[selectedPortfolios.value.length - 1].name
    )

    console.log('res', res.data)
    console.log('resparams', resparams.data)
    console.log('resprem', resprem.data)

    if (res.data.length === 0) {
      snackbar.value = true
      text.value = 'There are no valid model points for the selected portfolio.'
      return false
    }

    if (resparams.data.length === 0) {
      snackbar.value = true
      text.value = 'There are no valid parameters for the selected portfolio.'
      return false
    }

    if (availableYears.value.length > 0) {
      const intersection = _.intersection(availableYears.value, res.data)

      if (intersection.length < 1) {
        return false
      } else {
        availableYears.value = intersection
      }
    } else {
      availableYears.value = res.data
    }

    if (availableParameterYears.value.length > 0) {
      const intersection = _.intersection(availableParameterYears.value, resparams.data)

      if (intersection.length < 1) {
        return false
      } else {
        availableParameterYears.value = intersection
      }
    } else {
      availableParameterYears.value = resparams.data
    }

    // Remove Not Applicable from available premium years before intersection
    availablePremiumYears.value = availablePremiumYears.value.filter(
      (item: any) => item !== 'Not Applicable'
    )

    if (availablePremiumYears.value.length > 0) {
      const intersection = _.intersection(availablePremiumYears.value, resprem.data)

      if (intersection.length < 1) {
        return false
      } else {
        availablePremiumYears.value = intersection
      }
    } else {
      availablePremiumYears.value = resprem.data
    }
    availablePremiumYears.value.unshift('Not Applicable')
  }
  return true
}

const checkPaaFinanceYear = async () => {
  console.log('Checking PAA Finance Year')
  if (selectedPortfolios.value.length > 0 && selectedYear.value !== null) {
    // const res = await ModifiedGMMService.checkPaaFinanceYear(
    //   selectedPortfolios.value[0].name,
    //   selectedYear.value
    // )
    // if (!res.data) {
    //   text.value =
    //     'PAA Finance data is not available for the selected portfolio and year. This run will not be executed.'
    //   snackbar.value = true
    // }
    // get available model point versions
    const resMp = await ModifiedGMMService.getAvailableMpVersions(
      selectedPortfolios.value[0].name,
      selectedYear.value
    )
    availableMpVersions.value = resMp.data
  }
}

onMounted(() => {
  ModifiedGMMService.getShockSettings().then((res: any) => {
    availableShocks.value = res.data
    availableShocks.value.unshift('Not Applicable')
  })
  ModifiedGMMService.getValidPortfolios().then((res: any) => {
    portfolios.value = res.data
  })
})

const addToRunJobs = () => {
  console.log('Adding to run jobs', runName.value, selectedParameterYear.value)
  if (runName.value !== null && selectedParameterYear.value !== null) {
    const jobGroup: any = {}
    jobGroup.name = runName.value
    jobGroup.run_single = runSingle.value
    jobGroup.individual_results = useIndividualResults.value
    jobGroup.run_date = formatDateString(runDate.value, true, true, false)
    jobGroup.model_point = selectedYear.value
    jobGroup.model_point_version = selectedMpVersion.value
    jobGroup.parameter_year = selectedParameterYear.value
    jobGroup.expected_claims = selectedParameterYear.value
    jobGroup.claims_expenses = selectedParameterYear.value
    jobGroup.maintenance_expense = selectedParameterYear.value
    jobGroup.acquisition_expense = selectedParameterYear.value
    jobGroup.risk_adjustment = selectedParameterYear.value
    jobGroup.reinsurance = selectedParameterYear.value
    // jobGroup.projection_period = parseInt(projectionPeriod.value);
    if (selectedPremiumEarningYear.value !== 'Not Applicable') {
      jobGroup.premium_earning = selectedPremiumEarningYear.value
    } else {
      jobGroup.premium_earning = 0
    }
    jobGroup.ifrs17_aggregation = selectedAggregationOption.value
    jobGroup.year_end_month = Number(yearEndMonth.value)
    if (selectedShock.value !== 'Not Applicable') {
      if (selectedShock.value !== null) {
        jobGroup.shock_setting_id = selectedShock.value.id
        jobGroup.shock_setting = selectedShock.value
      }
    } else {
      jobGroup.shock_setting_id = 0
      jobGroup.shock_setting = { name: 'N/A', description: '' }
    }
    jobGroup.portfolios = []

    selectedPortfolios.value.forEach((portfolio) => {
      const job: any = {}
      job.name = runName.value
      // job.name = runName.value + "_" + portfolio.name + '_' + runDate.value;
      job.run_single = runSingle.value
      job.individual_results = useIndividualResults.value
      job.portfolio_name = portfolio.name
      job.portfolio_id = portfolio.id
      job.run_date = formatDateString(runDate.value, true, true, false)
      job.model_point = selectedYear.value
      job.model_point_version = selectedMpVersion.value
      job.parameter_year = selectedParameterYear.value
      job.expected_claims = selectedParameterYear.value
      job.claims_expenses = selectedParameterYear.value
      job.maintenance_expense = selectedParameterYear.value
      job.acquisition_expense = selectedParameterYear.value
      job.risk_adjustment = selectedParameterYear.value
      job.reinsurance = selectedParameterYear.value
      job.premium_earning = jobGroup.premium_earning
      job.ifrs17_aggregation = jobGroup.ifrs17_aggregation
      job.year_end_month = jobGroup.year_end_month
      job.shock_setting_id = jobGroup.shock_setting_id
      job.shock_setting = jobGroup.shock_setting
      jobGroup.portfolios.push(job)
    })
    runJobs.value.push(jobGroup)
  }
}

// const getPortfolioModelpointYears = () => {
//   selectedYear.value = null;
//   ModifiedGMMService.getModelPointYears(selectedPortfolio.value.id).then(
//     (res) => {
//       availableYears.value = res.data;
//     }
//   );
//   getAvailableParameterYears();
// };

// const getAvailableParameterYears = () => {
//   ModifiedGMMService.getAvailableParameterYears(
//     selectedPortfolio.value.name
//   ).then((res) => {
//     availableParameterYears.value = res.data;
//   });
//   ModifiedGMMService.getAvailablePremiumPatternYears(
//     selectedPortfolio.value.name
//   ).then((res) => {
//     availablePremiumYears.value = res.data;
//     availablePremiumYears.value.unshift("Not Applicable");
//   });
// };

// export default {
//   data() {
//     // availableYears will be fetched from db...
//     return {
//       error: null,
//       runSingle: false,
//       useIndividualResults: false,
//       portfolios: [],
//       projectionPeriod: 120,
//       modelpointCount: 0,
//       errorMessages: null,
//       file: null,
//       fileModelPoints: null,
//       fileParameters: null,
//       showFileUpload: false,
//       loading: false,
//       uploadDisabled: true,
//       uploadFileDialog: false,
//       showDownloadTemplate: false,
//       showDetail: false,
//       runName: null,
//       fromDateMenu: false,
//       runDate: null,
//       runJobs: [],
//       availableYears: [],
//       availableRunTypes: [{ type: "PAA" }, { type: "Modified GMM" }],
//       availableScenarios: [
//         { scenario: "Control" },
//         { scenario: "Reinsurance" },
//         { scenario: "Control" },
//         { scenario: "Discount Rate" },
//         { scenario: "Claims" },
//         { scenario: "Claims Exp" },
//         { scenario: "Maintenance Exp" },
//         { scenario: "Acquisition Exp" },
//         { scenario: "Risk Adjustment" },
//         { scenario: "Closing" },
//       ],
//       availableParameterYears: [],
//       availablePremiumYears: any: [],
//       availableShocks: [],
//       availableAggregateOptions: [
//         { text: "Yes", value: true },
//         { text: "No", value: false },
//       ],
//       availableMpVersions: [],
//       selectedAggregationOption: null,
//       selectedScenario: null,
//       selectedYear: null,
//       selectedMpVersion: null,
//       selectedParameterYear: null,
//       selectedModelPointsYear: null,
//       selectedDiscountCurveYear: null,
//       selectedExpectedClaimsYear: null,
//       selectedClaimsExpensesYear: null,
//       selectedMaintenanceExpenseYear: null,
//       selectedAcquisitionExpenseYear: null,
//       selectedRiskAdjustmentYear: null,
//       selectedReinsuranceYear: null,
//       selectedPremiumEarningYear: null,
//       selectedRunType: null,
//       selectedPortfolio: null,
//       selectedPortfolios: [],
//       selectedShock: null,
//       snackbar: false,
//       timeout: 5000,
//       text: "",
//       yearEndMonth: 12,
//     };
//   },
//   validations: {
//     runDate: {
//       required,
//     },
//     runName: {
//       required,
//       runNameDuplicate: async function (value) {
//         if (value) {
//           let result;
//           result = await ModifiedGMMService.checkRunName(value);
//           return !result.data;
//         }
//       },
//     },
//   },
//   computed: {
//     runDateErrors() {
//       const errors = [];
//       if (!this.$v.runDate.$dirty) return errors;
//       !this.$v.runDate.required && errors.push("run date is required.");
//       return errors;
//     },
//     runNameErrors() {
//       const errors = [];
//       if (!this.$v.runName.$dirty) return errors;
//       !this.$v.runName.required && errors.push("run name is required.");
//       !this.$v.runName.runNameDuplicate &&
//         errors.push("The run name already exists");
//       return errors;
//     },
//   },

//   mounted() {
//     ModifiedGMMService.getShockSettings().then((res) => {
//       this.availableShocks = res.data;
//       this.availableShocks.unshift("Not Applicable");
//     });
//     ModifiedGMMService.getValidPortfolios().then((res) => {
//       this.portfolios = res.data;
//     });
//   },
//   methods: {
//     async checkPaaFinanceYear() {
//       if (this.selectedPortfolios.length > 0 && this.selectedYear !== null) {
//         const res = await ModifiedGMMService.checkPaaFinanceYear(
//           this.selectedPortfolios[0].name,
//           this.selectedYear
//         );
//         if (!res.data) {
//           this.text =
//             "PAA Finance data is not available for the selected portfolio and year. This run will not be executed.";
//           this.snackbar = true;
//         }
//         // get available model point versions
//         const resMp = await ModifiedGMMService.getAvailableMpVersions(
//           this.selectedPortfolios[0].name,
//           this.selectedYear
//         );
//         this.availableMpVersions = resMp.data;
//       }
//     },
//     async validatePortfolios() {
//       if (this.selectedPortfolios.length === 0) {
//         this.returnValidationError(
//           "You need to provide portfolios for this job to run"
//         );
//         this.availableParameterYears = [];
//         this.availablePremiumYears: any = [];
//         this.availableYears = [];
//         return;
//       }

//       if (this.selectedPortfolios.length > 0) {
//         let res;
//         let resparams;
//         let resprem = {};
//         res = await ModifiedGMMService.getModelPointYears(
//           this.selectedPortfolios[this.selectedPortfolios.length - 1].id
//         );
//         resparams = await ModifiedGMMService.getAvailableParameterYears(
//           this.selectedPortfolios[this.selectedPortfolios.length - 1].name
//         );

//         resprem = await ModifiedGMMService.getAvailablePremiumPatternYears(
//           this.selectedPortfolios[this.selectedPortfolios.length - 1].name
//         );

//         if (res.data.length === 0) {
//           this.returnValidationError(
//             "There are no valid model points for the selected portfolio."
//           );
//           this.selectedPortfolios.pop();
//           return;
//         }

//         if (resparams.data.length === 0) {
//           this.returnValidationError(
//             "There are no valid parameters for the selected portfolio."
//           );
//           this.selectedPortfolios.pop();
//           return;
//         }

//         if (this.availableYears.length > 0) {
//           const intersection = _.intersection(this.availableYears, res.data);

//           if (intersection.length < 1) {
//             this.returnValidationError(
//               "The available number of model point years must be the same with the previously selected portfolio."
//             );
//             this.selectedPortfolios.pop();
//             return;
//           } else {
//             this.availableYears = intersection;
//           }
//         } else {
//           this.availableYears = res.data;
//         }

//         if (this.availableParameterYears.length > 0) {
//           const intersection = _.intersection(
//             this.availableParameterYears,
//             resparams.data
//           );

//           if (intersection.length < 1) {
//             this.returnValidationError(
//               "The available number of parameter years must be the same with the previously selected portfolio."
//             );
//             this.selectedPortfolios.pop();
//             return;
//           } else {
//             this.availableParameterYears = intersection;
//           }
//         } else {
//           this.availableParameterYears = resparams.data;
//         }

//         // Remove Not Applicable from available premium years before intersection
//         this.availablePremiumYears: any = this.availablePremiumYears: any.filter(
//           (item) => item !== "Not Applicable"
//         );

//         if (this.availablePremiumYears: any.length > 0) {
//           const intersection = _.intersection(
//             this.availablePremiumYears: any,
//             resprem.data
//           );

//           if (intersection.length < 1) {
//             this.returnValidationError(
//               "The available number of premium pattern years must be the same with the previously selected portfolio."
//             );
//             return;
//           } else {
//             this.availablePremiumYears: any = intersection;
//           }
//         } else {
//           this.availablePremiumYears: any = resprem.data;
//         }
//         this.availablePremiumYears: any.unshift("Not Applicable");
//       }
//     },

//     getPortfolioModelpointYears() {
//       this.selectedYear = null;
//       ModifiedGMMService.getModelPointYears(this.selectedPortfolio.id).then(
//         (res) => {
//           this.availableYears = res.data;
//         }
//       );
//       this.getAvailableParameterYears();
//     },
//     getAvailableParameterYears() {
//       ModifiedGMMService.getAvailableParameterYears(
//         this.selectedPortfolio.name
//       ).then((res) => {
//         this.availableParameterYears = res.data;
//         // this.availablePremiumYears: any.unshift("Not Applicable");
//       });
//       ModifiedGMMService.getAvailablePremiumPatternYears(
//         this.selectedPortfolio.name
//       ).then((res) => {
//         this.availablePremiumYears: any = res.data;
//         this.availablePremiumYears: any.unshift("Not Applicable");
//       });
//     },
//     uploadParameterFile() {
//       const formdata = new FormData();

//       formdata.append("file", this.fileParameters);
//       formdata.append("year", this.selectedParameterYear);

//       ModifiedGMMService.uploadParameters(formdata)
//         .then(() => {
//           this.uploadSuccess = true;
//           this.paramsAvailable = true;
//         })
//         .catch((err) => {
//           this.errorMessages.push(err.data.error);
//           this.uploadSuccess = false;
//           this.paramsAvailable = false;
//         });
//     },
//     uploadModelPoints() {
//       const formdata = new FormData();
//       formdata.append("file", this.fileModelPoints);
//       formdata.append("year", this.selectedModelPointsYear);
//       ModifiedGMMService.uploadModelPoints(formdata).then(() => {
//         this.fileModelPoints = null;
//         this.selectedModelPointsYear = null;
//       });
//     },
//     displayFileUpload() {
//       this.showFileUpload = true;
//       this.uploadFileDialog = true;
//     },
//     cancelUpload() {
//       this.showFileUpload = false;
//       this.uploadFileDialog = false;
//       this.uploadDisabled = false;
//       this.file = null;
//       this.loading = false;
//       this.error = false;
//       this.errorMessages = [];
//     },

//     addToRunJobs() {

//       // this.$v.$touch();
//       // if (this.$v.$invalid) {
//       //   return;
//       // }
//       if (this.runName !== null && this.selectedParameterYear !== null) {
//         const jobGroup = {};
//         jobGroup.name = this.runName;
//         jobGroup.run_single = this.runSingle;
//         jobGroup.individual_results = this.useIndividualResults;
//         jobGroup.run_date = this.runDate;
//         jobGroup.model_point = this.selectedYear;
//         jobGroup.model_point_version = this.selectedMpVersion;
//         jobGroup.parameter_year = this.selectedParameterYear;
//         jobGroup.expected_claims = this.selectedParameterYear;
//         jobGroup.claims_expenses = this.selectedParameterYear;
//         jobGroup.maintenance_expense = this.selectedParameterYear;
//         jobGroup.acquisition_expense = this.selectedParameterYear;
//         jobGroup.risk_adjustment = this.selectedParameterYear;
//         jobGroup.reinsurance = this.selectedParameterYear;
//         // jobGroup.projection_period = parseInt(this.projectionPeriod);
//         if (this.selectedPremiumEarningYear !== "Not Applicable") {
//           jobGroup.premium_earning = this.selectedPremiumEarningYear;
//         } else {
//           jobGroup.premium_earning = 0;
//         }
//         jobGroup.ifrs17_aggregation = this.selectedAggregationOption;
//         jobGroup.year_end_month = Number(this.yearEndMonth);
//         if (this.selectedShock !== "Not Applicable") {
//           jobGroup.shock_setting_id = this.selectedShock.id;
//           jobGroup.shock_setting = this.selectedShock;
//         } else {
//           jobGroup.shock_setting_id = 0;
//           jobGroup.shock_setting = { name: "N/A", description: "" };
//         }
//         jobGroup.portfolios = [];

//         this.selectedPortfolios.forEach((portfolio) => {
//           const job = {};
//           job.name = this.runName;
//           // job.name = this.runName + "_" + portfolio.name + '_' + this.runDate;
//           job.run_single = this.runSingle;
//           job.individual_results = this.useIndividualResults;
//           job.portfolio_name = portfolio.name;
//           job.portfolio_id = portfolio.id;
//           job.run_date = this.runDate;
//           job.model_point = this.selectedYear;
//           job.model_point_version = this.selectedMpVersion;
//           job.parameter_year = this.selectedParameterYear;
//           job.expected_claims = this.selectedParameterYear;
//           job.claims_expenses = this.selectedParameterYear;
//           job.maintenance_expense = this.selectedParameterYear;
//           job.acquisition_expense = this.selectedParameterYear;
//           job.risk_adjustment = this.selectedParameterYear;
//           job.reinsurance = this.selectedParameterYear;
//           // job.projection_period = parseInt(this.projectionPeriod);

//           if (this.selectedPremiumEarningYear !== "Not Applicable") {
//             job.premium_earning = this.selectedPremiumEarningYear;
//           } else {
//             job.premium_earning = 0;
//           }

//           job.ifrs17_aggregation = this.selectedAggregationOption;
//           job.year_end_month = Number(this.yearEndMonth);
//           if (this.selectedShock !== "Not Applicable") {
//             job.shock_setting_id = this.selectedShock.id;
//             job.shock_setting = this.selectedShock;
//           } else {
//             job.shock_setting_id = 0;
//             job.shock_setting = { name: "N/A", description: "" };
//           }

//           jobGroup.portfolios.push(job);
//         });

//         this.runJobs.push(jobGroup);

//         this.runName = null;
//         this.runDate = null;
//         this.selectedRunType = null;
//         this.runSingle = false;
//         this.useIndividualResults = false;
//         this.selectedYear = null;
//         this.selectedExpectedClaimsYear = null;
//         this.selectedMaintenanceExpenseYear = null;
//         this.selectedAcquisitionExpenseYear = null;
//         this.selectedRiskAdjustmentYear = null;
//         this.selectedReinsuranceYear = null;
//         this.selectedClaimsExpensesYear = null;
//         this.selectedAggregationOption = null;
//         this.selectedShock = null;
//         this.selectedPortfolio = null;
//         this.selectedPortfolios = [];
//         this.selectedPremiumEarningYear = null;
//         this.selectedParameterYear = null;
//         this.yearEndMonth = 12;
//         this.projectionPeriod = 120;
//         this.availableParameterYears = [];
//         this.availablePremiumYears: any = [];
//         this.availableYears = [];
//         this.selectedMpVersion = null;
//         this.availableMpVersions = [];

//         this.$v.$reset();
//       }
//     },
//     removeFromRunJobs(jobName) {
//       this.runJobs = _.remove(this.runJobs, function (item) {
//         return item.name !== jobName;
//       });
//     },
//     executeJobs() {
//       ModifiedGMMService.runJobs(this.runJobs).then((res) => {
//         this.timeout = 3000;
//         this.snackbar = true;
//         this.text = res.data.message;
//         setTimeout(() => {
//           this.$router.push({ path: "/m-gmm/projection-runs" });
//         }, 2000);
//       });
//     },
//     returnValidationError(text) {
//       this.text = text;
//       this.timeout = 3000;
//       this.snackbar = true;
//     },
//   },
// };
</script>

<style scoped>
.table-col {
  min-width: 120px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
