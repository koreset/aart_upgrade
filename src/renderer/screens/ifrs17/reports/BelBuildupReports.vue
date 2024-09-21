<template>
  <v-container>
    <base-card>
      <template #header>
        <span class="headline">BEL Build Up</span>
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
              @update:modelValue="getProducts"
            ></v-select>
          </v-col>
          <v-col v-if="productList !== null && productList.length > 0" cols="4">
            <v-select
              v-model="selectedProduct"
              density="compact"
              variant="outlined"
              label="Product"
              :items="productList"
              item-title="product_code"
              item-value="product_code"
              @update:modelValue="getBelForProduct"
            ></v-select>
          </v-col>
          <v-col v-if="groups.length > 0" cols="4">
            <v-select
              v-model="selectedGroup"
              variant="outlined"
              density="compact"
              label="IFRS17 Groups"
              :items="groups"
              item-title="ifrs17_group"
              item-value="ifrs17_group"
              @update:modelValue="getGroupSteps"
            ></v-select>
          </v-col>
        </v-row>
        <loading-indicator :loadingData="loadingData" />
        <v-row v-if="stepResults.length > 0 && !loadingData">
          <v-col>
            <data-grid :columnDefs="columnDefs" :rowData="stepResults" />
          </v-col>
        </v-row>
      </template>
    </base-card>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import BaseCard from '@/renderer/components/BaseCard.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
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

// methods
const getProducts = () => {
  selectedProduct.value = null
  selectedGroup.value = null
  groups.value = []
  loadingData.value = true
  CsmEngine.getBelProductList(selectedRun.value).then((res) => {
    productList.value = res.data.products
    stepResults.value = res.data.steps
    createColumnDefs(stepResults.value)
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    loadingData.value = false
  })
}

const getBelForProduct = () => {
  groups.value = []
  stepResults.value = []
  CsmEngine.getBelForProduct(selectedRun.value, selectedProduct.value).then((res) => {
    stepResults.value = res.data.steps
    groups.value = res.data.groups
    createColumnDefs(stepResults.value)
    groups.value.unshift('All Groups')
    selectedGroup.value = 'All Groups'
    loadingData.value = false
  })
}

const getGroupSteps = () => {
  stepResults.value = []
  CsmEngine.getBelForProductGroup(
    selectedRun.value,
    selectedProduct.value,
    selectedGroup.value
  ).then((res) => {
    stepResults.value = res.data.steps
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
    columnDefs.value.push(header)
  })
}

// lifecycle
onMounted(() => {
  CsmEngine.getAosRunList().then((res) => {
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
//     CsmEngine.getAosRunList().then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     getProducts() {
//       this.selectedProduct = null
//       this.selectedGroup = null
//       this.groups = []
//       this.loadingData = true
//       CsmEngine.getBelProductList(this.selectedRun).then((res) => {
//         this.productList = res.data.products
//         this.stepResults = res.data.steps
//         this.createColumnDefs(this.stepResults)
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//         this.loadingData = false
//       })
//     },
//     getBelForProduct() {
//       this.groups = []
//       this.stepResults = []
//       CsmEngine.getBelForProduct(this.selectedRun, this.selectedProduct).then((res) => {
//         this.stepResults = res.data.steps
//         this.groups = res.data.groups
//         this.createColumnDefs(this.stepResults)
//         this.groups.unshift('All Groups')
//         this.selectedGroup = 'All Groups'
//         this.loadingData = false
//       })
//     },
//     getGroupSteps() {
//       console.log('getGroupSteps')
//       this.stepResults = []
//       CsmEngine.getBelForProductGroup(
//         this.selectedRun,
//         this.selectedProduct,
//         this.selectedGroup
//       ).then((res) => {
//         this.stepResults = res.data.steps
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
