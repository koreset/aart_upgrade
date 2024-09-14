<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">LIC Build Up Report</span>
          </template>
          <template #default>
            <v-row
              ><v-col>
                <v-btn class="custom-btn" variant="plain" text :to="'/valuations/lic/run-results'">
                  Back to Run List
                </v-btn></v-col
              ></v-row
            >
            <v-row v-if="!loading && !dataAvailable">
              <v-col>
                <p>There is no data available for this run configuration</p>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="runList.length > 0" cols="3">
                <v-select
                  v-model="selectedRunDate"
                  variant="outlined"
                  density="compact"
                  placeholder="Run Date"
                  :items="runList"
                  @update:modelValue="getPortfolios"
                >
                </v-select>
              </v-col>
              <v-col v-if="portfolioList.length > 0" cols="3">
                <v-select
                  v-model="selectedPortfolio"
                  variant="outlined"
                  density="compact"
                  placeholder="Portfolios"
                  label="Portfolios"
                  :items="portfolioList"
                  @update:modelValue="getProducts"
                ></v-select>
              </v-col>
              <v-col v-if="productList.length > 0" cols="3">
                <v-select
                  v-model="selectedProduct"
                  variant="outlined"
                  density="compact"
                  placeholder="Products"
                  label="Products"
                  :items="productList"
                  @update:modelValue="getResultsForProduct"
                ></v-select
              ></v-col>
            </v-row>
            <v-row v-if="rowData.length > 0">
              <v-col>
                <data-grid :columnDefs="columnDefs" :rowData="rowData" :pagination="true">
                </data-grid>
              </v-col>
            </v-row>
            <v-row v-if="runSettings !== null">
              <v-col>
                <v-card>
                  <v-card-title class="header-title accent white--text mb-3"
                    >Run Settings</v-card-title
                  >
                  <v-card-text>
                    <v-table class="trans-tables">
                      <thead>
                        <tr class="table-row">
                          <th class="minwidth-name table-col">Run Name</th>
                          <th class="minwidth table-col">Run Date</th>
                          <th class="minwidth table-col">LIC Configuration Name</th>
                          <th class="minwidth table-col">Opening Balance Date</th>
                          <th class="minwidth table-col">Run By</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ runSettings.run_name }}</td>
                          <td>{{ runSettings.run_date }}</td>
                          <td>{{ runSettings.lic_configuration_name }}</td>
                          <td>{{ runSettings.opening_balance_date }}</td>
                          <td>{{ runSettings.user_name }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LicService from '../../../api/LicService'
import formatValues from '../../../utils/format_values'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

const router = useRouter()
const loading = ref(false)
const runSettings: any = ref(null)
const dataAvailable = ref(false)
const runId: any = ref(null)
const runList = ref([])
const portfolioList: any = ref([])
const productList: any = ref([])
const rowData: any = ref([])
const selectedRunDate = ref('')
const selectedPortfolio = ref('')
const selectedProduct = ref('')
const columnDefs: any = ref([])

onMounted(() => {
  runId.value = router.currentRoute.value.params.id
  getPortfolios()
  // LicService.getLicBuildUps(runId.value, null, null).then((response) => {
  //   console.log(response.data)
  //   runList.value = response.data.list
  // })
})

const getPortfolios = () => {
  loading.value = true
  LicService.getLicBuildUps(runId.value, null, null).then((response) => {
    console.log(response.data)
    portfolioList.value = response.data.list
    runSettings.value = response.data.audit_trail
    if (portfolioList.value.length > 0) {
      dataAvailable.value = true
      portfolioList.value.unshift('All Portfolios')
      selectedPortfolio.value = 'All Portfolios'
      rowData.value = response.data.data
      createColumnDefs(rowData.value[0])
    }
    loading.value = false
  })
}

const getProducts = () => {
  if (selectedPortfolio.value !== 'All Portfolios') {
    LicService.getLicBuildUps(runId.value, selectedPortfolio.value, null).then((response) => {
      console.log(response)
      rowData.value = response.data.data
      productList.value = response.data.list
      runSettings.value = response.data.audit_trail
      productList.value.unshift('All Products')
      selectedProduct.value = 'All Products'
      createColumnDefs(rowData.value[0])
    })
  } else {
    productList.value = []
    getPortfolios()
  }
}

const getResultsForProduct = () => {
  if (selectedProduct.value !== 'All Products') {
    LicService.getLicBuildUps(runId.value, selectedPortfolio.value, selectedProduct.value).then(
      (response) => {
        rowData.value = response.data.data
        createColumnDefs(rowData.value[0])
      }
    )
  } else {
    getProducts()
  }
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 150
    columnDefs.value.push(header)
  })
}
</script>

<style></style>
