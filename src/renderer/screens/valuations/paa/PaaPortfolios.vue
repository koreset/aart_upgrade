<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="true">
          <template #header>
            <span class="headline">PAA Portfolios</span>
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
              <v-col cols="3">
                <v-select
                  v-model="premiumEarningPattern"
                  placeholder="Select a Premium Earning Pattern"
                  label="Premium Earning Pattern"
                  variant="outlined"
                  density="compact"
                  :items="earningPatterns"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedInsuranceType"
                  placeholder="Select an Insurance Type"
                  label="Insurance Type"
                  variant="outlined"
                  density="compact"
                  :items="insuranceTypes"
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
                        :key="item.name"
                        @group:selected="checkClass"
                      >
                        <v-expansion-panel-title>
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
                                        :show-ibnr-table-types="false"
                                        :tableType="'PAA Model Points'"
                                        :actionName="'Upload PAA Model Points'"
                                        @uploadFile="handleUpload($event, item)"
                                      />

                                      <v-btn
                                        class="ml-7 mr-3"
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        rounded
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
                              <p>
                                <b>Premium Earning Pattern: </b>
                                {{ item.premium_earning_pattern }}
                              </p>
                              <p><b>Insurance Type: </b> {{ item.insurance_type }}</p>
                            </v-col>
                          </v-row>
                          <v-divider class="mb-5"></v-divider>
                          <v-row>
                            <v-col>
                              <p class="mpc-border mb-5"><b>Model Point Counts</b></p>
                              <v-row
                                v-if="item.year_versions == null || item.year_versions.length == 0"
                              >
                                <v-col>
                                  There are no model points uploaded for this portfolio
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="3">
                                  <v-select
                                    v-model="selectedPortfolioMpYear"
                                    density="compact"
                                    variant="outlined"
                                    :items="item.model_point_years"
                                    label="Model Point Year"
                                    @update:model-value="
                                      getMpVersions(item.id, selectedPortfolioMpYear)
                                    "
                                  ></v-select>
                                </v-col>
                                <v-col v-if="yearVersions.length > 0" cols="3">
                                  <v-select
                                    v-model="selectedYearVersion"
                                    density="compact"
                                    variant="outlined"
                                    :items="yearVersions"
                                    item-title="mp_version"
                                    item-value="mp_version"
                                    label="Version"
                                    return-object
                                    @update:model-value="showCountData(selectedYearVersion)"
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
                                        item.name,
                                        selectedPortfolioMpYear,
                                        selectedYearVersion.mp_version
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
                                        item.id,
                                        selectedPortfolioMpYear,
                                        selectedYearVersion.mp_version
                                      )
                                    "
                                  >
                                    <v-icon color="error">mdi-delete</v-icon>
                                    <span>Delete</span></v-btn
                                  >
                                </v-col>
                              </v-row>
                              <v-row v-if="rowData.length > 0 && loadDataComplete">
                                <data-grid :rowData="rowData" :columnDefs="columnDefs"></data-grid>
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
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import ConfirmationDialog from '../../../components/ConfirmDialog.vue'
import DataGrid from '../../../components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/format_values'
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
const selectedYearVersion: any = ref(null)
const rowData: any = ref([])
const columnDefs: any = ref([])

const portfolios: any = ref([])

const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(0)

const paginatedPortfolios: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return portfolios.value.slice(start, end)
})

const discountTypes = [
  { text: 'Undiscounted', value: 'undiscounted' },
  { text: 'Discounted', value: 'discounted' }
]

const earningPatterns = [
  { text: 'Passage of Time', value: 'passageoftime' },
  { text: 'Specified by User', value: 'userdefined' }
]

const insuranceTypes = [
  { text: 'Reinsurance', value: 'reinsurance' },
  { text: 'Direct', value: 'direct' }
]

const portfolioNameErrors = ref([])

const createPortfolio = () => {
  console.log('Creating Portfolio')
  const portfolio = {
    name: portfolioName.value,
    premium_earning_pattern: premiumEarningPattern.value,
    discount_option: discountOption.value,
    insurance_type: selectedInsuranceType.value
  }
  ModifiedGMMService.createPaaPortfolio(portfolio).then((res) => {
    portfolios.value.push(res.data)
    portfolioName.value = null
    discountOption.value = null
    premiumEarningPattern.value = null
    selectedInsuranceType.value = null
  })
}

const handleUpload = (event: any, item: any) => {
  console.log('Handling Upload', event, item)
  const formData = new FormData()
  formData.append('file', event.file)
  formData.append('year', event.selectedYear)
  formData.append('mp_version', event.version)
  formData.append('portfolio_name', item.name)
  formData.append('portfolio_id', item.id)
  // this.loading = true
  ModifiedGMMService.uploadGmmModelpointTables(formData)
    .then((res) => {
      console.log(res)
      loadDataComplete.value = true
      // this.uploadSuccess = true;
      // this.resetErrorState();
      // this.$emit("successUpload", this.tableId);
      // this.loading = false;
    })
    .catch((err) => {
      console.log(err)
      loadDataComplete.value = true
      // this.errorMessages.push(err.data.error);
      // this.uploadSuccess = false;
      // this.selectedYear = null;
      // this.loading = false;
    })
}

const getMpVersions = (id: number, year: number) => {
  console.log('Getting MP Versions', id, year)
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  yearVersions.value = []
  selectedYearVersion.value = null
  // get the portfolio with the id from portfolios
  const portfolio = portfolios.value.find((elem) => {
    return elem.id === id
  })
  console.log('Portfolio', portfolio)

  // get the year_versions from the portfolio that match the year
  yearVersions.value = portfolio.year_versions.filter((elem) => {
    return elem.year === year
  })

  console.log('Year Versions', yearVersions.value)
}

const showCountData = (version: any) => {
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  console.log('Showing Count Data', version)
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
      ModifiedGMMService.deletePortfolio(id).then((res) => {
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

const deleteData = (id: number, year: number, version: number) => {
  console.log('Deleting Data', id, year, version)
}

const showData = async (id: number, name: string, year: number, version: number) => {
  console.log('Showing Data', id, name, year, version)
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  const res = await ModifiedGMMService.getPortfolioModelPoints(id, year, version)
  rowData.value = res.data

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
  if (item) {
    expansionColor.value = 'expanded'
  } else {
    expansionColor.value = ''
  }
  selectedPortfolioMpYear.value = ''
  yearVersions.value = []
  selectedYearVersion.value = null
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
}

onMounted(() => {
  ModifiedGMMService.getPaaPortfolios().then((res) => {
    if (res.data.length > 0) {
      portfolios.value = res.data
      totalPages.value = Math.ceil(portfolios.value.length / pageSize)
    } else {
      portfolios.value = []
      loadDataComplete.value = true
    }
  })
})
</script>

<style scoped>
.v-expansion-panel-title--active {
  background-color: rgb(243, 243, 243) !important;
}
</style>
