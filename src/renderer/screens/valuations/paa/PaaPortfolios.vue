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
                              <p>
                                <b>Discount Option:</b> {{ item.discount_option }} ||
                                <b>Premium Earning Pattern: </b>
                                {{ item.premium_earning_pattern }} || <b>Insurance Type: </b>
                                {{ item.insurance_type }}
                              </p>
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
                              <v-row
                                v-if="item.year_versions !== null && item.year_versions.length > 0"
                              >
                                <v-col cols="3">
                                  <v-select
                                    v-model="selectedPortfolioMpYear"
                                    density="compact"
                                    variant="outlined"
                                    :items="item.model_point_years"
                                    label="Model Point Year"
                                    placeholder="Select a Year"
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
                                <data-grid
                                  :show-close-button="true"
                                  :table-title="
                                    selectedPortfolioMpYear + ' - ' + selectedYearVersion.mp_version
                                  "
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
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import ConfirmationDialog from '../../../components/ConfirmDialog.vue'
import DataGrid from '../../../components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/format_values'
import FileUpdater from '@/renderer/components/FileUpdater.vue'

const confirmDialog = ref()
const activePanel = ref<any[]>([]) // Explicitly type if possible, e.g., number[] or string[]
// const expansionColor = ref('') // This ref is declared but not obviously used in the provided snippet for dynamic styling
const portfolioName: any = ref('')
const discountOption: any = ref('')
const premiumEarningPattern: any = ref('')
const selectedInsuranceType: any = ref('')
const loadDataComplete: any = ref(false) // Consider more specific naming if its scope is limited, e.g., gridDataLoadComplete
const selectedPortfolioMpYear: any = ref(null)
const yearVersions: any = ref([])
const selectedYearVersion: any = ref(null)
const rowData: any = ref([])
const columnDefs: any = ref([])

const portfolios: any = ref([])

const pageSize = 10 // Consider making this a const if not changed, or part of component props/config
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
  { text: 'Specified by User', value: 'userdefined' },
  { text: 'Daily Passage of Time', value: 'dailypassageoftime' }
]

const insuranceTypes = [
  { text: 'Reinsurance', value: 'reinsurance' },
  { text: 'Direct', value: 'direct' },
  { text: 'Proportional Reinsurance', value: 'proportionalreinsurance' }
]

const portfolioNameErrors: any = ref([]) // This ref is declared but not used for error display in the template v-text-field

const clearData = () => {
  rowData.value = []
  columnDefs.value = [] // Also clear columnDefs when clearing data
  // selectedTable.value = '' // This was commented out, seems to be from a previous state
  loadDataComplete.value = false // If grid is cleared, mark data as not complete for it
}

const createPortfolio = () => {
  console.log('Creating Portfolio')
  // Basic validation for portfolioName (example)
  if (!portfolioName.value || portfolioName.value.trim() === '') {
    portfolioNameErrors.value = ['Portfolio Name is required.']
    return
  }
  portfolioNameErrors.value = [] // Clear errors

  const portfolio = {
    name: portfolioName.value,
    premium_earning_pattern: premiumEarningPattern.value,
    discount_option: discountOption.value,
    insurance_type: selectedInsuranceType.value
  }
  ModifiedGMMService.createPaaPortfolio(portfolio)
    .then((res) => {
      portfolios.value.push(res.data)
      totalPages.value = Math.ceil(portfolios.value.length / pageSize) // Update totalPages
      // Reset form fields
      portfolioName.value = null
      discountOption.value = null
      premiumEarningPattern.value = null
      selectedInsuranceType.value = null
    })
    .catch((err) => {
      console.error('Error creating portfolio:', err)
      // Handle error display to user, e.g., through a snackbar or message
      if (err.response && err.response.data && err.response.data.name) {
        portfolioNameErrors.value = err.response.data.name // Example if backend returns field-specific errors
      } else {
        portfolioNameErrors.value = ['Failed to create portfolio.']
      }
    })
}

const handleUpload = (event: any, portfolioItemFromTemplate: any) => {
  console.log('Handling Upload', event, portfolioItemFromTemplate)
  const formData = new FormData()
  formData.append('file', event.file)
  formData.append('year', event.selectedYear)
  formData.append('mp_version', event.version)
  formData.append('portfolio_name', portfolioItemFromTemplate.name)
  formData.append('portfolio_id', portfolioItemFromTemplate.id)

  // Indicate loading state for this specific upload if possible, or globally
  // this.loading = true // Assuming 'this.loading' would be a ref if used like this in setup

  ModifiedGMMService.uploadGmmModelpointTables(formData)
    .then((res) => {
      const newYearVersionEntry = res.data.year_version // e.g., { year: 2024, mp_version: 'v1', count: 50, ... }

      // Find the authoritative portfolio object in the main 'portfolios.value' list
      const portfolioToUpdate = portfolios.value.find(
        (p: any) => p.id === portfolioItemFromTemplate.id
      )

      if (portfolioToUpdate) {
        // 1. Update year_versions (the detailed list of all versions for all years)
        if (!portfolioToUpdate.year_versions) {
          portfolioToUpdate.year_versions = []
        }
        portfolioToUpdate.year_versions.push(newYearVersionEntry)

        // 2. Update model_point_years (the unique list of years for the year dropdown)
        if (!portfolioToUpdate.model_point_years) {
          portfolioToUpdate.model_point_years = []
        }
        const yearOfNewEntry = Number(newYearVersionEntry.year) // Ensure it's a number
        if (!portfolioToUpdate.model_point_years.includes(yearOfNewEntry)) {
          portfolioToUpdate.model_point_years.push(yearOfNewEntry)
          portfolioToUpdate.model_point_years.sort((a: number, b: number) => a - b) // Keep sorted
        }

        // 3. If this portfolio's panel is open and the selected year matches the uploaded year, refresh versions list.
        // The upload button is within the expanded panel, so 'portfolioItemFromTemplate' is the active one.
        // 'selectedPortfolioMpYear.value' holds the year selected in the dropdown for the active panel.
        if (selectedPortfolioMpYear.value === yearOfNewEntry) {
          getMpVersions(portfolioToUpdate.id, yearOfNewEntry)

          // Optional: auto-select the newly uploaded version in the 'Version' dropdown
          const newlyAddedVersionInList = yearVersions.value.find(
            (v: any) => v.mp_version === newYearVersionEntry.mp_version && v.year === yearOfNewEntry
          )
          if (newlyAddedVersionInList) {
            selectedYearVersion.value = newlyAddedVersionInList
            // The @update:model-value on the version select will call showCountData automatically
          }
        }
      } else {
        console.error(
          `Portfolio with ID ${portfolioItemFromTemplate.id} not found in main list after upload.`
        )
      }
      loadDataComplete.value = true // Signifies that an operation that might load data is complete.
      // Could be more specific if needed.
    })
    .catch((err) => {
      console.error('Error uploading GMM Modelpoint Tables:', err)
      // Handle error display to user
      loadDataComplete.value = true // Still set to true to unblock UI or signify end of attempt
    })
  // finally(() => { this.loading = false; }) // Reset loading state
}

const getMpVersions = (id: number, year: number | string | null) => {
  console.log('Getting MP Versions', id, year)
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  yearVersions.value = []
  selectedYearVersion.value = null

  if (year === null || year === undefined || year === '') {
    // Handle case where year might be cleared
    return
  }
  const numericYear = Number(year) // Ensure year is a number for comparison

  const portfolio = portfolios.value.find((elem: any) => elem.id === id)
  console.log('Portfolio for MP Versions:', portfolio)

  if (portfolio && portfolio.year_versions) {
    yearVersions.value = portfolio.year_versions.filter((elem: any) => {
      return Number(elem.year) === numericYear
    })
  } else {
    yearVersions.value = []
  }
  console.log('Year Versions populated:', yearVersions.value)
}

const showCountData = (version: any) => {
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  console.log('Showing Count Data for version:', version)
  // This function currently only resets state.
  // If it's meant to display something based on the count, that logic would be here.
  // The count is already displayed via `<h4>Count: {{ selectedYearVersion.count }}</h4>`
}

const deletePortfolio = async (id: number) => {
  console.log('Attempting to delete Portfolio ID:', id)
  try {
    const result = await confirmDialog.value.open(
      'Delete Portfolio',
      'Are you sure you want to delete this portfolio? This action cannot be undone.'
    )
    console.log('Confirmation result:', result)
    if (result) {
      ModifiedGMMService.deletePortfolio(id)
        .then((res) => {
          if (res.status === 200 || res.status === 204) {
            // 204 No Content is also a success for delete
            portfolios.value = portfolios.value.filter((elem: any) => elem.id !== id)
            totalPages.value = Math.ceil(portfolios.value.length / pageSize)
            if (currentPage.value > totalPages.value && totalPages.value > 0) {
              currentPage.value = totalPages.value // Adjust current page if it becomes invalid
            } else if (totalPages.value === 0) {
              currentPage.value = 1 // Reset to page 1 if no portfolios left
            }
            // Optionally, close the panel if the deleted item was active, though checkClass handles reset
          } else {
            console.error('Failed to delete portfolio with status:', res.status)
            // Display error to user
          }
        })
        .catch((err) => {
          console.error('Error deleting portfolio:', err)
          // Display error to user
        })
    }
  } catch (err) {
    // This catch is for errors in confirmDialog.open, which is unlikely if it's a simple promise.
    // The actual API call error is handled in the .catch block of ModifiedGMMService.deletePortfolio
    console.log('Error in confirmation dialog process:', err)
  }
}

// The deleteData function was empty, assuming it's for deleting specific model point data (year/version)
const deleteData = async (portfolioId: number, year: number, versionValue: string | number) => {
  console.log(
    'Attempting to delete Model Point Data for Portfolio ID:',
    portfolioId,
    'Year:',
    year,
    'Version:',
    versionValue
  )
  try {
    const result = await confirmDialog.value.open(
      'Delete Model Point Data',
      `Are you sure you want to delete model point data for year ${year}, version ${versionValue}? This action cannot be undone.`
    )
    if (result) {
      ModifiedGMMService.deletePaModelPointData(portfolioId, year, versionValue) // Assuming such an API endpoint exists
        .then((res) => {
          if (res.status === 200 || res.status === 204) {
            console.log('Model point data deleted successfully')
            // Refresh data:
            // 1. Update the specific portfolio's year_versions array
            const portfolioToUpdate = portfolios.value.find((p: any) => p.id === portfolioId)
            if (portfolioToUpdate) {
              portfolioToUpdate.year_versions = portfolioToUpdate.year_versions.filter(
                (yv: any) => !(Number(yv.year) === Number(year) && yv.mp_version === versionValue)
              )

              // 2. Check if this was the last version for that year
              const remainingVersionsForYear = portfolioToUpdate.year_versions.filter(
                (yv: any) => Number(yv.year) === Number(year)
              )
              if (remainingVersionsForYear.length === 0) {
                // Remove year from model_point_years
                portfolioToUpdate.model_point_years = portfolioToUpdate.model_point_years.filter(
                  (y: number) => Number(y) !== Number(year)
                )
                // If the deleted year was selected, clear selections
                if (selectedPortfolioMpYear.value === year) {
                  selectedPortfolioMpYear.value = null
                  yearVersions.value = []
                  selectedYearVersion.value = null
                  rowData.value = []
                  columnDefs.value = []
                }
              } else {
                // If current year is selected, refresh versions
                if (selectedPortfolioMpYear.value === year) {
                  getMpVersions(portfolioId, year)
                  // selectedYearVersion.value might become invalid if it was the one deleted.
                  // Check if current selectedYearVersion still exists in new yearVersions.value
                  const currentVersionStillExists = yearVersions.value.some(
                    (v: any) => v.mp_version === selectedYearVersion.value?.mp_version
                  )
                  if (!currentVersionStillExists) {
                    selectedYearVersion.value = null
                    rowData.value = []
                    columnDefs.value = []
                  }
                }
              }
            }
            // Clear displayed data if it was the deleted one
            if (
              selectedPortfolioMpYear.value === year &&
              selectedYearVersion.value?.mp_version === versionValue
            ) {
              rowData.value = []
              columnDefs.value = []
              loadDataComplete.value = false
            }
            console.log('Successfully deleted model point data.')
          } else {
            console.error('Failed to delete model point data with status:', res.status)
          }
        })
        .catch((err) => {
          console.error('Error deleting model point data:', err)
        })
    }
  } catch (err) {
    console.log('Error in deleteData confirmation dialog:', err)
  }
}

const showData = async (id: number, name: string, year: number, version: string | number) => {
  console.log(
    'Showing Data for Portfolio ID:',
    id,
    'Name:',
    name,
    'Year:',
    year,
    'Version:',
    version
  )
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
  try {
    const res = await ModifiedGMMService.getPortfolioModelPoints(id, year, version)
    if (res.data && res.data.length > 0) {
      rowData.value = res.data
      createColumnDefs(rowData.value)
    } else {
      rowData.value = [] // Ensure it's an empty array if no data
      console.log('No model point data returned or data is empty.')
      // Optionally, provide user feedback that no data exists for this selection
    }
  } catch (err) {
    console.error('Error fetching portfolio model points:', err)
    rowData.value = [] // Ensure cleanup on error
    // Display error to user
  } finally {
    loadDataComplete.value = true
  }
}

const createColumnDefs = (data: any[]) => {
  // Ensure data is an array
  columnDefs.value = []
  if (data && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    Object.keys(data[0]).forEach((element) => {
      const header: any = {}
      header.headerName = element // Or a more friendly formatted name
      header.field = element
      header.valueFormatter = formatValues // Ensure this function handles various data types gracefully
      header.minWidth = 220
      header.filter = true
      header.resizable = true
      header.sortable = true
      columnDefs.value.push(header)
    })
  } else {
    // Handle case where data is empty or not in expected format, to prevent errors
    console.warn('Cannot create column definitions: data is empty or not in expected format.')
  }
}

const checkClass = (item: any) => {
  // 'item' here is the value of the active panel(s) from v-model
  console.log('Active panel changed:', item)
  // expansionColor.value is not used, can be removed if not intended for future use.
  // if (item && item.length > 0 ) { // If 'multiple' is enabled on v-expansion-panels, item is an array
  //   expansionColor.value = 'expanded'
  // } else if (item !== null && item !== undefined) { // If 'multiple' is not enabled, item is a single value (or undefined)
  //    expansionColor.value = 'expanded'
  // }
  // else {
  //   expansionColor.value = ''
  // }

  // Reset state when panel selection changes (either a new one opens or current one closes)
  selectedPortfolioMpYear.value = null // Use null for v-select placeholder to work if item value is null/undefined
  yearVersions.value = []
  selectedYearVersion.value = null
  rowData.value = []
  columnDefs.value = []
  loadDataComplete.value = false
}

onMounted(() => {
  ModifiedGMMService.getPaaPortfolios()
    .then((res) => {
      if (res.data && res.data.length > 0) {
        // Ensure each portfolio has model_point_years, derive if necessary and not provided by backend
        portfolios.value = res.data.map((p: any) => {
          let modelYears = p.model_point_years
          if (!modelYears && p.year_versions && p.year_versions.length > 0) {
            // Derive unique years from year_versions if model_point_years is missing
            modelYears = [...new Set(p.year_versions.map((yv: any) => Number(yv.year)))].sort(
              (a: any, b: any) => a - b
            )
          } else if (!modelYears) {
            modelYears = []
          } else {
            // Ensure years are numbers and sorted if coming from backend
            modelYears = modelYears.map(Number).sort((a: number, b: number) => a - b)
          }
          return { ...p, model_point_years: modelYears }
        })
        totalPages.value = Math.ceil(portfolios.value.length / pageSize)
      } else {
        portfolios.value = []
        totalPages.value = 0 // Reset totalPages
      }
      // loadDataComplete.value = true; // This might be misleading here, as it usually refers to grid data
    })
    .catch((err) => {
      console.error('Error fetching PAA portfolios:', err)
      portfolios.value = []
      totalPages.value = 0
      // Display error to user
    })
})
</script>

<style scoped>
/*
.v-expansion-panel-title--active {
  background-color: rgb(243, 243, 243) !important;
}
  */
</style>
