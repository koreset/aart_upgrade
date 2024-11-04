<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Result Aggregations</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedValuationJob"
                  label="Valuation Run"
                  placeholder="Select Valuation Run"
                  variant="outlined"
                  density="compact"
                  item-value="id"
                  :items="valuationJobs"
                  :item-props="itemProps"
                  return-object
                  @update:model-value="onValuationJobChange"
                ></v-select>
              </v-col>
              <v-col v-if="selectedValuationJob" cols="3">
                <v-select
                  v-model="selectedJobProduct"
                  label="Product"
                  placeholder="Select Product"
                  variant="outlined"
                  density="compact"
                  item-title="product_name"
                  item-value="product_id"
                  return-object
                  :items="jobProducts"
                  @update:model-value="getAggregatedResultsForProduct"
                ></v-select>
              </v-col>
              <v-col
                v-if="selectedJobProduct && selectedJobProduct.product_name !== 'All Products'"
                cols="3"
              >
                <v-select
                  v-model="selectedSpCode"
                  label="SP Code"
                  placeholder="Select SP Code"
                  variant="outlined"
                  density="compact"
                  :items="spCodes"
                  @update:model-value="getAggregatedResultsForProductAndSpCode"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-btn
                  rounded
                  size="small"
                  variant="outlined"
                  color="primary"
                  @click="dialog = true"
                  >Select variables</v-btn
                >
              </v-col>

            </v-row>
            <v-row v-if="rowData.length > 0">
              <v-col>
                <data-grid
                  :show-export="true"
                  :rowData="rowData"
                  :columnDefs="columnDefs"
                ></data-grid>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <!-- Dialog containing the list component -->
    <v-dialog v-model="dialog" max-width="1000px">
      <base-card>
        <template #header>
          <span class="headline">Select required aggregation variables</span>
        </template>

        <template #default>
          <v-container>
            <v-row>
              <!-- Available Items List -->
              <v-col>
                <base-card :show-actions="false">
                  <template #header>
                    <span class="headline">Available Variables</span>
                  </template>
                  <template #default>
                    <v-list class="scrollable-list">
                      <v-list-item
                        v-for="(item, index) in aggregationVariables"
                        :key="index"
                        :class="{
                          'selected-item': selectedFromAvailable.includes(item)
                        }"
                        @click="toggleSelection(item, 'available')"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </template>
                </base-card>
              </v-col>

              <v-col cols="2">
                <!-- Buttons for moving items -->
                <v-row justify="center" align="center">
                  <v-btn
                    variant="outlined"
                    rounded
                    size="small"
                    :disabled="selectedFromAvailable.length === 0"
                    @click="moveSelectedToTarget"
                  >
                    Move →
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    rounded
                    size="small"
                    :disabled="aggregationVariables.length === 0"
                    @click="moveAllToTarget"
                  >
                    Move All →
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    rounded
                    size="small"
                    :disabled="selectedVariables.length === 0"
                    @click="moveAllToAvailable"
                  >
                    ← Move All
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    rounded
                    size="small"
                    :disabled="selectedFromTarget.length === 0"
                    @click="moveSelectedToAvailable"
                  >
                    ← Move
                  </v-btn>
                </v-row>
              </v-col>

              <!-- Target Items List -->
              <v-col>
                <base-card :show-actions="false">
                  <template #header>
                    <span class="headline">Selected Variables</span>
                  </template>
                  <template #default>
                    <v-list class="scrollable-list">
                      <v-list-item
                        v-for="(item, index) in selectedVariables"
                        :key="index"
                        :class="{
                          'selected-item': selectedFromTarget.includes(item)
                        }"
                        @click="toggleSelection(item, 'target')"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </template>
                </base-card>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <template #actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialog = false">Close</v-btn>
        </template>
      </base-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import ProductService from '@/renderer/api/ProductService'
import ValuationService from '@/renderer/api/ValuationService'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/format_values'

const dialog = ref(false)
const selectedVariables: any = ref([])
const valuationJobs = ref([])
const selectedValuationJob: any = ref(null)
const selectedJobProduct: any = ref(null)
const aggregationVariables: any = ref([])
const selectedFromAvailable = ref<string[]>([])
const selectedFromTarget = ref<string[]>([])
const rowData: any = ref([])
const columnDefs: any = ref([])
const spCodes: any = ref([])

const jobProducts: any = ref([])
const selectedSpCode: any = ref(null)
const itemProps = (item) => {
  return {
    title: item.run_name,
    subtitle: `Run date - ${item.run_date}`
  }
}

const onValuationJobChange = (job) => {
  jobProducts.value = []
  selectedJobProduct.value = null
  rowData.value = []
  columnDefs.value = []

  jobProducts.value = job.products
  jobProducts.value.unshift({ product_id: null, product_name: 'All Products' })
  selectedJobProduct.value = jobProducts.value[0]
  getAggregatedResults()
}

const getAggregatedResultsForProductAndSpCode = () => {
  if (selectedSpCode.value === 'All SP Codes') {
    getAggregatedResultsForProduct()
    return
  }

  ValuationService.getAggregatedResultsForProductAndSpCode(
    selectedValuationJob.value.id,
    selectedJobProduct.value.product_code,
    selectedSpCode.value,
    selectedVariables.value
  ).then((res) => {
    rowData.value = res.data
    createColumnDefs(rowData.value)
  })
}

const getAggregatedResultsForProduct = () => {
  spCodes.value = []
  selectedSpCode.value = null
  if (selectedJobProduct.value.product_id === null) {
    getAggregatedResults()
    return
  }

  ValuationService.getAggregatedResultsForProduct(
    selectedValuationJob.value.id,
    selectedJobProduct.value.product_code,
    selectedVariables.value
  ).then((res) => {
    rowData.value = res.data
    createColumnDefs(rowData.value)
    ValuationService.getSpCodesForProduct(
      selectedValuationJob.value.id,
      selectedJobProduct.value.product_code
    ).then((res) => {
      spCodes.value = res.data
      spCodes.value.unshift('All SP Codes')
    })
  })
}

const getAggregatedResults = async () => {
  if (selectedVariables.value.length === 0) {
    return
  }
  const result = await ValuationService.getAggregatedResults(
    selectedValuationJob.value.id,
    selectedVariables.value
  )
  rowData.value = result.data
  createColumnDefs(rowData.value)
}
onMounted(async () => {
  const res = await ProductService.getValuationJobs()
  valuationJobs.value = res.data

  const res2 = await ValuationService.getAggregationVariables()
  aggregationVariables.value = res2.data

  // get valuation runs list
})

// Function to move selected items to the target list
const moveSelectedToTarget = () => {
  selectedVariables.value.push(...selectedFromAvailable.value)
  aggregationVariables.value = aggregationVariables.value.filter(
    (item) => !selectedFromAvailable.value.includes(item)
  )
  selectedFromAvailable.value = []
}

// Function to move selected items back to the available list
const moveSelectedToAvailable = () => {
  aggregationVariables.value.push(...selectedFromTarget.value)
  selectedVariables.value = selectedVariables.value.filter(
    (item) => !selectedFromTarget.value.includes(item)
  )
  selectedFromTarget.value = []
}

// Function to move all available items to the target list
const moveAllToTarget = () => {
  selectedVariables.value.push(...aggregationVariables.value)
  aggregationVariables.value = []
  selectedFromAvailable.value = [] // Clear selection
}

// Function to move all target items back to the available list
const moveAllToAvailable = () => {
  aggregationVariables.value.push(...selectedVariables.value)
  selectedVariables.value = []
  selectedFromTarget.value = [] // Clear selection
}

// Function to handle item selection
const toggleSelection = (item: string, list: string) => {
  if (list === 'available') {
    if (!selectedFromAvailable.value.includes(item)) {
      selectedFromAvailable.value.push(item)
    } else {
      selectedFromAvailable.value = selectedFromAvailable.value.filter((i) => i !== item)
    }
  } else if (list === 'target') {
    if (!selectedFromTarget.value.includes(item)) {
      selectedFromTarget.value.push(item)
    } else {
      selectedFromTarget.value = selectedFromTarget.value.filter((i) => i !== item)
    }
  }
}

const createColumnDefs = (data: any) => {
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
</script>
<style scoped>
.selected-item {
  background-color: #e0f7fa; /* Light cyan */
  color: #006064; /* Dark cyan */
}

.scrollable-list {
  max-height: 300px; /* Set the height of the list */
  overflow-y: auto; /* Enable vertical scrolling if content exceeds max height */
}

.v-btn {
  margin: 10px;
}
</style>
