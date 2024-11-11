<template>
  <v-container>
    <base-card :show-actions="false">
      <template #header>
        <span class="headline">IFRS17 Run Results</span>
      </template>
      <template #default>
        <v-row
          ><v-col>
            <v-btn class="custom-btn" variant="text" :to="{ name: 'ifrs17-run-results' }">
              {{ backSign }} Back to IFRS17 Run List
            </v-btn></v-col
          ></v-row
        >
        <v-row v-if="csmRun !== null">
          <v-col>
            <h3>Run Name: {{ csmRun.name }} ({{ csmRun.measurement_type }})</h3>
            <p>Run Date: {{ csmRun.run_date }}</p>
          </v-col>
        </v-row>
        <v-row class="mt-3">
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
            <data-grid :columnDefs="columnDefs" :rowData="stepResults" />
          </v-col>
        </v-row>
        <v-row v-if="csmRun !== null">
          <v-col>
            <base-card :show-actions="false">
              <template #header>
                <span class="headline">Run Settings</span>
              </template>
              <template #default>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="table-col minwidth-name">Run Name</th>
                      <th class="table-col minwidth">Run Date</th>
                      <th class="table-col minwidth-name">Configuration Name</th>
                      <th class="table-col minwidth">Transition Type</th>
                      <th class="table-col minwidth">Measurement Type</th>
                      <th class="table-col minwidth">Finance Year</th>
                      <th class="table-col minwidth">Risk Adjustment Year</th>
                      <th class="table-col minwidth">Run By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ csmRun.name }}</td>
                      <td>{{ csmRun.run_date }}</td>
                      <td>{{ csmRun.configuration_name }}</td>
                      <td>{{ csmRun.transition_type }}</td>
                      <td>{{ csmRun.measurement_type }}</td>
                      <td>{{ csmRun.finance_year }}</td>
                      <td>{{ csmRun.risk_adjustment_year }}</td>
                      <td>{{ csmRun.user_name }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </base-card>
          </v-col>
        </v-row>
      </template>
    </base-card>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseCard from '@/renderer/components/BaseCard.vue'

const $route = useRoute()
const backSign = ref('<')
const csmRunId: any = ref(null)
const csmRunDate: any = ref(null)
const csmRun: any = ref(null)
const productList: any = ref([])
const groups: any = ref([])
const stepResults = ref([])
const selectedProduct: any = ref(null)
const selectedGroup: any = ref(null)
const columnDefs: any = ref([])

onMounted(() => {
  csmRunId.value = $route.params.id
  csmRunDate.value = $route.params.run_date
  console.log(csmRunId.value, csmRunDate.value)
  CsmEngine.getAosSingleRunProductList(csmRunId.value, csmRunDate.value).then((res) => {
    stepResults.value = res.data.steps
    productList.value = res.data.products
    productList.value.unshift('All Products')
    selectedProduct.value = 'All Products'
    csmRun.value = res.data.run_settings
    createColumnDefs(stepResults.value)
  })
})

const getProductSteps = () => {
  stepResults.value = []
  CsmEngine.getAosSingleRunProduct(csmRunId.value, csmRunDate.value, selectedProduct.value).then(
    (res) => {
      stepResults.value = res.data.steps
      createColumnDefs(stepResults.value)
      if (selectedProduct.value !== 'All Products') {
        groups.value = res.data.groups
        groups.value.unshift('All Groups')
        selectedGroup.value = 'All Groups'
      } else {
        groups.value = []
      }
    }
  )
}

const getGroupSteps = () => {
  if (selectedGroup.value !== 'All Groups') {
    CsmEngine.getAosSingleRunProductGroup(
      csmRunId.value,
      csmRunDate.value,
      selectedProduct.value,
      selectedGroup.value
    ).then((res) => {
      stepResults.value = res.data.steps
      createColumnDefs(stepResults.value)
    })
  } else {
    getProductSteps()
  }
}

// const getReportByProduct = () => {
//   CsmEngine.getReportByProduct(selectedProduct.value).then((response) => {
//     const fileURL = window.URL.createObjectURL(new Blob([response.data]))
//     const fileLink = document.createElement('a')

//     fileLink.href = fileURL
//     fileLink.setAttribute('download', selectedProduct.value + '.xlsx')
//     document.body.appendChild(fileLink)
//     fileLink.click()
//   })
// }

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
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

// export default {
//   data() {
//     return {
//       backSign: '<',
//       csmFile: null,
//       runList: [],
//       csmRunId: null,
//       csmRunDate: null,
//       csmRun: null,
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
//     this.csmRunId = this.$router.currentRoute.params.id
//     this.csmRunDate = this.$router.currentRoute.params.run_date
//     console.log(this.csmRunId, this.csmRunDate)
//     CsmEngine.getAosRunList().then((res) => {
//       this.runList = res.data
//     })
//     this.getProducts()
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
//       if (this.selectedGroup !== 'All Groups') {
//         CsmEngine.getAosSingleRunProductGroup(
//           this.csmRunId,
//           this.csmRunDate,
//           this.selectedProduct,
//           this.selectedGroup
//         ).then((res) => {
//           this.stepResults = res.data.steps
//           this.createColumnDefs(this.stepResults)
//         })
//       } else {
//         this.getProductSteps()
//       }
//     },
//     getProductSteps() {
//       this.stepResults = []
//       CsmEngine.getAosSingleRunProduct(this.csmRunId, this.csmRunDate, this.selectedProduct).then(
//         (res) => {
//           this.stepResults = res.data.steps
//           this.createColumnDefs(this.stepResults)
//           if (this.selectedProduct !== 'All Products') {
//             this.groups = res.data.groups
//             this.groups.unshift('All Groups')
//             this.selectedGroup = 'All Groups'
//           } else {
//             this.groups = []
//           }
//         }
//       )
//     },
//     getProducts() {
//       this.selectedProduct = null
//       this.selectedGroup = null
//       this.groups = []
//       CsmEngine.getAosSingleRunProductList(this.csmRunId, this.csmRunDate).then((res) => {
//         this.productList = res.data.products
//         this.stepResults = res.data.steps
//         this.csmRun = res.data.run_settings
//         this.createColumnDefs(this.stepResults)
//         this.productList.unshift('All Products')
//         this.selectedProduct = 'All Products'
//       })
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

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
