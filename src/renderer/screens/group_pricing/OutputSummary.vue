<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Group Life Assurance Rating Summary</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="3"><p>Scheme Name</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{ quote.scheme_name }}</p></v-col
              >
              <v-col cols="3"><p>Start Date</p></v-col>
              <v-col cols="3"
                ><p class="text-right content-bg">{{
                  parseDateString(quote.commencement_date)
                }}</p></v-col
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
            <v-divider class="my-5"></v-divider>
            <v-expansion-panels>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ glaBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9">
                      <v-col cols="3"
                        ><p><b>GLA SUM ASSURED</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Minimum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_gla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_gla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_gla_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_gla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_gla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_gla_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum FCL Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Total Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Average Covered Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>

                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Expected Number of Claims</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_gla_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_gla_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_gla_risk_rate))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_gla_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_gla_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_gla_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Unit Rate per 1000 Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.gla_risk_rate_per_1000_sa))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_gla_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_gla_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_gla_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_gla_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_gla_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_gla_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_gla_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_gla_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"
                        ><p>Unit Office Premium Rate per 1000 Covered Sum Assured</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.gla_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_gla_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_gla_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_gla_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_gla_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_gla_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ ptdBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9">
                      <v-col cols="3"
                        ><p><b>SUM ASSURED</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Minimum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ptd_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ptd_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ptd_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ptd_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ptd_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ptd_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum FCL Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Total Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_gla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Average Covered Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_ptd_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>

                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Expected Number of Claims</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_ptd_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_ptd_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_ptd_risk_rate))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ptd_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ptd_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ptd_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Unit Rate per 1000 Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.ptd_risk_rate_per_1000_sa))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ptd_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ptd_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_ptd_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ptd_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ptd_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ptd_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ptd_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ptd_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"
                        ><p>Unit Office Premium Rate per 1000 Covered Sum Assured</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.ptd_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ptd_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ptd_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_ptd_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ptd_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ptd_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ ciBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9">
                      <v-col cols="3"
                        ><p><b>SUM ASSURED</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Minimum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ci_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ci_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ci_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ci_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ci_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ci_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum FCL Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ci_capped_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ci_capped_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ci_capped_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Total Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ci_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ci_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ci_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Average Covered Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_ci_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_ci_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_ci_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>

                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Expected Number of Claims</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_ci_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_ci_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_ci_risk_rate))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ci_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ci_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ci_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Unit Rate per 1000 Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.ci_risk_rate_per_1000_sa))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ci_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ci_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_ci_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ci_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ci_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ci_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ci_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ci_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"
                        ><p>Unit Office Premium Rate per 1000 Covered Sum Assured</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.ci_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ci_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ci_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_ci_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ci_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ci_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ phiBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9">
                      <v-col cols="3"
                        ><p><b>Regular Income</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Minimum Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_phi_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_phi_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_phi_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_phi_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_phi_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_phi_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Capped Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_phi_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_phi_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_phi_capped_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Total Capped Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_phi_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_phi_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_phi_capped_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Average Covered Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.average_phi_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.average_phi_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.average_phi_capped_income))
                        }}</p></v-col
                      >
                    </v-row>

                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Expected Number of Claims</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_phi_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_phi_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_phi_risk_rate))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_phi_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_phi_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_phi_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Unit Rate per 1000 Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.phi_risk_rate_per_1000_sa))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_phi_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_phi_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_phi_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_phi_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_phi_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_phi_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_phi_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_phi_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"
                        ><p>Unit Office Premium Rate per 1000 Covered Sum Assured</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.phi_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_phi_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_phi_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_phi_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_phi_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_phi_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ ttdBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9">
                      <v-col cols="3"
                        ><p><b>Regular Income</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p> Minimum Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ttd_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ttd_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_ttd_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ttd_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ttd_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ttd_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Capped Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ttd_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ttd_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_ttd_capped_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Total Capped Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_ttd_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_ttd_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_ttd_capped_income))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Average Capped Income</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.average_ttd_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.average_ttd_capped_income))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.average_ttd_capped_income))
                        }}</p></v-col
                      >
                    </v-row>

                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Expected Number of Claims</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_ttd_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_ttd_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_ttd_risk_rate))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ttd_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ttd_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ttd_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Unit Rate per 1000 Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.ttd_risk_rate_per_1000_sa))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ttd_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ttd_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_ttd_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ttd_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ttd_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_ttd_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ttd_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_ttd_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"
                        ><p>Unit Office Premium Rate per 1000 Covered Sum Assured</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.ttd_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ttd_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_ttd_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_ttd_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ttd_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_ttd_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ sglaBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9">
                      <v-col cols="3"
                        ><p><b>SUM ASSURED</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Minimum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_sgla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_sgla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.min_sgla_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_sgla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_sgla_sum_assured))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.max_sgla_sum_assured))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Maximum FCL Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.max_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Total Capped Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Average Covered Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.average_sgla_capped_sum_assured)
                          )
                        }}</p></v-col
                      >
                    </v-row>

                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Expected Number of Claims</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.total_sgla_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_sgla_risk_rate))
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(roundUpToTwoDecimals(resultSummary.exp_total_sgla_risk_rate))
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_sgla_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_sgla_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_sgla_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Unit Rate per 1000 Sum Assured</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.sgla_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_sgla_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_sgla_risk_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_sgla_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_sgla_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_sgla_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_sgla_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_sgla_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_sgla_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"
                        ><p>Unit Office Premium Rate per 1000 Covered Sum Assured</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.sgla_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_sgla_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_sgla_office_rate_per_1000_sa)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_sgla_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_sgla_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_sgla_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel elevation="1" tile>
                <v-expansion-panel-title
                  ><v-row
                    ><v-col cols="4">
                      <p>{{ familyFuneralBenefitTitle }}</p>
                    </v-col>
                  </v-row></v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col cols="3"></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Theoretical Rate</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Experience Rated</p></v-col>
                      <v-col cols="3"><p class="text-center content-bg">Discounted</p></v-col>
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>RISK PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Risk Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_fun_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_fun_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_fun_annual_risk_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium per Member per Month</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_fun_annual_risk_premium / 12)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_total_fun_annual_risk_premium / 12
                            )
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_total_fun_annual_risk_premium / 12
                            )
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Risk Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_fun_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_fun_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_fun_annual_risk_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n9 mt-8">
                      <v-col cols="3"
                        ><p><b>OFFICE PREMIUM</b></p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Annual Office Premium</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_fun_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_fun_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.exp_total_fun_annual_office_premium)
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium per Member per Month</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(resultSummary.total_fun_annual_office_premium / 12)
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_total_fun_annual_office_premium / 12
                            )
                          )
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_total_fun_annual_office_premium / 12
                            )
                          )
                        }}</p></v-col
                      >
                    </v-row>
                    <v-row class="mb-n8">
                      <v-col cols="3"><p>Office Premium Premium as % of Annual Salary</p></v-col>
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.proportion_fun_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_fun_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                      <v-col cols="3"
                        ><p class="text-center content-bg">{{
                          dashIfEmpty(
                            roundUpToTwoDecimals(
                              resultSummary.exp_proportion_fun_office_premium_salary * 100
                            )
                          ) + '%'
                        }}</p></v-col
                      >
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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

const glaBenefitTitle = ref('Group Life Assurance (GLA)')
const sglaBenefitTitle = ref('Spouse Group Life Assurance (GLA)')
const ptdBenefitTitle = ref('Permanent Total Disability')
const ciBenefitTitle = ref('Critical Illness')
const phiBenefitTitle = ref('Personal Health Insurance')
const ttdBenefitTitle = ref('Temporary Total Disability')
const familyFuneralBenefitTitle = ref('Family Funeral')
const benefitMaps: any = ref([])

const props = defineProps({
  quote: {
    type: Object,
    default: () => ({})
  },
  resultSummary: {
    type: Object,
    default: () => ({})
  }
})

console.log('quoteData', props.quote)

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

const roundUpToTwoDecimals = (num) => {
  const roundedNum = Math.ceil(num * 100) / 100 // Round up to two decimal places
  return roundedNum
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    .replace(/,/g, ' ') // Replace commas with spaces for accounting format }
}

const dashIfEmpty = (value: any) => {
  return value || '-'
}

onMounted(async () => {
  GroupPricingService.getBenefitMaps().then((res) => {
    console.log('Output Summary:', res.data)
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
})
// onMounted(() => {
//   GroupPricingService.getBenefitMaps().then((response) => {

//  console.log(response)
// })
</script>
<style lang="css" scoped></style>
