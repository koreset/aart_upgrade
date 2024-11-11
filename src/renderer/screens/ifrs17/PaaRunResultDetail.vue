<template>
  <v-container>
    <base-card>
      <template #header>
        <span class="headline">IFRS17 PAA</span>
      </template>
      <template #default>
        <v-row
          ><v-col>
            <v-btn class="custom-btn" variant="text" :to="{ name: 'ifrs17-run-results' }">
              {{ backSign }} Back to IFRS17 Run List
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="csmRun !== null">
          <v-col>
            <h3>Run Name: {{ csmRun.name }} ({{ csmRun.measurement_type }})</h3>
            <p>Run Date: {{ csmRun.run_date }}</p>
          </v-col>
        </v-row>
        <!-- <loading-indicator :loadingData="loadingData" /> -->

        <v-row v-if="productList.length < 1 && !loadingData" class="mt-3">
          <v-col>
            <h4>there are no runs to display currently</h4>
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col v-if="productList !== null && productList.length > 0" cols="4">
            <v-select
              v-model="selectedProduct"
              density="compact"
              variant="outlined"
              label="Product"
              :items="productList"
              item-title="product_code"
              item-value="product_code"
              @update:modelValue="getProductSteps"
            ></v-select>
          </v-col>
          <v-col v-if="groups.length > 0" cols="4">
            <v-select
              v-model="selectedGroup"
              density="compact"
              variant="outlined"
              label="IFRS17 Groups"
              :items="groups"
              item-title="ifrs17_group"
              item-value="ifrs17_group"
              @update:modelValue="getGroupSteps"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="stepResults.length > 0">
          <v-col>
            <data-grid
              :tableTitle="selectedProduct + (selectedGroup !== null ? ' - ' + selectedGroup : '')"
              :columnDefs="columnDefs"
              :rowData="stepResults"
            />
          </v-col>
        </v-row>
        <v-row v-if="eligibilityResults.length > 0">
          <v-col>
            <data-grid
              :tableTitle="'PAA Eligibility Results - Unfiltered'"
              :columnDefs="eligibilityColumnDefs"
              :rowData="eligibilityResults"
            />
          </v-col>
        </v-row>
        <v-row v-if="csmRun !== null">
          <v-col>
            <v-card>
              <v-card-title class="header-title accent white--text mb-3">Run Settings</v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="table-col minwidth-name">Run Name</th>
                      <th class="table-col minwidth">Run Date</th>
                      <th class="table-col minwidth">PAA Run</th>
                      <th class="table-col minwidth">Measurement Type</th>
                      <th class="table-col minwidth">PAA Eligibility</th>
                      <th class="table-col minwidth">Risk Adjustment Year</th>
                      <th class="table-col minwidth">Finance Year</th>
                      <th class="table-col minwidth">Run By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ csmRun.name }}</td>
                      <td>{{ csmRun.run_date }}</td>
                      <td>{{ csmRun.paa_run_name }}</td>
                      <td>{{ csmRun.measurement_type }}</td>
                      <td>{{ csmRun.paa_eligibility_test }}</td>
                      <td>{{ csmRun.risk_adjustment_year }}</td>
                      <td>{{ csmRun.finance_year }}</td>
                      <td>{{ csmRun.user_name }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </base-card>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

// data
const $router = useRoute()
const backSign = ref('<')
const csmRunId: any = ref(null)
const csmRunDate: any = ref(null)
const csmRun: any = ref(null)
const productList: any = ref([])
const groups: any = ref([])
const stepResults = ref([])
const eligibilityResults = ref([])
const selectedProduct: any = ref(null)
const selectedGroup: any = ref(null)
const loadingData = ref(false)
const columnDefs: any = ref([])
const eligibilityColumnDefs: any = ref([])

onMounted(() => {
  console.log($router.params)
  console.log('paa run result detail')
  csmRunId.value = $router.params.id
  csmRunDate.value = $router.params.run_date
  console.log(csmRunId.value, csmRunDate.value)
  loadingData.value = true
  CsmEngine.getPaaSingleRunProductList(csmRunId.value, csmRunDate.value).then((res) => {
    stepResults.value = res.data.steps
    productList.value = res.data.products
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'

    csmRun.value = res.data.run_settings
    eligibilityResults.value = res.data.eligibility_results
    if (stepResults.value.length > 0) {
      createColumnDefs(stepResults.value)
    }

    if (eligibilityResults.value.length > 0) {
      createEligibilityColumnDefs(eligibilityResults.value)
    }

    loadingData.value = false
  })
})

const createEligibilityColumnDefs = (data) => {
  eligibilityColumnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    eligibilityColumnDefs.value.push(header)
  })
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 150
    header.sortable = true
    header.filter = true
    header.resizable = true

    columnDefs.value.push(header)
  })
}

const getGroupSteps = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    CsmEngine.getPaaSingleRunProductGroup(
      csmRunId.value,
      selectedProduct.value,
      selectedGroup,
      csmRunDate
    ).then((res) => {
      stepResults.value = res.data.steps
      createColumnDefs(stepResults.value)
      loadingData.value = false
    })
  } else {
    getProductSteps()
  }
}
const getProductSteps = () => {
  console.log('getProductSteps')

  stepResults.value = []
  groups.value = []

  loadingData.value = true
  CsmEngine.getPaaSingleRunProduct(csmRunId.value, selectedProduct.value, csmRunDate.value).then(
    (res) => {
      stepResults.value = res.data.steps
      createColumnDefs(stepResults.value)
      if (selectedProduct.value !== 'All Products') {
        groups.value = res.data.groups
        groups.value.unshift('All Groups')
        selectedGroup.value = 'All Groups'
      } else {
        groups.value = []
      }
      loadingData.value = false
    }
  )
}
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
