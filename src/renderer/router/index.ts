import { ErrorScreen } from '@/renderer/screens'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from '../App.vue'
import AppLogin from '../AppLogin.vue'
import AppSetup from '../AppSetup.vue'
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/app',
      name: 'App',
      component: App
    },
    {
      path: '/login',
      name: 'AppLogin',
      component: AppLogin
    },
    {
      path: '/setup',
      name: 'setup',
      component: AppSetup
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../screens/Dashboard.vue'),
      meta: {
        titleKey: 'title.dashboard'
      }
    },
    {
      path: '/product-setup',
      name: 'product-setup',
      component: () => import('../screens/ProductConfiguration.vue'),
      meta: {
        titleKey: 'title.productSetup'
      }
    },
    {
      path: '/product-edit/:id',
      name: 'product-edit',
      component: () => import('../screens/ProductConfiguration.vue'),
      meta: {
        titleKey: 'title.productEdit'
      }
    },

    {
      path: '/global-tables',
      name: 'global-tables',
      component: () => import('../screens/GlobalTables.vue'),
      meta: {
        titleKey: 'title.globalTables'
      }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../screens/ProductDetail.vue')
    },
    {
      path: '/products/:id/:familyId',
      name: 'product-detail',
      component: () => import('../screens/ProductDetail.vue')
    },

    {
      path: '/products',
      name: 'products',
      component: () => import('../screens/ProductDetail.vue')
    },

    {
      path: '/product-comparison',
      name: 'product-comparison',
      component: () => import('../screens/ProductComparison.vue'),
      meta: {
        titleKey: 'title.globalTables'
      }
    },
    {
      path: '/reporting',
      name: 'reporting',
      component: () => import('../screens/Reporting.vue')
    },
    {
      path: '/valuations/gmm/shock-settings',
      name: 'valuations-gmm-shock-settings',
      component: () => import('../screens/valuations/gmm/ShockSettings.vue')
    },
    {
      path: '/valuations/gmm/run-settings',
      name: 'valuations-gmm-run-settings',
      component: () => import('../screens/valuations/gmm/RunSettings.vue')
    },
    {
      path: '/valuations/gmm/run-results',
      name: 'valuations-gmm-run-results',
      component: () => import('../screens/valuations/gmm/RunResults.vue')
    },
    {
      path: '/valuations/gmm/result-aggregations',
      name: 'valuations-gmm-result-aggregations',
      component: () => import('../screens/valuations/gmm/ResultAggregations.vue')
    },

    {
      path: '/valuations/gmm/run-detail/:id/:prodId/:prod_name/:run_name',
      name: 'valuation-gmm-run-results-detail',
      component: () => import('../screens/valuations/gmm/RunDetail.vue'),
      props: true
    },
    {
      path: '/valuations/paa/run-settings',
      name: 'valuations-paa-run-settings',
      component: () => import('../screens/valuations/paa/RunSettings.vue')
    },
    {
      path: '/valuations/paa/run-results',
      name: 'valuations-paa-run-results',
      component: () => import('../screens/valuations/paa/RunResults.vue')
    },
    {
      path: '/valuations/paa/run-detail/:id',
      name: 'valuations-paa-run-detail',
      component: () => import('../screens/valuations/paa/RunDetail.vue')
    },

    {
      path: '/valuations/paa/portfolios',
      name: 'valuations-paa-portfolios',
      component: () => import('../screens/valuations/paa/PaaPortfolios.vue')
    },
    {
      path: '/valuations/paa/portfolio-summaries',
      name: 'valuations-paa-portfolio-summaries',
      component: () => import('../screens/valuations/paa/PortfolioSummaries.vue')
    },
    {
      path: '/valuations/paa/tables',
      name: 'valuations-paa-tables',
      component: () => import('../screens/valuations/paa/Tables.vue')
    },
    {
      path: '/valuations/paa/shock-settings',
      name: 'valuations-paa-shock-settings',
      component: () => import('../screens/valuations/paa/ShockSettings.vue')
    },
    {
      path: '/valuations/ibnr/portfolios',
      name: 'valuations-ibnr-portfolios',
      component: () => import('../screens/valuations/ibnr/IbnrPortfolios.vue')
    },
    {
      path: '/valuations/ibnr/shock-settings',
      name: 'valuations-ibnr-shock-settings',
      component: () => import('../screens/valuations/ibnr/ShockSettings.vue')
    },
    {
      path: '/valuations/ibnr/tables',
      name: 'valuations-ibnr-tables',
      component: () => import('../screens/valuations/ibnr/Tables.vue')
    },
    {
      path: '/valuations/ibnr/run-settings',
      name: 'valuations-ibnr-run-settings',
      component: () => import('../screens/valuations/ibnr/RunSettings.vue')
    },
    {
      path: '/valuations/ibnr/run-results',
      name: 'valuations-ibnr-run-results',
      component: () => import('../screens/valuations/ibnr/RunResults.vue')
    },
    {
      path: '/valuations/ibnr/run-details/:id',
      name: 'valuations-ibnr-run-details',
      component: () => import('../screens/valuations/ibnr/RunDetail.vue')
    },
    {
      path: '/valuations/lic/tables',
      name: 'valuations-lic-tables',
      component: () => import('../screens/valuations/lic/Tables.vue')
    },
    {
      path: '/valuations/lic/configuration',
      name: 'valuations-lic-configuration',
      component: () => import('../screens/valuations/lic/Configuration.vue')
    },
    {
      path: '/valuations/lic/run-settings',
      name: 'valuations-lic-run-settings',
      component: () => import('../screens/valuations/lic/RunSettings.vue')
    },
    {
      path: '/valuations/lic/run-results',
      name: 'valuations-lic-run-results',
      component: () => import('../screens/valuations/lic/RunResults.vue')
    },
    {
      path: '/valuations/lic/run-details/:id',
      name: 'valuations-lic-run-details',
      component: () => import('../screens/valuations/lic/RunDetail.vue')
    },
    {
      path: '/pricing/tables',
      name: 'pricing-tables',
      component: () => import('../screens/pricing/Tables.vue')
    },
    {
      path: '/pricing/run-settings',
      name: 'pricing-run-settings',
      component: () => import('../screens/pricing/RunSettings.vue')
    },
    {
      path: '/pricing/run-results',
      name: 'pricing-run-results',
      component: () => import('../screens/pricing/RunResults.vue')
    },
    {
      path: '/pricing/run-details/:id',
      name: 'pricing-run-details',
      component: () => import('../screens/pricing/RunDetails.vue')
    },
    {
      path: '/exp-analysis/configuration',
      name: 'exp-analysis-configuration',
      component: () => import('../screens/exp_analysis/Configuration.vue')
    },
    {
      path: '/exp-analysis/tables',
      name: 'exp-analysis-tables',
      component: () => import('../screens/exp_analysis/Tables.vue')
    },
    {
      path: '/exp-analysis/run-settings',
      name: 'exp-analysis-run-settings',
      component: () => import('../screens/exp_analysis/RunSettings.vue')
    },
    {
      path: '/exp-analysis/run-results',
      name: 'exp-analysis-run-results',
      component: () => import('../screens/exp_analysis/RunResults.vue')
    },
    {
      path: '/exp-analysis/run-detail/:id',
      name: 'exp-analysis-run-detail',
      component: () => import('../screens/exp_analysis/RunDetail.vue')
    },
    {
      path: '/ifrs17/ra-drivers',
      name: 'ifrs17-ra-drivers',
      component: () => import('../screens/ifrs17/RiskAdjustmentDrivers.vue')
    },

    {
      path: '/ifrs17/tables',
      name: 'ifrs17-tables',
      component: () => import('../screens/ifrs17/Tables.vue')
    },
    {
      path: '/ifrs17/aos-config',
      name: 'ifrs17-aos-config',
      component: () => import('../screens/ifrs17/AosConfiguration.vue')
    },

    {
      path: '/ifrs17/run-settings',
      name: 'ifrs17-run-settings',
      component: () => import('../screens/ifrs17/RunSettings.vue')
    },
    {
      path: '/ifrs17/run-results',
      name: 'ifrs17-run-results',
      component: () => import('../screens/ifrs17/RunResults.vue')
    },
    {
      path: '/ifrs17/aos-run-detail/:id/:run_date',
      name: 'ifrs17-aos-run-detail',
      component: () => import('../screens/ifrs17/AosRunResultDetail.vue')
    },
    {
      path: '/ifrs17/paa-run-detail/:id/:run_date',
      name: 'ifrs17-paa-run-detail',
      component: () => import('../screens/ifrs17/PaaRunResultDetail.vue')
    },
    {
      path: '/ifrs17/reports/aos',
      name: 'ifrs17-reports-aos',
      component: () => import('../screens/ifrs17/reports/AosRunReports.vue')
    },
    {
      path: '/ifrs17/reports/paa',
      name: 'ifrs17-reports-paa',
      component: () => import('../screens/ifrs17/reports/PaaRunReports.vue')
    },
    {
      path: '/ifrs17/reports/paa-buildup',
      name: 'ifrs17-reports-paa-buildup',
      component: () => import('../screens/ifrs17/reports/PaaBuildupReports.vue')
    },
    {
      path: '/ifrs17/reports/bel-buildup',
      name: 'ifrs17-reports-bel-buildup',
      component: () => import('../screens/ifrs17/reports/BelBuildupReports.vue')
    },
    {
      path: '/ifrs17/reports/journal-entries',
      name: 'ifrs17-reports-journal-entries',
      component: () => import('../screens/ifrs17/reports/JournalEntriesReport.vue')
    },
    {
      path: '/ifrs17/reports/sub-ledger',
      name: 'ifrs17-reports-sub-ledger',
      component: () => import('../screens/ifrs17/reports/SubLedgerReports.vue')
    },
    {
      path: '/ifrs17/reports/trial-balance',
      name: 'ifrs17-reports-trial-balance',
      component: () => import('../screens/ifrs17/reports/TrialBalanceReports.vue')
    },
    {
      path: '/ifrs17/reports/closing-balance-details',
      name: 'ifrs17-reports-closing-balance-details',
      component: () => import('../screens/ifrs17/reports/ClosingBalanceDetailsReports.vue')
    },
    {
      path: '/ifrs17/reports/closing-balance-details',
      name: 'ifrs17-reports-closing-balance-details',
      component: () => import('../screens/ifrs17/reports/ClosingBalanceDetailsReports.vue')
    },
    {
      path: '/ifrs17/reports/balance-sheet-summary',
      name: 'ifrs17-reports-balance-sheet-summary',
      component: () => import('../screens/ifrs17/reports/BalanceSheetSummaries.vue')
    },
    {
      path: '/ifrs17/reports/financials',
      name: 'ifrs17-reports-financials',
      component: () => import('../screens/ifrs17/reports/FinancialReports.vue')
    },
    {
      path: '/ifrs17/reports/liability-movements',
      name: 'ifrs17-reports-liability-movements',
      component: () => import('../screens/ifrs17/reports/LiabilityMovementReports.vue')
    },
    {
      path: '/ifrs17/reports/insurance-revenue-analysis',
      name: 'ifrs17-reports-insurance-revenue-analysis',
      component: () => import('../screens/ifrs17/reports/InsuranceRevenueAnalysisReports.vue')
    },
    {
      path: '/ifrs17/reports/initial-recognition',
      name: 'ifrs17-reports-initial-recognition',
      component: () => import('../screens/ifrs17/reports/InitialRecognitionReports.vue')
    },
    {
      path: '/ifrs17/reports/csm-projection',
      name: 'ifrs17-reports-csm-projection',
      component: () => import('../screens/ifrs17/reports/CsmProjectionReports.vue')
    },
    {
      path: '/group-pricing/quote-generation',
      name: 'group-pricing-quote-generation',
      component: () => import('../screens/group_pricing/QuoteGeneration.vue')
    },
    {
      path: '/group-pricing/quote-generation/:id',
      name: 'group-pricing-quote-generation-edit',
      component: () => import('../screens/group_pricing/QuoteGeneration.vue')
    },
    {
      path: '/group-pricing/brokers',
      name: 'group-pricing-brokers',
      component: () => import('../screens/group_pricing/BrokerList.vue')
    },
    {
      path: '/group-pricing/schemes',
      name: 'group-pricing-schemes',
      component: () => import('../screens/group_pricing/GroupSchemeList.vue')
    },
    {
      path: '/group-pricing/schemes/:id',
      name: 'group-pricing-schemes-detail',
      props: true,
      component: () => import('../screens/group_pricing/GroupSchemeDetail.vue')
    },

    {
      path: '/group-pricing/scheme-details/:id',
      name: 'group-pricing-scheme-details',
      props: true,
      component: () => import('../screens/group_pricing/ViewQuoteDetail.vue')
    },
    {
      path: '/group-pricing/quotes',
      name: 'group-pricing-quotes',
      component: () => import('../screens/group_pricing/GroupSchemeQuotes.vue')
    },
    {
      path: '/group-pricing/quotes/output/:quoteId',
      name: 'group-pricing-quotes-generation',
      component: () => import('../screens/group_pricing/QuoteOutput.vue'),
      props: true
    },

    {
      path: '/group-pricing/tables',
      name: 'group-pricing-tables',
      component: () => import('../screens/group_pricing/Tables.vue')
    },
    {
      path: '/group-pricing/dashboard',
      name: 'group-pricing-dashboard',
      component: () => import('../screens/group_pricing/GPDashBoard.vue')
    },

    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../screens/Tasks.vue')
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: () => import('../screens/Documentation.vue')
    },
    {
      path: '/app-settings',
      name: 'app-settings',
      component: () => import('../screens/AppSettings.vue')
    },

    {
      path: '/error',
      component: ErrorScreen,
      meta: {
        titleKey: 'title.error'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
