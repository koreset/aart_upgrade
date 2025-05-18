<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="true">
          <template #header>
            <span class="headline">IBNR Portfolios</span>
          </template>
          <template #default>
            <v-row class="mt-9 mx-5">
              <v-col cols="3">
                <v-text-field
                  v-model="portfolioName"
                  class="mr-9"
                  placeholder="Portfolio Name"
                  label="Portfolio Name"
                  variant="outlined"
                  density="compact"
                  :error-messages="portfolioNameErrors"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="discountOption"
                  placeholder="Select a Discount Option"
                  label="Discount Option"
                  variant="outlined"
                  density="compact"
                  :items="discountTypes"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col class="d-flex align-baseline" cols="3">
                <v-btn
                  rounded
                  class="primary mt-1"
                  size="small"
                  variant="outlined"
                  @click="createPortfolio"
                  >Add Portfolio</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="portfolios.length > 0" class="mx-5">
              <v-col>
                <base-card :showActions="false">
                  <template #header>
                    <span class="headline">Portfolios List</span>
                  </template>
                  <template #default>
                    <v-expansion-panels v-model="activePanel">
                      <v-expansion-panel
                        v-for="item in paginatedPortfolios"
                        :key="item.id"
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
                                        :show-ibnr-table-types="true"
                                        :tableType="'IBNR Data'"
                                        :actionName="'Upload Ibnr Data'"
                                        @uploadFile="handleUpload($event, item)"
                                      />

                                      <v-btn
                                        class="ml-5 mr-3"
                                        variant="outlined"
                                        rounded
                                        size="small"
                                        @click="deletePortfolio(item.id)"
                                      >
                                        <v-icon color="red">mdi-delete</v-icon
                                        ><span>Delete Portfolio</span>
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
                          <v-row class="mt-5">
                            <v-col>
                              <p>Portfolio parameters</p>
                              <p> <b>Discount Option:</b> {{ item.discount_option }} </p>
                            </v-col>
                          </v-row>
                          <v-divider class="mb-5"></v-divider>
                          <v-row>
                            <v-col>
                              <p class="mpc-border mb-5"><b>Claims Data</b></p>
                              <v-row
                                v-if="
                                  item.claims_year_version == null ||
                                  item.claims_year_version.length == 0
                                "
                              >
                                <v-col>
                                  There are no claim data files uploaded for this portfolio
                                </v-col>
                              </v-row>
                              <v-row v-else>
                                <v-col cols="3">
                                  <v-select
                                    v-model="selectedPortfolioMpYear"
                                    density="compact"
                                    variant="outlined"
                                    :items="getUniqueYears(item.claims_year_version)"
                                    item-title="year"
                                    item-value="year"
                                    label="Model Point Year"
                                    @update:model-value="
                                      getMpVersions(
                                        selectedPortfolioMpYear,
                                        item.claims_year_version,
                                        'claims_data'
                                      )
                                    "
                                  ></v-select>
                                </v-col>
                                <v-col v-if="availableVersions.length > 0" cols="3">
                                  <v-select
                                    v-model="selectedYearVersion"
                                    density="compact"
                                    variant="outlined"
                                    :items="availableVersions"
                                    item-title="version_name"
                                    item-value="version_name"
                                    label="Version"
                                    return-object
                                    @update:model-value="showCountData()"
                                  ></v-select>
                                </v-col>
                                <v-col v-if="selectedYearVersion !== null" cols="2"
                                  ><h4 v-if="selectedYearVersion !== null" class="mt-2"
                                    >Count: {{ selectedYearVersion.count }}</h4
                                  ></v-col
                                >
                                <v-col v-if="selectedYearVersion !== null" cols="4">
                                  <v-btn
                                    class="primary mr-5"
                                    rounded
                                    size="small"
                                    variant="outlined"
                                    @click="
                                      showData(
                                        item.name,
                                        'claims_data',
                                        selectedPortfolioMpYear,
                                        selectedYearVersion.version_name
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
                                        item.name,
                                        'claims_data',
                                        selectedPortfolioMpYear,
                                        selectedYearVersion.version_name
                                      )
                                    "
                                  >
                                    <v-icon color="error">mdi-delete</v-icon>
                                    <span>Delete</span></v-btn
                                  >
                                </v-col>
                              </v-row>
                              <v-row v-if="rowData.length > 0 && loadDataComplete">
                                <data-grid
                                  :show-close-button="true"
                                  :table-title="tableTitle"
                                  :rowData="rowData"
                                  :columnDefs="columnDefs"
                                  @update:clear-data="clearData"
                                ></data-grid>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-divider class="mb-5"></v-divider>
                          <v-row>
                            <v-col>
                              <p class="mpc-border mb-5"><b>Earned Premium Data</b></p>
                              <v-row
                                v-if="
                                  item.earned_premium_year_version == null ||
                                  item.earned_premium_year_version.length == 0
                                "
                              >
                                <v-col>
                                  There are no earned premium data files uploaded for this portfolio
                                </v-col>
                              </v-row>
                              <v-row v-else>
                                <v-col cols="3">
                                  <v-select
                                    v-model="selectedEarnedPremiumYear"
                                    density="compact"
                                    variant="outlined"
                                    :items="getUniqueYears(item.earned_premium_year_version)"
                                    item-title="year"
                                    item-value="year"
                                    label="Model Point Year"
                                    @update:model-value="
                                      getMpVersions(
                                        selectedEarnedPremiumYear,
                                        item.earned_premium_year_version,
                                        'earned_premium'
                                      )
                                    "
                                  ></v-select>
                                </v-col>
                                <v-col v-if="availableEarnedPremiumVersions.length > 0" cols="3">
                                  <v-select
                                    v-model="selectedEarnedPremiumYearVersion"
                                    density="compact"
                                    variant="outlined"
                                    :items="availableEarnedPremiumVersions"
                                    item-title="version_name"
                                    item-value="version_name"
                                    label="Version"
                                    return-object
                                    @update:model-value="showCountData()"
                                  ></v-select>
                                </v-col>
                                <v-col v-if="selectedEarnedPremiumYearVersion !== null" cols="2"
                                  ><h4 v-if="selectedEarnedPremiumYearVersion !== null" class="mt-2"
                                    >Count: {{ selectedEarnedPremiumYearVersion.count }}</h4
                                  ></v-col
                                >
                                <v-col v-if="selectedEarnedPremiumYearVersion !== null" cols="4">
                                  <v-btn
                                    class="primary mr-5"
                                    rounded
                                    size="small"
                                    variant="outlined"
                                    @click="
                                      showData(
                                        item.name,
                                        'earned_premium',
                                        selectedEarnedPremiumYear,
                                        selectedEarnedPremiumYearVersion.version_name
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
                                        item.name,
                                        'earned_premium',
                                        selectedEarnedPremiumYear,
                                        selectedEarnedPremiumYearVersion.version_name
                                      )
                                    "
                                  >
                                    <v-icon color="error">mdi-delete</v-icon>
                                    <span>Delete</span></v-btn
                                  >
                                </v-col>
                              </v-row>
                              <v-row v-if="rowData.length > 0 && loadDataComplete">
                                <data-grid
                                  :show-close-button="true"
                                  :table-title="tableTitle"
                                  :rowData="rowData"
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
          <template #actions>
            <v-row>
              <v-col>
                <v-pagination
                  v-if="totalPages > 1"
                  v-model="currentPage"
                  :length="totalPages"
                ></v-pagination>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <confirmation-dialog ref="confirmDialog"></confirmation-dialog>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../../../components/BaseCard.vue'
import { onMounted, ref, computed } from 'vue'
import IbnrService from '../../../api/IbnrService'
import ConfirmationDialog from '../../../components/ConfirmDialog.vue'
import DataGrid from '../../../components/tables/DataGrid.vue'
import formatValues from '../../../utils/format_values'
import FileUpdater from '@/renderer/components/FileUpdater.vue'

const confirmDialog = ref()
const activePanel = ref([])
const expansionColor = ref('')
const portfolioName: any = ref('')
const discountOption: any = ref('')
const premiumEarningPattern: any = ref('')
const selectedInsuranceType: any = ref('')
const loadDataComplete: any = ref(false)
const selectedPortfolioMpYear: any = ref('')
const yearVersions: any = ref([])
const availableVersions: any = ref([])
const availableEarnedPremiumVersions: any = ref([])
const selectedYearVersion: any = ref(null)
const selectedEarnedPremiumYearVersion: any = ref(null)
const selectedEarnedPremiumYear: any = ref(null)
const rowData: any = ref([])
const columnDefs: any = ref([])
const tableTitle: any = ref('')

const portfolios: any = ref([])

const discountTypes = [
  { text: 'Undiscounted', value: 'undiscounted' },
  { text: 'Discounted', value: 'discounted' }
]

const portfolioNameErrors = ref([])

const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(3)

const paginatedPortfolios: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return portfolios.value.slice(start, end)
})

const createPortfolio = () => {
  console.log('Creating Portfolio')
  const portfolio = {
    name: portfolioName.value,
    discount_option: discountOption.value
  }
  IbnrService.createPortfolio(portfolio).then((res) => {
    portfolios.value.push(res.data)
    portfolioName.value = null
    discountOption.value = null
    premiumEarningPattern.value = null
    selectedInsuranceType.value = null
  })
}

const clearData = () => {
  rowData.value = []
  columnDefs.value = []
}

const handleUpload = (event: any, item: any) => {
  console.log('Handling Upload', event, item)
  const formData = new FormData()
  formData.append('file', event.file)
  formData.append('year', event.selectedYear)
  formData.append('type', event.dataTableType)
  formData.append('portfolio_name', item.name)
  formData.append('portfolio_id', item.id)
  formData.append('version_name', event.version)
  // this.loading = true
  IbnrService.uploadLicModelpoints(formData)
    .then((res) => {
      console.log('Response', res)
      loadDataComplete.value = true
      // this.resetErrorState()
      // this.$emit('successUpload', this.tableId)
      // loading.value = false
    })
    .catch((err) => {
      console.log('Error', err)
      // this.errorMessages.push(err.data.error)
      // this.uploadSuccess = false
      // this.selectedYear = null
      // this.loading = false
      loadDataComplete.value = true
    })
}

const getUniqueYears = (items: any) => {
  console.log('Getting Unique Years', items)

  //   // clear versions
  // yearVersions.value = []
  //   selectedYearVersion.value = null
  const years = items.map((elem: any) => {
    return elem.year
  })
  return Array.from(new Set(years))
}

const getMpVersions = (year: number, versions: any, type: string) => {
  console.log('Getting MP Versions Year', year, ' | versions', versions)

  const filteredVersions = versions.filter((elem: any) => {
    return elem.year === year
  })

  // availableEarnedPremiumVersions.value = []
  // availableVersions.value = []
  // selectedYearVersion.value = null
  // selectedEarnedPremiumYearVersion.value = null

  console.log('Filtered Versions', filteredVersions)
  if (type === 'earned_premium') {
    availableEarnedPremiumVersions.value = filteredVersions
  } else {
    availableVersions.value = filteredVersions
  }
}

const showCountData = () => {
  console.log('Showing Count Data', selectedYearVersion.value)
  rowData.value = []
  columnDefs.value = []
}

const deletePortfolio = async (id: number) => {
  console.log('Deleting Portfolio', id)
  try {
    const result = await confirmDialog.value.open(
      'Delete Portfolio',
      'Are you sure you want to delete this portfolio?'
    )
    console.log('Result', result)
    if (result) {
      IbnrService.deletePortfolio(id).then((res) => {
        if (res.status === 200) {
          portfolios.value = portfolios.value.filter((elem) => {
            return elem.id !== id
          })
        }
      })
    }
  } catch (err) {
    console.log('Error', err)
  }
}

const deleteData = async (portfolio: string, tableType: string, year: number, version: string) => {
  try {
    const result = await confirmDialog.value.open(
      'Delete Data',
      'Are you sure you want to delete this data?'
    )
    console.log('Result', result)
    console.log('Deleting Data', portfolio, year, version, tableType)
    IbnrService.deleteTableData(tableType, portfolio, year, version).then((res) => {
      if (res.status === 200) {
        rowData.value = []
        columnDefs.value = []
        loadDataComplete.value = false
        // this.$emit('successUpload', this.tableId)
      }
    })
  } catch (err) {
    console.log('Error', err)
  }
}

const showData = async (name: string, type: string, year: number, version: number) => {
  console.log('Showing Data', name, type, year, version)

  if (type === 'claims_data') {
    tableTitle.value = 'Claims Data'
  }
  if (type === 'earned_premium') {
    tableTitle.value = 'Earned Premium Data'
  }

  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  // const res = await ModifiedGMMService.getPortfolioModelPoints(id, year, version)
  const res = await IbnrService.getLicClaimsData(name, type, year, version)
  rowData.value = res.data.data

  if (rowData.value !== null) {
    createColumnDefs(rowData.value)
  }

  loadDataComplete.value = true
}

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

const checkClass = (item: any) => {
  console.log('Checking Class', item)
  // if (item) {
  //   console.log('activePanel', activePanel.value)
  //   expansionColor.value = 'expanded'
  // } else {
  //   console.log('activePanel', activePanel.value)
  //   expansionColor.value = ''
  // }
  selectedPortfolioMpYear.value = null
  yearVersions.value = []
  selectedYearVersion.value = null
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
}

onMounted(() => {
  IbnrService.getPortfolios().then((res) => {
    if (res.data.length > 0) {
      portfolios.value = res.data
      console.log('Portfolios', portfolios.value)
      totalPages.value = Math.ceil(portfolios.value.length / pageSize)
    } else {
      portfolios.value = []
      loadDataComplete.value = true
    }
  })
})
</script>

<style scoped></style>
