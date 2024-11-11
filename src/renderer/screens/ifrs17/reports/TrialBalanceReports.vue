<template>
  <v-container>
    <base-card :show-actions="false">
      <template #header>
        <span class="headline">Trial Balance</span>
      </template>
      <template #default>
        <v-row>
          <v-col>
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
                  label="Products"
                  :items="productList"
                  item-title="name"
                  item-value="name"
                  @update:modelValue="getReportGroups"
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
                  @update:modelValue="getTrialBalanceEntries"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <loading-indicator :loadingData="loadingData" />
        <v-row v-if="reportEntries.length > 0 && !loadingData">
          <v-col>
            <data-grid :columnDefs="columnDefs" :rowData="reportEntries" />
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
const runList: any = ref([])
const productList: any = ref([])
const columnDefs: any = ref([])
const reportEntries: any = ref([])
const loadingData = ref(false)

// methods
const getProducts = () => {
  loadingData.value = true
  CsmEngine.getTrialBalanceByRunDate(selectedRun.value).then((res) => {
    productList.value = res.data.products
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    reportEntries.value = res.data.steps
    if (reportEntries.value !== null) {
      createColumnDefs(reportEntries.value)
    } else {
      reportEntries.value = []
    }
    loadingData.value = false
  })
}

const getTrialBalanceEntries = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    CsmEngine.getTrialBalanceByGroup(selectedGroup.value, selectedRun.value).then((res) => {
      reportEntries.value = res.data
      if (reportEntries.value !== null) {
        createColumnDefs(reportEntries.value)
      } else {
        reportEntries.value = []
      }
      loadingData.value = false
    })
  } else {
    getReportGroups()
  }
}

const getReportGroups = () => {
  if (selectedProduct.value !== 'All Products') {
    loadingData.value = true
    CsmEngine.getTrialBalanceByProduct(selectedProduct.value, selectedRun.value).then((res) => {
      groups.value = res.data.groups
      groups.value.unshift('All Groups')
      selectedGroup.value = 'All Groups'
      reportEntries.value = res.data.steps
      if (reportEntries.value !== null) {
        createColumnDefs(reportEntries.value)
      } else {
        reportEntries.value = []
      }
      loadingData.value = false
    })
  } else {
    getProducts()
    groups.value = []
  }
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
  CsmEngine.getCsmRunList().then((res) => {
    runList.value = res.data
  })
})

// export default {
//   data() {
//     return {
//       loadingData: false,
//       csmFile: null,
//       columnDefs: [],
//       runList: [],
//       productList: [],
//       groupList: [],
//       groups: [],
//       reportEntries: [],
//       selectedRun: null,
//       selectedProduct: null,
//       selectedGroup: null,
//       financeVariables: []
//     }
//   },
//   mounted() {
//     CsmEngine.getCsmRunList().then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     getProducts() {
//       this.loadingData = true
//       CsmEngine.getTrialBalanceByRunDate(this.selectedRun).then((res) => {
//         this.productList = res.data.products
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//         this.reportEntries = res.data.steps
//         if (this.reportEntries !== null) {
//           this.createColumnDefs(this.reportEntries)
//         } else {
//           this.reportEntries = []
//         }
//         this.loadingData = false
//       })
//     },

//     getTrialBalanceEntries() {
//       if (this.selectedGroup !== 'All Groups') {
//         this.loadingData = true
//         CsmEngine.getTrialBalanceByGroup(this.selectedGroup, this.selectedRun).then((res) => {
//           this.reportEntries = res.data
//           if (this.reportEntries !== null) {
//             this.createColumnDefs(this.reportEntries)
//           } else {
//             this.reportEntries = []
//           }
//           this.loadingData = false
//         })
//       } else {
//         this.getReportGroups()
//       }
//     },
//     getReportGroups() {
//       if (this.selectedProduct !== 'All Products') {
//         this.loadingData = true
//         CsmEngine.getTrialBalanceByProduct(this.selectedProduct, this.selectedRun).then((res) => {
//           this.groups = res.data.groups
//           this.groups.unshift('All Groups')
//           this.selectedGroup = 'All Groups'
//           this.reportEntries = res.data.steps
//           if (this.reportEntries !== null) {
//             this.createColumnDefs(this.reportEntries)
//           } else {
//             this.reportEntries = []
//           }
//           this.loadingData = false
//         })
//       } else {
//         this.getProducts()
//         this.groups = []
//       }
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

<style></style>
