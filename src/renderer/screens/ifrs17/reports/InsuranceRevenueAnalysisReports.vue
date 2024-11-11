<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="header-title accent white--text">Insurance Revenue Analysis Report</span>
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
const runList = ref([])
const selectedRun = ref(null)
const groups: any = ref([])
const selectedProduct = ref(null)
const selectedGroup = ref(null)

// lifecycle
onMounted(() => {
  CsmEngine.getInsuranceRevenueRuns().then((res) => {
    runList.value = res.data
  })
})

// methods
const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(reportData.value[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.minWidth = 200
    header.valueFormatter = formatValues
    header.sortable = true
    header.filter = true
    header.resizable = true

    columnDefs.value.push(header)
  })
}

const getGroupReport = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    CsmEngine.getInsuranceRevenueForProductGroup(
      selectedRun.value,
      selectedProduct.value,
      selectedGroup.value
    )
      .then((res) => {
        reportData.value = res.data.report
        createColumnDefs(reportData.value)
        loadingData.value = false
      })
      .catch(() => {
        loadingData.value = false
      })
  } else {
    getProductReport()
  }
}

const getProducts = () => {
  loadingData.value = true
  CsmEngine.getInsuranceRevenueForRun(selectedRun.value)
    .then((res) => {
      productList.value = res.data.list
      productList.value.unshift('All Products')
      selectedProduct.value = productList.value[0]
      reportData.value = res.data.report
      createColumnDefs(reportData.value)
      loadingData.value = false
    })
    .catch(() => {})
}

const getProductReport = () => {
  if (selectedProduct.value === 'All Products') {
    getProducts()
  } else {
    loadingData.value = true
    CsmEngine.getInsuranceRevenueForProduct(selectedRun.value, selectedProduct.value)
      .then((res) => {
        reportData.value = res.data.report
        createColumnDefs(reportData.value)
        groups.value = res.data.list
        groups.value.unshift('All Groups')
        selectedGroup.value = groups.value[0]
        loadingData.value = false
      })
      .catch(() => {
        loadingData.value = false
      })
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
//       selectedRun: null,
//       groups: [],
//       selectedProduct: null,
//       selectedGroup: null
//     }
//   },
//   mounted() {
//     CsmEngine.getInsuranceRevenueRuns().then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     /* eslint-disable */
//     createColumnDefs(data) {
//       this.columnDefs = []
//       Object.keys(this.reportData[0]).forEach((element) => {
//         let header = {}
//         header.headerName = element
//         header.field = element
//         header.minWidth = 200
//         header.valueFormatter = formatValues
//         this.columnDefs.push(header)
//       })
//     },
//     getGroupReport() {
//       if (this.selectedGroup !== 'All Groups') {
//         this.loadingData = true
//         CsmEngine.getInsuranceRevenueForProductGroup(
//           this.selectedRun,
//           this.selectedProduct,
//           this.selectedGroup
//         )
//           .then((res) => {
//             this.reportData = res.data.report
//             this.createColumnDefs(this.reportData)
//             this.loadingData = false
//           })
//           .catch(() => {
//             this.loadingData = false
//           })
//       } else {
//         this.getProductReport()
//       }
//     },
//     getProducts() {
//       this.loadingData = true
//       CsmEngine.getInsuranceRevenueForRun(this.selectedRun)
//         .then((res) => {
//           this.productList = res.data.list
//           this.productList.unshift('All Products')
//           this.selectedProduct = this.productList[0]
//           this.reportData = res.data.report
//           this.createColumnDefs(this.reportData)
//           this.loadingData = false
//         })
//         .catch(() => {})
//     },
//     getProductReport() {
//       if (this.selectedProduct === 'All Products') {
//         this.getProducts()
//       } else {
//         this.loadingData = true
//         CsmEngine.getInsuranceRevenueForProduct(this.selectedRun, this.selectedProduct)
//           .then((res) => {
//             this.reportData = res.data.report
//             this.createColumnDefs(this.reportData)
//             this.groups = res.data.list
//             this.groups.unshift('All Groups')
//             this.selectedGroup = this.groups[0]
//             this.loadingData = false
//           })
//           .catch(() => {
//             this.loadingData = false
//           })
//       }
//     }
//   }
// }
</script>

<style></style>
