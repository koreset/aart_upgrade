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
          <v-img class="ml-3" src="../assets/aart-logo-02.png"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <v-list class="nav-text">
      <v-list-item
        class="list-item-text"
        :to="{ name: 'dashboard' }"
        :title="'Dashboard'"
        :prepend-icon="'mdi-monitor-dashboard'"
      ></v-list-item>
      <v-list-item :to="{ name: 'product-setup' }" :prepend-icon="'mdi-table-settings'">
        <v-list-item-title>Product Configuration</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'products' }" :prepend-icon="'mdi-table-settings'">
        <v-list-item-title>Products</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'global-tables' }" :prepend-icon="'mdi-table'">
        <v-list-item-title>Global Tables</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'product-comparison' }" :prepend-icon="'mdi-table'">
        <v-list-item-title>Product Comparison</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'reporting' }" :prepend-icon="'mdi-table'">
        <v-list-item-title>Reports</v-list-item-title>
      </v-list-item>
      <v-list-group value="Valuations">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="Valuations"
          ></v-list-item>
        </template>
        <v-list-group value="GMM">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="GMM"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'valuations-gmm-shock-settings' }">
            <v-list-item-title>Shock Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-gmm-run-settings' }">
            <v-list-item-title>Run Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'valuations-gmm-run-results' }">
            <v-list-item-title>Run Results</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="PAA">
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
        <v-list-group value="IBNR">
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
        <v-list-group value="LIC">
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
      <v-list-group value="Pricing">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="Pricing"
          ></v-list-item>
        </template>
        <v-list-item :to="{ name: 'pricing-tables' }">
          <v-list-item-title>Tables</v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-group value="Exp Analysis">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
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
      <v-list-group value="IFRS17">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
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
      <v-list-group value="IFRS17 Reports">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="IFRS17 Reports"
          ></v-list-item>
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
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { watchEffect, defineProps, ref } from 'vue'
// import ProductService from '@/renderer/api/ProductService' // Assuming the 'ProductService' module is located in the 'api' folder at the root of your project
const props = defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
})

// const products: any = ref([])

const internalDrawer = ref(props.drawer)

watchEffect(() => {
  internalDrawer.value = props.drawer
})
</script>

<style scoped>
.custom-navbar {
  font-size: 8px !important;
}

.list-item-text {
  font-size: 8px !important;
}

.nav-text {
  font-size: 10px !important;
}

.nav-bg {
  background-color: lightgrey !important;
}
</style>
