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
    data_variable: 'free_cover_limit_scaling_factor',
    data_type: 'number',
    data_description:
      'Allows the free cover limit to be scaled appropriately based on the group size and the average sum assured, helping to balance risk while providing a coverage limit. The final free cover limit is constrained by the Percentile(MemberData, FreeCoverLimitPercentile), ensuring it stays within acceptable limits. Ref. MemeberDistributionFreeCoverLimit formula for details',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'free_cover_limit_percentile',
    data_type: 'number',
    data_description:
      'Refers to the percentile [0,1] applied to the MemberData (e.g., the sum assured or coverage amounts of the members) to determine the limit.It ensures that the free cover limit is not set too high, regardless of the scaling factor and other parameters. It accounts for the spread or distribution of member data, ensuring that the free cover limit reflects the overall group characteristics while avoiding overly generous limits that could pose higher risk.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'free_cover_limit_nearest_multiple',
    data_type: 'number',
    data_description:
      'A specified multiple to which the MemberDistributionFreeCoverLimit is rounded. This multiple may be a fixed amount—such as 10,000, 50,000, or 100,000—depending on the policy or applicable calculation rules.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'free_cover_limit',
    data_type: 'number',
    data_description:
      'Similar to the MemberDistributionFreeCoverLimit, this limit is calculated based on the statistical distribution of members sums assured within the scheme. It is subject to the lesser of the scheme’s overall free cover limit or a predefined floor, which may be applied to maintain pricing competitiveness and manage underwriting risk.',
    data_source: 'Max (MemberDistributionFreeCoverLimit, MaxFreeCoverLimit )',
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
    data_description:
      'Education Levels 1 - Pre-School, 2- Primary 3- Secondary 4 - Tertiary respectively',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_coverage_period',
    data_type: 'number',
    data_description:
      'The number of years over which the education benefit is provided under each respective education level. This duration may vary by level (Pre-School, Primary, Secondary, Tertiary) and is defined according to the scheme’s terms and conditions. Ref. Group Pricing Educator Structure Table',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_tuition_per_year',
    data_type: 'number',
    data_description:
      'The maximum educator benefit amount available per year under each respective education level. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_book_allowance_proportion',
    data_type: 'number',
    data_description:
      'The maximum educator book allowance is calculated as a proportion of the respective education levels maximum tuition per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_book_allowance_amount',
    data_type: 'number',
    data_description:
      'The maximum educator book allowance amount per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_book_allowance',
    data_type: 'number',
    data_description:
      'The maximum educator book allowance per year is determined by the higher of the amount calculated from the MaxBookAllowanceProportion and the MaxBookAllowanceAmount. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: 'Max( MaxBookAllowanceAmount, MaxBookAllowanceProportion * MaxTuitionPerYear)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'max_accommodation_allowance_proportion',
    data_type: 'number',
    data_description:
      'The maximum educator accommodation allowance is calculated as a proportion of the respective education levels maximum tuition per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_accommodation_allowance_amount',
    data_type: 'number',
    data_description:
      'The maximum educator accommodation allowance amount per year. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source: ' Group Pricing Educator Structure',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_accommodation_allowance',
    data_type: 'number',
    data_description:
      'The maximum educator accommodation allowance per year is determined by the higher of the amount calculated from the MaxAccommodationAllowanceProportion and the MaxAccommodationAllowanceAmount. For detailed information, please refer to the Group Pricing Educator Structure Table.',
    data_source:
      'Max( MaxAccomodationAllowanceAmount, MaxAccommodationAllowanceProportion * MaxTuitionPerYear)',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'spouse_age_gap',
    data_type: 'number',
    data_description:
      'Age gap between the main member and their spouse. Used to estimate the spouse`s age from the main member`s age, subject to min_age and max_age constraints',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'min_age',
    data_type: 'number',
    data_description:
      'Minimum age constraint used as a lower bound when estimating the spouse`s age.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'max_age',
    data_type: 'number',
    data_description:
      'Maximum age constraint used as an upper bound when estimating the spouse`s age.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'is_lumpsum_reins_gla_dependent',
    data_type: 'number',
    data_description:
      'Boolean variable indicating whether the ceded proportion of other lump sum components is based on the underlying GLA reinsurance cession ratios. A value of 1 indicates True; 0 indicates False.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'gla_terminal_illness_loading_rate',
    data_type: 'number',
    data_description:
      'A rate between 0 and 1 representing a proportional loading over the base GLA rate to reflect the additional terminal illness risk, if included under the GLA benefit configuration.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'premium_rates_guaranteed_period_months',
    data_type: 'number',
    data_description:
      'The number of months during which premium rates are guaranteed and cannot be subject to review.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'quote_validity_period_months',
    data_type: 'number',
    data_description:
      'Duration in months for which the quote remains valid, starting from the quote date',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'annual_expense_amount',
    data_type: 'number',
    data_description: 'Annual expense amount per member, in addition to the expense loading.',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'credibility_scaling_factor',
    data_type: 'number',
    data_description:
      'A factor used to scale credibility adjustments based on available data, which is fed into the downstream CredibilityRate calculation"',
    data_source: 'Group Pricing Parameter Table',
    data_source_type: 'User Input'
  },
  {
    data_variable: 'credibility_rate',
    data_type: 'number',
    data_description:
      'Number of months for which premium rates are guaranteed and cannot be reviewed.',
    data_source: 'Min( Sqrt( WeightedLifeYears/CredibilityScalingFactor ), 1 )',
    data_source_type: 'Calculation Engine'
  }
]
