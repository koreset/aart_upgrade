<template>
  <v-container>
    <base-card>
      <template #header>
        <span class="headline">PAA Run Reports</span>
      </template>
      <template #default>
        <v-row v-if="runList.length < 1 && !loadingData" class="mt-3">
          <v-col>
            <h4>there are no runs to display currently</h4>
          </v-col>
        </v-row>

        <v-row v-if="runList.length > 0" class="mt-3">
          <v-col cols="4">
            <v-select
              v-model="selectedRun"
              variant="outlined"
              density="compact"
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
              variant="outlined"
              density="compact"
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
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { onMounted, ref } from 'vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

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
  CsmEngine.getPAAProductList(selectedRun.value).then((res) => {
    productList.value = res.data.products
    stepResults.value = res.data.steps
    createColumnDefs(stepResults.value)
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    loadingData.value = false
  })
}

const getGroupSteps = () => {
  loadingData.value = true

  if (selectedGroup.value !== 'All Groups') {
    CsmEngine.getPAAGroupSteps(selectedProduct.value, selectedRun.value, selectedGroup.value).then(
      (res) => {
        stepResults.value = res.data.steps
        createColumnDefs(stepResults.value)
        loadingData.value = false
      }
    )
  } else {
    getProductSteps()
  }
}

const getProductSteps = () => {
  stepResults.value = []
  loadingData.value = true

  CsmEngine.getPAAProductSteps(selectedProduct.value, selectedRun.value).then((res) => {
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
  loadingData.value = true
  CsmEngine.getPAARunList('inactive').then((res) => {
    runList.value = res.data
    loadingData.value = false
  })
})

// export default {
//   data() {
//     return {
//       loadingData: false,
//       csmFile: null,
//       runList: [],
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
//     CsmEngine.getPAARunList('inactive').then((res) => {
//       this.runList = res.data
//       this.loadingData = false
//     })
//   },
//   methods: {
//     getGroupSteps() {
//       this.loadingData = true

//       if (this.selectedGroup !== 'All Groups') {
//         CsmEngine.getPAAGroupSteps(this.selectedProduct, this.selectedRun, this.selectedGroup).then(
//           (res) => {
//             this.stepResults = res.data.steps
//             this.createColumnDefs(this.stepResults)
//             this.loadingData = false
//           }
//         )
//       } else {
//         this.getProductSteps()
//       }
//     },
//     getProductSteps() {
//       this.stepResults = []
//       this.loadingData = true

//       CsmEngine.getPAAProductSteps(this.selectedProduct, this.selectedRun).then((res) => {
//         this.stepResults = res.data.steps
//         this.createColumnDefs(this.stepResults)
//         if (this.selectedProduct !== 'All Products') {
//           this.groups = res.data.groups
//           this.groups.unshift('All Groups')
//           this.selectedGroup = 'All Groups'
//         } else {
//           this.groups = []
//         }
//         this.loadingData = false
//       })
//     },
//     getProducts() {
//       this.selectedProduct = null
//       this.selectedGroup = null
//       this.groups = []
//       this.loadingData = true
//       CsmEngine.getPAAProductList(this.selectedRun).then((res) => {
//         this.productList = res.data.products
//         this.stepResults = res.data.steps
//         this.createColumnDefs(this.stepResults)
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//         this.loadingData = false
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
