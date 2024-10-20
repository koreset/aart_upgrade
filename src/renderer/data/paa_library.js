export const paaLibrary = [
  {
    data_variable: 'premium_receipt',
    data_type: 'number',
    data_description:
      'Expected premium receipt from the inforce policy, based on the contractual premium payment frequency.',
    data_source:
      'IF mp.Frequency = 0 \n\t IF ValuationMonth = 1 \n\t\t mp.AnnualPremium * InforcePolicyCountSM(t)\n\tELSE\n\t\t0\nELSE\n\tIF mod(ValuationMonth-1,12/mp.Frequency) = 0\n\t\tmp.AnnualPremium * InforcePolicyCountSM/mp.Frequency\n\tELSE\n\t\t0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'nb_premium_receipt ',
    data_type: 'number',
    data_description:
      'Expected premium receipt from a new business policy, based on the contractual premium payment frequency.',
    data_source:
      'IF mp.Frequency = 0 \n\t IF ValuationMonth = 1 \n\t\t mp.AnnualPremium * InforcePolicyCountSM(t)\n\tELSE\n\t\t0\nELSE\n\tIF mod(ValuationMonth-1,12/mp.Frequency) = 0\n\t\tmp.AnnualPremium * InforcePolicyCountSM/mp.Frequency\n\tELSE\n\t\t0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'earned_premium',
    data_type: 'number',
    data_description:
      'Premium earned, in line with either passage of time or specified premium earning pattern, at projection month t',
    data_source:
      'IF portfolio.PremiumEarningPattern = PassageofTime\n\tInforcePolicyCountSM * WrittenPremium/mp.TermMonths\nELSE\n\tInforcePolicyCountSM * WrittenPremium * RiskUnit(t)/SumRiskUnits(0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'written_premium',
    data_type: 'number',
    data_description:
      'Total premium expected from policy inception upto the contract boundary of the policy',
    data_source:
      'IF mp.Frequency = 0 \n\tmp.AnnualPremium\nELSE\n\tmp.AnnualPremium * mp.TermMonths/12',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'sum_risk_units',
    data_type: 'number',
    data_description:
      'Total risk units from policy duration 0 upto the contract boundary of the policy',
    data_source: 'For t:=0; t <= mp.TermMonths\n\t+=premiumearningpattern.RiskUnit(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'sum_covered_units',
    data_type: 'number',
    data_description: 'Total risk units covered in the respective current reporting period',
    data_source:
      'For t:= durationStartPeriod+1  ; t <= durationStartPeriod + CurrentPeriodDuration\n\t+=premiumearningpattern.RiskUnit(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'current_period_earned_premium',
    data_type: 'number',
    data_description:
      'Retrospective calculation: premium earned, either using passage of time or specified premium earning pattern, from the start to the end of the current reporting period.',
    data_source:
      'IF portfolio.PremiumEarningPattern = PassageofTime\n\t(WrittenPremium - AcquisitionCost) * CurrentPeriodDuration/mp.TermMonths\nELSE\n\t(WrittenPremium - AcquisitionCost) * SumCoveredUnits/SumRiskUnits',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'acquisition_cost',
    data_type: 'number',
    data_description: 'Acquisition cost',
    data_source: 'InitialExpenseOutgo + InitialCommissionOutgo',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'current_period_duration',
    data_type: 'number',
    data_description: 'Duration covered from the start to the end of the current reporting period',
    data_source: 'Min( Min( OutstandingTermAtStart, MonthIndex), mp.DurationInforceMonths)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'month_index',
    data_type: 'number',
    data_description:
      'Is the number of months from the company year end month to the valuation date',
    data_source:
      'IF ValuationMonth = YearEndMonth\n\t12\nELSE IF ValuationMonth < YearEndMonth\n\t12 -(YearEndMonth - ValuationMonth)\nELSE\n\tValuationMonth - YearEndMonth',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'outstanding_term_at_start',
    data_type: 'number',
    data_description: 'Outstanding term at the start of the current reporting period',
    data_source: 'mp.TermMonths - mp.DurationInforceMonths + MonthIndex',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_inforce_months',
    data_type: 'number',
    data_description:
      'Number of months calculated from policy inception to the current valuation date, inclusive. Can exceed contract boundary if the policy exists from the previous valuation period',
    data_source: 'mp.DurationInforceMonths',
    data_source_type: 'Model Point'
  },
  {
    data_variable: 'current_period_armotized_acquisition_cost',
    data_type: 'number',
    data_description:
      'Retrospective calculation: acquisition cost incurred, amortized using either passage of time or specified premium earning pattern, from the start to the end of the current reporting period.',
    data_source:
      'IF portfolio.PremiumEarningPattern = PassageofTime\n\t AcquisitionCost * CurrentPeriodDuration/mp.TermMonths\nELSE\n\t AcquisitionCost * SumCoveredUnits/SumRiskUnits',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'treaty1_current_period_earned_premium',
    data_type: 'number',
    data_description:
      'Retrospective calculation: treaty1 premium earned, either using passage of time or specified premium earning pattern, from the start to the end of the current reporting period.',
    data_source:
      '(CurrentPeriodEarnedPremium + CurrentPeriodAmortizedAcquisitionCost ) * Treaty1PremProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'treaty2_current_period_earned_premium',
    data_type: 'number',
    data_description:
      'Retrospective calculation: treaty2 premium earned, either using passage of time or specified premium earning pattern, from the start to the end of the current reporting period.',
    data_source:
      '(CurrentPeriodEarnedPremium + CurrentPeriodAmortizedAcquisitionCost ) * Treaty2PremProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'treaty3_current_period_earned_premium',
    data_type: 'number',
    data_description:
      'Retrospective calculation: treaty3 premium earned, either using passage of time or specified premium earning pattern, from the start to the end of the current reporting period.',
    data_source:
      '(CurrentPeriodEarnedPremium + CurrentPeriodAmortizedAcquisitionCost ) * Treaty3PremProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'claims_outgo',
    data_type: 'number',
    data_description: 'Expected claim payments over the projection period ',
    data_source: 'EarnedPremium(t) * ClaimsProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'claims_expense_outgo',
    data_type: 'number',
    data_description: 'Expected claim expenses over the projection period ',
    data_source: 'EarnedPremium(t) * ClaimsExpenseProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'treaty1_claims_outgo',
    data_type: 'number',
    data_description: 'Expected claim payments over the projection period allocated to treaty1',
    data_source: 'ClaimsOutgo(t) * ReinsuranceTreaty1ClaimsProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'treaty2_claims_outgo',
    data_type: 'number',
    data_description: 'Expected claim payments over the projection period allocated to treaty2',
    data_source: 'ClaimsOutgo(t) * ReinsuranceTreaty2ClaimsProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'treaty3_claims_outgo',
    data_type: 'number',
    data_description: 'Expected claim payments over the projection period allocated to treaty3',
    data_source: 'ClaimsOutgo(t) * ReinsuranceTreaty3ClaimsProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'initial_commission_outgo',
    data_type: 'number',
    data_description:
      'Expected initial commission outgo over the projection period allocated to treaty3',
    data_source: 'NbPremiumReceipt(t) * InitialYr1CommissionProportion + InitialCommissionAmount',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'initial_yr1_commission_proportion',
    data_type: 'number',
    data_description: 'Initial commission rate as a percentage of annual premium payable in year1',
    data_source: 'param.InitialYr1CommissionProportion',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'initial_commission_amount',
    data_type: 'number',
    data_description:
      'Initial commission amount that is payable before or at initial recognition date',
    data_source: 'param.InitialCommissionAmount',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'initial_expense_outgo',
    data_type: 'number',
    data_description: 'Initial expense outgo that is payable before or at initial recognition date',
    data_source: 'NbPremiumReceipt(t) * InitialExpenseProportion + InitialExpenseAmount',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'initial_expense_proportion',
    data_type: 'number',
    data_description: 'Initial expense rate as a percentage of annual premium',
    data_source: 'param.InitialExpenseProportion',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'initial_expense_amount',
    data_type: 'number',
    data_description:
      'Initial expense amount that is payable before or at initial recognition date',
    data_source: 'param.InitialExpenseAmount',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'renewal_commission_outgo',
    data_type: 'number',
    data_description:
      'Expected renewal commission payable as and when premium is receipted throughout the coverage period',
    data_source:
      'IF mp.Frequency != 0\n\tTotalPremiumReceipt(t) * RenewalCommissionProportion + RenewalAnnualCommissionAmount/mp.Frequency\nELSE\n\tTotalPremiumReceipt(t) * RenewalCommissionProportion + RenewalAnnualCommissionAmount',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'renewal_commission_proportion',
    data_type: 'number',
    data_description: 'Renewal commission rate as a percentage of premium receipt',
    data_source: 'param.RenewalCommissionProportion',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'renewal_commission_amount',
    data_type: 'number',
    data_description: 'Renewal commission amount that is payable as and when premium is receipted',
    data_source: 'param.RenewalCommissionAmount',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'maintenance_expense_outgo',
    data_type: 'number',
    data_description:
      'Expected maintenance expense outgo. The expense amount is incurred and payable monthly',
    data_source:
      ' EarnedPremium(t) * MaintenanceExpenseProportion + MaintenanceAnnualExpenseAmount/12',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'maintenance_expense_proportion',
    data_type: 'number',
    data_description: 'Maintenance expense rate as a percentage of earned premium',
    data_source: 'param.MaintenanceExpenseProportion',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'maintenance_annual_expense_amount',
    data_type: 'number',
    data_description:
      'Maintenance annual expense amount. The expense amount is incurred and payable monthly ',
    data_source: 'param.MaintenanceAnnualExpenseAmount',
    data_source_type: 'Parameter Table'
  },
  {
    data_variable: 'cash_out_flow',
    data_type: 'number',
    data_description: 'Sum of projected expected cash out flows',
    data_source:
      'ClaimsOutgo(t) + ClaimsExpenseOutgo(t) + MaintenanceExpenseOutgo(t) + InitialExpenseOutgo(t) +\n\t\t RenewalExpenseOutgo(t) + RenewalCommissionOutgo(t) + InitialCommissionOutgo(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'net_cash_flow',
    data_type: 'number',
    data_description: 'Expected cash outflow less cash inflow at each projection period',
    data_source: 'CashOutgo(t) - TotalPremiumReceipt(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'discounted_earned_premium',
    data_type: 'number',
    data_description: 'Discounted Earned Premium',
    data_source: '(DiscountedEarnedPremium(t+1) + EarnedPremium(t+1)) * DiscountFactor(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'DiscountedNetCashFlowsLockedin',
    data_type: 'number',
    data_description: 'Modified GMM Reserve',
    data_source:
      '(ClaimsOutgo(t+1) + ClaimsExpenseOutgo(t+1) + DiscountedNetCashflow(t+1) ) * DiscountFactor(t) +\n\t\t MaintenanceExpenseOutgo(t+1) + RenewalCommissionOutgo(t+1) + InitialCommission(t+1) + InitialExpenseOutgo(t+1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'risk_adjustment',
    data_type: 'number',
    data_description: 'Risk Adjustment',
    data_source: 'DiscountedEarnedPremium(t) * RiskAdjustmentProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'risk_adjustment_proportion',
    data_type: 'number',
    data_description: 'Risk adjustment proportion as a percentage of discounted earned premium',
    data_source: 'param.RiskAdjustmentProportion',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'discount_factor',
    data_type: 'number',
    data_description:
      'Discount factor that is used in the recursive formula to compute discounted cash flows',
    data_source: '(1 + forwardRate(t))^(-1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'initial_recognition_loss_component',
    data_type: 'number',
    data_description: 'Loss Component at Initial Recognition',
    data_source: 'Max(IrDiscountedNetCashFlowsLockedin + IrRiskAdjustment,0)',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'initial_recognition_reinsurance_claims',
    data_type: 'number',
    data_description: 'discounted reinsurance claims at initial recognition',
    data_source:
      'IrTreaty1DiscountedClaimsOutgo + IrTreaty2DiscountedClaimsOutgo + IrTreaty3DiscountedClaimsOutgo',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'initial_recognition_loss_recovery',
    data_type: 'number',
    data_description: 'initial recognition loss recovery',
    data_source:
      'InitialRecognitionLossComponent * (InitialREcognitionReinsuranceClaims / IrDiscountedClaimsOutgLockedin)',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'loss_component_unwind',
    data_type: 'number',
    data_description: 'loss component unwind in the current reporting period',
    data_source:
      'InitialRecognitionLossComponent * CurrentPeriodEarnedPremium/(SumFutureEarnedPremium + CurrentPeriodEarnedPremium)',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'loss_recovery_unwind',
    data_type: 'number',
    data_description: 'loss recovery unwind in the current reporting period',
    data_source:
      'InitialRecognitionLossRecoveryComponent * CurrentPeriodEarnedPremium/(SumFutureEarnedPremium + CurrentPeriodEarnedPremium)',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'paa_liability_for_remaining_coverage',
    data_type: 'number',
    data_description: 'Liability for remaining coverage',
    data_source:
      'PAALiabilityForRemainingCoverage(t-1) + totalPremimumIncome - AcqusitionCostPaid - CurrentPeriodEarnedPremium',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'allocated_reinsurance_premium',
    data_type: 'number',
    data_description: 'reinsurance premium allocated/earned in the current reporting period',
    data_source:
      'Treaty1CurrentPeriodEarnedPremium + Treaty2CurrentPeriodEarnedPeriod + Treaty3CurrentPeriodEarnedPremium',
    data_source_type: 'IFRS17 Engine'
  },
  {
    data_variable: 'reinsurance_treaty1_lrc',
    data_type: 'number',
    data_description: 'Liability for remaining coverage for treaty1',
    data_source:
      'ReinsuranceTreaty1LRC(t-1) + ReinsurancePremiumPaid  - AllocatedREinsurancePremiumPaid',
    data_source_type: 'IFRS17 Engine'
  }
]
