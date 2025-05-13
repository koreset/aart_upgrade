export const experienceAnalysis = [
  {
    data_variable: 'test_statistic_z',
    data_type: 'number',
    data_description:
      'A statistical significance test is performed to determine whether the lapse rates require adjustment. It is assumed that lapses follow a binomial distribution',
    data_source:
      '(ExpectedUx - ActualUx ) * SQRT(CentralExposure)/ SQRT( ActualUx * (1-ActualUx) )',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'central_exposure',
    data_type: 'number',
    data_description:
      'Captures the number of months a policy is exposed to lapse risk during a specific year, categorized by its duration in force.',
    data_source:
      'Sums the DurationExposureInYearX across all model points, with the maximum duration segmented into duration clusters',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'period_start_date',
    data_type: 'number',
    data_description: 'Start date of the investigation period',
    data_source: ' Run Settings',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'period_end_date',
    data_type: 'number',
    data_description: 'End date of the investigation period.',
    data_source: ' Run Settings',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'date_at_start',
    data_type: 'number',
    data_description: 'Entry date of the policy into the investigation period.',
    data_source: ' MaxDate( CommencementDate, DateofBirth,PeriodStartDate)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'exit_date',
    data_type: 'number',
    data_description:
      'Exit date of the policy from the investigation period, occurring due to a claim or lapse.',
    data_source:
      ' IF DisabilityDate.Year != 1900 THEN\n\tExitDate = DisabilityDate\n\nIF ClaimsDate.Year !=1900 THEN\n\tExitDate = ClaimsDate\n\nIF ClaimsDate.Year = 1900 and DisabilityDate.Year = 1900 THEN\n\t ExitDate = LapseDate',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'date_at_end',
    data_type: 'number',
    data_description: 'Exit date of the policy from the investigation period.',
    data_source:
      ' IF ExitDate = 0 THEN\n\t MaxDate(DateAtStart,PeriodEndDate)\nELSE\n\tMinDate(ExitDate,PeriodEndDate)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_if_at_start',
    data_type: 'number',
    data_description:
      'Duration in force, measured in months, at the later of the investigation period start date or the policy commencement date, within the investigation period.',
    data_source: 'Roundup(Yearfrac(DateAtStart,CommencementDate) * 12,0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_if_at_end',
    data_type: 'number',
    data_description: 'Duration in force, measured in months, at the point of exit during the investigation period.',
    data_source: 'Roundup(Yearfrac(DateAtEnd, CommencementDate) * 12,0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_if_at_end_y',
    data_type: 'number',
    data_description: 'Duration in force, measured in years, at the point of exit during the investigation period.',
    data_source: 'Roundup(DurationIFAtEnd/12,0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_duration_exposure',
    data_type: 'number',
    data_description:
      'Calculates the maximum number of months a policy is exposed to lapse risk during a given year.',
    data_source: ' DurationIFAtExist - DurationIfAtStart',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'date_reaching_next_age',
    data_type: 'number',
    data_description: 'The date on which the life assured reaches age X+1',
    data_source:
      ' IF DateATStart.Month >= DateOfBirth.Month THEN\n\t IF DateAtStart.Month == DateOfBirth.Month && DateATStart.Day <= DateOfBirth.Day\n\t\tdate(DateAtStart.Year, DateOfBirth.Month, DateOfBirth.Day)\n\t ELSE\n\t\t date(DateAtStart.Year + 1, DateOfBirth.Month, DateOfBirth.Day)\nELSE\n\tdate(DateAtStart.Year, DateOfBirth.Month,DateOfBirth.Day)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'date_at_end_age_x',
    data_type: 'number',
    data_description: 'The date on which the life assured exits age X during the investigation period.',
    data_source:
      ' IF ExitDate = 0 THEN\n\t MinDate (DateReachingNextAge,PeriodEndDate)\nELSE\n\tMinDate(DateReachingNextAge,PeriodEndDate,ExitDate)',
    data_source_type: 'Calculation Engine'
  },  {
    data_variable: 'age_at_start',
    data_type: 'number',
    data_description: 'Age as of the entry date into the investigation period.',
    data_source:
      ' Int(yearfrac(DateofBirth, DateAtStart)*12) + 1',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'age_at_exit',
    data_type: 'number',
    data_description: 'Age as of the exit date during the investigation period.',
    data_source:
      ' Int(yearfrac(DateofBirth, DateAtEnd)*12) + 1',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'max_duration',
    data_type: 'number',
    data_description: 'The maximum duration for which the policy was covered during the investigation period.',
    data_source:
      ' Roundup(yearfrac(DateAtStart, DateAtEnd)*12),0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'age_x_exposure',
    data_type: 'number',
    data_description: 'Number of months calculated as contributing to the exposure at age X',
    data_source:
      ' Roundup(yearfrac(DateAtStart, DateAtEndAgeX)*12),0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'age_next_exposure',
    data_type: 'number',
    data_description: 'Number of months calculated as contributing to the exposure at age X + 1',
    data_source:
      'MaxDuration - AgeXExposure',
    data_source_type: 'Calculation Engine'
  }, 
  {
    data_variable: 'amount_age_exposure',
    data_type: 'number',
    data_description: 'Exposure Amount calculated as contributing to the exposure at age X',
    data_source:
      'AgeXExposure * SumAssured',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'amount_age_next_exposure',
    data_type: 'number',
    data_description: 'Exposure Amount calculated as contributing to the exposure at age X + 1',
    data_source:
      'AgeNextExposure * SumAssured',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_claim_count_male',
    data_type: 'number',
    data_description: 'The expected number of claims occurring at age X within the investigation period, attributable to male lives.',
    data_source:
      'AgeXExposure * MortalityRateAtAgeX',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_claim_amount_male',
    data_type: 'number',
    data_description: 'The expected claim amount occurring at age X within the investigation period, attributable to male lives.',
    data_source:
      'AmountAgeXExposure * MortalityRateAtAgeX',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_claim_count_female',
    data_type: 'number',
    data_description: 'The expected number of claims occurring at age X within the investigation period, attributable to female lives.',
    data_source:
      'AgeXExposure * MortalityRateAtAgeX',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_claim_amount_female',
    data_type: 'number',
    data_description: 'The expected claim amount occurring at age X within the investigation period, attributable to female lives.',
    data_source:
      'AmountAgeXExposure * MortalityRateAtAgeX',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_age_next_claim_count_male',
    data_type: 'number',
    data_description: 'The expected number of claims occurring at age X + 1 within the investigation period, attributable to male lives.',
    data_source:
      'AgeNextExposure * MortalityRateAtNextAge',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_age_next_claim_amount_male',
    data_type: 'number',
    data_description: 'The expected claim amount occurring at age X + 1 within the investigation period, attributable to male lives.',
    data_source:
      'AmountAgeNextExposure * MortalityRateAtNextAge',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_age_next_claim_count_female',
    data_type: 'number',
    data_description: 'The expected number of claims occurring at age X + 1 within the investigation period, attributable to female lives.',
    data_source:
      'AgeNextExposure * MortalityRateAtNextAge',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'expected_age_next_claim_amount_female',
    data_type: 'number',
    data_description: 'The expected claim amount occurring at age X + 1 within the investigation period, attributable to female lives.',
    data_source:
      'expmp.AmountAgeNextExposure * MortalityRateAtNextAge',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'crude_rates_Lives',
    data_type: 'number',
    data_description: 'The ratio of number of deaths to the total person-time at risk (or population at risk) over a specified observation period',
    data_source:
      'Min(1-Exp(-ActualClaimCount/ExposureCount), 1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_in_year1',
    data_type: 'number',
    data_description: 'Number of months the policy spent in duration year 1 during the investigation period',
    data_source:
      'Min(Max(12-DurationIfAtStart, 0), TotalDurationExposure)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_in_year2',
    data_type: 'number',
    data_description: 'Number of months the policy spent in duration year 2 during the investigation period',
    data_source:
      'Min(Max(24-DurationIfAtStart-DurationInYear1, 0), TotalDurationExposure-DurationInYear1)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_in_year3',
    data_type: 'number',
    data_description: 'Number of months the policy spent in duration year 3 during the investigation period',
    data_source:
      'Min(Max(36-DurationIfAtStart-DurationInYear1_2, 0), TotalDurationExposure-DurationInYear1_2)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_in_year4',
    data_type: 'number',
    data_description: 'Number of months the policy spent in duration year 4 during the investigation period',
    data_source:
      'Min(Max(48-DurationIfAtStart-DurationInYear1,2_3, 0), TotalDurationExposure - DurationInYear1,2_3)',
    data_source_type: 'Calculation Engine'
  },  {
    data_variable: 'duration_in_year5+',
    data_type: 'number',
    data_description: 'Number of months the policy spent in duration year 5+ during the investigation period',
    data_source:
      'Max(TotalDurationExposure - DurationInYear1,2,3_4, 0)',
    data_source_type: 'Calculation Engine'
  }
]
