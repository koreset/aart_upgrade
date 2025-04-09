export const groupPricing = [
  {
    data_variable: 'free_cover_limit',
    data_type: 'number',
    data_description:
      'The free cover limit is the maximum coverage an individual can receive without additional medical information or underwriting.',
    data_source:
      'Min( (FreeCoverLimitScalingFactor ) * SQRT(NumberOfMembers) * AverageUncappedSumAssured,\n\t\t\t\t\t Percentile(MemberData,FreeCoverLimitPercentile) )',
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
    data_description:
      'The date on which a member exits the group scheme.',
    data_source:
      ' Scheme Maintenance',
    data_source_type: 'User Input'
  },
]
