<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <v-navigation-drawer v-model="internalDrawer" class="custom-navbar drawer-text" dark color="navbar" location="left">
    <v-container>
      <v-row>
        <v-col>
          <v-img class="ml-3" src="../assets/aart-logo-02.png"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <v-list class="nav-text">
      <v-list-item class="list-item-text" :to="{ name: 'dashboard' }" :title="'Dashboard'"
        :prepend-icon="'mdi-monitor-dashboard'"></v-list-item>
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
      <v-list-group value="Valuations">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Valuations"></v-list-item>
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
        </v-list-group>
        <v-list-group value="LIC">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="LIC"></v-list-item>
          </template>
        </v-list-group>


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
</style>
