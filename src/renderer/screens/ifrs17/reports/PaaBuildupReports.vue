<template>
  <v-container>
    <base-card>
      <template #header>
        <span class="headline">PAA Build Up</span>
      </template>
      <template #default>
        <v-row v-if="runList.length < 1" class="mt-3">
          <v-col>
            <h4>there are no runs to display currently</h4>
          </v-col>
        </v-row>

        <v-row v-if="runList.length > 0" class="mt-3">
          <v-col cols="3">
            <v-select
              v-model="selectedRun"
              density="compact"
              variant="outlined"
              label="IFRS17 Runs"
              :items="runList"
              item-title="run_date"
              item-value="run_date"
              @update:modelValue="getRunPortfolios"
            ></v-select>
          </v-col>
          <v-col v-if="selectedRun !== null" cols="3">
            <v-select
              v-model="selectedPortfolio"
              density="compact"
              variant="outlined"
              label="Portfolios"
              placeholder="Select Portfolio"
              :items="portfolioList"
              item-title="portfolio_name"
              item-value="portfolio_name"
              @update:modelValue="getPortfolioProducts"
            ></v-select>
          </v-col>

          <v-col v-if="productList !== null && productList.length > 0" cols="3">
            <v-select
              v-model="selectedProduct"
              density="compact"
              variant="outlined"
              label="Product"
              :items="productList"
              item-title="product_code"
              item-value="product_code"
              @update:modelValue="getPortfolioProductGroups"
            ></v-select>
          </v-col>
          <v-col v-if="groups.length > 0" cols="3">
            <v-select
              v-model="selectedGroup"
              density="compact"
              variant="outlined"
              label="IFRS17 Groups"
              :items="groups"
              item-title="ifrs17_group"
              item-value="ifrs17_group"
              @update:modelValue="getPortfolioProductGroup"
            ></v-select>
          </v-col>
        </v-row>
        <loading-indicator :loadingData="loadingData" />
        <v-row v-if="stepResults.length > 0 && !loadingData">
          <v-col>
            <data-grid :show-export="true" :columnDefs="columnDefs" :rowData="stepResults" />
          </v-col>
        </v-row>
      </template>
    </base-card>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'

// data
const selectedRun = ref(null)
const selectedProduct: any = ref(null)
const selectedGroup: any = ref(null)
const groups: any = ref([])
const stepResults = ref([])
const runList = ref([])
const productList: any = ref([])
const columnDefs: any = ref([])
const loadingData = ref(false)
const portfolioList: any = ref([])
const selectedPortfolio: any = ref(null)
// methods

const getRunPortfolios = () => {
  portfolioList.value = []
  loadingData.value = true
  console.log(selectedRun.value)
  CsmEngine.getRunPortfolios(selectedRun.value).then((res) => {
    portfolioList.value = res.data.list
    stepResults.value = res.data.portfolios
    createColumnDefs(stepResults.value)
    portfolioList.value.unshift('All Portfolios')
    selectedPortfolio.value = 'All Portfolios'
    loadingData.value = false
  })
}

const getPortfolioProducts = () => {
  loadingData.value = true
  if (selectedPortfolio.value !== 'All Portfolios') {
    console.log('portfolio: ', selectedPortfolio.value)
    console.log('run: ', selectedRun.value)
    selectedProduct.value = null
    selectedGroup.value = null
    groups.value = []
    CsmEngine.getRunPortfolioProducts(selectedRun.value, selectedPortfolio.value).then((res) => {
      console.log('res: ', res)
      productList.value = res.data.list
      stepResults.value = res.data.portfolios
      createColumnDefs(stepResults.value)
      productList.value.unshift('All Products')
      selectedProduct.value = 'All Products'
      loadingData.value = false
    })
  } else {
    productList.value = []
    selectedProduct.value = null
    groups.value = []
    selectedGroup.value = null
    getRunPortfolios()
    loadingData.value = false
  }
}

const getPortfolioProductGroups = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    CsmEngine.getPortfolioProductGroups(
      selectedRun.value,
      selectedPortfolio.value,
      selectedProduct.value
    ).then((res) => {
      groups.value = res.data.list
      stepResults.value = res.data.portfolios
      createColumnDefs(stepResults.value)
      groups.value.unshift('All Groups')
      selectedGroup.value = 'All Groups'
      loadingData.value = false
    })
  } else {
    getPortfolioProducts()
  }
}

const getPortfolioProductGroup = () => {
  CsmEngine.getPortfolioProductGroup(
    selectedRun.value,
    selectedPortfolio.value,
    selectedProduct.value,
    selectedGroup.value
  ).then((res) => {
    stepResults.value = res.data.portfolios
    createColumnDefs(stepResults.value)
  })
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    header.sortable = true
    header.filter = true
    header.resizable = true

    columnDefs.value.push(header)
  })
}

// lifecycle

onMounted(() => {
  CsmEngine.getPAARunList('active').then((res) => {
    runList.value = res.data
  })
})

// export default {
//   data() {
//     return {
//       loadingData: false,
//       csmFile: null,
//       runList: [],
//       columnDefs: [],
//       selectedPortfolio: null,
//       portfolioList: [],
//       productList: [],
//       groupList: [],
//       groups: [],
//       stepResults: [],
//       selectedRun: null,
//       selectedProduct: null,
//       selectedGroup: null,
//       financeVariables: []
//     }
//   },
//   mounted() {
//     CsmEngine.getPAARunList('active').then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     getRunPortfolios(runDate) {
//       this.portfolioList = []
//       this.loadingData = true
//       CsmEngine.getRunPortfolios(runDate).then((res) => {
//         this.portfolioList = res.data.list
//         this.stepResults = res.data.portfolios
//         this.createColumnDefs(this.stepResults)
//         this.portfolioList.unshift('All Portfolios')
//         this.selectedPortfolio = 'All Portfolios'
//         this.loadingData = false
//       })
//     },
//     getPortfolioProducts() {
//       this.loadingData = true
//       if (this.selectedPortfolio !== 'All Portfolios') {
//         this.selectedProduct = null
//         this.selectedGroup = null
//         this.groups = []
//         CsmEngine.getRunPortfolioProducts(this.selectedRun, this.selectedPortfolio).then((res) => {
//           this.productList = res.data.list
//           this.stepResults = res.data.portfolios
//           this.createColumnDefs(this.stepResults)
//           this.productList.unshift('All Products')
//           this.selectedProduct = 'All Products'
//           this.loadingData = false
//         })
//       } else {
//         this.productList = []
//         this.selectedProduct = null
//         this.groupList = []
//         this.selectedGroup = null
//         this.getRunPortfolios(this.selectedRun)
//         this.loadingData = false
//       }
//     },
//     getPortfolioProductGroups() {
//       if (this.selectedGroup !== 'All Groups') {
//         this.loadingData = true
//         CsmEngine.getPortfolioProductGroups(
//           this.selectedRun,
//           this.selectedPortfolio,
//           this.selectedProduct
//         ).then((res) => {
//           this.groupList = res.data.list
//           this.stepResults = res.data.portfolios
//           this.createColumnDefs(this.stepResults)
//           this.groupList.unshift('All Groups')
//           this.selectedGroup = 'All Groups'
//           this.loadingData = false
//         })
//       } else {
//         this.getPortfolioProducts()
//       }
//     },
//     getPortfolioProductGroup() {
//       CsmEngine.getPortfolioProductGroup(
//         this.selectedRun,
//         this.selectedPortfolio,
//         this.selectedProduct,
//         this.selectedGroup
//       ).then((res) => {
//         this.stepResults = res.data.portfolios
//         this.createColumnDefs(this.stepResults)
//       })
//     },

//     createColumnDefs(data) {
//       this.columnDefs = []
//       Object.keys(data[0]).forEach((element) => {
//         const header = {}
//         header.headerName = element
//         header.field = element
//         header.valueFormatter = formatValues
//         header.minWidth = 200
//         this.columnDefs.push(header)
//       })
//     }
//   }
// }
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
