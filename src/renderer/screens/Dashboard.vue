<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <server-unavailable />
    <v-row v-if="!productsAvailable">
      <v-col>
        <v-card>
          <v-card-text>
            <h3>No Configured Products found</h3>
            <p>Perhaps you want to start off by setting up a product?</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <premiums-data-chart />
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col>
        <monthly-result-chart />
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col>
        <reserves-summary />
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col>
        <paa-reserves-summary />
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col>
        <dashboard-reserves />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ServerUnavailable from '../components/ServerUnavailable.vue'
import PremiumsDataChart from '../components/charts/PremiumsDataChart.vue'
import MonthlyResultChart from '../components/charts/MonthlyResultChart.vue'
import ReservesSummary from '../components/ReservesSummary.vue'
import PaaReservesSummary from '../components/PaaReservesSummary.vue'
import DashboardReserves from '../components/DashboardReserves.vue'
import ProductService from '../api/ProductService'

import { ref, onBeforeMount } from 'vue'

const productsAvailable = ref(false)

onBeforeMount(() => {
  ProductService.getProducts()
    .then((products: any) => {
      console.log(products)
      productsAvailable.value = products.data.length > 0
    })
    .catch((error) => {
      console.error(error)
    })
  console.log('Dashboard mounted')
})
</script>

<style scoped></style>
