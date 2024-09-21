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
      path: '/ifrs17/tables',
      name: 'ifrs17-tables',
      component: () => import('../screens/ifrs17/Tables.vue')
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
      path: '/ifrs17/aos-config',
      name: 'ifrs17-aos-config',
      component: () => import('../screens/ifrs17/AosConfiguration.vue')
    },
    {
      path: '/ifrs17/ra-drivers',
      name: 'ifrs17-ra-drivers',
      component: () => import('../screens/ifrs17/RiskAdjustmentDrivers.vue')
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
