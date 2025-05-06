export const groupPricing = [
  {
    data_variable: 'member_distribution_free_cover_limit',
    data_type: 'number',
    data_description:
      'The free cover limit is the maximum coverage an individual can receive without additional medical information or underwriting. It is calculated based on the underlying distribution of members’ sum assured.',
    data_source:
      'Min( (FreeCoverLimitScalingFactor ) * SQRT(NumberOfMembers) * AverageUncappedSumAssured,\n\t\t\t\t\t Percentile(MemberData,FreeCoverLimitPercentile) )',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'free_cover_limit',
    data_type: 'number',
    data_description:
      'Similar to the MemberDistributionFreeCoverLimit, this limit is calculated based on the statistical distribution of members sums assured within the scheme. It is subject to the lesser of the scheme’s overall free cover limit or a predefined floor, which may be applied to maintain pricing competitiveness and manage underwriting risk.',
    data_source:
      'Max (MemberDistributionFreeCoverLimit, MaxFreeCoverLimit )',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'commencement_date',
    data_type: 'number',
    data_description: 'The date on which the group risk cover starts',
    data_source: ' Group Quote',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'entry_date',
    data_type: 'number',
    data_description: 'The date on which a member entered the group scheme.',
    data_source: ' Original Member Data or Scheme Maintenance',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'exit_date',
    data_type: 'number',
    data_description: 'The date on which a member exits the group scheme.',
    data_source: ' Scheme Maintenance',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'education_level',
    data_type: 'number',
    data_description: 'Education Levels 1 - Pre-School, 2- Primary 3- Secondary 4 - Tertiary respectively',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_coverage_period',
    data_type: 'number',
    data_description: 'The number of years over which the education benefit is provided under each respective education level. This duration may vary by level (Pre-School, Primary, Secondary, Tertiary) and is defined according to the scheme’s terms and conditions. Ref. Group Pricing Educator Structure Table',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_tuition_per_year',
    data_type: 'number',
    data_description: 'The maximum educator benefit amount available per year under each respective education level. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_book_allowance_proportion',
    data_type: 'number',
    data_description: 'The maximum educator book allowance is calculated as a proportion of the respective education levels maximum tuition per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_book_allowance_amount',
    data_type: 'number',
    data_description: 'The maximum educator book allowance amount per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_book_allowance',
    data_type: 'number',
    data_description: 'The maximum educator book allowance per year is determined by the higher of the amount calculated from the MaxBookAllowanceProportion and the MaxBookAllowanceAmount. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: 'Max( MaxBookAllowanceAmount, MaxBookAllowanceProportion * MaxTuitionPerYear)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'max_accommodation_allowance_proportion',
    data_type: 'number',
    data_description: 'The maximum educator accommodation allowance is calculated as a proportion of the respective education levels maximum tuition per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_accommodation_allowance_amount',
    data_type: 'number',
    data_description: 'The maximum educator accommodation allowance amount per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_accommodation_allowance',
    data_type: 'number',
    data_description: 'The maximum educator accommodation allowance per year is determined by the higher of the amount calculated from the MaxAccommodationAllowanceProportion and the MaxAccommodationAllowanceAmount. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: 'Max( MaxAccomodationAllowanceAmount, MaxAccommodationAllowanceProportion * MaxTuitionPerYear)',
    data_source_type: 'Calculation Engine'
  }
]
