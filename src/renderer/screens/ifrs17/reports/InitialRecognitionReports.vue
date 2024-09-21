<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Initial Recognition Analysis Report</span>
          </template>
          <template #default>
            <v-row class="mt-3">
              <v-col cols="4">
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
              <v-col v-if="productList.length > 0" cols="4">
                <v-select
                  v-model="selectedProduct"
                  density="compact"
                  variant="outlined"
                  label="Product"
                  :items="productList"
                  item-title="product_code"
                  item-value="product_code"
                  @update:modelValue="getProductReport"
                ></v-select>
              </v-col>
              <v-col v-if="groups.length > 0">
                <v-select
                  v-model="selectedGroup"
                  density="compact"
                  variant="outlined"
                  label="IFRS17 Groups"
                  :items="groups"
                  item-title="ifrs17_group"
                  item-value="ifrs17_group"
                  @update:modelValue="getGroupReport"
                ></v-select>
              </v-col>
            </v-row>
            <loading-indicator :loadingData="loadingData" />
            <v-row v-if="reportData !== null && !loadingData">
              <v-col>
                <data-grid :columnDefs="columnDefs" :rowData="reportData" />
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'

// data
const loadingData = ref(false)
const reportData: any = ref(null)
const columnDefs: any = ref([])
const productList: any = ref([])
const runList: any = ref([])
const groups: any = ref([])
const selectedProduct = ref(null)
const selectedGroup = ref(null)
const selectedRun = ref(null)

onMounted(() => {
  CsmEngine.getInitialRecogRuns().then((res) => {
    runList.value = res.data
  })
})

// methods
const getProducts = () => {
  loadingData.value = true
  CsmEngine.getInitialRecogProducts(selectedRun.value).then((res) => {
    productList.value = res.data.list
    productList.value.unshift('All Products')
    selectedProduct.value = productList.value[0]
    reportData.value = res.data.report
    createColumnDefs(reportData.value)
    loadingData.value = false
  })
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(reportData.value[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 150
    columnDefs.value.push(header)
  })
}

const getGroupReport = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    CsmEngine.getInitialRecogForProductGroup(
      selectedRun.value,
      selectedProduct.value,
      selectedGroup.value
    ).then((res) => {
      reportData.value = res.data.report
      createColumnDefs(reportData.value)
      loadingData.value = false
    })
  } else {
    getProductReport()
  }
}

const getProductReport = () => {
  if (selectedProduct.value !== 'All Products') {
    loadingData.value = true
    CsmEngine.getInitialRecogForProduct(selectedRun.value, selectedProduct.value).then((res) => {
      groups.value = res.data.list
      groups.value.unshift('All Groups')
      selectedGroup.value = groups.value[0]
      reportData.value = res.data.report
      createColumnDefs(reportData.value)
      loadingData.value = false
    })
  } else {
    getProducts()
  }
}

// export default {
//   data() {
//     return {
//       loadingData: false,
//       reportData: null,
//       columnDefs: [],
//       productList: [],
//       runList: [],
//       groups: [],
//       selectedProduct: null,
//       selectedGroup: null,
//       selectedRun: null
//     }
//   },
//   mounted() {
//     CsmEngine.getInitialRecogRuns().then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     getProducts() {
//       this.loadingData = true
//       CsmEngine.getInitialRecogProducts(this.selectedRun).then((res) => {
//         this.productList = res.data.list
//         this.productList.unshift('All Products')
//         this.selectedProduct = this.productList[0]
//         this.reportData = res.data.report
//         this.createColumnDefs(this.reportData)
//         this.loadingData = false
//       })
//     },

//     /* eslint-disable */
//     createColumnDefs(data) {
//       this.columnDefs = []
//       Object.keys(this.reportData[0]).forEach((element) => {
//         let header = {}
//         header.headerName = element
//         header.field = element
//         header.valueFormatter = formatValues
//         header.minWidth = 150
//         this.columnDefs.push(header)
//       })
//     },
//     getGroupReport() {
//       if (this.selectedGroup !== 'All Groups') {
//         this.loadingData = true
//         CsmEngine.getInitialRecogForProductGroup(
//           this.selectedRun,
//           this.selectedProduct,
//           this.selectedGroup
//         ).then((res) => {
//           this.reportData = res.data.report
//           this.createColumnDefs(this.reportData)
//           this.loadingData = false
//         })
//       } else {
//         this.getProductReport()
//       }
//     },
//     getProductReport() {
//       if (this.selectedProduct !== 'All Products') {
//         this.loadingData = true
//         CsmEngine.getInitialRecogForProduct(this.selectedRun, this.selectedProduct).then((res) => {
//           this.groups = res.data.list
//           this.groups.unshift('All Groups')
//           this.selectedGroup = this.groups[0]
//           this.reportData = res.data.report
//           this.createColumnDefs(this.reportData)
//           this.loadingData = false
//         })
//       } else {
//         this.getProducts()
//       }
//     }
//   }
// }
</script>

<style></style>
