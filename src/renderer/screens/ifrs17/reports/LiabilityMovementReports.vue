<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Liability Movement Reports</span>
          </template>
          <template #default>
            <v-row v-if="runList.length > 0" class="mt-3">
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
              <v-col v-if="groups.length > 0" cols="4">
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
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
import { onMounted, ref } from 'vue'

// data
const selectedRun = ref(null)
const runList = ref([])
const productList: any = ref([])
const groups: any = ref([])
const selectedProduct: any = ref(null)
const selectedGroup: any = ref(null)
const reportData: any = ref(null)
const loadingData = ref(false)
const columnDefs: any = ref([])

// lifecycle
onMounted(() => {
  getRunList()
})

// methods
const getProducts = () => {
  loadingData.value = true
  CsmEngine.getLiabilityMovementProducts(selectedRun.value).then((res) => {
    productList.value = res.data.list
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    reportData.value = res.data.movements
    createColumnDefs(reportData.value)
    loadingData.value = false
  })
}

const getRunList = () => {
  CsmEngine.getLiabilityMovementRunList().then((res) => {
    runList.value = res.data
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
    header.sortable = true
    header.filter = true
    header.resizable = true

    columnDefs.value.push(header)
  })
}

const getGroupReport = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    CsmEngine.getLiabilityMovementReport(
      selectedRun.value,
      selectedProduct.value,
      selectedGroup.value
    ).then((res) => {
      reportData.value = res.data
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
    CsmEngine.getLiabilityMovementReport(
      selectedRun.value,
      selectedProduct.value,
      selectedGroup.value
    ).then((res) => {
      reportData.value = res.data.movements
      createColumnDefs(reportData.value)
      groups.value = res.data.list
      groups.value.unshift('All Groups')
      selectedGroup.value = 'All Groups'
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
//       runList: [],
//       productList: [],
//       groups: [],
//       selectedProduct: null,
//       selectedGroup: null,
//       selectedRun: null
//     }
//   },
//   mounted() {
//     this.getRunList()
//   },
//   methods: {
//     getProducts() {
//       this.loadingData = true
//       CsmEngine.getLiabilityMovementProducts(this.selectedRun).then((res) => {
//         this.productList = res.data.list
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//         this.reportData = res.data.movements
//         this.createColumnDefs(this.reportData)
//         this.loadingData = false
//       })
//     },
//     getRunList() {
//       CsmEngine.getLiabilityMovementRunList().then((res) => {
//         this.runList = res.data
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
//         CsmEngine.getLiabilityMovementReport(
//           this.selectedRun,
//           this.selectedProduct,
//           this.selectedGroup
//         ).then((res) => {
//           this.reportData = res.data
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
//         CsmEngine.getLiabilityMovementReport(
//           this.selectedRun,
//           this.selectedProduct,
//           this.selectedGroup
//         ).then((res) => {
//           this.reportData = res.data.movements
//           this.createColumnDefs(this.reportData)
//           this.groups = res.data.list
//           this.groups.unshift('All Groups')
//           this.selectedGroup = 'All Groups'
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
