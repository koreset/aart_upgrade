export const pricingLibrary = [
  {
    data_variable: 'discounted_profit',
    data_type: 'number',
    data_description:
      'discounted expected profit at policy inception, assumes profit is earned at the end of a month',
    data_source:
      'ProfDiscountedPremium - ProfDiscountedDeath - ProfDiscountedAccidentalDeath\n\t\t\t - ProfDiscountedCommission + ProfDiscountedClaback\n\t\t\t\t\t - ProfDiscountedDisability - ProfDiscountedRetrenchment - ProfDiscountedRider\n\t\t\t\t\t\t\t - ProfDiscountedExpenses - ProfDiscountedChangeInReserve + ProfDiscountedInvestmentIncome',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'prof_discounted_premium',
    data_type: 'number',
    data_description: 'discounted expected earned premium income',
    data_source: '( PremiumIncome(t+1) + ProfDiscountedPremium(t+1) ) * discountFactor',
    data_source_type: 'Calculation Engine'
  },
  {
    data_variable: 'discounted_premium',
    data_type: 'number',
    data_description:
      'discounted expected premium income. Feeds into downstream reserve calculation. Assumes that premium is receipted in advance.',
    data_source: ' PremiumIncome(t+1) + ProfDiscountedPremium(t+1)* discountFactor',
    data_source_type: 'Calculation Engine'
  }
]
