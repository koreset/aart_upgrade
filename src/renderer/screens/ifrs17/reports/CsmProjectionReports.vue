<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Csm Projection</span>
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
            <v-row v-if="reportData !== null">
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
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

import formatValues from '@/renderer/utils/format_values'
import { onMounted, ref } from 'vue'

// data
const loadingData = ref(false)
const reportData: any = ref(null)
const columnDefs: any = ref([])
const productList: any = ref([])
const runList = ref([])
const groups: any = ref([])
const selectedProduct = ref(null)
const selectedGroup = ref(null)
const selectedRun = ref(null)

// lifecycle
onMounted(() => {
  getRuns()
})

// methods
const getRuns = () => {
  CsmEngine.getCsmProjectionRuns().then((res) => {
    runList.value = res.data
  })
}

const getProducts = () => {
  loadingData.value = true
  CsmEngine.getCsmProjectionProducts(selectedRun.value).then((res) => {
    groups.value = []
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
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    columnDefs.value.push(header)
  })
}

const getGroupReport = () => {
  loadingData.value = true
  if (selectedGroup.value !== 'All Groups') {
    CsmEngine.getCsmProjectionProductGroup(
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
  loadingData.value = true
  if (selectedProduct.value !== 'All Products') {
    CsmEngine.getCsmProjectionProductGroups(selectedRun.value, selectedProduct.value).then(
      (res) => {
        groups.value = res.data.list
        groups.value.unshift('All Groups')
        selectedGroup.value = groups.value[0]
        reportData.value = res.data.report
        createColumnDefs(reportData.value)
        loadingData.value = false
      }
    )
  } else {
    getProducts()
  }
}
</script>

<!-- export default {
  data() {
    return {
      loadingData: false,
      reportData: null,
      columnDefs: [],
      runList: [],
      productList: [],
      groups: [],
      selectedRun: null,
      selectedProduct: null,
      selectedGroup: null
    }
  },
  mounted() {
    this.getRuns()
  },
  methods: {
    getRuns() {
      CsmEngine.getCsmProjectionRuns().then((res) => {
        this.runList = res.data
      })
    },
    getProducts() {
      CsmEngine.getCsmProjectionProducts(this.selectedRun).then((res) => {
        this.groups = []
        this.productList = res.data.list
        this.productList.unshift('All Products')
        this.selectedProduct = this.productList[0]
        this.reportData = res.data.report
        this.createColumnDefs(this.reportData)
      })
    },

    /* eslint-disable */
    createColumnDefs(data) {
      this.columnDefs = []
      Object.keys(this.reportData[0]).forEach((element) => {
        let header = {}
        header.headerName = element
        header.field = element
        header.valueFormatter = formatValues
        header.minWidth = 200
        this.columnDefs.push(header)
      })
    },
    getGroupReport() {
      if (this.selectedGroup !== 'All Groups') {
        CsmEngine.getCsmProjectionProductGroup(
          this.selectedRun,
          this.selectedProduct,
          this.selectedGroup
        ).then((res) => {
          this.reportData = res.data.report
          this.createColumnDefs(this.reportData)
        })
      } else {
        this.getProductReport()
      }
    },
    getProductReport() {
      if (this.selectedProduct !== 'All Products') {
        CsmEngine.getCsmProjectionProductGroups(this.selectedRun, this.selectedProduct).then(
          (res) => {
            this.groups = res.data.list
            this.groups.unshift('All Groups')
            this.selectedGroup = this.groups[0]
            this.reportData = res.data.report
            this.createColumnDefs(this.reportData)
          }
        )
      } else {
        this.getProducts()
      }
    }
  }
} -->

<style></style>
