<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Group Life Assurance Pricing</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="3"><p>Scheme Name</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.schemeName }}</p></v-col
              >
              <v-col cols="3"><p>Start Date</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.commencementDate }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Industry</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.industry }}</p></v-col
              >
              <v-col cols="3"><p>Renewal/New</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.quoteType }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Broker</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.quoteBroker }}</p></v-col
              >
              <v-col cols="3"><p>Voluntary/Compulsory</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.obligationType }}</p></v-col
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
                ><p class="text-right content-bg">{{ quote.expenseLoading }}</p></v-col
              >
              <v-col cols="3"><p>Commission Rate</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.commissionRate }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Profit Loading</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.profitLoading }}</p></v-col
              >
              <v-col cols="3"><p>Normal Retirement Age</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.normalRetirementAge }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Cover Termination Age</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.coverTerminationAge }}</p></v-col
              >
              <v-col cols="3"><p>Accelerated Benefit Discount</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.acceleratedBenefitDiscount }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Current Free Cover Limit</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.currentFcl }}</p></v-col
              >
              <v-col cols="3"><p>Experience Rating</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.claimsExperience }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Overall Premium Discount</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.overallPremiumDiscount }}</p></v-col
              >
              <v-col cols="3"><p>Occupation Class</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.occupationClass }}</p></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3"><p>Terminal Illness Benefit</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.terminalIllnessBenefit }}</p></v-col
              >
              <v-col cols="3"><p>Multiples of Salary</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.salaryMultiple }}</p></v-col
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
                    ><v-col cols="5"> <p>Spouse Group Life Assurance (GLA)</p> </v-col>
                    <v-checkbox
                      v-model:model-value="quote.sglaBenefit"
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
                      v-model:model-value="quote.ptdBenefit"
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
                      v-model:model-value="quote.ciBenefit"
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
                      v-model:model-value="quote.phiTtdBenefit"
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
                      ><p class="text-right content-bg">{{ quote.phi.productType }}</p></v-col
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
                      ><p class="text-right content-bg">{{
                        quote.phi.waitingPeriodMonths
                      }}</p></v-col
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
                      v-model:model-value="quote.familyFuneralBenefit"
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
                      <td :class="checkTableData(item)" style="width: 70%">{{
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
                          v-if="item.table_type !== 'Group Pricing Parameters'"
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="uploadTable(item)"
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
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import formatValues from '@/renderer/utils/format_values'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const columnDefs: any = ref([])
const rowCount: any = ref(0)

const snackbar = ref(false)
const timeout = 2000
const snackbarText = ref('')

const tableData = ref([])
const selectedTable = ref('')
const loadingData = ref(false)
const quote: any = ref({})
const broker = ref({})
const relatedTables = ref([
  { table_type: 'Member Data', value: 'member_data' },
  { table_type: 'Claims Experience', value: 'claims_experience' },
  { table_type: 'Group Pricing Parameters', value: 'group_pricing_parameters' },
  { table_type: 'Member Rating Results', value: 'member_rating_results' }
])

const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
}

const checkTableData = (item: any) => {
  if (item.table_type === selectedTable.value) {
    return 'bg-primary text-white'
  }
  return ''
}

const dashIfEmpty = (value: any) => {
  return value || '-'
}

const goBack = () => {
  router.push({ name: 'group-pricing-quotes' })
}

const uploadTable = async (item: any) => {
  console.log('Upload Table:', item)
}

const deleteTable = async (item: any) => {
  console.log('Delete Table:', item)
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
</script>
<style lang="css" scoped>
.content-bg {
  background-color: #c1def7;
  padding-right: 10px;
}
</style>
