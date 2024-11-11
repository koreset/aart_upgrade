<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Closing Balance Details</span>
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
                  @update:modelValue="getReportsByGroup"
                ></v-select>
              </v-col>
            </v-row>
            <loading-indicator v-if="runList.length === 0" />
            <v-row v-if="reportEntries.length > 0">
              <v-col>
                <data-grid :columnDefs="columnDefs" :rowData="reportEntries" />
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
const runList = ref([])
const productList: any = ref([])
const groups: any = ref([])
const reportEntries = ref([])
const selectedRun = ref(null)
const selectedProduct: any = ref(null)
const selectedGroup: any = ref(null)
const columnDefs: any = ref([])

// methods
const getReportsByGroup = () => {
  if (selectedGroup.value !== 'All Groups') {
    CsmEngine.getBalanceSheetRecordByProductGroup(
      selectedRun.value,
      selectedProduct.value,
      selectedGroup.value
    ).then((res) => {
      reportEntries.value = res.data.reports
      if (reportEntries.value !== null) {
        createColumnDefs(reportEntries.value)
      } else {
        reportEntries.value = []
      }
    })
  } else {
    getReportGroups()
  }
}

const getReportGroups = () => {
  if (selectedProduct.value !== 'All Products') {
    CsmEngine.getBalanceSheetRecordByProduct(selectedRun.value, selectedProduct.value).then(
      (res) => {
        groups.value = res.data.groups
        groups.value.unshift('All Groups')
        selectedGroup.value = 'All Groups'
        reportEntries.value = res.data.reports
        if (reportEntries.value !== null) {
          createColumnDefs(reportEntries.value)
        } else {
          reportEntries.value = []
        }
      }
    )
  } else {
    getProducts()
    groups.value = []
  }
}

const getProducts = () => {
  CsmEngine.getBalanceSheetProducts(selectedRun.value).then((res) => {
    productList.value = res.data.products
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    reportEntries.value = res.data.reports
    if (reportEntries.value !== null) {
      createColumnDefs(reportEntries.value)
    } else {
      reportEntries.value = []
    }
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
  CsmEngine.getCsmRunList().then((res) => {
    runList.value = res.data
  })
})

// export default {
//   data() {
//     return {
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
//     getReportsByGroup() {
//       if (this.selectedGroup !== 'All Groups') {
//         CsmEngine.getBalanceSheetRecordByProductGroup(
//           this.selectedRun,
//           this.selectedProduct,
//           this.selectedGroup
//         ).then((res) => {
//           this.reportEntries = res.data.reports
//           if (this.reportEntries !== null) {
//             this.createColumnDefs(this.reportEntries)
//           } else {
//             this.reportEntries = []
//           }
//         })
//       } else {
//         this.getReportGroups()
//       }
//     },
//     getReportGroups() {
//       if (this.selectedProduct !== 'All Products') {
//         CsmEngine.getBalanceSheetRecordByProduct(this.selectedRun, this.selectedProduct).then(
//           (res) => {
//             this.groups = res.data.groups
//             this.groups.unshift('All Groups')
//             this.selectedGroup = 'All Groups'
//             this.reportEntries = res.data.reports
//             if (this.reportEntries !== null) {
//               this.createColumnDefs(this.reportEntries)
//             } else {
//               this.reportEntries = []
//             }
//           }
//         )
//       } else {
//         this.getProducts()
//         this.groups = []
//       }
//     },
//     getProducts() {
//       CsmEngine.getBalanceSheetProducts(this.selectedRun).then((res) => {
//         this.productList = res.data.products
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//         this.reportEntries = res.data.reports
//         if (this.reportEntries !== null) {
//           this.createColumnDefs(this.reportEntries)
//         } else {
//           this.reportEntries = []
//         }
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

<style></style>
