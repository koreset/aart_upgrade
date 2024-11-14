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
              <v-col v-if="variableGroups.length > 0" cols="3">
                <v-select
                  v-model="selectedVariableGroup"
                  :items="variableGroups"
                  item-value="name"
                  item-title="name"
                  return-object
                  variant="outlined"
                  density="compact"
                  placeholder="Choose a variable group"
                  label="Aggregation variable group"
                  @update:modelValue="onVariableGroupChange"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-btn
                  v-if="selectedVariableGroup !== null"
                  rounded
                  size="small"
                  variant="outlined"
                  color="primary"
                  @click="viewVariables"
                  >View variable list</v-btn
                >
                <v-btn
                  rounded
                  size="small"
                  variant="outlined"
                  color="primary"
                  @click="showVariableDialog"
                  >Create variable group</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="my-5"></v-divider>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="selectedValuationJob"
                  :messages="varMessage"
                  :disabled="selectedVariableGroup === null"
                  label="Valuation Run"
                  placeholder="Select Valuation Run"
                  variant="outlined"
                  density="compact"
                  item-value="id"
                  :items="valuationJobs"
                  :item-props="itemProps"
                  return-object
                  @update:model-value="onValuationJobChange"
                  @update:focused="warnEmptyVariables"
                ></v-select>
              </v-col>
              <v-col v-if="selectedValuationJob" cols="4">
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
                cols="4"
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
            </v-row>
            <loading-indicator :loading-data="loadingData"></loading-indicator>

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
          <span class="headline">Create aggregation variable groups</span>
        </template>

        <template #default>
          <v-container>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="variableGroupName"
                  label="Variable Group Name"
                  placeholder="Enter a name for the variable group"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <!-- Available Items List -->
              <v-col>
                <base-card :show-actions="false">
                  <template #header>
                    <span class="headline">Available Variables</span>
                  </template>
                  <template #default>
                    <v-row>
                      <v-col>
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
                      </v-col>
                    </v-row>
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
                  <v-btn
                    v-if="variableGroupName !== '' && selectedVariables.length > 0"
                    variant="outlined"
                    rounded
                    size="small"
                    @click="saveVariableGroup"
                    >Save Group</v-btn
                  >
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
    <v-dialog v-model="viewDialog" max-width="1000px">
      <base-card :show-actions="false">
        <template #header>
          <span class="headline">{{ selectedVariableGroup.name }}</span>
        </template>

        <template #default>
          <v-container>
            <v-row>
              <v-col class="text-right">
                <v-btn color="primary" variant="plain" @click="viewDialog = false">Close</v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <base-card :show-actions="false">
                  <template #header>
                    <span class="headline">Variable List</span>
                  </template>
                  <template #default>
                    <v-row>
                      <v-col>
                        <v-list class="scrollable-list">
                          <v-list-item
                            v-for="(item, index) in selectedVariableGroup.variables"
                            :key="index"
                          >
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </template>
                </base-card>
              </v-col>
            </v-row>
          </v-container>
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
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

const loadingData = ref(false)
const varMessage = ref('')
const dialog = ref(false)
const viewDialog = ref(false)
const selectedVariables: any = ref([])
const valuationJobs = ref([])
const selectedValuationJob: any = ref(null)
const selectedJobProduct: any = ref(null)
const aggregationVariables: any = ref([])
const baseAggregationVariables: any = ref([])
const selectedFromAvailable = ref<string[]>([])
const selectedFromTarget = ref<string[]>([])
const rowData: any = ref([])
const columnDefs: any = ref([])
const spCodes: any = ref([])

const jobProducts: any = ref([])
const selectedSpCode: any = ref(null)
const variableGroupName: any = ref('')
const variableGroups: any = ref([])
const selectedVariableGroup: any = ref(null)
const itemProps = (item) => {
  return {
    title: item.run_name,
    subtitle: `Run date - ${item.run_date}`
  }
}

const warnEmptyVariables = () => {
  if (selectedVariableGroup.value === null) {
    varMessage.value = 'Please select variables to view results'
  }
}

const onVariableGroupChange = () => {
  console.log(selectedVariableGroup.value)
  if (selectedVariableGroup.value === null) {
    return
  }
  varMessage.value = selectedVariableGroup.value.name + ' will be used to generate results'
}

const viewVariables = () => {
  viewDialog.value = true
}
const showVariableDialog = () => {
  dialog.value = true
  selectedVariables.value = []
  aggregationVariables.value = baseAggregationVariables.value
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

const saveVariableGroup = () => {
  if (variableGroupName.value === '') {
    return
  }
  const vGroup: any = {
    name: variableGroupName.value,
    variables: selectedVariables.value
  }

  ValuationService.saveVariableGroup(vGroup).then((res) => {
    const newGroup = res.data
    variableGroups.value.push(newGroup)
    variableGroupName.value = ''
    dialog.value = false
    selectedVariables.value = []
  })
}

const getAggregatedResultsForProductAndSpCode = () => {
  if (selectedSpCode.value === 'All SP Codes') {
    getAggregatedResultsForProduct()
    return
  }
  rowData.value = []
  loadingData.value = true
  ValuationService.getAggregatedResultsForProductAndSpCode(
    selectedValuationJob.value.id,
    selectedJobProduct.value.product_code,
    selectedSpCode.value,
    selectedVariableGroup.value.variables
  ).then((res) => {
    rowData.value = res.data
    createColumnDefs(rowData.value)
    loadingData.value = false
  })
}

const getAggregatedResultsForProduct = () => {
  spCodes.value = []
  selectedSpCode.value = null
  rowData.value = []
  if (selectedJobProduct.value.product_id === null) {
    getAggregatedResults()
    return
  }
  loadingData.value = true
  ValuationService.getAggregatedResultsForProduct(
    selectedValuationJob.value.id,
    selectedJobProduct.value.product_code,
    selectedVariableGroup.value.variables
  ).then((res) => {
    rowData.value = res.data
    createColumnDefs(rowData.value)
    loadingData.value = false
    ValuationService.getSpCodesForProduct(
      selectedValuationJob.value.id,
      selectedJobProduct.value.product_code
    ).then((res) => {
      spCodes.value = res.data
      spCodes.value.unshift('All SP Codes')
      selectedSpCode.value = spCodes.value[0]
    })
  })
}

const getAggregatedResults = async () => {
  // if (selectedVariables.value.length === 0) {
  //   return
  // }
  if (selectedVariableGroup.value === null) {
    return
  }
  loadingData.value = true

  const result = await ValuationService.getAggregatedResults(
    selectedValuationJob.value.id,
    selectedVariableGroup.value.variables
  )
  rowData.value = result.data
  createColumnDefs(rowData.value)
  loadingData.value = false
}

onMounted(async () => {
  const res = await ProductService.getValuationJobs()
  valuationJobs.value = res.data

  const res2 = await ValuationService.getAggregationVariables()
  aggregationVariables.value = res2.data
  baseAggregationVariables.value = res2.data

  const resVars = await ValuationService.getVariableGroups()
  variableGroups.value = resVars.data

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
    header.sortable = true
    header.filter = true
    header.resizable = true

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
