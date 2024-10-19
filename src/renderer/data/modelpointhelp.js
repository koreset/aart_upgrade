export const modelpointHelp = [
  {
    data_variable: 'Year',
    description:
      'This variable is used to differentiate parameters/assumptions and allows referencing by year. Parameter tables, Assumption tables, model point files and other non-static tables are tagged by year accordingly. The user is required to choose year from the drop down list, and assign it to the table before uploading it. The assigned year is used to reference or choose appropriate assumptions in setting up valuation runs. eg. AOS runs.',
    data_type: 'int',
    constraints: 'N/A',
    note: 'Relevant for non-static tables that are expected to change regularly e.g. assumption table.'
  },
  {
    data_variable: 'IFRS17Group',
    description:
      'The IFRS17 group is used as the calculation level in the IFRS17 engine. The variable forms part of a model point file. \nLast Letter of the IFRS17 group is used as profitability indicator. N - No Significant Probability of being Onerous, O - Onerous, R - Remaining',
    data_type: 'string',
    constraints: 'N/A',
    note: 'Cash flows are aggregated using the IFRS17 Group, in line with the IFRS17 standard. Fulfilment cash flows are then used in the IFRS17 engine to calculate CSM at the required LoA.'
  },
  {
    data_variable: 'ProductCode',
    description:
      'Unique code that is used to identify a product. The product code is used to read product specific assumptions or parameters.',
    data_type: 'string',
    constraints: 'N/A',
    note: 'Should be in line with product configuration.'
  },
  {
    data_variable: 'CommencementYear',
    description:
      'This is the year during which a contract between a life assured and an insurer commenced. This variable is more important in IFRS17 calculations. Commencement year is used to identify lockedin discount rates. For example, year is concatenated with the Commencement Month as the indentifier for the IFRS17 Lockedin Yield Curve.',
    data_type: 'int',
    constraints: 'N/A',
    note: 'The engine reads the yield curve using commencement year when running lockedin calculations. The commencement year and commencement month should have corresponding Yield Curve. E.g. 2020 Commencement Year should have a corresponding 2020&Month IFRS17 Yield Curve.'
  },
  {
    data_variable: 'CommencementMonth',
    description:
      'The month during which a contract between a life assured and an insurer commenced. Together with the commencement year, commencement month is used to identify lockedin discount rates. Month is concatenated with the Commencement Year as the indentifier for the IFRS17 Lockedin Yield Curve.',
    data_type: 'int',
    constraints: [1, 12],
    note: 'The engine reads the yield curve using commencement year when running lockedin calculations. The commencement year and commencement month should have corresponding Yield Curve. E.g. 2020 Commencement Year should have a corresponding 2020&Month IFRS17 Yield Curve.'
  },
  {
    data_variable: 'AgeAtEntry',
    description: "This is the Life assured's age at entry in years.",
    data_type: 'int',
    constraints: [0, 120],
    note: "Can be used as a rating factor in transition tables. Product specific restrictions for age at entry do apply e.g. [18 -65]. \nModel point's age at entry should comply with product restrictions."
  },
  {
    data_variable: 'Gender',
    description: 'Male or Female Input Variable. Or Characters "F" and "M" are also acceptable.',
    data_type: 'string',
    constraints: 'Male,Female\nM, F',
    note: 'Can be used as a rating factor in transition tables.'
  },
  {
    data_variable: 'MainMemberAgeAtEntry',
    description: "Main Member's age at entry in years.",
    data_type: 'int',
    constraints: [0, 120],
    note: "Can be used as a rating factor in transition tables. Product specific restrictions for age at entry do apply e.g. [18 -65]. \nModel point's age at entry should comply with product restrictions."
  },
  {
    data_variable: 'MainMemberGender',
    description:
      'Main Member\'s Gender. Male or Female Input Variable. Or Characters "F" and "M" are also acceptable.',
    data_type: 'string',
    constraints: 'Male, Female\nM, F',
    note: 'Can be used as a rating factor in transition tables.'
  },
  {
    data_variable: 'InitialPolicy',
    description:
      'Policy count as at the valuation date. Usually 1 is assigned unless model point weighting is assumed. The latter option being more relevant for pricing purposes.',
    data_type: 'int',
    constraints: [0, 1],
    note: 'Used as the initial policy count as at the valuation date.'
  },
  {
    data_variable: 'SumAssured',
    description: 'Payable Base Lump Sum Amount',
    data_type: 'float64',
    constraints: '[0, )',
    note: 'Used to compute expected benefit payout at each projection period. Triggered by a transition from one state to the next. Expected payout is calculated as SumAssured multiplied by the probability of transitioning from one state to the next.'
  },
  {
    data_variable: 'OriginalTerm',
    description:
      'Contractual term, as at the loan issue date, over which the loan is due for full repayment.',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used in the calculation of the instalment amount that is payable from the loan issue date'
  },
  {
    data_variable: 'OutstandingTerm',
    description: 'Outstanding term as at the valuation date.',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used to determine the projection term as at the valuation date.'
  },
  {
    data_variable: 'Interest_Percentage',
    description: 'Annual interest rate charged on the oustanding loan amount.',
    data_type: 'float64',
    constraints: [0, 100],
    note: 'Used to project outstanding sum assured/loan amount at each projection period.'
  },
  {
    data_variable: 'CurrentLoan',
    description: 'Outsrtanding loan as at the valuation date.',
    data_type: 'float64',
    constraints: '[0,  )',
    note: 'Used to project sum assured at each projection period.'
  },
  {
    data_variable: 'AnnualPremium',
    description:
      'Annualised base premium amount that is payable on a policy as at the valuation date. Premium escalations allowed for in a separate variable. Single Premium is stated as is.',
    data_type: 'float64',
    constraints: '[0,  )',
    note: 'Used in projection of premium income at each projection period.'
  },
  {
    data_variable: 'WaitingPeriod',
    description:
      'A period over which the insurance cover is limited according to terms and conditions e.g. only accidental risk may be covered during the Waiting Period.',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Only accidental death is covered during this period.'
  },
  {
    data_variable: 'DurationInForceMonths',
    description:
      'Number of months a policy has been in force, since inception date, as at the valuation date',
    data_type: 'int',
    constraints: '[0, )',
    note: 'One of the rating factors that can be used to read assumptions such as the lapse table.'
  },
  {
    data_variable: 'MemberType',
    description:
      "Assured's life relationship to the contracting party or main member on a policy.\nMM for a Main Member, SP for a Spouse, CH for a Child, PAR for a Parent, EXT for Extended Family",
    data_type: 'string',
    constraints: 'MM, SP\nCH, PAR\nEXT',
    note: 'Some benefits are member type specific e.g. there is a Child Sum Assured that is required for a funeral product.'
  },
  {
    data_variable: 'SumAssuredEscalation',
    description:
      'Escalation percentage that the sum assured is increased by on a specified period.',
    data_type: 'float64',
    constraints: [0, 100],
    note: 'Used in the projection of the sum assured at each projection period.'
  },
  {
    data_variable: 'SumAssuredEscalationPeriod',
    description:
      'Frequency in months over which the sum assured is increased by the SumAssuredEscalation percentage in a year.',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used in the projection of the sum assured to determine the frequency of the sum assured increase'
  },
  {
    data_variable: 'PremiumEscalation',
    description: 'Percentage that the premium is increased by on a specified period.',
    data_type: 'float64',
    constraints: [0, 100],
    note: 'Used in the projection of annual premium at each projection period.'
  },
  {
    data_variable: 'PremiumFrequency',
    description:
      'How often premiums are paid in a year. 0 for Single Premium, 1 for Annual Premium, 4 for premium payable quarterly, 12 for monthly premium',
    data_type: 'int',
    constraints: [0, 12],
    note: 'Used in the projection of premium income at the aggreed intervals.'
  },
  {
    data_variable: 'PremiumRate',
    description: 'Monthly premium rate per 1000 sum assured.',
    data_type: 'float64',
    constraints: '[0, )',
    note: 'Used in the calculation of annual premium. 12*(SumAssured/1000)*PremiumRate'
  },
  {
    data_variable: 'PaidupOption',
    description: 'Boolean paid up option. 1 if the option is chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to switch on and off paid up cover'
  },
  {
    data_variable: 'Term',
    description: 'Policy term in months.',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used in projecting cash flows within the specified term of the contract.'
  },
  {
    data_variable: 'PaidupIndicator',
    description:
      'Boolean paid up indicator. 1 if a policy is in the paid up state and 0 otherwise. Applicable if PaidupOption is 1.',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to switch on and off paid up benefits'
  },
  {
    data_variable: 'TemporaryPremiumWaiverIndicator',
    description:
      'Boolean temporary premium waiver indicator. 1 if temporary premium waiver is effective otherwise 0',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to switch on and off temporary premium waiver benefits'
  },
  {
    data_variable: 'TemporaryPremiumWaiverMonthExit',
    description: 'Number of months remaining for the temporary premium waiver',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used to project temporary premium waiver upto the effective period'
  },
  {
    data_variable: 'Plan',
    description: 'Benefit Plan Type. A,B, C, E….',
    data_type: 'string',
    constraints: 'A,B,C,D,E,F….',
    note: 'Plan Type in accordance with the sum assured table.'
  },
  {
    data_variable: 'ContinuityOrPremiumWaiverOption',
    description: 'Boolean paid up option. 1 if the option is chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to switch on and off premium waiver cover'
  },
  {
    data_variable: 'PremiumWaiverIndicator',
    description: 'Boolean premium waiver indicator. 1 if premium waiver is effective otherwise 0',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to switch on and off premium waiver benefits'
  },
  {
    data_variable: 'CommissionType',
    description:
      '1 for initial commission with clawback. Parameters are included in the parameter table. Clawback Table is also required. \n2 for renewal commission. Percentage of Premium Plus Renewal Rand Amount. Parameters are included in the parameter table.',
    data_type: 'int',
    constraints: '1,2',
    note: 'Used to select commission model to use in the projection of commission over the projection period.'
  },
  {
    data_variable: 'CashbackIndicator',
    description:
      'Boolean Cashback option. 1 if cashback option is chosen. Cashback on Survival and Cashback on Death parameters are included in the parameter table.',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the calculation accordingly'
  },
  {
    data_variable: 'Grocery',
    description: 'Boolean grocery income option. 1 if chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the code accordingly'
  },
  {
    data_variable: 'Repatriation',
    description: 'Boolean repatriation benefit option. 1 if chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the calculation accordingly'
  },
  {
    data_variable: 'Tombstone',
    description: 'Boolean tombstone benefit option. 1 if chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the calculation accordingly'
  },
  {
    data_variable: 'CowBenefit',
    description: 'Boolean cow benefit option. 1 if chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the calculation accordingly'
  },
  {
    data_variable: 'EducatorOption',
    description: 'Boolean education benefit option. 1 if chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the calculation accordingly'
  },
  {
    data_variable: 'FuneralServiceIndicator',
    description: 'Boolean additional benefit option. 1 if chosen and 0 otherwise',
    data_type: 'ConvertibleBoolean',
    constraints: '0,1',
    note: 'Used to indicate whether or not the benefit option is selected, and used to switch on and off the calculation accordingly'
  },
  {
    data_variable: 'PremiumHolidayUsed',
    description: 'Number of premium holidays used as at the valuation date',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used to track number of premium holidays claimed on a policy'
  },
  {
    data_variable: 'Income',
    description: 'Income rating class eg. 0 not applicable, 1 for less than 10000',
    data_type: 'int',
    constraints: [0, 1, 2, 3, 4, 5],
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration'
  },
  {
    data_variable: 'EducationLevel',
    description: 'Education level rating class eg. 1 for No Matric, 2, Matric etc.',
    data_type: 'int',
    constraints: [0, 1, 2, 3, 4, 5],
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration'
  },
  {
    data_variable: 'SocioEconomicClass',
    description: 's]Socio economic class, 0 for not applicable, 1 for low SEC etc',
    data_type: 'int',
    constraints: [0, 1, 2, 3, 4, 5],
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration'
  },
  {
    data_variable: 'OccupationalClass',
    description: 'Occupation rating class, 0 for no applicable, 1 for manual work etc.',
    data_type: 'int',
    constraints: [0, 1, 2, 3, 4, 5],
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration'
  },
  {
    data_variable: 'SmokerStatus',
    description: 'Smoking status of the life assured. "S" for a Smoker, "NS" for Non-Smoker',
    data_type: 'string',
    constraints: 'S\nNS',
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration'
  },
  {
    data_variable: 'SelectPeriod',
    description:
      'Rating factor: select period in years eg. 0 for not applicable, 1 for select year 1 etc',
    data_type: 'int',
    constraints: [0, 1, 2, 3],
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration'
  },
  {
    data_variable: 'DisabilityDefinition',
    description: 'Own occupation, any occupation etc',
    data_type: 'int',
    constraints: [1, 2, 3, 4, 5],
    note: 'Used as one of the rating factors in reading transition rate tables. Guided by product configuration.  Should be consistent with definitions included in the incidence rating table.'
  },
  {
    data_variable: 'DeferredPeriod',
    description:
      'Number of months a benefit payout is deferred by to assess the severity of the sickness. E.g. a period over which the severity of disability is assessed',
    data_type: 'int',
    constraints: '[0, )',
    note: 'Used in the projection of permanent disability cash flows. Benefit projection in line with the deferral period'
  },
  {
    data_variable: 'Weighting',
    description: 'Relevant for pricing. Policy weighting ratio within a portfolio of policies.',
    data_type: 'float64',
    constraints: [0, 1],
    note: 'Used in the calculation of the weighted average calculations. Relevant for \\Premium Breakdown Calculations.'
  }
]
