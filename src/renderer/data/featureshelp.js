export const featuresHelp = [
  {
    "benefit_feature": "FUNERAL_COVER",
    "note": "Required for configuration of a funeral product",
    "Dependency on Product Features": "",
    "description": "Identifies funeral products. Mandatory for funeral products.",
    "product_association": "Funeral",
    "associated_required_tables": "Child Sum Assured Table\nChild Additional Sum Assured"
  },
  {
    "benefit_feature": "PREMIUM_HOLIDAY",
    "note": "Premium holiday benefit",
    "Dependency on Product Features": "",
    "description": "Premium holiday benefit. Allows a policyholder to skip premium payments subject to limits/restrictions on the timing.   E.g every December or every 12th Premium",
    "product_association": "All",
    "associated_required_tables": "Parameters"
  },
  {
    "benefit_feature": "WHOLE_OF_LIFE",
    "note": "Whole of Life",
    "Dependency on Product Features": "",
    "description": "These are products that provide cover until death from inception date. Otherwise cover is provided over a given term.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "SA_FIXED_BASE_LUMP_SUM",
    "note": "Fixed Base Lump Sum. Read from a model point file as Sum Assured",
    "Dependency on Product Features": "",
    "description": "Base Sum Assured. Must be selected for the fixed base sum assuered. Sum Assured is read from the model point file.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "STANDARD_ADDITIONAL_LUMP_SUM",
    "note": "Standard lump sum payable over and above the base lump sum on death of the life assured.",
    "Dependency on Product Features": "",
    "description": "Additional lump sum cover",
    "product_association": "All",
    "associated_required_tables": "Parameters"
  },
  {
    "benefit_feature": "RIDER_BENEFIT",
    "note": "OPTIONAL benefit(s) payable over and above the base SA.Rider table required",
    "Dependency on Product Features": "",
    "description": "Optional benefits that may be added to a policy to supplement/compliment the base benefit.",
    "product_association": "All",
    "associated_required_tables": "Riders"
  },
  {
    "benefit_feature": "ACCIDENTAL_DEATH_BENEFIT",
    "note": "Funeral: A multiple of the base SA is payable in the event of the accidental death",
    "Dependency on Product Features": "",
    "description": "Accidental death benefit is payable on a product.",
    "product_association": "All",
    "associated_required_tables": "Accident Benefit Multiplier"
  },
  {
    "benefit_feature": "LAPSE_DEPENDENT_ON_CP_DEATH",
    "note": "Funeral: A policy lapse dependent on the contract party's death",
    "Dependency on Product Features": "",
    "description": "Indicates an increase of the lapse rate by the main member's expected mortality rate. This is applicable for a funeral product.",
    "product_association": "Funeral",
    "associated_required_tables": "None"
  },
  {
    "benefit_feature": "CASH_BACK_SURVIVAL",
    "note": "Return of proportion of premiums on survival",
    "Dependency on Product Features": "",
    "description": "Cashback benefit is payable on survival to the end of the policy term.",
    "product_association": "All",
    "associated_required_tables": "Parameters"
  },
  {
    "benefit_feature": "CASH_BACK_ON_DEATH",
    "note": "Return of proportion of premiums on death",
    "Dependency on Product Features": "",
    "description": "Cashback benefit is payable upon death of the life assured. Cashback parameters are included in the parameter table.",
    "product_association": "All",
    "associated_required_tables": "Parameters"
  },
  {
    "benefit_feature": "DEATH_BENEFIT",
    "note": "Natural Death Lump Sum benefit if Accidental Death Benefit is selected otherwise the Lump Sum benefit is payable on both Natural and Accidental deaths",
    "Dependency on Product Features": "",
    "description": "Death Benefit is payable on the death of the life assured.",
    "product_association": "All",
    "associated_required_tables": "Sum Assured: Model Point File"
  },
  {
    "benefit_feature": "CREDIT_LIFE",
    "note": "Required for configuration of a credit Life product",
    "Dependency on Product Features": "",
    "description": "Used to identify credit life products. Must be chosen for credit life products.",
    "product_association": "Credit Life",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "SA_OUTSTANDING_LOAN",
    "note": "Outstanding Loan Amount as Sum Assured",
    "Dependency on Product Features": "CREDIT_LIFE",
    "description": "Sum Assured is projected as the outstanding loan amount over the projection period.",
    "product_association": "Credit Life",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "CREDIT_LIFE_FLAT_PREMIUM",
    "note": "Credit Life: Premium as a percentage of the Original Loan Amount",
    "Dependency on Product Features": "CREDIT_LIFE",
    "description": "Credit Life Premium Pattern. Premium is calculated as a percentage of the original loan amount.",
    "product_association": "Credit Life",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "CREDIT_LIFE_DECREASING_PREMIUM",
    "note": "Credit Life: Premium as a percentage of the Outstanding Loan Amount",
    "Dependency on Product Features": "CREDIT_LIFE",
    "description": "Credit Life Premium Pattern. Premium decreases in line with the reducing outstanding loan amount. Premium is expressed as a percentage of the outstanding loan amount.",
    "product_association": "Credit Life",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "OS_PROJ_PV_METHOD",
    "note": "Credit Life: First Principle projection of the O/S Amount. Else provided amounts used for projection of Oustanding Sum Assured",
    "Dependency on Product Features": "CREDIT_LIFE",
    "description": "This variable is used as an indicator to calculate and project outstanding sum assured over the projection period.",
    "product_association": "Credit Life",
    "associated_required_tables": "Parameters"
  },
  {
    "benefit_feature": "RETRENCHMENT_BENEFIT",
    "note": "Benefit payable on retrenchment",
    "Dependency on Product Features": "",
    "description": "This feature indicates that a retrenchment benefit is payable on a product.",
    "product_association": "All",
    "associated_required_tables": "Parameters"
  },
  {
    "benefit_feature": "PERMANENT_DISABILITY_BENEFIT",
    "note": "Permanent Disability Benefit",
    "Dependency on Product Features": "",
    "description": "This feature indicates that permanent disability benefit is payable on a product.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "TEMPORARY_DISABILITY_BENEFIT",
    "note": "Benefit payable on temporary disability",
    "Dependency on Product Features": "",
    "description": "Temporary disability benefit is payable on a product.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "CREDIT_LIFE_FUNERAL_OPTION",
    "note": "Credit Life: Funeral Benefit Payable on Death",
    "Dependency on Product Features": "RIDER_BENEFIT",
    "description": "Funeral option benefit within a credit life product.Only applicable for a credit life product.",
    "product_association": "Credit Life",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "JOINT_LIFE",
    "note": "Joint Life Coverage",
    "Dependency on Product Features": "",
    "description": "Joint Life cover. Two life assureds covered on a policy.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "ANNUITY_INCOME",
    "note": "Regular income payable while alive",
    "Dependency on Product Features": "",
    "description": "Regular income is payable on a product, provided that the life assured is alive.",
    "product_association": "Annuities",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "FULLY_PAIDUP",
    "note": "Premium payment reduced to zero. SA adjusted accordingly.",
    "Dependency on Product Features": "",
    "description": "Fully paid up benefit is applicable on a product. Premium is not payable once the benefit is triggered.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "REDUCED_PAIDUP",
    "note": "Premium payment reduced to non-zero and SA adjusted accordingly",
    "Dependency on Product Features": "",
    "description": "This feature is applicable on a product where the life assured may reduce sum assured and/or premium to a non-zero amount",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "PREMIUM_WAIVER_ON_DEATH",
    "note": "Premium payment waiver following death of the life assured",
    "Dependency on Product Features": "",
    "description": "Premium waiver benefit upon death of the life assured. For example applicable on education or savings products.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "SURRENDER_BENEFIT",
    "note": "Benefit Payable on Surrender",
    "Dependency on Product Features": "",
    "description": "This feature indicates surrender benefit on a product when a policy is surrendered. Usually this is calculated on a proportionate basis.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "UNIT_FUND",
    "note": "Unit Linked Product",
    "Dependency on Product Features": "",
    "description": "This feature identifies products that offer benefits that are linked to a value of a given underlying fund.",
    "product_association": "Unit Linked",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "WITH_PROFIT",
    "note": "Policyholder participation in generated underwriting profits",
    "Dependency on Product Features": "",
    "description": "This feature identifies products that allow the policy to participate in profits by means of bonus distributions.",
    "product_association": "With Profits",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "STERLING",
    "note": "Non-Unit Reserve",
    "Dependency on Product Features": "",
    "description": "The actuarial reserve for the risk benefit of the product within a  unit linked product.",
    "product_association": "Unit Linked",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "CRITICAL_ILLNESS_BENEFIT",
    "note": "Benefit payable at the diagnosis of a pre-defined critical illness",
    "Dependency on Product Features": "",
    "description": "This feature indicates applicability of critical illness benefit on a product.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "PREMIUM_WAIVER_ON_DISABILITY",
    "note": "Premium payment waiver upon confirmation of disability",
    "Dependency on Product Features": "",
    "description": "This feature is applicable on a product where a premium waiver benefit is offered upon confirmation of the policyholder's disability state.",
    "product_association": "All",
    "associated_required_tables": "Model Point File"
  },
  {
    "benefit_feature": "PROPORTIONAL_REINSURANCE",
    "note": "Proportional Reinsurance: Quota and/or Surplus Reinsurance",
    "Dependency on Product Features": "",
    "description": "3 tier reinsurance structure. Configurable for quota share, surplus reinsurance and/or hybrid reinsurance. The User is required to specify lower and upper limit exposure levels and ceding proportions in each of the levels. Also flat premium proportion is required. All these variables form part of the Reinsurance table",
    "product_association": "All",
    "associated_required_tables": "Reinsurance Table"
  }
]