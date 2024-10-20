export const experienceAnalysis = [
  {
    data_variable: 'test_statistic_z',
    data_type: 'number',
    data_description:
      'statistical significance test on whether the lapse rates need adjustment or not. Assumes lapses are binomially distributed',
    data_source:
      '(ExpectedUx - ActualUx ) * SQRT(CentralExposure)/ SQRT( ActualUx * (1-ActualUx) )',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'central_exposure',
    data_type: 'number',
    data_description:
      'counts number of months a policy is exposed to lapse risk in a given year, classified by duration in force',
    data_source:
      'Sums DurationExposureInYearX for all Model Points; Maximum Duration sliced into duration clusters',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'period_start_date',
    data_type: 'number',
    data_description: 'investigation period start date',
    data_source: ' Run Settings',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'period_end_date',
    data_type: 'number',
    data_description: 'investigation period end date',
    data_source: ' Run Settings',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'date_at_start',
    data_type: 'number',
    data_description: 'date at which a policy enters the investigation period',
    data_source: ' MaxDate( CommencementDate, DateofBirth,PeriodStartDate)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'exit_date',
    data_type: 'number',
    data_description:
      'date at which a policy exits the investigation period because of a claim or lapse',
    data_source:
      ' IF DisabilityDate.Year != 1900 THEN\n\tExitDate = DisabilityDate\n\nIF ClaimsDate.Year !=1900 THEN\n\tExitDate = ClaimsDate\n\nIF ClaimsDate.Year = 1900 and DisabilityDate.Year = 1900 THEN\n\t ExitDate = LapseDate',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'date_at_end',
    data_type: 'number',
    data_description: 'date at which a policy exits the investigation period',
    data_source:
      ' IF ExitDate = 0 THEN\n\t MaxDate(DateAtStart,PeriodEndDate)\nELSE\n\tMinDate(ExitDate,PeriodEndDate)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_if_at_start',
    data_type: 'number',
    data_description:
      'duration inforce, in months, at the latter of the start of the investigation date or policy commencementdate within the investigation period',
    data_source: 'Max((DateAtStart - CommencementDate) * 12/365, 0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'duration_if_at_end',
    data_type: 'number',
    data_description: 'duration inforce, in months, at the exit during the investigation period.',
    data_source: 'Max((DateAtEnd - CommencementDate) * 12/365, 0)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'total_duration_exposure',
    data_type: 'number',
    data_description:
      'counts maximm number of months a policy is exposed to lapse risk in a given year',
    data_source: ' DurationIFAtExist - DurationIfAtStart',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'date_reaching_next_age',
    data_type: 'number',
    data_description: 'date at which a life assured reaches Age X+1',
    data_source:
      ' IF DateATStart.Month >= DateOfBirth.Month THEN\n\t date(DateAtStart.Year + 1, DateOfBirth.Month, DateOfBirth.Day)\nELSE\n\tdate(DateAtStart.Year, DateOfBirth.Month,DateOfBirth.Day)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'date_at_end_age_x',
    data_type: 'number',
    data_description: 'date at which a life assured exits age X during the investigation period',
    data_source:
      ' IF ExitDate = 0 THEN\n\t MinDate (DateReachingNextAge,PeriodEndDate)\nELSE\n\tMinDate(DateReachingNextAge,PeriodEndDate,ExitDate)',
    data_source_type: 'Calculation Engine'
  }
]
