<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <v-navigation-drawer
    v-model="internalDrawer"
    class="custom-navbar nav-bg drawer-text"
    dark
    color="navbar"
    location="left"
  >
    <v-container>
      <v-row>
        <v-col>
          <img class="ml-3" width="100%" src="/images/aart-logo-02.png" />
          <p class="nav-text"
            >App Version: {{ appVersion }} | API version: {{ apiVersion.version }}</p
          >
        </v-col>
      </v-row>
    </v-container>
    <v-list class="nav-text smaller-font">
      <v-list-item
        :class="{ 'disabled-item': checkEntitlement('dashboard') }"
        :to="{ name: 'dashboard' }"
        :title="'Dashboard'"
        :prepend-icon="'mdi-monitor-dashboard'"
        @click="checkEntitlement('dashboard') ? showAccessMessage('dashboard') : null"
      ></v-list-item>
      <v-list-item
        :class="{ 'disabled-item': checkEntitlement('product-setup') }"
        :to="{ name: 'product-setup' }"
        :prepend-icon="'mdi-table-settings'"
        @click="checkEntitlement('product-setup') ? showAccessMessage('product-setup') : null"
      >
        <v-list-item-title>Product Configuration</v-list-item-title>
      </v-list-item>
      <v-list-item
        :disabled="checkEntitlement('products')"
        :to="{ name: 'products' }"
        :prepend-icon="'mdi-dolly'"
      >
        <v-list-item-title>Products</v-list-item-title>
      </v-list-item>
      <v-list-item
        :disabled="checkEntitlement('global-tables')"
        :to="{ name: 'global-tables' }"
        :prepend-icon="'mdi-table-multiple'"
      >
        <v-list-item-title>Global Tables</v-list-item-title>
      </v-list-item>
      <v-list-item
        :disabled="checkEntitlement('product-comparison')"
        :to="{ name: 'product-comparison' }"
        :prepend-icon="'mdi-compare-horizontal'"
      >
        <v-list-item-title>Cash Flow Comparison</v-list-item-title>
      </v-list-item>
      <v-list-item
        :disabled="checkEntitlement('reporting')"
        :to="{ name: 'reporting' }"
        :prepend-icon="'mdi-chart-box-multiple'"
      >
        <v-list-item-title>Reports</v-list-item-title>
      </v-list-item>
      <v-list-group value="Group Pricing">
        <template #activator="{ props }">
          <v-list-item
            :disabled="checkEntitlement('group-pricing')"
            v-bind="props"
            prepend-icon="mdi-file-table-box-multiple-outline"
            title="Group Pricing"
          ></v-list-item>
        </template>
        <v-list-item
          :disabled="checkEntitlement('group-pricing-dashboard')"
          :to="{ name: 'group-pricing-dashboard' }"
        >
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item
          :disabled="checkEntitlement('group-pricing-quotes')"
          :to="{ name: 'group-pricing-quotes' }"
        >
          <v-list-item-title>Quotes</v-list-item-title>
        </v-list-item>
        <v-list-item
          :disabled="checkEntitlement('group-pricing-tables')"
          :to="{ name: 'group-pricing-tables' }"
        >
          <v-list-item-title>Tables</v-list-item-title>
        </v-list-item>
        <v-list-item
          :disabled="checkEntitlement('group-pricing-brokers')"
          :to="{ name: 'group-pricing-brokers' }"
        >
          <v-list-item-title>Metadata</v-list-item-title>
        </v-list-item>
        <v-list-item
          :disabled="checkEntitlement('group-pricing-schemes')"
          :to="{ name: 'group-pricing-schemes' }"
        >
          <v-list-item-title>Schemes</v-list-item-title>
        </v-list-item>
        <v-list-group subgroup class="first-level-group" value="Claims">
          <template #activator="{ props }">
            <v-list-item
              :disabled="checkEntitlement('group-pricing-claims')"
              v-bind="props"
              title="Claims"
            ></v-list-item>
          </template>
          <v-list-item class="second-level-item" :to="{ name: 'group-pricing-claims-list' }">
            <v-list-item-title>Claims List</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list-group>
      <v-list-group value="Valuations">
        <template #activator="{ props }">
          <v-list-item
            :disabled="checkEntitlement('valuations')"
            v-bind="props"
            prepend-icon="mdi-file-table-box-multiple-outline"
            title="Valuations"
          ></v-list-item>
        </template>
        <v-list-group subgroup class="first-level-group" value="GMM">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="GMM"></v-list-item>
          </template>
          <v-list-item class="second-level-item" :to="{ name: 'valuations-gmm-shock-settings' }">
            <v-list-item-title>Shock Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-gmm-run-settings' }">
            <v-list-item-title>Run Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-gmm-run-results' }">
            <v-list-item-title>Run Results</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-gmm-result-aggregations' }">
            <v-list-item-title>Results Aggregations</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group subgroup class="first-level-group" value="PAA">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="PAA"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'valuations-paa-portfolios' }">
            <v-list-item-title>Portfolios</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-paa-portfolio-summaries' }">
            <v-list-item-title>Portfolio Summaries</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-paa-tables' }">
            <v-list-item-title>Tables</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-paa-shock-settings' }">
            <v-list-item-title>Shock Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-paa-run-settings' }">
            <v-list-item-title>Run Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-paa-run-results' }">
            <v-list-item-title>Run Results</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group subgroup class="first-level-group" value="IBNR">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="IBNR"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'valuations-ibnr-portfolios' }">
            <v-list-item-title>Portfolios</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-ibnr-shock-settings' }">
            <v-list-item-title>Shock Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-ibnr-tables' }">
            <v-list-item-title>Tables</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-ibnr-run-settings' }">
            <v-list-item-title>Run Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-ibnr-run-results' }">
            <v-list-item-title>Run Results</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group subgroup class="first-level-group" value="LIC">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="LIC"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'valuations-lic-tables' }">
            <v-list-item-title>Tables</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-lic-configuration' }">
            <v-list-item-title>Configuration</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-lic-run-settings' }">
            <v-list-item-title>Run Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-lic-run-results' }">
            <v-list-item-title>Run Results</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list-group>
      <v-list-group class="first-level-group" value="Pricing">
        <template #activator="{ props }">
          <v-list-item
            :disabled="checkEntitlement('pricing')"
            v-bind="props"
            prepend-icon="mdi-file-table-box-multiple-outline"
            title="Pricing"
          ></v-list-item>
        </template>
        <v-list-item :to="{ name: 'pricing-tables' }">
          <v-list-item-title>Tables</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'pricing-run-settings' }">
          <v-list-item-title>Run Settings</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'pricing-run-results' }">
          <v-list-item-title>Run Results</v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-group class="first-level-group" value="Exp Analysis">
        <template #activator="{ props }">
          <v-list-item
            :disabled="checkEntitlement('exp-analysis')"
            v-bind="props"
            prepend-icon="mdi-file-table-box-multiple-outline"
            title="Exp Analysis"
          ></v-list-item>
        </template>
        <v-list-item :to="{ name: 'exp-analysis-configuration' }">
          <v-list-item-title>Configuration</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'exp-analysis-tables' }">
          <v-list-item-title>Tables</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'exp-analysis-run-settings' }">
          <v-list-item-title>Run Settings</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'exp-analysis-run-results' }">
          <v-list-item-title>Run Results</v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-group class="first-level-group" value="IFRS17">
        <template #activator="{ props }">
          <v-list-item
            :disabled="checkEntitlement('ifrs17')"
            v-bind="props"
            prepend-icon="mdi-file-table-box-multiple-outline"
            title="IFRS17"
          ></v-list-item>
        </template>
        <v-list-item :to="{ name: 'ifrs17-ra-drivers' }">
          <v-list-item-title>RA Drivers</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'ifrs17-tables' }">
          <v-list-item-title>Tables</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'ifrs17-aos-config' }">
          <v-list-item-title>AoS Configuration</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'ifrs17-run-settings' }">
          <v-list-item-title>Run Settings</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'ifrs17-run-results' }">
          <v-list-item-title>Run Results</v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-group class="first-level-group" value="IFRS17 Reports">
        <template #activator="{ props }">
          <v-list-item
            :disabled="checkEntitlement('ifrs17-reports')"
            v-bind="props"
            prepend-icon="mdi-chart-box-multiple"
            title="IFRS17 Reports"
          ></v-list-item>
        </template>

        <v-list-group subgroup class="first-level-group" value="Detailed Results">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Detailed Results"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'ifrs17-reports-aos' }">
            <v-list-item-title>AoS</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-paa' }">
            <v-list-item-title>PAA</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-paa-buildup' }">
            <v-list-item-title>PAA Build Up</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-bel-buildup' }">
            <v-list-item-title>BEL Build Up</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group subgroup class="first-level-group" value="Business Accounts">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Business Accounts"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'ifrs17-reports-journal-entries' }">
            <v-list-item-title>Journal Entries</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-sub-ledger' }">
            <v-list-item-title>Sub Ledger</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-trial-balance' }">
            <v-list-item-title>Trial Balance</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-closing-balance-details' }">
            <v-list-item-title>Closing Balance</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-balance-sheet-summary' }">
            <v-list-item-title>Balance Sheet Summary</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-financials' }">
            <v-list-item-title>Financial Reports</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group subgroup class="first-level-group" value="Disclosures">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Disclosures"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'ifrs17-reports-liability-movements' }">
            <v-list-item-title>Liability Movements</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-insurance-revenue-analysis' }">
            <v-list-item-title>Insurance Revenue Analysis</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-initial-recognition' }">
            <v-list-item-title>Initial Recognition</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ifrs17-reports-csm-projection' }">
            <v-list-item-title>CSM Projection</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list-group>
      <v-list-item
        :disabled="checkEntitlement('tasks')"
        :to="{ name: 'tasks' }"
        :prepend-icon="'mdi-table-settings'"
      >
        <v-list-item-title>Tasks</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'app-settings' }" :prepend-icon="'mdi-table-settings'">
        <v-list-item-title>Application Settings</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'documentation' }" :prepend-icon="'mdi-table-settings'">
        <v-list-item-title>Documentation</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import TaskService from '@/renderer/api/TaskService'
import { watchEffect, defineProps, ref, onMounted } from 'vue'
import { useAppStore } from '@/renderer/store/app'
// import ProductService from '@/renderer/api/ProductService' // Assuming the 'ProductService' module is located in the 'api' folder at the root of your project
const navProps = defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
})

const appStore = useAppStore()
const snackbar = ref(false)
const snackbarMessage = ref('')
const timeout = ref(3000)

const showAccessMessage = (entitlement: string) => {
  console.log('Entitlement', entitlement)
  console.log('You are not entitled to access this feature.')
  snackbarMessage.value = `You are not entitled to access this feature: ${entitlement}`
  snackbar.value = true
}

const checkEntitlement = (entitlement: string) => {
  const entitlements: any = appStore.getEntitlements()
  if (entitlements && entitlements.length > 0) {
    return !entitlements.includes(entitlement)
  }
  return false
}
const appVersion: any = ref('')
const apiVersion: any = ref('')

onMounted(async () => {
  appVersion.value = await window.mainApi?.sendSync('msgGetAppVersion')
  TaskService.getApiVersion().then((response) => {
    apiVersion.value = response.data
  })
})

// const products: any = ref([])

const internalDrawer = ref(navProps.drawer)

watchEffect(() => {
  internalDrawer.value = navProps.drawer
})
</script>

<style scoped>
.custom-navbar {
  font-size: 10px !important;
}

.list-item-text {
  font-size: 8px !important;
}

.nav-text {
  color: white !important;
  font-size: 12px !important;
}

.nav-bg {
  background-color: #2e566e !important;
}

.smaller-font :deep(.v-list-item-title),
.smaller-font :deep(.v-list-item__append) {
  font-size: 14px;
  padding-left: 0 !important;
}
.smaller-font.v-list-item {
  min-height: unset;
}
.first-level-group :deep(.v-list-group__items) {
  padding-left: 0 !important;
  --indent-padding: calc(var(--parent-padding) - 16px) !important;
}

.v-list-item.v-list-item--active {
  border-top-right-radius: 32px !important;
  border-bottom-right-radius: 32px !important;
}

.v-list-group__items .v-list-item {
  padding-inline-start: calc(var(--indent-padding)) !important;
}

.disabled-item {
  pointer-events: auto; /* allow click events */
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
