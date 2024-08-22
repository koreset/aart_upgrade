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
