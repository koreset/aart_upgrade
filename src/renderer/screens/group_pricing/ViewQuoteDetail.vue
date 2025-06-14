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
              <v-col cols="3">
                <v-btn size="small" rounded color="primary" @click="goBack">Back</v-btn>
              </v-col>
              <v-col cols="9" class="text-right">
                <v-btn class="mr-3" size="small" rounded color="primary" @click="goBack"
                  >Edit</v-btn
                >
                <v-btn
                  v-if="quote.member_data_count > 0 && quote.claims_experience_count > 0"
                  class="mr-3"
                  size="small"
                  :loading="loading"
                  rounded
                  color="primary"
                  @click="basisDialog = true"
                  >Run Calculations</v-btn
                >

                <v-btn
                  class="mr-3"
                  size="small"
                  rounded
                  color="primary"
                  :disabled="quote.member_data_count === 0"
                  @click="approveQuote"
                  >Approve</v-btn
                >
                <v-btn
                  :disabled="quote.status === 'InForce' || quote.member_data_count === 0"
                  size="small"
                  rounded
                  color="primary"
                  @click="acceptQuote"
                  >Accept Quote</v-btn
                >
              </v-col>
            </v-row>
            <v-dialog v-model="basisDialog" persistent max-width="550px">
              <base-card>
                <template #header>
                  <span class="headline">Choose a parameter basis</span>
                </template>
                <template #default>
                  <v-row>
                    <v-col>
                      <v-select
                        v-model:model-value="quote.basis"
                        clearable
                        variant="outlined"
                        density="compact"
                        placeholder="Select a Basis"
                        label="Basis"
                        :items="parameterBases"
                        item-title="basis"
                        item-children="basis"
                      ></v-select>
                    </v-col>
                  </v-row>
                </template>
                <template #actions>
                  <v-spacer></v-spacer>
                  <v-btn rounded variant="text" @click="closeBasisDialog(true)">Ok</v-btn>
                  <v-btn rounded variant="text" @click="closeBasisDialog(false)">Cancel</v-btn>
                </template>
              </base-card>
            </v-dialog>
            <v-divider class="my-4"></v-divider>
            <base-card :show-actions="false">
              <template #header>
                <span class="headline">Quote Input Data</span>
              </template>
              <template #default>
                <v-container>
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
                      ><p class="text-right content-bg">{{
                        quote.loadings.expense_loading
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Commission Rate</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.loadings.commission_loading
                      }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Profit Loading</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.loadings.profit_loading
                      }}</p></v-col
                    >
                    <v-col cols="3"><p>Normal Retirement Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{ quote.normal_retirement_age }}</p></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="3"><p>Cover Termination Age</p></v-col>
                    <v-col cols="3"
                      ><p class="text-right content-bg">{{
                        quote.gla.cover_termination_age
                      }}</p></v-col
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
                  <h4>Benefits</h4>
                  <v-expansion-panels>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ glaBenefitTitle }}</p>
                          </v-col>
                        </v-row></v-expansion-panel-title
                      >
                      <v-expansion-panel-text>
                        <v-row>
                          <v-col cols="3"><p>Salary Multiple</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.gla.salary_multiple
                            }}</p></v-col
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
                            ><p class="text-right content-bg">{{
                              quote.gla.waiting_period
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ sglaBenefitTitle }}</p>
                          </v-col>
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
                              quote.sgla.cover_termination_age
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Maximum Benefit</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.sgla.max_benefit
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Sgla Salary Multiple</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.sgla.sgla_salary_multiple
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ ptdBenefitTitle }}</p>
                          </v-col>
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
                            ><p class="text-right content-bg">{{
                              quote.ptd.benefit_type
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Cover Termination Age</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ptd.cover_termination_age
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Deferred Period</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ptd.deferred_period
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Disability Definition</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ptd.disability_definition
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Risk Type</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{ quote.ptd.risk_type }}</p></v-col
                          >
                          <v-col cols="3"><p>Multiples of Salary</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ptd.salary_multiple
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ ciBenefitTitle }}</p>
                          </v-col>
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
                            ><p class="text-right content-bg">{{
                              quote.ci.benefit_structure
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Cover Termination Age</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              dashIfEmpty(quote.ci.cover_termination_age)
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Critical Illness Salary Multiple</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ci.critical_illness_salary_multiple
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ phiBenefitTitle }}</p>
                          </v-col>
                          <v-checkbox
                            v-model:model-value="quote.phi_benefit"
                            density="compact"
                            hide-details
                            readonly
                            disabled
                          ></v-checkbox> </v-row
                      ></v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-row>
                          <v-col cols="3"><p>Risk Type</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{ quote.phi.risk_type }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Cover Termination Age</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.cover_termination_age
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Deferred Period (Months)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.deferred_period
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Disability Definition</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.disability_definition
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Maximum Basic Benefit</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.maximum_benefit
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Maximum Premium Waiver</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.max_premium_waiver
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Income Replacement Percentage</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.income_replacement_percentage
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Number of Monthly Payments in a Year</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.number_monthly_payments
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>PHI Escalation (%)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.escalation_percentage
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Premium Waiver Benefit</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.premium_waiver
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Premium Waiver Percentage</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.premium_waiver_percentage
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Waiting Period (Months)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.phi.waiting_period
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ ttdBenefitTitle }}</p>
                          </v-col>
                          <v-checkbox
                            v-model:model-value="quote.ttd_benefit"
                            density="compact"
                            hide-details
                            readonly
                            disabled
                          ></v-checkbox> </v-row
                      ></v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-row>
                          <v-col cols="3"><p>Risk Type</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{ quote.ttd.risk_type }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Cover Termination Age</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.cover_termination_age
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Deferred Period (Months)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.deferred_period
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Disability Definition</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.disability_definition
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Maximum Basic Benefit</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.maximum_benefit
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Maximum Premium Waiver</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.max_premium_waiver
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Income Replacement Percentage</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.income_replacement_percentage
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Number of Monthly Payments in a Year</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.number_monthly_payments
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>PHI Escalation (%)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.escalation_percentage
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Premium Waiver Benefit</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.premium_waiver
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Premium Waiver Percentage</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.premium_waiver_percentage
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Waiting Period (Months)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.ttd.waiting_period
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="1" tile>
                      <v-expansion-panel-title
                        ><v-row
                          ><v-col cols="5">
                            <p>{{ familyFuneralBenefitTitle }}</p>
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
                              quote.family_funeral.main_member_funeral_sum_assured
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Sum Assured (Spouse)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.family_funeral.spouse_funeral_sum_assured
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Sum Assured (Children)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.family_funeral.children_funeral_sum_assured
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Sum Assured (Adult Dependants)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.family_funeral.adult_dependant_sum_assured
                            }}</p></v-col
                          >
                        </v-row>
                        <v-row>
                          <v-col cols="3"><p>Maximum Children Covered</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.family_funeral.max_children_covered
                            }}</p></v-col
                          >
                          <v-col cols="3"><p>Sum Assured (Parent)</p></v-col>
                          <v-col cols="3"
                            ><p class="text-right content-bg">{{
                              quote.family_funeral.parent_funeral_sum_assured
                            }}</p></v-col
                          >
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-divider class="my-4"></v-divider>
                  <h4>Quote Tables</h4>
                  <v-row>
                    <v-col>
                      <v-table>
                        <tbody>
                          <tr v-for="item in relatedTables" :key="item.table_type">
                            <td :class="{ unpopulated: !item.populated }" style="width: 60%">{{
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
                                  item.table_type !== 'Member Rating Results' &&
                                  item.table_type !== 'Member Premium Schedules'
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
                </v-container>
              </template>
            </base-card>

            <v-divider class="my-4"></v-divider>
            <base-card :show-actions="false">
              <template #header>
                <span class="headline">Quote Run Results</span>
              </template>
              <template #default>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-table>
                        <tbody>
                          <tr v-for="item in relatedResultTables" :key="item.table_type">
                            <td :class="{ unpopulated: !item.populated }" style="width: 60%">{{
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

                              <!-- <v-btn
                                v-if="
                                  item.table_type !== 'Group Pricing Parameters' &&
                                  item.table_type !== 'Member Rating Results' &&
                                  item.table_type !== 'Member Premium Schedules'
                                "
                                variant="outlined"
                                rounded
                                color="red"
                                size="small"
                                @click.stop="deleteTable(item)"
                              >
                                <v-icon left color="red">mdi-delete</v-icon>
                                <span>Delete</span>
                              </v-btn> -->
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                  </v-row>
                  <loading-indicator v-if="loadingData" class="my-3" />
                  <v-row v-if="resultTableData.length > 0 && !loadingData">
                    <v-col>
                      <group-pricing-data-grid
                        :columnDefs="columnDefs"
                        :show-close-button="true"
                        :rowData="resultTableData"
                        :table-title="selectedTable"
                        :pagination="true"
                        :rowCount="rowCount"
                        @update:clear-data="clearData"
                        @update-column="handleColumnUpdate"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <p v-if="displaySummary" class="text-right mb-n5"
                  ><v-btn variant="plain" @click="displaySummary = false">Close</v-btn></p
                >
                <output-summary
                  v-if="quote !== null && displaySummary"
                  :quote="quote"
                  :resultSummary="resultSummary"
                />
              </template>
            </base-card>

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
    <confirm-dialog ref="confirmAction" />
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { computed, onMounted, ref } from 'vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import formatValues from '@/renderer/utils/format_values'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import GroupPricingDataGrid from '@/renderer/components/tables/GroupPricingDataGrid.vue'
import { useRouter } from 'vue-router'
import FileUploadDialog from '@/renderer/components/FileUploadDialog.vue'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import OutputSummary from './OutputSummary.vue'
import _ from 'lodash'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

const confirmAction = ref()
const router = useRouter()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const glaBenefitTitle = ref('Group Life Assurance (GLA)')
const sglaBenefitTitle = ref('Spouse Group Life Assurance (GLA)')
const ptdBenefitTitle = ref('Permanent Total Disability')
const ciBenefitTitle = ref('Critical Illness')
const phiBenefitTitle = ref('Personal Health Insurance')
const ttdBenefitTitle = ref('Temporary Total Disability')
const familyFuneralBenefitTitle = ref('Family Funeral')
const benefitMaps: any = ref([])
const showModelPoint = ref(false)
const yearLabel = ref('') // 'Select a year'
const uploadTitle = ref('')
const mpLabel = ref('')
const isDialogOpen = ref(false)
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k))
const updateDialog = (value: boolean) => {
  isDialogOpen.value = value
}

const loading = ref(false)
const basisDialog = ref(false)
const columnDefs: any = ref([])
const rowCount: any = ref(0)
const parameterBases = ref([])
const resultSummary: any = ref([])
const displaySummary = ref(false)

const snackbar = ref(false)
const timeout = 2000
const snackbarText = ref('')

const tableData = ref([])
const resultTableData: any = ref([])
const selectedTable: any = ref(null)
const loadingData = ref(false)
const quote: any = ref(null)
const broker = ref(null)

const relatedResultTables = computed(() => {
  const tables: any = []

  if (quote.value.member_rating_result_count > 0) {
    tables.push({
      table_type: 'Member Rating Results',
      value: 'member_rating_results',
      populated: true
    })
  } else {
    tables.push({
      table_type: 'Member Rating Results',
      value: 'member_rating_results',
      populated: false
    })
  }

  if (quote.value.member_premium_schedule_count > 0) {
    tables.push({
      table_type: 'Member Premium Schedules',
      value: 'member_premium_schedules',
      populated: true
    })
  } else {
    tables.push({
      table_type: 'Member Premium Schedules',
      value: 'member_premium_schedules',
      populated: false
    })
  }

  if (quote.value.bordereaux_count > 0) {
    tables.push({
      table_type: 'Bordereaux',
      value: 'bordereaux',
      populated: true
    })
  } else {
    tables.push({
      table_type: 'Bordereaux',
      value: 'bordereaux',
      populated: false
    })
  }

  tables.push({
    table_type: 'Output Summary',
    value: 'output_summary',
    populated: true
  })

  return tables
})

const relatedTables = computed(() => {
  const tables: any = []
  if (quote.value.member_data_count > 0) {
    tables.push({ table_type: 'Member Data', value: 'member_data', populated: true })
  } else {
    tables.push({ table_type: 'Member Data', value: 'member_data', populated: false })
  }
  if (quote.value.claims_experience_count > 0) {
    tables.push({ table_type: 'Claims Experience', value: 'claims_experience', populated: true })
  } else {
    tables.push({ table_type: 'Claims Experience', value: 'claims_experience', populated: false })
  }

  tables.push({
    table_type: 'Group Pricing Parameters',
    value: 'group_pricing_parameters',
    populated: true
  })

  return tables
})

const openDialog = (item: any) => {
  selectedTable.value = item
  yearLabel.value = 'Select a year'
  uploadTitle.value = 'Upload Data for ' + item.table_type + ' Table (csv)'
  isDialogOpen.value = true
}

const closeBasisDialog = (value) => {
  if (value) {
    runQuoteCalculations()
  }
  basisDialog.value = false
}

const approveQuote = async () => {
  try {
    const res = await GroupPricingService.approveQuote(quote.value.id)
    console.log('Response:', res.data)
    snackbarText.value = 'Quote Approved Successfully'
    snackbar.value = true
  } catch (error) {
    console.log('Error:', error)
    snackbarText.value = 'Quote Approval Failed'
    snackbar.value = true
  }
}

const acceptQuote = async () => {
  try {
    const res = await GroupPricingService.acceptQuote(quote.value.id)
    console.log('Response:', res.data)
    snackbarText.value = 'Quote Accepted Successfully'
    snackbar.value = true
  } catch (error: any) {
    console.log('Error:', error.data)
    snackbarText.value = 'Quote Acceptance Failed'
    snackbar.value = true
  }
}

const handleUpload = async (payload: any) => {
  const formdata = new FormData()
  formdata.append('file', payload.file)
  formdata.append('quote_id', quote.value.id)
  formdata.append('table_type', selectedTable.value.table_type)
  GroupPricingService.uploadQuoteTable(formdata)
    .then((res) => {
      const count = res.data
      snackbarText.value = 'Upload Successful'
      snackbar.value = true
      if (selectedTable.value.table_type === 'Member Data') {
        quote.value.member_data_count = count
      } else if (selectedTable.value.table_type === 'Claims Experience') {
        quote.value.claims_experience_count = count
      } else if (selectedTable.value.table_type === 'Member Rating Results') {
        quote.value.member_rating_result_count = count
      } else if (selectedTable.value.table_type === 'Member Premium Schedules') {
        quote.value.member_premium_schedule_count = count
      }
    })
    .catch((error) => {
      console.log('Error:', error)
      snackbarText.value = 'Upload Failed'
      snackbar.value = true
    })
}

onMounted(async () => {
  GroupPricingService.getBenefitMaps().then((res) => {
    benefitMaps.value = res.data
    const glaBenefit = benefitMaps.value.find((item) => item.benefit_code === 'GLA')
    if (glaBenefit.benefit_alias !== '') {
      glaBenefitTitle.value = glaBenefit.benefit_alias
    }
    const sglaBenefit = benefitMaps.value.find((item) => item.benefit_code === 'SGLA')
    if (sglaBenefit.benefit_alias !== '') {
      sglaBenefitTitle.value = sglaBenefit.benefit_alias
    }
    const ptdBenefit = benefitMaps.value.find((item) => item.benefit_code === 'PTD')
    if (ptdBenefit.benefit_alias !== '') {
      ptdBenefitTitle.value = ptdBenefit.benefit_alias
    }
    const ciBenefit = benefitMaps.value.find((item) => item.benefit_code === 'CI')
    if (ciBenefit.benefit_alias !== '') {
      ciBenefitTitle.value = ciBenefit.benefit_alias
    }
    const phiBenefit = benefitMaps.value.find((item) => item.benefit_code === 'PHI')
    if (phiBenefit.benefit_alias !== '') {
      phiBenefitTitle.value = phiBenefit.benefit_alias
    }
    const ttdBenefit = benefitMaps.value.find((item) => item.benefit_code === 'TTD')
    if (ttdBenefit.benefit_alias !== '') {
      ttdBenefitTitle.value = ttdBenefit.benefit_alias
    }
    const familyFuneralBenefit = benefitMaps.value.find((item) => item.benefit_code === 'GFF')
    if (familyFuneralBenefit.benefit_alias !== '') {
      familyFuneralBenefitTitle.value = familyFuneralBenefit.benefit_alias
    }
  })
  loadQuote()
})

const loadQuote = async () => {
  try {
    const res = await GroupPricingService.getQuote(props.id)
    quote.value = res.data
    broker.value = quote.value.quoteBroker

    const res1 = await GroupPricingService.getQuoteTable(quote.value.id, 'group_pricing_parameters')

    if (res1.data !== null && res1.data.data.length > 0) {
      parameterBases.value = res1.data.data.map((item: any) => {
        return {
          basis: item.basis
        }
      })
    }
    GroupPricingService.getResultSummary(props.id).then((res) => {
      resultSummary.value = res.data
    })
  } catch (error) {
    console.log('Error:', error)
  }
}

const clearData = () => {
  tableData.value = []
  resultTableData.value = []
  selectedTable.value = ''
}

const handleColumnUpdate = async ({ colId, newValue }: { colId: string; newValue: any }) => {
  console.log('Column Update:', colId, newValue)
  // const manualAddedCredibility: any = 'manual_added_credibility'
  // const updatedData = resultTableData.value.map((row) => {
  //   // Return a new object for each row to ensure reactivity
  //   return {
  //     ...row,
  //     [manualAddedCredibility]: newValue // Example of updating another column
  //   }
  // })

  // // Update the application's state.
  // // Vue's reactivity will pass the new data down to YourGridComponent via the prop.
  // resultTableData.value = updatedData

  if (colId === 'manually_added_credibility') {
    const resp = await GroupPricingService.runQuoteCalculationsWithCredibility(
      quote.value.id,
      quote.value.basis,
      newValue
    )
    console.log('Response:', resp.data)
    snackbarText.value = 'Exp Credibility Updated Successfully'
    snackbar.value = true
  }
}

const dashIfEmpty = (value: any) => {
  return value || '-'
}

const goBack = () => {
  router.push({ name: 'group-pricing-quotes' })
}

const runQuoteCalculations = async () => {
  if (quote.value.basis !== null && quote.value.basis !== '') {
    console.log('Running Quote Calculations')
    loading.value = true
    try {
      const res = await GroupPricingService.runQuoteCalculations(quote.value.id, quote.value.basis)
      if (res.status === 201) {
        console.log('Response:', res.data)
        snackbarText.value = 'Calculations Successful'
        snackbar.value = true
      }
      loading.value = false
      loadQuote()
    } catch (error) {
      console.log('Error:', error)
      snackbarText.value = 'Calculations Failed'
      snackbar.value = true
      loading.value = false
    }
  } else {
    snackbarText.value = 'Please select a basis'
    snackbar.value = true
  }
}

const deleteTable = async (item: any) => {
  try {
    console.log('Delete Table:', item)
    const result = await confirmAction.value.open(
      'Deleting Data for ' + item.table_type + ' table',
      'Are you sure you want to delete this data?'
    )

    if (!result) {
      return
    }

    GroupPricingService.deleteQuoteTableData(quote.value.id, item.table_type).then((res) => {
      console.log('Response:', res.data)
      if (item.table_type === 'Member Data') {
        quote.value.member_data_count = 0
      } else if (item.table_type === 'Claims Experience') {
        quote.value.claims_experience_count = 0
      }
      snackbarText.value = 'Table Deleted Successfully'
      snackbar.value = true
    })
  } catch (error) {
    console.log('Error:', error)
  }
}

const viewTable = async (item: any) => {
  // special case for output summary
  loadingData.value = true
  if (item.table_type === 'Output Summary') {
    resultTableData.value = []
    displaySummary.value = true
    return
  }
  try {
    const res = await GroupPricingService.getQuoteTable(quote.value.id, item.value)
    if (res.data.data !== null && res.data.data.length > 0) {
      const orderedData = res.data.data.map((item) =>
        _.fromPairs(res.data.json_tags.map((key) => [key, item[key]]))
      )

      console.log('Item Value:', item.value)
      displaySummary.value = false

      if (
        item.value === 'member_rating_results' ||
        item.value === 'member_premium_schedules' ||
        item.value === 'bordereaux'
      ) {
        resultTableData.value = orderedData
      } else {
        tableData.value = orderedData
      }

      selectedTable.value = item.table_type
      createColumnDefs(orderedData)
      loadingData.value = false
    } else {
      tableData.value = []
      resultTableData.value = []
      selectedTable.value = ''
      snackbarText.value = 'No data found for this table'
      snackbar.value = true
    }
  } catch (error) {
    console.log('Error:', error)
  }
}

const replaceSubstring = (input, search, replacement) => {
  if (input.includes(search)) {
    benefitMaps.value.forEach((item) => {
      if (item.benefit_code.toLowerCase() === search && item.benefit_alias_code !== '') {
        input = input.replace(search, item.benefit_alias_code.toLowerCase())
      }
    })
    // return input
  }
  return input
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const column: any = {}
    if (element.includes('ci')) {
      column.headerName = replaceSubstring(element, 'ci', 'severe')
    } else if (element.includes('phi')) {
      column.headerName = replaceSubstring(element, 'phi', 'phi2')
    } else if (element.includes('gla')) {
      column.headerName = replaceSubstring(element, 'gla', 'gla2')
    } else if (element.includes('sgla')) {
      column.headerName = replaceSubstring(element, 'sgla', 'sgla2')
    } else if (element.includes('ptd')) {
      column.headerName = replaceSubstring(element, 'ptd', 'ptd2')
    } else if (element.includes('ttd')) {
      column.headerName = replaceSubstring(element, 'ttd', 'ttd2')
    } else if (element.includes('gff')) {
      column.headerName = replaceSubstring(element, 'gff', 'gff2')
    } else {
      column.headerName = element
    }

    // header.headerName = element
    column.field = element
    column.valueFormatter = formatValues
    column.minWidth = 200
    column.sortable = true
    column.filter = true
    column.resizable = true
    if (column.field === 'id' || column.field === 'quote_id') {
      column.hide = true
    }
    // if column.field is exp_credibility, then set it to editable
    if (column.field === 'manually_added_credibility') {
      column.editable = true
    } else {
      column.editable = false
    }
    columnDefs.value.push(column)
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
