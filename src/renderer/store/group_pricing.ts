import { defineStore } from 'pinia'

export const useGroupPricingStore = defineStore('groupPricing', {
  state: () => ({
    quoteTypes: ['New Business', 'Renewal'],
    obligationTypes: ['Voluntary', 'Compulsory'],
    schemeTypes: ['Defined Benefit', 'Defined Contribution'],
    currencies: ['USD', 'ZAR'],
    terminalIllnessBenefits: ['Yes', 'No'],
    yesNoItems: ['Yes', 'No'],
    claimsExperiences: ['Yes', 'No'],
    riskTypes: ['All Causes', 'Accidental'],
    benefitTypes: ['Standalone', 'Associated'],
    disabilityDefinitions: ['Own Occupation', 'Any Occupation'],
    phiEscalationPercentages: ['0%', '5%', '7.5%', '10%'],
    productTypes: ['PHI', 'TTD', 'PHI & TTD'],
    benefitStructures: ['Standalone', 'Accelerated'],
    brokers: [],
    groupSchemes: [],
    selectedQuote: null,
    groupPricingQuote: {
      reviewer: null,
      quoteId: 0,
      creationDate: null,
      quoteType: '',
      schemeName: null,
      quoteBroker: null,
      obligationType: '',
      commencementDate: null,
      industry: '',
      schemeType: '',
      occupationClass: 0,
      acceleratedBenefitDiscount: '',
      commissionRate: '',
      profitLoading: '',
      expenseLoading: '',
      overallPremiumDiscount: '',
      currency: null,
      exchangeRate: 0,
      salaryMultiple: 0,
      currentFcl: 0,
      terminalIllnessBenefit: '',
      normalRetirementAge: '',
      coverTerminationAge: '',
      claimsExperience: '',
      basis: null,
      ptdBenefit: false,
      ciBenefit: false,
      sglaBenefit: false,
      phiTtdBenefit: false,
      familyFuneralBenefit: false,
      ptd: {
        riskType: null,
        salaryMultiple: 0,
        benefitType: null,
        coverTerminationAge: 0,
        deferredPeriod: 0,
        disabilityDefinition: null
      },
      ci: {
        criticalIllnessPercentage: 0,
        maxBenefit: 0,
        benefitStructure: null,
        coverTerminationAge: 0
      },
      sgla: {
        sglaPercentage: 0,
        maxBenefit: 0,
        coverTerminationAge: 0
      },
      phi: {
        productType: null,
        riskType: null,
        maxBasicBenefit: 0,
        monthlyBenefitPercentage: 0,
        premiuimWaiverBenefit: null,
        premiumWaiverPercentage: 0,
        phiEscalationPercentage: null,
        maxPremiumWaiver: '',
        numberAnnualPayments: 0,
        coverTerminationAge: '',
        waitingPeriodMonths: '',
        deferredPeriodMonths: '',
        disabilityDefinition: ''
      },
      groupFamilyFuneral: {
        member: 0,
        spouse: 0,
        children: 0,
        adultDependantSumAssured: 0,
        maxChildrenCovered: 0,
        numberAdultDependants: 0
      },
      ttd: {
        riskType: '',
        maxBasicBenefit: '',
        monthlyBenefitPercentage: '',
        premiuimWaiverBenefit: '',
        premiumWaiverPercentage: '',
        phiEscalationPercentage: '',
        maxPremiumWaiver: '',
        numberAnnualPayments: '',
        coverTerminationAge: '',
        deferredPeriodMonths: '',
        disabilityDefinition: ''
      },
      uploadData: {
        memberDataFile: null,
        claimsExperienceFile: null
      }
    }
  }),
  actions: {
    // setGroupPricing(groupPricing) {
    //   this.groupPricing = groupPricing
    // }
  }
})
