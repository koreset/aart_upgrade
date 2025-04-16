import { defineStore } from 'pinia'

export const useGroupPricingStore = defineStore('groupPricing', {
  state: () => ({
    quoteTypes: ['New Business', 'Renewal'],
    obligationTypes: ['Voluntary', 'Compulsory'],
    schemeTypes: ['Management', 'Administration', 'General'],
    currencies: ['USD', 'ZAR'],
    terminalIllnessBenefits: ['Yes', 'No'],
    yesNoItems: ['Yes', 'No'],
    claimsExperiences: ['Yes', 'No'],
    riskTypes: ['All Causes', 'Accidental'],
    benefitTypes: ['Standalone', 'Accelerated'],
    disabilityDefinitions: ['Own Occupation', 'Any Occupation'],
    phiEscalationPercentages: ['0%', '5%', '7.5%', '10%'],
    productTypes: ['PHI', 'TTD', 'PHI & TTD'],
    benefitStructures: ['Standalone', 'Accelerated'],
    brokers: [],
    industries: [],
    groupSchemes: [],
    selectedQuote: null,
    memberDataCount: 0,
    claimsExperienceCount: 0,
    group_pricing_quote: {
      reviewer: null,
      quote_id: 0,
      creation_date: null,
      quote_type: '',
      scheme_id: 0,
      scheme_name: null,
      scheme_contact: null,
      scheme_email: null,
      quote_broker: null,
      obligation_type: '',
      commencement_date: null,
      industry: '',
      scheme_type: '',
      occupation_class: 0,
      free_cover_limit: 0,
      currency: null,
      exchangeRate: 0,
      normal_retirement_age: 0,
      experience_rating: '',
      basis: null,
      ptd_benefit: false,
      ci_benefit: false,
      sgla_benefit: false,
      phi_benefit: false,
      ttd_benefit: false,
      gla_benefit: true,
      edu_benefit: false,
      family_funeral_benefit: false,
      gla: {
        salary_multiple: 0,
        terminal_illness_benefit: '',
        waiting_period: 0,
        cover_termination_age: 0
      },
      ptd: {
        risk_type: null,
        salary_multiple: 0,
        benefit_type: null,
        cover_termination_age: 0,
        deferred_period: 0,
        waiting_period: 0,
        disability_definition: null
      },
      ci: {
        critical_illness_salary_multiple: 0,
        max_benefit: 0,
        benefit_structure: null,
        cover_termination_age: 0
      },
      sgla: {
        sgla_salary_multiple: 0,
        max_benefit: 0,
        cover_termination_age: 0
      },
      phi: {
        benefit: null,
        risk_type: null,
        maximum_benefit: 0,
        income_replacement_percentage: 0,
        premium_waiver: null,
        premium_waiver_percentage: 0,
        escalation_percentage: null,
        max_premium_waiver: 0,
        number_monthly_payments: 0,
        cover_termination_age: 0,
        waiting_period: 0,
        deferred_period: 0,
        disability_definition: null
      },
      ttd: {
        benefit: null,
        risk_type: null,
        maximum_benefit: 0,
        income_replacement_percentage: 0,
        premium_waiver: null,
        premium_waiver_percentage: 0,
        escalation_percentage: null,
        max_premium_waiver: 0,
        number_monthly_payments: 0,
        cover_termination_age: 0,
        waiting_period: 0,
        deferred_period: 0,
        disability_definition: null
      },
      family_funeral: {
        main_member_funeral_sum_assured: 0,
        spouse_funeral_sum_assured: 0,
        children_funeral_sum_assured: 0,
        adult_dependant_sum_assured: 0,
        parent_funeral_sum_assured: 0,
        max_number_children: 0,
        max_number_adult_dependants: 0
      },
      loadings: {
        commission_loading: 0,
        profit_loading: 0,
        expense_loading: 0,
        distribution_loading: 0,
        accelerated_benefit_discount: 0,
        discount: 0
      },
      uploadData: {
        member_data_file: null,
        claims_experience_file: null
      }
    }
  }),
  actions: {
    // setGroupPricing(groupPricing) {
    //   this.groupPricing = groupPricing
    // }
    // reset group_pricing_quote
    resetGroupPricingQuote() {
      this.group_pricing_quote = {
        reviewer: null,
        quote_id: 0,
        creation_date: null,
        quote_type: '',
        scheme_name: null,
        scheme_contact: null,
        scheme_email: null,
        scheme_id: 0,
        quote_broker: null,
        obligation_type: '',
        commencement_date: null,
        industry: '',
        scheme_type: '',
        occupation_class: 0,
        free_cover_limit: 0,
        currency: null,
        exchangeRate: 0,
        normal_retirement_age: 0,
        experience_rating: '',
        basis: null,
        ptd_benefit: false,
        ci_benefit: false,
        sgla_benefit: false,
        phi_benefit: false,
        ttd_benefit: false,
        gla_benefit: true,
        edu_benefit: false,
        family_funeral_benefit: false,
        gla: {
          salary_multiple: 0,
          terminal_illness_benefit: '',
          waiting_period: 0,
          cover_termination_age: 0
        },
        ptd: {
          risk_type: null,
          salary_multiple: 0,
          benefit_type: null,
          cover_termination_age: 0,
          deferred_period: 0,
          waiting_period: 0,
          disability_definition: null
        },
        ci: {
          critical_illness_salary_multiple: 0,
          max_benefit: 0,
          benefit_structure: null,
          cover_termination_age: 0
        },
        sgla: {
          sgla_salary_multiple: 0,
          max_benefit: 0,
          cover_termination_age: 0
        },
        phi: {
          benefit: null,
          risk_type: null,
          maximum_benefit: 0,
          income_replacement_percentage: 0,
          premium_waiver: null,
          premium_waiver_percentage: 0,
          escalation_percentage: null,
          max_premium_waiver: 0,
          number_monthly_payments: 0,
          cover_termination_age: 0,
          waiting_period: 0,
          deferred_period: 0,
          disability_definition: null
        },
        ttd: {
          benefit: null,
          risk_type: null,
          maximum_benefit: 0,
          income_replacement_percentage: 0,
          premium_waiver: null,
          premium_waiver_percentage: 0,
          escalation_percentage: null,
          max_premium_waiver: 0,
          number_monthly_payments: 0,
          cover_termination_age: 0,
          waiting_period: 0,
          deferred_period: 0,
          disability_definition: null
        },
        family_funeral: {
          main_member_funeral_sum_assured: 0,
          spouse_funeral_sum_assured: 0,
          children_funeral_sum_assured: 0,
          adult_dependant_sum_assured: 0,
          parent_funeral_sum_assured: 0,
          max_number_children: 0,
          max_number_adult_dependants: 0
        },
        loadings: {
          commission_loading: 0,
          profit_loading: 0,
          expense_loading: 0,
          distribution_loading: 0,
          accelerated_benefit_discount: 0,
          discount: 0
        },
        uploadData: {
          member_data_file: null,
          claims_experience_file: null
        }
      }
    }
  }
})
