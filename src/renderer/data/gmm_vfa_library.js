export const gmmVfaLibrary = [
  {
    data_variable: 'projection_month',
    data_type: 'number',
    data_description:
      'Month counter from 0 to 1440. Where 0 is the valuation date and 1440 is the maximum projection period from the valuation date.',
    data_source: 'For i:=0 <= ProjectionRange; i++\n\t i',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'valuation_time_month',
    data_type: 'number',
    data_description:
      'Month counter at each ProjectionMonth, counted from policy commencement date.',
    data_source: 'ProjectionMonth(t) + mp.DurationInforceMonth',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'valuation_time_year',
    data_type: 'number',
    data_description:
      'Year counter at each ProjectionMonth, counted from policy commencement date.',
    data_source: 'ValuationTimeMonth/12',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'calendar_month',
    data_type: 'number',
    data_description: 'Corresponding calendar month at each projection month',
    data_source:
      'IF ProjectionMonth(t)  = 0\n\tValMonth\nELSE\n\tIF CalendarMonth(t-1) + 1 = 13\n\t\t 1\n\tELSE\n\t\t CalendarMonth(t-1) + 1',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'main_member_age_next_birthday',
    data_type: 'number',
    data_description:
      "Main Member's or Contract Party's age next birthday in Years at each ProjectionMonth.",
    data_source: ' mp.MainMemberAgeAtEntry + Roundup(ValuationTimeYear,0) ',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'age_next_birthday',
    data_type: 'number',
    data_description: "Life assured's age next birthday in years at each ProjectionMonth.",
    data_source: ' mp.AgeAtEntry + Roundup(ValuationTimeYear,0) ',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'accident_proportion',
    data_type: 'number',
    data_description: 'Proportion of the base mortality rate that arises from non-natural causes',
    data_source: ' read from Accidental Mortality Table ',
    data_source_type: 'Transition Rate Table'
  },
  {
    data_variable: 'inflation_factor',
    data_type: 'number',
    data_description: 'Cumulative inflation factor at each projection period from month 1',
    data_source:
      'IF ProjectionMonth = 0\n\t1\nELSE\n\tInflationFactor(t-1) * (1 + InflationRate)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'premium_escalation',
    data_type: 'number',
    data_description:
      'Stepped Annual Premium Escalation Factor. Annual Premium increasing on annual anniversary. Premium Escalation rate read from the Model Point File.',
    data_source:
      'IF ProjectionMonth = 0\n\t1\nELSE IF CalendarMonth(t) = mp.EscalationMonth\n\tPremiumEscalation(t-1) * (1 + mp.PremiumEscalation)\nELSE\n\tPremiumEscalation(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'sum_assured_escalation',
    data_type: 'number',
    data_description:
      'Stepped Sum Assured Escalation Factor. Sum Assured increasing on annual anniversary. Sum Assured Escalation rate read from the Model Point File.',
    data_source:
      'IF ProjectionMonth = 0\n\t1\nELSE IF CalendarMonth(t) = mp.EscalationMonth\n\tSumAssuredEscalation(t-1) * (1 + mp.SumAssuredEscalation)\nELSE\n\tSumAssuredEscalation(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'lapse_margin',
    data_type: 'number',
    data_description:
      'Lapse Margin reads from the Lapse Margin Table. The sign of the lapse margin is read as is from the table',
    data_source:
      'LapseMarginTable.Lapse Margin readby Rating Factors, LapseMarginYear & ProductCode',
    data_source_type: 'Lapse Margin Table'
  },
  {
    data_variable: 'main_member_mortality_rate',
    data_type: 'number',
    data_description:
      'Main Member Mortality Rate reads from the respecitve Transition Table(Health to Death). Includes both Natural and Accidental death rates. Reads by configured Rating Factors.',
    data_source:
      'IF MainMemberAgeNextBirthday > 120\n\t1\nELSE\n\tIF MortalityShock =1\n\t\tMin( MortalityRate(t) * (1 + Shocks.MultiplicativeMortality(t)) + Shocks.AdditiveMortality(t), 1)\n\tELSE\n\t\tMortalityRate(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'base_mortality_rate',
    data_type: 'number',
    data_description:
      'Mortality Rate reads from the respecitve Transition Table(Health to Death). Includes both Natural and Accidental death rates. Read by configured Rating Factors.',
    data_source:
      'IF AgeNextBirthday > 120\n\t1\nELSE\n\tIF MortalityShock =1\n\t\tMin(MortalityRate(t) * (1 + Shocks.MultiplicativeMortality(t)) + Shocks.AdditiveMortality(t), 1)\n\tELSE\n\t\tMortalityRate(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'base_lapse',
    data_type: 'number',
    data_description:
      'Annual Lapse Rate reads from the Transition Table(Health to Lapse). Reads by configured Rating Factors. Refer to Rating Factors tab.',
    data_source:
      'IF LapseShock =1\n\tMin(AnnualLapseRate(t) * (1 + Shocks.MultiplicativeLapse(t)) + Shocks.AdditiveLapse(t), 1)\nELSE\n\tAnnualLapseRate(t)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'contracting_party_alive_portion',
    data_type: 'number',
    data_description:
      "Projects Main Member's survival rate at each projection period, allowing for a lapse rate and main member's mortality rate. Probability that the main member is alive and the policy is active at each projection period.",
    data_source:
      "IF Features.LapseDependentCpDeath = 1\n\tIF MemberType !='MM'\n\t\tContractingPartyAlivePortion(t-1) * (1 - LapseRate)^(1/12) * (1 - MainMemberMortality)^(1/12)\n\tELSE\n\t\tContractingPartyAlivePortion(t-1) * (1- LapseRate)^(1/12)\nELSE\n\tContractingPartyAlivePortion(t-1) * (1- LapseRate)^(1/12)",
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'contracting_party_policy_lapse',
    data_type: 'number',
    data_description:
      'Monthly Lapse Rate calculated from Contracting PartyAlivePortion if applicable otherwise determined from the base Lapserate.',
    data_source:
      'IF Features.LapseDependentCpDeath = 1\n\t1-ContractingPartyAlivePortion(t)/ContractingPartyAlivePortion(t-1)\nELSE\n\t 1 - (1- LapseRate)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'base_independent_lapse',
    data_type: 'number',
    data_description: 'Annual Independent Base Lapse Rate ',
    data_source: ' (1-ContractingPartyPolicyLapse)^12',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'base_retrenchment_rate',
    data_type: 'number',
    data_description:
      'Annual Retrenchment Rate. Reads from the transition table associated with the transition path health to Retrenchment',
    data_source:
      'IF RetrenchmentShock = 1\n\tMin(RetrenchmentRate * (1 + Shocks.MultiplicativeRetrenchment) + Shocks.AdditiveRetrenchment,1)\nELSE\n\tRetrenchmentRate',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'base_disability_increment',
    data_type: 'number',
    data_description:
      'Annual Incidence Rate. Reads from the transition table associated with the transition path health to Permanent Disability',
    data_source:
      'IF MorbidityShock = 1\n\tMin(BaseDisabilityIncidence * (1 + Shocks.MultiplicativeMorbidity) + Shocks.AdditiveMorbidity,1)\nELSE\n\tDisabilityIncidence',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'main_member_mortality_rate_by_month',
    data_type: 'number',
    data_description: 'Conversion of the Independent Annual rate into independent monthly rate',
    data_source: '1-(1-MainMemberMortalityRate)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'independent_mortality_rate_mortality',
    data_type: 'number',
    data_description: 'Conversion of the Independent Annual rate into independent monthly rate',
    data_source: '1-(1-BaseMortalityRate)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'independent_lapse_monthly',
    data_type: 'number',
    data_description: 'Conversion of the Independent Annual rate into independent monthly rate',
    data_source: '1-(1-BaseIndependentLapse)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'indepedent_retrenchment_monthly',
    data_type: 'number',
    data_description: 'Conversion of the Independent Annual rate into independent monthly rate',
    data_source: '1-(1-BaseRetrenchmentRate)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'independent_disability_monthly',
    data_type: 'number',
    data_description: 'Conversion of the Independent Annual rate into independent monthly rate',
    data_source: '1-(1-BaseDisabilityIncrement)^(1/12)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'monthly_depedent_mortality',
    data_type: 'number',
    data_description:
      'Conversion of the monthly transition rate into monthly dependent transition rate',
    data_source:
      'IndependentMortalityRateMonthly*(1-TimingLapsezero*IndependentLapseMonthly)*_\n\t\t\t\t\t\t\t(1-TimingDisabilityhalf*IndependentDisabilityMonthly)*_\n\t\t\t\t\t\t\t(1-TimingRetrenchmentZero*IndependentRetrenchmentMonthly)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'monhtly_dependent_lapse',
    data_type: 'number',
    data_description:
      'Conversion of the monthly transition rate into monthly dependent transition rate',
    data_source:
      'IndependentLapseMonthly*(1-TimingMortalityOne*IndependentMortalityRateMonthly)*_\n\t\t\t\t\t\t\t(1-TimingDisabilityOne*IndependentDisabilityMonthly)*_\n\t\t\t\t\t\t\t(1-TimingRetrenchmentOne*IndependentRetrenchmentMonthly)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'monthly_dependent_retrenchment',
    data_type: 'number',
    data_description:
      'Conversion of the monthly transition rate into monthly dependent transition rate',
    data_source:
      'IndependentRetrenchmentMonthly*(1-TimingLapseZero*IndependentLapseMonthly)*_\n\t\t\t\t\t\t\t(1-TimingMortalityOne*IndependentMortalityRateMonthly)*_\n\t\t\t\t\t\t\t(1-TimingDisabilityOne*IndependentDisabilityMonthly)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'monthly_dependent_disability',
    data_type: 'number',
    data_description:
      'Conversion of the monthly transition rate into monthly dependent transition rate',
    data_source:
      'IndependentDisabilityMonthly*(1-TimingLapseZero*IndependentLapseMonthly)*_\n\t\t\t\t\t\t\t(1-TimingMortalityHalf*IndependentMortalityRateMonthly)*_\n\t\t\t\t\t\t\t(1-TimingRetrenchmentZero*IndependentRetrenchmentMonthly)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'initial_policy',
    data_type: 'number',
    data_description: 'Number of Policies in force(health state) at each projection period.',
    data_source:
      'startingInitialPolicy-NumberOfMaturities-NaturalDeathsInForce-_\n\t\t\t\tNumberOfAccidentDeaths-NumberOfLapses-NumberOfDisabilities-NumberOfRetrenchments',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'number_of_lapses',
    data_type: 'number',
    data_description: 'Computes cumulative number of lapses over the projection period.',
    data_source:
      'IF MainMemberAgeNextBirthday >= param.PaidupEffectiveAge && mp.PaidupOption OR  ValuationTimeMonth > Term\n\t NumberofLapses(t-1)\nELSE\n\t(InitialPolicy(t-1) - NumberofMaturities(t)) * MonthlyDependentLapse(t) + NumberofLapses(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'number_deaths_inforce',
    data_type: 'number',
    data_description: 'Computes cumulative number of deaths over the projection period.',
    data_source:
      'IF ValuationTimeMonth <= Term\n\t(InitialPolicy(t-1) - NumberofMaturities(t)) * MonthlyDependentMortality(t) * (1- AccidentProportion(t))_\n\t\t\t\t\t\t\t\t\t\t + NumberDeathsInForce(t-1)\nELSE\n\tNumberDeathsInForce(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'number_of_deaths_accident',
    data_type: 'number',
    data_description: 'Computes cumulative number of accident deaths over the projection period.',
    data_source:
      'IF ValuationTimeMonth <= Term\n\t(InitialPolicy(t-1) - NumberofMaturities(t)) * MonthlyDependentMortality(t) *  AccidentProportion(t)_\n\t\t\t\t\t\t\t\t\t\t + NumberOfAccidentDeaths(t-1)\nELSE\n\tNumberOfAccidentDeaths(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'number_of_disabilities',
    data_type: 'number',
    data_description:
      'Computes cumulative number of permanent disabilities over the projection period.',
    data_source:
      'IF ValuationTimeMonth <= Term\n\t(InitialPolicy(t-1) - NumberofMaturities(t)) * MonthlyDependentDisability(t) + NumberOfDisabilities(t-1)\nELSE\n\tNumberOfDisabilities(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'number_of_retrenchments',
    data_type: 'number',
    data_description: 'Computes cumulative number of retrenchments over the projection period.',
    data_source:
      'IF ValuationTimeMonth <= Term\n\t(InitialPolicy(t-1) - NumberofMaturities(t)) * MonthlyDependentRetrenchment(t) + NumberOfRetrenchment(t-1)\nELSE\n\tNumberOfRetrenchment(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'number_of_maturities',
    data_type: 'number',
    data_description: 'Computes cumulative number of maturities over the projection period.',
    data_source:
      'IF ValuationTimeMonth <= Term + 1\nIF Features.MaturityBenefitPattern\n\tIF Term + 1 - ValuationTimeMonth > MaximumNumberofBenefits\n\t\tNumberofMaturities(t-1)\n\tELSE\n\t\tIF NumberofMaturities(t-1) > 0\n\t\t\tNumberofMaturities(t-1)\n\t\tELSE\n\t\t\tIF GetMaturityRate(RemainingTermYear) > 0\n\t\t\t\tStartingInitialPolicy - NumberofMaturities(t-1) - NumberofDeathsInForce(t-1) - NumberofAccidentDeaths(t-1)\n\t\t\t\t - NumberofLapses(t-1) - NumberofDisabilities(t-1) - NumberofRetrenchments(t-1)\n\t\t\tELSE\n\t\t\t\t0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_incremental_natural_deaths',
    data_type: 'number',
    data_description: 'Computes incremental number of natural deaths over the projection period.',
    data_source:
      'IF ValuationTimeMonth > Term\n\t0\nELSE\n\tNaturalDeathsInForce(t) - NaturalDeathsInForce(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_incremental_disabilities',
    data_type: 'number',
    data_description: 'Computes incremental number of disabilities over the projection period.',
    data_source:
      'IF ValuationTimeMonth > Term\n\t0\nELSE\n\tNumberOfDisabilities(t) - NumberOfDisabilities(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_incremental_Retrenchments',
    data_type: 'number',
    data_description: 'Computes incremental number of retrenchments over the projection period.',
    data_source:
      'IF ValuationTimeMonth > Term\n\t0\nELSE\n\tNumberOfRetrenchments(t) - NumberOfRetrenchments(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_incremental_accidental_deaths',
    data_type: 'number',
    data_description:
      'Computes incremental number of accidental deaths over the projection period.',
    data_source:
      'IF ValuationTimeMonth > Term\n\t0\nELSE\n\tNumberOfAccidentDeaths(t) - NumberOfAccidentDeaths(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_incremental_lapses',
    data_type: 'number',
    data_description: 'Computes incremental number of lapses over the projection period.',
    data_source:
      'IF ValuationTimeMonth > Term\n\t0\nELSE\n\tNumberOfLapses(t) - NumberOfLapses(t-1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'outstanding_sum_assured',
    data_type: 'number',
    data_description:
      'Computes outstanding loan amount at each projection period 1) Prospective - OsProjPVMethod or 2) Retrosective.',
    data_source:
      'IF Features.OsProjPvMethod\n\tPV(mp.interest,mp.OutstandingTermMonths - ValuationTimeMonth(t),Instalment)\nELSE\n\tIF ProjectionMonth = 0\n\t\tmp.OutstandingLoan\n\tELSE\n\t\tOutstandingSumAssured(t-1) * (1 + mp.interest)^(1/12) - Instalment',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'sum_assured',
    data_type: 'number',
    data_description: 'Reads and projects sum assured applying sum assured escalation rate.',
    data_source:
      "IF MemberType ='CH'\n\tIF AgenNextBirthday <= ChildExitAge\n\t\tGetChildSumAssured(ProductCode,mp.Plan,AgeNextBirthday)\n\tELSE\n\t\t0\nELSE\n\tIF Features.SaOutstandingLoan\n\t\tOutstandingSumAssured(t)\n\tELSE IF Feautures.SaFixedBaseLumpSum\n\t\tmp.SumAssured * SumAssuredEscalation(t)\n\tELSE\n\t\t0",
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'rider_sum_assured',
    data_type: 'number',
    data_description: 'Reads and sums applicable rider sums assured from the rider table',
    data_source:
      "IF ValuationTimeMonth <= Term and Features.RiderBenefit\n\tIF MemberType ='CH'\n\t\tIF AgenNextBirthday <= ChildExitAge\n\t\t\tGetAdditionalSumAssured(ProductCode,mp.Plan,AgeNextBirthday)\n\t\tELSE\n\t\t\t0\n\tELSE\n\t\tIF Features.CreditLifeFuneralOption\n\t\t\tparams.RiderSumAssured + Min(Max(SumAssured * RiderFuneralSaProportion,RiderFuneralMinimumBeneift),RiderFuneralMaximumBenefit\n\t\tELSE GetRiderSumAssured(mp,Features)\nELSE\n\t0",
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'standard_additional_lump_sum',
    data_type: 'number',
    data_description: 'Reads additional sum assured',
    data_source:
      "IF ValuationTimeMonth <= Term and Features.StandardAdditionalLumpSum\n\tIF MemberType ='CH'\n\t\tIF AgenNextBirthday <= ChildExitAge\n\t\t\tStandardAdditionalSumAssured\n\t\tELSE\n\t\t\t0\n\tELSE\n\t\tStandardAdditionalSumAssuresd\nELSE\n\t0",
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'annuity_income',
    data_type: 'number',
    data_description: 'Projects annuity income using annuity escalation rate',
    data_source:
      'IF ValuationTimeMonth <= Term and Features.AnnuityIncome\n\tmp.AnnuityIncome * AnnuityEscalation(t)\nELSE\n\t0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'annuity_escalation',
    data_type: 'number',
    data_description:
      'Projects stepped annuity escalation using the specified annuity escalation calendar month',
    data_source:
      'IF ProjectionNonth = 0\n\t1\nELSE IF ValuationTimeMonth <= Term\n\tIF Features.AnnuityCalendarMonthEscalations\n\t\tIF CalendarMonth(t) = mp.AnnuityEscalationMonth\n\t\t\tAnnuityEscalation(t-1) * (1 + mp.AnnuityEscalationRate)\n\t\tELSE\n\t\t\tAnnuityEscalation(t-1)\n\tELSE\n\t\tIF Mod(ValuationTimeMonth-1,12) = 0 and ValuationTimeMonth > 1\n\t\t\tAnnuityEscalation(t-1) * (1 + mp.AnnuityEscalationRate)\n\t\tELSE\n\t\t\tAnnuityEscalation(t-1)\nELSE\n\t0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'investment_income',
    data_type: 'number',
    data_description:
      'Projects investment income expected to be earned from reserves,allowing for timing of cash flows',
    data_source:
      'IF ProjectionNonth = 0\n\t0\nELSE IF ValuationTimeMonth <= Term\n\t[ Reserve(t-1)- ( PremiumNotReceived + Commission + RenewalCommission + RenewalExpenses + \n\t\tEPremiumAdvisoryCost + EFundAdvisoryCost - \n\t\t\t\t(PremiumIncome -EAllocatedPremiumIncome) - EPolicyFee - \n\t\t\t\t\t\tEPremiumAdvisoryFee - EFundAdvisoryFee ) ] * ( (1 + ForwardRate)^(1/12)-1 )\nELSE 0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'profit_adjustment',
    data_type: 'number',
    data_description:
      'Projects profit adjustment to allow for expected policy renewals. This is applicable for 1 year contracts that are projected beyond 1 year.',
    data_source:
      'IF ProjectionNonth = 0\n\t0\nELSE IF ValuationTimeMonth <= Term\n\t (- NetCashFlow - ReserveChange + InvestmentIncome ) * ProfitAdjustment\nELSE 0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'profit',
    data_type: 'number',
    data_description: 'Projects profit expected to be earned at the end of each reporting period',
    data_source:
      'IF ProjectionNonth = 0\n\t0\nELSE IF ValuationTimeMonth <= Term\n\t - NetCashFlow - ReserveChange + InvestmentIncome + ProfitAdjustment\nELSE 0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'profit_adjusted',
    data_type: 'number',
    data_description: 'Projects profit expected to be earned at the end of each reporting period',
    data_source:
      'IF ProjectionNonth = 0\n\t0\nELSE IF ValuationTimeMonth <= Term\n\t - NetCashFlow - ReserveChangeA + InvestmentIncomeA + ProfitAdjustmentAdjusted\nELSE 0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'corporate_tax',
    data_type: 'number',
    data_description:
      'Projects oversimplified corporate tax calculated as a percentage of profit arising at the end of each projection period.',
    data_source:
      'IF ProjectionNonth = 0\n\t0\nELSE IF ValuationTimeMonth <= Term\n\t (- NetCashFlow - ReserveChange + InvestmentIncome + ProfitAdjustment ) * CorporateTaxRate\nELSE 0',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'vif',
    data_type: 'number',
    data_description:
      'Projects discounted expected future profit throughout the projection period.',
    data_source:
      'IF ValuationTimeMonth = Term\n\t0\nELSE  ( Profit(t+1) + VIF(t+1) ) * RiskDiscountRate',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'vif_adjusted',
    data_type: 'number',
    data_description:
      'Projects discounted expected future profit throughout the projection period.',
    data_source:
      'IF ValuationTimeMonth = Term\n\t0\nELSE  ( ProfitAdjusted(t+1) + VIFAdjusted(t+1) ) * RiskDiscountRate',
    data_source_type: 'Calculation Engine'
  }
]
