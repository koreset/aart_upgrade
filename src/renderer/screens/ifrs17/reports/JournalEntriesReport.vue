<template>
  <v-container>
    <base-card :show-actions="false">
      <template #header>
        <span class="headline">Journal Entry Reports</span>
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
                  @update:modelValue="getProductList"
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
                  @update:modelValue="getJournalEntries"
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
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { onMounted, ref } from 'vue'

// data
const selectedRun = ref(null)
const selectedProduct: any = ref(null)
const selectedGroup: any = ref(null)
const groups: any = ref([])
const reportEntries: any = ref([])
const runList: any = ref([])
const productList: any = ref([])
const columnDefs: any = ref([])
const loadingData = ref(false)

// methods
const getProductList = () => {
  loadingData.value = true
  CsmEngine.getJournalEntryProducts(selectedRun.value).then((res) => {
    productList.value = res.data.products
    reportEntries.value = res.data.steps
    if (reportEntries.value === null) {
      reportEntries.value = []
    }
    createColumnDefs(reportEntries.value)
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    loadingData.value = false
  })
}

const getReportGroups = () => {
  loadingData.value = true
  if (selectedProduct.value !== 'All Products') {
    CsmEngine.getJournalEntriesByProduct(selectedRun.value, selectedProduct.value).then((res) => {
      reportEntries.value = res.data.steps
      if (reportEntries.value === null) {
        reportEntries.value = []
      }
      createColumnDefs(reportEntries.value)

      groups.value = res.data.groups
      groups.value.unshift('All Groups')
      selectedGroup.value = 'All Groups'
      loadingData.value = false
    })
  } else {
    getProductList()
    groups.value = []
  }
}

const getJournalEntries = () => {
  if (selectedGroup.value === 'All Groups') {
    getReportGroups()
  } else {
    reportEntries.value = []
    loadingData.value = true

    CsmEngine.getJournalEntriesByGroup(selectedGroup.value, selectedRun.value).then((res) => {
      reportEntries.value = res.data
      if (reportEntries.value === null) {
        reportEntries.value = []
      }
      createColumnDefs(reportEntries.value)
      loadingData.value = false
    })
  }
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 150

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
//   components: { LoadingIndicator },
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
//     getJournalEntries() {
//       if (this.selectedGroup === 'All Groups') {
//         this.getReportGroups()
//       } else {
//         this.reportEntries = []
//         this.loadingData = true

//         CsmEngine.getJournalEntriesByGroup(this.selectedGroup, this.selectedRun).then((res) => {
//           this.reportEntries = res.data
//           if (this.reportEntries === null) {
//             this.reportEntries = []
//           }
//           this.createColumnDefs(this.reportEntries)
//           this.loadingData = false
//         })
//       }
//     },
//     getProductList() {
//       this.loadingData = true
//       CsmEngine.getJournalEntryProducts(this.selectedRun).then((res) => {
//         this.productList = res.data.products
//         this.reportEntries = res.data.steps
//         if (this.reportEntries === null) {
//           this.reportEntries = []
//         }
//         this.createColumnDefs(this.reportEntries)
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//         this.loadingData = false
//       })
//     },
//     getReportGroups() {
//       this.loadingData = true
//       if (this.selectedProduct !== 'All Products') {
//         CsmEngine.getJournalEntriesByProduct(this.selectedRun, this.selectedProduct).then((res) => {
//           this.reportEntries = res.data.steps
//           if (this.reportEntries === null) {
//             this.reportEntries = []
//           }
//           this.createColumnDefs(this.reportEntries)

//           this.groups = res.data.groups
//           this.groups.unshift('All Groups')
//           this.selectedGroup = 'All Groups'
//           this.loadingData = false
//         })
//       } else {
//         this.getProductList()
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
//         header.minWidth = 150

//         this.columnDefs.push(header)
//       })
//     }
//   }
// }
</script>

<style></style>
