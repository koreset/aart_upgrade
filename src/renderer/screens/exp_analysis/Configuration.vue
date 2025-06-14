<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Configurations</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="configurationName"
                  class="mr-9"
                  placeholder="Configuration Name"
                  label="Configuration Name"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex align-baseline" cols="3">
                <v-btn
                  rounded
                  class="primary mt-1"
                  size="small"
                  variant="outlined"
                  @click="createConfiguration"
                  >Add Configuration</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <base-card :showActions="false">
                  <template #header>
                    <span class="headline">Portfolios List</span>
                  </template>
                  <template #default>
                    <v-expansion-panels v-model="activePanel">
                      <v-expansion-panel
                        v-for="item in configurations"
                        :key="item.name"
                        @group:selected="checkClass"
                      >
                        <v-expansion-panel-title :class="expansionColor">
                          <template #default="{ expanded }">
                            <v-row no-gutters>
                              <v-col cols="12">
                                <v-fade-transition leave-absolute>
                                  <v-row v-if="expanded" no-gutters style="width: 100%">
                                    <v-col cols="3">{{ item.name }}</v-col>
                                    <v-col cols="9" class="d-flex justify-end">
                                      <file-updater
                                        :upload-complete="loadDataComplete"
                                        :show-year="true"
                                        :showVersion="true"
                                        :show-exp-table-types="true"
                                        :tableType="'Experience Analysis'"
                                        :actionName="'Upload Data'"
                                        @uploadFile="handleUpload($event, item)"
                                      />
                                      <v-btn
                                        class="ml-5 mr-3"
                                        variant="outlined"
                                        size="small"
                                        rounded
                                        @click.stop="deletePortfolio(item.id)"
                                      >
                                        <v-icon color="red">mdi-delete</v-icon>
                                        <span>Delete Configuration</span>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                  <v-row v-else>
                                    <v-col cols="3">{{ item.name }}</v-col>
                                  </v-row>
                                </v-fade-transition>
                              </v-col>
                            </v-row>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-row>
                            <v-col>
                              <p class="mpc-border mb-5"><b>Exposure Data Points</b></p>
                              <v-row v-if="item.exp_data_years == null || item.exp_data_years == 0">
                                <v-col>
                                  There are no exposure data points uploaded for this portfolio
                                </v-col>
                              </v-row>
                              <v-row v-else>
                                <v-col cols="3">
                                  <v-select
                                    v-model="selectedExpDataYear"
                                    density="compact"
                                    variant="outlined"
                                    :items="item.exp_data_years"
                                    label="Model Point Year"
                                    @update:model-value="
                                      getExpDataVersions(item.id, selectedExpDataYear)
                                    "
                                  ></v-select>
                                </v-col>
                                <v-col v-if="yearVersions.length > 0" cols="3">
                                  <v-select
                                    v-model="selectedYearVersion"
                                    density="compact"
                                    variant="outlined"
                                    :items="yearVersions"
                                    item-title="version"
                                    item-value="version"
                                    label="Version"
                                    return-object
                                  ></v-select>
                                </v-col>
                                <v-col v-if="selectedYearVersion" cols="2"
                                  ><h4 class="mt-2"
                                    >Count: {{ selectedYearVersion.count }}</h4
                                  ></v-col
                                >
                                <v-col v-if="selectedYearVersion" cols="4">
                                  <v-btn
                                    class="primary mr-5"
                                    rounded
                                    size="small"
                                    variant="outlined"
                                    @click="
                                      showData(
                                        item.id,
                                        'exposure_data',
                                        selectedYearVersion.year,
                                        selectedYearVersion.version
                                      )
                                    "
                                  >
                                    <v-icon left color="primary">mdi-information</v-icon>
                                    <span>Info</span></v-btn
                                  >
                                  <v-btn
                                    class="red"
                                    rounded
                                    size="small"
                                    variant="outlined"
                                    @click="
                                      deleteData(
                                        'exposure_data',
                                        item.id,
                                        selectedYearVersion.year,
                                        selectedYearVersion.version
                                      )
                                    "
                                  >
                                    <v-icon color="error">mdi-delete</v-icon>
                                    <span>Delete</span></v-btn
                                  >
                                </v-col>
                              </v-row>
                              <loading-indicator :loading-data="loadingData"></loading-indicator>
                              <v-row v-if="rowData.length > 0 && !loadingData">
                                <data-grid
                                  :table-title="'Exposure Data'"
                                  :show-close-button="true"
                                  :rowData="rowData"
                                  :columnDefs="columnDefs"
                                  @update:clear-data="clearData"
                                ></data-grid>
                              </v-row>
                              <v-row v-if="actualRowData.length > 0 && !loadingData">
                                <data-grid
                                  :table-title="'Actual Data'"
                                  :show-close-button="true"
                                  :rowData="actualRowData"
                                  :columnDefs="columnDefs"
                                  @update:clear-data="clearData"
                                ></data-grid>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </template>
                </base-card>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmDeleteDialog" />
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ExpService from '../../api/ExpAnalysisService'
import IbnrService from '../../api/IbnrService'
import BaseCard from '@/renderer/components/BaseCard.vue'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import FileUpdater from '@/renderer/components/FileUpdater.vue'
import formatValues from '@/renderer/utils/format_values'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

const confirmDeleteDialog = ref()
const loadingData = ref(false)
const configurations: any = ref([])
const portfolios = ref([])
const configurationName = ref('')
const activePanel = ref([])
const expansionColor = ref('')
const selectedExpDataYear: any = ref(null)
const yearVersions = ref([])
// const actualYearVersions = ref([])
const selectedYearVersion: any = ref(null)
const selectedActualYearVersion: any = ref(null)
const selectedActualDataYear: any = ref(null)
const rowData: any = ref([])
const actualRowData: any = ref([])
const columnDefs: any = ref([])
const loadDataComplete = ref(false)

const createConfiguration = () => {
  loadingData.value = true
  const payload: any = {
    name: configurationName.value
  }
  ExpService.createConfiguration(payload).then((res) => {
    configurations.value = res.data
    loadingData.value = false
    loadConfigs()
  })
}

const getExpDataVersions = (id: number, year: number) => {
  yearVersions.value = []

  const configData = configurations.value.filter((item) => item.id === id)

  yearVersions.value = configData[0].exp_data_year_versions.filter(
    (item: any) => item.year === year
  )
}

// const getActualDataVersions = (id: number, year: number) => {
//   actualYearVersions.value = []

//   const configData = configurations.value.filter((item) => item.id === id)

//   actualYearVersions.value = configData[0].actual_data_year_versions.filter(
//     (item: any) => item.year === year
//   )
// }

const clearData = () => {
  actualRowData.value = []
  rowData.value = []
  columnDefs.value = []
  loadingData.value = false
}

const checkClass = (item: any) => {
  if (item) {
    expansionColor.value = 'expanded'
  } else {
    expansionColor.value = ''
  }
  selectedExpDataYear.value = null
  selectedYearVersion.value = null
  selectedActualDataYear.value = null
  yearVersions.value = []
  selectedActualYearVersion.value = null
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
}

const deletePortfolio = async (id: number) => {
  const res = await confirmDeleteDialog.value.open(
    'Delete Portfolio',
    'Are you sure you want to delete this portfolio?'
  )

  if (!res) return

  loadingData.value = true
  ExpService.deleteConfiguration(id).then((res) => {
    configurations.value = res.data
    loadingData.value = false
    loadConfigs()
  })
}

const loadConfigs = () => {
  loadingData.value = true
  ExpService.getConfigurations().then((res) => {
    configurations.value = res.data
    loadingData.value = false
  })
}

const showData = (id: number, name: string, year: number, version: number) => {
  loadingData.value = true
  rowData.value = []
  actualRowData.value = []

  ExpService.getTableData(id, name, year, version).then((res) => {
    if (name === 'actual_data') {
      actualRowData.value = res.data
      if (actualRowData.value !== null) {
        createColumnDefs(actualRowData.value)
      }
    }

    if (name === 'exposure_data') {
      rowData.value = res.data
      if (rowData.value !== null) {
        createColumnDefs(rowData.value)
      }
    }
    loadingData.value = false
  })
}

const deleteData = async (
  tableType: string,
  portfolioId: string,
  year: number,
  version: number
) => {
  const res = await confirmDeleteDialog.value.open(
    'Delete Data',
    'Are you sure you want to delete this data?'
  )

  if (!res) return

  loadingData.value = true
  ExpService.deleteConfigData(tableType, portfolioId, year, version).then((res) => {
    rowData.value = res.data
    columnDefs.value = Object.keys(res.data[0]).map((item) => {
      return {
        headerName: item,
        field: item
      }
    })
    loadingData.value = false
  })
}

onMounted(() => {
  loadingData.value = true
  loadConfigs()
  IbnrService.getPortfolios().then((res) => {
    portfolios.value = res.data
    loadingData.value = false
  })
})

const createColumnDefs = (data: any) => {
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

const handleUpload = (payload: any, config: any) => {
  loadingData.value = true
  loadDataComplete.value = false

  const formdata = new FormData()
  formdata.append('file', payload.file)
  formdata.append('year', payload.selectedYear)
  formdata.append('exp_configuration_name', config.name)
  formdata.append('exp_id', config.id)
  formdata.append('version', payload.version)

  if (payload.dataTableType === 'actual_data') {
    ExpService.uploadExpActualData(formdata).then((res) => {
      configurations.value = res.data
      loadingData.value = false
      loadDataComplete.value = true
      loadConfigs()
    })
  }

  if (payload.dataTableType === 'exposure_data') {
    ExpService.uploadExpData(formdata).then((res) => {
      configurations.value = res.data
      loadingData.value = false
      loadDataComplete.value = true
      loadConfigs()
    })
  }
}
</script>
<style lang="css">
.expansionColor {
  background-color: #f5f5f5;
}
</style>
