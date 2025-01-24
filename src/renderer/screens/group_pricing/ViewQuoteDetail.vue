<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card v-if="quote !== null" :show-actions="false">
          <template #header>
            <span class="headline">Group Life Assurance Pricing</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="3"><p>Scheme Name</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.scheme_name }}</p></v-col
              >
              <v-col cols="3"><p>Start Date</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.commencement_date }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Industry</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.industry }}</p></v-col
              >
              <v-col cols="3"><p>Renewal/New</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.quote_type }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Broker</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.quote_broker.name }}</p></v-col
              >
              <v-col cols="3"><p>Voluntary/Compulsory</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.obligation_type }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Currency</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.currency }}</p></v-col
              >
              <v-col cols="3"><p>Exchange Rate</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.exchangeRate }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Expense Loading</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.loadings.expense_loading }}</p></v-col
              >
              <v-col cols="3"><p>Commission Rate</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.loadings.commission_loading }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Profit Loading</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.loadings.profit_loading }}</p></v-col
              >
              <v-col cols="3"><p>Normal Retirement Age</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.normal_retirement_age }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Cover Termination Age</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.gla.cover_termination_age }}</p></v-col
              >
              <v-col cols="3"><p>Accelerated Benefit Discount</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{
                  quote.loadings.accelerated_benefit_discount
                }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Free Cover Limit</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.free_cover_limit }}</p></v-col
              >
              <v-col cols="3"><p>Experience Rating</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.experience_rating }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Overall Premium Discount</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.loadings.discount }}</p></v-col
              >
              <v-col cols="3"><p>Occupation Class</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.occupation_class }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Terminal Illness Benefit</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{
                  quote.gla.terminal_illness_benefit
                }}</p></v-col
              >
              <v-col cols="3"><p>Multiples of Salary</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.gla.salary_multiple }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Basis</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ dashIfEmpty(quote.basis) }}</p></v-col
              >
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-expansion-panels>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="5"> <p>Group Life Assurance (GLA)</p> </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="3"><p>Salary Multiple</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.gla.salary_multiple }}</p></v-col
                    >
                    <v-col cols="3"><p>Terminal Illness Benefit</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.gla.terminal_illness_benefit
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Waiting Period</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.gla.waiting_period }}</p></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="5"> <p>Spouse Group Life Assurance (GLA)</p> </v-col>
                    <v-checkbox
                      v-model:model-value="quote.sgla_benefit"
                      density="compact"
                      hide-details
                      readonly
                      disabled
                    ></v-checkbox> </v-row
                ></v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="3"><p>Cover Termination Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.sgla.coverTerminationAge
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Maximum Benefit</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.sgla.maximumBenefit }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Spousal Percentage</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.sgla.sglaPercentage }}</p></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="5"> <p>Permanent Total Disability</p> </v-col>
                    <v-checkbox
                      v-model:model-value="quote.ptd_benefit"
                      density="compact"
                      hide-details
                      readonly
                      disabled
                    ></v-checkbox> </v-row
                ></v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="3"><p>Benefit Type</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.ptd.benefitType }}</p></v-col
                    >
                    <v-col cols="3"><p>Cover Termination Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.ptd.coverTerminationAge
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Deferred Period</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.ptd.deferredPeriod }}</p></v-col
                    >
                    <v-col cols="3"><p>Disability Definition</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.ptd.disabilityDefinition
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Risk Type</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.ptd.riskType }}</p></v-col
                    >
                    <v-col cols="3"><p>Multiples of Salary</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.ptd.salaryMultiple }}</p></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="5"> <p>Critical Illness</p> </v-col>
                    <v-checkbox
                      v-model:model-value="quote.ci_benefit"
                      density="compact"
                      hide-details
                      readonly
                      disabled
                    ></v-checkbox> </v-row
                ></v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="3"><p>Benefit Structure</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.ci.benefitStructure }}</p></v-col
                    >
                    <v-col cols="3"><p>Cover Termination Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.ci.coverTerminationAge
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Critical Illness Percentage</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.ci.criticalIllnessPercentage
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Cover Termination Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.ci.coverTerminationAge
                      }}</p></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="5">
                      <p>Personal Health Insurance / Temporary Total Disability</p>
                    </v-col>
                    <v-checkbox
                      v-model:model-value="quote.phi_ttd_benefit"
                      density="compact"
                      hide-details
                      readonly
                      disabled
                    ></v-checkbox> </v-row
                ></v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="3"><p>Product Type</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.phi.product_type }}</p></v-col
                    >
                    <v-col cols="3"><p>Risk Type</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.phi.riskType }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Cover Termination Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.coverTerminationAge
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Deferred Period (Months)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.deferredPeriodMonths
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Disability Definition</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.disabilityDefinition
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Maximum Basic Benefit</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.phi.maxBasicBenefit }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Maximum Premium Waiver</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.phi.maxPremiumWaiver }}</p></v-col
                    >
                    <v-col cols="3"><p>Monthly Benefit Proportion</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.monthlyBenefitProportion
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Number of Annual Payments</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.numberAnnualPayments
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>PHI Escalation (%)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.phiEscalationPercentage
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Premium Waiver Benefit</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.premiumWaiverBenefit
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Premium Waiver Proportion</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.phi.premiumWaiverProportion
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Waiting Period (Months)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.phi.waiting_period }}</p></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="5">
                      <p>Family Funeral</p>
                    </v-col>
                    <v-checkbox
                      v-model:model-value="quote.family_funeral_benefit"
                      density="compact"
                      hide-details
                      readonly
                      disabled
                    ></v-checkbox> </v-row
                ></v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="3"><p>Sum Assured (Main Member)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.groupFamilyFuneral.main_member_group_funeral_sum_assured
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Sum Assured (Spouse)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.groupFamilyFuneral.spouse_group_funeral_sum_assured
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Sum Assured (Children)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.groupFamilyFuneral.child_group_funeral_sum_assured
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Sum Assured (Adult Dependants)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.groupFamilyFuneral.adultDependantSumAssured
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Maximum Children Covered</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.groupFamilyFuneral.maxChildrenCovered
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Sum Assured (Adult Dependants)</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.groupFamilyFuneral.adultDependantSumAssured
                      }}</p></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col>
                <v-table>
                  <tbody>
                    <tr v-for="item in relatedTables" :key="item.table_type">
                      <td :class="{ unpopulated: !item.populated }" style="width: 70%">{{
                        item.table_type
                      }}</td>
                      <td style="text-align: left">
                        <v-btn
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="viewTable(item)"
                        >
                          <v-icon left color="primary">mdi-information</v-icon>
                          <span>Info</span>
                        </v-btn>

                        <v-btn
                          v-if="
                            item.table_type !== 'Group Pricing Parameters' &&
                            item.table_type !== 'Member Rating Results'
                          "
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="openDialog(item)"
                        >
                          <v-icon left color="primary">mdi-upload</v-icon>
                          <span>Upload</span>
                        </v-btn>
                        <v-btn
                          v-if="item.table_type !== 'Group Pricing Parameters'"
                          variant="outlined"
                          rounded
                          color="red"
                          size="small"
                          @click.stop="deleteTable(item)"
                        >
                          <v-icon left color="red">mdi-delete</v-icon>
                          <span>Delete</span>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-if="tableData.length > 0 && !loadingData">
              <v-col>
                <data-grid
                  :columnDefs="columnDefs"
                  :show-close-button="true"
                  :rowData="tableData"
                  :table-title="selectedTable"
                  :pagination="true"
                  :rowCount="rowCount"
                  @update:clear-data="clearData"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="3"><p>Created By</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.createdBy }}</p></v-col
              >
              <v-col cols="3"><p>Reviewed By</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.reviewer }}</p></v-col
              >
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="3">
                <v-btn size="small" rounded color="primary" @click="goBack">Back</v-btn>
              </v-col>
              <v-col cols="9" class="text-right">
                <v-btn class="mr-3" size="small" rounded color="primary" @click="goBack"
                  >Edit</v-btn
                >
                <v-btn
                  v-if="quote.memberDataCount > 0 && quote.claimsExperienceCount > 0"
                  class="mr-3"
                  size="small"
                  rounded
                  color="primary"
                  @click="runQuoteCalculations"
                  >Run Calculations</v-btn
                >

                <v-btn size="small" rounded color="primary" @click="goBack">Approve</v-btn>
              </v-col>
            </v-row>
            <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
              {{ snackbarText }}
              <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <file-upload-dialog
          :yearLabel="yearLabel"
          :isDialogOpen="isDialogOpen"
          :showModelPoint="showModelPoint"
          :mpLabel="mpLabel"
          :table="'undefined'"
          :uploadTitle="uploadTitle"
          :years="years"
          @upload="handleUpload"
          @update:isDialogOpen="updateDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { computed, onMounted, ref } from 'vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import formatValues from '@/renderer/utils/format_values'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { useRouter } from 'vue-router'
import FileUploadDialog from '@/renderer/components/FileUploadDialog.vue'

const router = useRouter()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const showModelPoint = ref(false)
const yearLabel = ref('') // 'Select a year'
const uploadTitle = ref('')
const mpLabel = ref('')
const isDialogOpen = ref(false)
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k))
const updateDialog = (value: boolean) => {
  isDialogOpen.value = value
}

const columnDefs: any = ref([])
const rowCount: any = ref(0)

const snackbar = ref(false)
const timeout = 2000
const snackbarText = ref('')

const tableData = ref([])
const selectedTable: any = ref(null)
const loadingData = ref(false)
const quote: any = ref(null)
const broker = ref(null)

const relatedTables = computed(() => {
  const tables: any = []
  if (quote.value.memberDataCount > 0) {
    tables.push({ table_type: 'Member Data', value: 'member_data', populated: true })
  } else {
    tables.push({ table_type: 'Member Data', value: 'member_data', populated: false })
  }
  if (quote.value.claimsExperienceCount > 0) {
    tables.push({ table_type: 'Claims Experience', value: 'claims_experience', populated: true })
  } else {
    tables.push({ table_type: 'Claims Experience', value: 'claims_experience', populated: false })
  }

  tables.push({
    table_type: 'Group Pricing Parameters',
    value: 'group_pricing_parameters',
    populated: true
  })

  tables.push({
    table_type: 'Member Rating Results',
    value: 'member_rating_results',
    populated: true
  })

  return tables
})

const openDialog = (item: any) => {
  console.log('Open Dialog:', item)
  selectedTable.value = item
  yearLabel.value = 'Select a year'
  uploadTitle.value = 'Upload Data for ' + item.table_type + ' Table (csv)'
  isDialogOpen.value = true
}

const handleUpload = async (payload: any) => {
  console.log('Handle Upload:', payload)
  const formdata = new FormData()
  formdata.append('file', payload.file)
  formdata.append('quote_id', quote.value.id)
  formdata.append('table_type', selectedTable.value.table_type)
  GroupPricingService.uploadQuoteTable(formdata)
    .then((res) => {
      console.log('Response:', res.data)
      const count = res.data
      snackbarText.value = 'Upload Successful'
      snackbar.value = true
      if (selectedTable.value.table_type === 'Member Data') {
        quote.value.memberDataCount = count
      } else if (selectedTable.value.table_type === 'Claims Experience') {
        quote.value.claimsExperienceCount = count
      }
    })
    .catch((error) => {
      console.log('Error:', error)
      snackbarText.value = 'Upload Failed'
      snackbar.value = true
    })

  // formdata.append('table_id', selectedTableId.value)
  // formdata.append('product_id', product.value.id)
  // formdata.append('product_code', product.value.product_code)
  // loading.value = true
  // PricingService.uploadProductPricingTable(formdata, product.value.id)
  //   .then(() => {
  //     // uploadSuccess.value = true
  //     loading.value = false
  //     updatePopulatedTables(selectedTableId.value)
  //   })
  //   .catch((err) => {
  //     console.log(err)

  //     // uploadSuccess = false
  //     loading.value = false
  //   })
}

onMounted(async () => {
  try {
    console.log('Group Life Assurance Pricing')
    console.log(props.id)
    const res = await GroupPricingService.getQuote(props.id)
    quote.value = res.data
    broker.value = quote.value.quoteBroker
    console.log('Broker:', quote.value)
    console.log(res)
  } catch (error) {
    console.log('Error:', error)
  }
})

const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
}

const dashIfEmpty = (value: any) => {
  return value || '-'
}

const goBack = () => {
  router.push({ name: 'group-pricing-quotes' })
}

const runQuoteCalculations = () => {
  console.log('Running Quote Calculations')
  GroupPricingService.runQuoteCalculations(quote.value.id)
    .then((res) => {
      console.log('Response:', res.data)
      snackbarText.value = 'Calculations Successful'
      snackbar.value = true
    })
    .catch((error) => {
      console.log('Error:', error)
      snackbarText.value = 'Calculations Failed'
      snackbar.value = true
    })
}

const deleteTable = async (item: any) => {
  console.log('Delete Table:', item)
  GroupPricingService.deleteQuoteTableData(quote.value.id, item.table_type).then((res) => {
    console.log('Response:', res.data)
    if (item.table_type === 'Member Data') {
      quote.value.memberDataCount = 0
    } else if (item.table_type === 'Claims Experience') {
      quote.value.claimsExperienceCount = 0
    }
    snackbarText.value = 'Table Deleted Successfully'
    snackbar.value = true
  })
}

const viewTable = async (item: any) => {
  try {
    console.log('View Table:', item)
    const res = await GroupPricingService.getQuoteTable(quote.value.id, item.value)
    console.log(res.data)
    if (res.data !== null && res.data.length > 0) {
      tableData.value = res.data
      selectedTable.value = item.table_type
      createColumnDefs(res.data)
    } else {
      tableData.value = []
      selectedTable.value = ''
      snackbarText.value = 'No data found for this table'
      snackbar.value = true
    }
  } catch (error) {
    console.log('Error:', error)
  }
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    header.sortable = true
    header.filter = true
    header.resizable = true
    columnDefs.value.push(header)
  })
}
</script>
<style lang="css" scoped>
.content-bg {
  background-color: #c1def7;
  padding-right: 10px;
}

.text-red {
  color: red;
}

.unpopulated {
  color: red;
}
</style>
