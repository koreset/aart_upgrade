<template>
  <v-container>
    <base-card>
      <template #header>
        <span class="headline">IFRS17 AOS</span>
      </template>
      <template #default>
        <v-row v-if="runList.length < 1" class="mt-3">
          <v-col cols="4">
            <h4>there are no runs to display currently</h4>
          </v-col>
        </v-row>
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

          <v-col v-if="productList !== null && productList.length > 0" cols="4">
            <v-select
              v-model="selectedProduct"
              density="compact"
              variant="outlined"
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
              density="compact"
              variant="outlined"
              label="IFRS17 Groups"
              :items="groups"
              item-title="ifrs17_group"
              item-value="ifrs17_group"
              @update:modelValue="getGroupSteps"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="stepResults.length > 0">
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
import { ref, onMounted } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'

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
  CsmEngine.getAosProductList(selectedRun.value).then((res) => {
    productList.value = res.data.products
    stepResults.value = res.data.steps
    createColumnDefs(stepResults.value)
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    loadingData.value = false
  })
}

const getProductSteps = () => {
  stepResults.value = []
  loadingData.value = true
  CsmEngine.getProductSteps(selectedProduct.value, selectedRun.value).then((res) => {
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

const getGroupSteps = () => {
  loadingData.value = true
  if (selectedGroup.value !== 'All Groups') {
    CsmEngine.getGroupStepsWithRunDate(selectedRun.value, selectedGroup.value).then((res) => {
      stepResults.value = res.data.steps
      loadingData.value = false
    })
  } else {
    CsmEngine.getProductSteps(selectedProduct.value).then((res) => {
      groups.value = []
      stepResults.value = res.data.steps
      createColumnDefs(stepResults.value)
      groups.value = res.data.groups
      groups.value.unshift('All Groups')
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
    header.minWidth = 220
    columnDefs.value.push(header)
  })
}

// lifecycle
onMounted(async () => {
  const res = await CsmEngine.getAosRunList()
  runList.value = res.data
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
//     CsmEngine.getAosRunList().then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     getReportByGroup() {
//       CsmEngine.getReportByGroup(this.selectedGroup).then((response) => {
//         const fileURL = window.URL.createObjectURL(new Blob([response.data]))
//         const fileLink = document.createElement('a')

//         fileLink.href = fileURL
//         fileLink.setAttribute('download', 'aosreport' + '.xlsx')
//         document.body.appendChild(fileLink)

//         fileLink.click()
//       })
//     },
//     getReportByProduct() {
//       CsmEngine.getReportByProduct(this.selectedProduct).then((response) => {
//         const fileURL = window.URL.createObjectURL(new Blob([response.data]))
//         const fileLink = document.createElement('a')

//         fileLink.href = fileURL
//         fileLink.setAttribute('download', this.selectedProduct + '.xlsx')
//         document.body.appendChild(fileLink)
//         fileLink.click()
//       })
//     },
//     getGroupSteps() {
//       this.loadingData = true
//       if (this.selectedGroup !== 'All Groups') {
//         CsmEngine.getGroupStepsWithRunDate(this.selectedRun, this.selectedGroup).then((res) => {
//           this.stepResults = res.data.steps
//           this.loadingData = false
//         })
//       } else {
//         CsmEngine.getProductSteps(this.selectedProduct).then((res) => {
//           this.groups = []
//           this.stepResults = res.data.steps
//           this.createColumnDefs(this.stepResults)
//           this.groups = res.data.groups
//           this.groups.unshift('All Groups')
//           this.loadingData = false
//         })
//       }
//     },
//     getProductSteps() {
//       this.stepResults = []
//       this.loadingData = true
//       CsmEngine.getProductSteps(this.selectedProduct, this.selectedRun).then((res) => {
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
//       CsmEngine.getAosProductList(this.selectedRun).then((res) => {
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
//         header.minWidth = 220
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
