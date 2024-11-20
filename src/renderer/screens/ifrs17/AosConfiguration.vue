<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">AOS Configuration</span>
          </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col>
                  <v-table>
                    <thead>
                      <tr class="table-col">
                        <th class="table-row">Configuration Name</th>
                        <th class="table-row">Coverage Units</th>
                        <th class="table-row">External SAP Source</th>
                        <th class="table-row">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in existingConfigs" :key="item.id">
                        <td>{{ item.configuration_name }}</td>
                        <td>{{ item.coverage_unit_option }}</td>
                        <td>{{ item.external_sap }}</td>
                        <td>
                          <v-btn
                            variant="outlined"
                            size="small"
                            rounded
                            @click="showTableData(item)"
                          >
                            <v-icon color="primary">mdi-information</v-icon><span>Info</span>
                          </v-btn>

                          <v-btn
                            size="small"
                            variant="outlined"
                            color="red"
                            rounded
                            class="ml-3"
                            @click="removeFromConfigs(item)"
                          >
                            <v-icon>mdi-delete</v-icon><span>Delete</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <file-info
                    :tableTitle="'AOS'"
                    :rowData="rowData"
                    :columnDefs="columnDefs"
                    :onUpdate:isInfoDialogOpen="closeInfoBox"
                    :isDialogOpen="infoDialog"
                  />
                </v-col>
              </v-row>

              <v-divider class="mb-9 mt-9"></v-divider>
              <v-row>
                <v-col>
                  <h4>Create a new configuration</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="aosSetName"
                    variant="outlined"
                    density="compact"
                    label="Enter a name for this configuration"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    v-model="coverageUnitOption"
                    variant="outlined"
                    density="compact"
                    label="Choose a Coverage Unit Option"
                    placeholder="Coverage Unit Options"
                    :items="coverageUnitOptions"
                    item-title="text"
                    item-value="value"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox
                    v-model="useManualSap"
                    :label="`Use imported Scoped Aggregation Results`"
                    @update:modelValue="toggleSap"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-table>
                    <thead>
                      <tr class="table-row">
                        <th class="table-col">Variable</th>
                        <th class="table-col">Description</th>
                        <th class="table-col minwidth-name">Run Name</th>
                        <th class="table-col minwidth">Time</th>
                        <th class="table-col">Notes</th>
                        <th class="table-col">Assumption Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in aosVars" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.description }}</td>
                        <td>
                          <v-select
                            v-model="item.run_name"
                            class="mt-7"
                            density="compact"
                            clearable
                            variant="outlined"
                            label="Select a Run"
                            placeholder="Select a Run"
                            :items="valuationRuns"
                            :item-title="getTitle"
                            item-value="run_name"
                            @change="uniqueRuns"
                          ></v-select>
                        </td>
                        <td>{{ item.time }}</td>
                        <td>{{ item.notes }}</td>
                        <td>{{ item.assumption_basis }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-row v-if="filteredRuns.length > 0">
                <v-col>
                  <v-table>
                    <thead>
                      <tr class="table-row">
                        <th class="table-col">Run Name</th>
                        <th class="table-col">Description</th>
                        <th class="table-col">MPF</th>
                        <th class="table-col">Mortality</th>
                        <th class="table-col">Morbidity</th>
                        <th class="table-col">Lapse</th>
                        <th class="table-col">Retrenchment</th>
                        <th class="table-col">Parameter</th>
                        <th class="table-col">Yield Curve</th>
                        <th class="table-col">Discount Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in filteredRuns" :key="item.run_name">
                        <td>{{ item.run_name }}</td>
                        <td>{{ item.run_description }}</td>
                        <td>{{ item.run_parameters.modelpoint_year }}</td>
                        <td>{{ item.run_parameters.mortality_year }}</td>
                        <td>{{ item.run_parameters.morbidity_year }}</td>
                        <td>{{ item.run_parameters.lapse_year }}</td>
                        <td>{{ item.run_parameters.retrenchment_year }}</td>
                        <td>{{ item.run_parameters.parameter_year }}</td>
                        <td>{{ item.run_parameters.yieldcurve_year }}</td>
                        <td>{{ item.yield_curve_basis }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    rounded
                    size="small"
                    variant="outlined"
                    class="primary"
                    @click="saveConfiguration"
                  >
                    Save Configuration
                  </v-btn>
                </v-col>
              </v-row>
              <v-snackbar v-model="snackbar" :timeout="timeout" :multi-line="true">
                {{ text }}
                <v-btn rounded color="red" variant="plain" @click="snackbar = false">Close</v-btn>
              </v-snackbar>
              <confirmation-dialog ref="confirmAction" />
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ProductService from '@/renderer/api/ProductService'
import CsmService from '@/renderer/api/CsmEngine'
import formatValues from '@/renderer/utils/format_values'
import { onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
// import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
import FileInfo from '@/renderer/components/FileInfo.vue'

// data
const infoDialog = ref(false)
const externalSap = ref(false)
const confirmAction = ref()
const aosSetName = ref(null)
const coverageUnitOption = ref(null)
const coverageUnitOptions = ref([
  {
    text: 'Undiscounted Coverage Units',
    value: 'UndiscountedCoverageUnits'
  },
  { text: 'Discounted Coverage Units', value: 'DiscountedCoverageUnits' }
])
const useManualSap = ref(false)
const text = ref('')
const timeout = ref(3000)
const snackbar = ref(false)
const valuationRuns: any = ref([])
const existingConfigs: any = ref([])
const columnDefs: any = ref([])
const rowData: any = ref([])
const filteredRuns: any = ref([])
const aosVars: any = ref([])

onMounted(() => {
  CsmService.getAosVariables().then((response) => {
    aosVars.value = response.data
    aosVars.value.forEach((item) => {
      item.run_name = null
    })
  })

  CsmService.getExistingConfigs().then((res) => {
    existingConfigs.value = res.data
    uniqueRuns()
  })
  getValuationJobList()
})

// methods
const closeInfoBox = (value) => {
  infoDialog.value = value
}

const getTitle = (item) => {
  return `${item.run_name} - [ Run date: ${item.run_date} ] `
}
const toggleSap = () => {
  for (const object of aosVars.value) {
    object.run_name = null
  }

  if (useManualSap.value) {
    getManualSapList()
  } else {
    getValuationJobList()
  }
}

const showTableData = (item) => {
  columnDefs.value = []
  rowData.value = []

  if (item.aos_variables.length > 0) {
    createColumnDefs(item.aos_variables)
    item.aos_variables.forEach((item) => {
      const transformed: any = {}
      const keys = Object.keys(item)
      keys.forEach((i) => {
        if (isNaN(item[i])) {
          transformed[i] = item[i]
        } else {
          const value = Number(item[i])
          transformed[i] = value
        }
      })
      rowData.value.push(transformed)
    })
  }
  infoDialog.value = true
}

const removeFromConfigs = async (item) => {
  console.log(item)
  try {
    const res = await confirmAction.value.open(
      'Deleting AOS Configuraton',
      `Are you sure you want to delete ${item.configuration_name}?`
    )
    if (!res) return
    CsmService.deleteAosConfig(item.id).then(() => {
      existingConfigs.value = existingConfigs.value.filter((config) => config.id !== item.id)
    })
  } catch (error) {
    console.log(error)
  }
}

const getManualSapList = () => {
  CsmService.getSapFileList().then((response) => {
    valuationRuns.value = response.data
  })
}

const getValuationJobList = () => {
  ProductService.getValuationJobs().then((response) => {
    console.log(response.data)
    valuationRuns.value = response.data
  })
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 220
    header.filter = true
    header.resizable = true
    header.sortable = true
    columnDefs.value.push(header)
  })
}

const uniqueRuns = () => {
  console.log('uniqueRuns')
  if (!useManualSap.value) {
    filteredRuns.value = []
    aosVars.value.forEach((item) => {
      if (item.run_id !== null && item.run_id > 0) {
        const found = valuationRuns.value.find((obj) => obj.id === item.run_id)
        if (filteredRuns.value.indexOf(found) === -1) {
          filteredRuns.value.push(found)
        }
      }
    })
  }
  console.log(filteredRuns.value)
}

const saveConfiguration = () => {
  if (aosSetName.value === null || coverageUnitOption.value === null) {
    return
  }

  const payload: any = {}
  payload.configuration_name = aosSetName.value
  payload.coverage_unit_option = coverageUnitOption.value
  payload.external_sap = useManualSap.value
  if (useManualSap.value) {
    aosVars.value.forEach((item) => {
      item.id = 0
      item.run_id = 0
    })
  }
  payload.aos_variables = aosVars.value
  CsmService.postAosConfigurations(payload).then((res) => {
    if (res.status === 201) {
      text.value = 'AOS Configuration saved successfully'
      const newConfig: any = {}
      newConfig.aosSetName = payload.configuration_name
      newConfig.coverageUnitOption = payload.coverage_unit_option
      newConfig.external_sap = payload.external_sap
      newConfig.aos_variables = payload.aos_variables
      existingConfigs.value.push(newConfig)
      snackbar.value = true
      aosSetName.value = null
      coverageUnitOption.value = null
      externalSap.value = false
      for (const object of aosVars.value) {
        object.run_name = null
      }
    }
  })
  CsmService.getExistingConfigs().then((res) => {
    existingConfigs.value = res.data
  })
}
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
.minwidth {
  min-width: 110px !important;
}
.minwidth-name {
  min-width: 250px !important;
}
</style>
