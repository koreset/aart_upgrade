<template>
  <v-container>
    <base-card>
      <template #header>
        <span class="headline">Reporting</span>
      </template>
      <template #default>
        <v-row>
          <v-col cols="4">
            <v-select
              v-model="selectedRun"
              density="compact"
              variant="outlined"
              class="mt-2"
              label="IFRS17 Runs"
              :items="runList"
              item-title="run_date"
              item-value="run_date"
              return-object
              @update:modelValue="getProducts"
            ></v-select>
          </v-col>

          <v-col v-if="products.length > 0" cols="4">
            <v-select
              v-model="selectedProduct"
              label="Select a Product"
              density="compact"
              variant="outlined"
              class="mt-2"
              clearable
              :items="products"
              item-title="product_code"
              item-value="product_code"
              @update:modelValue="clearReport"
            >
            </v-select>
          </v-col>
          <v-col v-if="products.length > 0" cols="4">
            <v-col>
              <v-btn small rounded class="primary" @click="getReport">Get Report</v-btn>
            </v-col>
          </v-col>
        </v-row>
        <v-row v-if="reportItems.length > 0">
          <v-col>
            <v-btn small rounded class="primary" @click="exportToExcel">Export to Excel</v-btn>
          </v-col>
        </v-row>
        <v-row v-if="reportItems.length > 0">
          <v-col>
            <v-table class="trans-tables">
              <thead>
                <tr>
                  <th>IASB format of Income Statement</th>
                  <th>Index</th>
                  <th>Current Year</th>
                  <th>Previous Year</th>
                  <th>Notes</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in reportItems"
                  :key="item.line_item"
                  :class="item.style == 'bold' ? 'sub-total' : ''"
                >
                  <td>{{ item.type == 'empty' ? '' : item.line_item }}</td>
                  <td>
                    {{ item.type == 'empty' || item.type == 'sub-total' ? '' : item.index }}
                  </td>
                  <td class="text-right">{{
                    item.type == 'empty' ? '' : formatNumber(item.current_year)
                  }}</td>
                  <td class="text-right">{{
                    item.type == 'empty' ? '' : formatNumber(item.past_year)
                  }}</td>
                  <td>{{ item.type == 'empty' ? '' : item.notes }}</td>
                  <td>{{ item.type == 'empty' ? '' : item.reference }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </template>
    </base-card>
  </v-container>
</template>

<script setup lang="ts">
import CsmService from '@/renderer/api/CsmEngine'
import ExcelJS from 'exceljs'
import { onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
// data
const selectedRun: any = ref(null)
const runList: any = ref([])
const selectedProduct: any = ref(null)
const reportItems: any = ref([])
const products: any = ref([])

// lifecycle
onMounted(() => {
  CsmService.getCsmRunList().then((res) => {
    runList.value = res.data
  })
})

// methods
const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const getProducts = () => {
  selectedProduct.value = null
  clearReport()
  products.value = []
  CsmService.getCsmProductList(selectedRun.value.run_date).then((res) => {
    products.value = res.data
    products.value.unshift({ product_code: 'ALL' })
  })
}

const clearReport = () => {
  reportItems.value = []
}

const getReport = () => {
  reportItems.value = []
  if (selectedProduct.value !== null) {
    CsmService.getFinancialReports(selectedRun.value.run_date, selectedProduct.value).then(
      (res) => {
        reportItems.value = res.data
      }
    )
  }
}

const exportToExcel = () => {
  const workbook = new ExcelJS.Workbook()

  const worksheet = workbook.addWorksheet('Financial Report')
  worksheet.columns = [
    { header: 'IASB format of Income Statement', key: 'line_item', width: 30 },
    { header: 'Index', key: 'index', width: 10 },
    { header: 'Current Year', key: 'current_year', width: 20 },
    { header: 'Previous Year', key: 'past_year', width: 20 },
    { header: 'Notes', key: 'notes', width: 20 },
    { header: 'Reference', key: 'reference2', width: 20 }
  ]

  reportItems.value.forEach((item) => {
    console.log(item)
    worksheet.addRow(item)
  })

  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF38546C' }
  }
  worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(1).height = 30

  // Generate a blob from the workbook and create a download link
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'table_data.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  })
}

// export default {
//   data() {
//     return {
//       selectedRun: null,
//       runList: [],
//       selectedProduct: null,
//       reportItems: [],
//       products: []
//     }
//   },
//   mounted() {
//     CsmService.getCsmRunList().then((res) => {
//       this.runList = res.data
//     })
//   },
//   methods: {
//     // function to format numbers with commas
//     formatNumber(num) {
//       return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
//     },
//     getProducts() {
//       this.selectedProduct = null
//       this.clearReport()
//       this.products = []
//       CsmService.getCsmProductList(this.selectedRun.run_date).then((res) => {
//         this.products = res.data
//         this.products.unshift({ product_code: 'ALL' })
//       })
//     },

//     clearReport() {
//       this.reportItems = []
//     },
//     getReport() {
//       if (this.selectedProduct !== null) {
//         CsmService.getFinancialReports(this.selectedRun.run_date, this.selectedProduct).then(
//           (res) => {
//             this.reportItems = []
//             this.reportItems = res.data
//           }
//         )
//       }
//     },
//     exportToExcel() {
//       const workbook = new ExcelJS.Workbook()

//       const worksheet = workbook.addWorksheet('Financial Report')
//       worksheet.columns = [
//         { header: 'IASB format of Income Statement', key: 'line_item', width: 30 },
//         { header: 'Index', key: 'index', width: 10 },
//         { header: 'Current Year', key: 'current_year', width: 20 },
//         { header: 'Previous Year', key: 'past_year', width: 20 },
//         { header: 'Notes', key: 'notes', width: 20 },
//         { header: 'Reference', key: 'reference2', width: 20 }
//       ]

//       this.reportItems.forEach((item) => {
//         console.log(item)
//         worksheet.addRow(item)
//       })

//       worksheet.getRow(1).font = { bold: true }
//       worksheet.getRow(1).fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FF38546C' }
//       }
//       worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } }
//       worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }
//       worksheet.getRow(1).height = 30

//       // Generate a blob from the workbook and create a download link
//       workbook.xlsx.writeBuffer().then((data) => {
//         const blob = new Blob([data], {
//           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         })
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = 'table_data.xlsx'
//         a.click()
//         window.URL.revokeObjectURL(url)
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

.sub-total {
  font-weight: 900;
  font-style: italic;
  border-top: 1px solid black;
  background-color: cadetblue;
}

/* class, text-right to align text to the right */
.text-right {
  text-align: right;
}
</style>
