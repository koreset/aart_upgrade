<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Valuation Run Results</span>
          </template>
          <template #default>
            <v-row
              ><v-col>
                <v-btn
                  rounded
                  size="small"
                  class="mb-2"
                  variant="outlined"
                  @click="getSelectStatus"
                  >{{ selectBtnText }}</v-btn
                >
                <v-btn
                  v-if="selectedItems.length > 0 && showSelect"
                  rounded
                  size="small"
                  class="ml-2 mb-2"
                  variant="outlined"
                  @click="selectedItems = []"
                  >Clear Selection</v-btn
                >

                <v-btn
                  v-if="selectedItems.length > 0 && showSelect"
                  rounded
                  size="small"
                  class="ml-2 mb-2"
                  variant="outlined"
                  @click="deleteRuns(selectedItems)"
                  >Delete Selected</v-btn
                >
              </v-col></v-row
            >
            <v-expansion-panels>
              <v-expansion-panel v-for="job in paginatedJobs" :key="job.id">
                <v-expansion-panel-title class="custom-panel-title px-3">
                  <template #default="{ expanded }">
                    <v-row no-gutters>
                      <v-col class="d-flex align-center justify-start" cols="3">
                        <v-checkbox
                          v-if="showSelect"
                          density="compact"
                          class="mr-2 no-padding-checkbox"
                          hide-details
                          :modelValue="isSelected(job.id)"
                          @click.stop="toggleSelect(job.id)"
                        />
                        {{ job.run_name }}
                      </v-col>
                      <v-col class="text-grey d-flex align-center" cols="9">
                        <v-fade-transition leave-absolute>
                          <span v-if="expanded" key="0">
                            <v-list-item-subtitle v-if="job.status == 'In Progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ (job.points_done / job.total_points) * 100 }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                              Start: {{ formatDateString(job.creation_date) }} | Duration:
                              {{ toMinutes(job.run_time) }} | Status: {{ job.status }} | User:
                              {{ job.user_name }}
                            </v-list-item-subtitle>
                          </span>
                          <span v-else key="1">
                            <v-list-item-subtitle v-if="job.status == 'In Progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ (job.points_done / job.total_points) * 100 }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                              Start: {{ formatDateString(job.creation_date) }} | Duration:
                              {{ toMinutes(job.run_time) }} | Status: {{ job.status }} | User:
                              {{ job.user_name }}
                            </v-list-item-subtitle>
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list-item v-for="run in job.products" :key="run.id">
                    <v-list-item-title>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <p>{{ run.product_name }}</p>
                            <v-btn
                              v-if="job.status !== 'Failed'"
                              variant="plain"
                              rounded
                              size="small"
                              color="primary"
                              @click.stop="
                                viewControl(run.id, run.product_id, run.product_name, job.run_name)
                              "
                              >View Control</v-btn
                            >
                            <v-btn
                              v-if="job.status !== 'Failed'"
                              variant="plain"
                              rounded
                              size="small"
                              color="primary"
                              :to="
                                '/valuations/gmm/run-detail/' +
                                run.id +
                                '/' +
                                run.product_id +
                                '/' +
                                run.product_name +
                                '/' +
                                job.run_name
                              "
                              >View Results</v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="job.status == 'Failed'">
                      <p>Run Error: {{ job.status_error }}</p>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-btn
                    variant="plain"
                    rounded
                    size="small"
                    color="primary"
                    @click="deleteRun(job.id)"
                    >Delete {{ job.run_name }}</v-btn
                  >
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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
    <v-row>
      <v-col>
        <file-info
          :tableTitle="tableTitle"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :onUpdate:isInfoDialogOpen="closeInfoBox"
          :isDialogOpen="infoDialog"
          :show-export="true"
        />
      </v-col>
    </v-row>
  </v-container>
  <confirm-dialog ref="confirmDelete" />
</template>

<script setup lang="ts">
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import BaseCard from '../../../components/BaseCard.vue'
import { computed, onMounted, ref } from 'vue'
import ProductService from '../../../api/ProductService'
import ValuationService from '../../../api/ValuationService'
import { DateTime } from 'luxon'
import formatValues from '@/renderer/utils/format_values'
import FileInfo from '@/renderer/components/FileInfo.vue'

let pollTimer: any = null

// selection variables
const selectedItems: any = ref([])
const selectBtnText = ref('Show Selection')
const showSelect = ref(false)

const infoDialog = ref(false)

const tableTitle = ref('')
const rowData: any = ref([])
const columnDefs: any = ref([])
const confirmDelete = ref()
const loading = ref(false)
const runJobs = ref([])
const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(3)

const paginatedJobs: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return runJobs.value.slice(start, end)
})

const formatDateString = (dateString: any) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
}

const toMinutes = (number: any) => {
  number = number * 60
  const minutes = Math.floor(number / 60) // 7
  let seconds = ((number % 60) / 100) * 60 // 30
  seconds = Math.round(seconds)
  return minutes + ' m, ' + seconds + ' s'
}

// const selectItem = (e: any) => {
//   console.log(e)
// }

const isSelected = (id) => {
  return selectedItems.value.includes(id)
}
const closeInfoBox = (value: any) => {
  infoDialog.value = value
}

const toggleSelect = (id: any) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter((item) => item !== id)
  } else {
    selectedItems.value.push(id)
  }
  console.log(selectedItems.value)
}

const getSelectStatus = () => {
  showSelect.value = !showSelect.value
  if (showSelect.value) {
    selectBtnText.value = 'Hide Selection'
  } else {
    selectBtnText.value = 'Show Selection'
  }
}

const deleteRun = async (runId: any) => {
  const result = await confirmDelete.value.open(
    'Deleting Valuation Job Run',
    'Are you sure you want to delete the selected valuation job run?'
  )
  if (!result) {
    return
  }

  loading.value = true
  await ValuationService.deleteProjectionJob(runId)
  const res = await ProductService.getValuationJobs()
  runJobs.value = res.data
  if (runJobs.value === undefined || runJobs.value === null) {
    runJobs.value = []
  }
  totalPages.value = Math.ceil(runJobs.value.length / pageSize)
  loading.value = false
}

const deleteRuns = async (runIds: any) => {
  try {
    const result = await confirmDelete.value.open(
      'Delete Valuation Jobs',
      'Are you sure you want to delete the selected valuation jobs?'
    )
    if (!result) {
      return
    }
    console.log(runIds)
    loading.value = true
    await ProductService.deleteValuationJobs(runIds)
    const res = await ProductService.getValuationJobs()
    runJobs.value = res.data
    if (runJobs.value === undefined || runJobs.value === null) {
      runJobs.value = []
    }
    totalPages.value = Math.ceil(runJobs.value.length / pageSize)
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

const viewControl = (runId: any, productId: any, productName: any, runName: any) => {
  console.log(runId, productId, productName, runName)
  ProductService.getValuationJobControl(runId).then((resp) => {
    console.log(resp.data)
    rowData.value = resp.data.projections
    createColumnDefs(rowData.value)
    console.log(rowData.value)
    console.log(columnDefs.value)
    tableTitle.value = productName + ' - ' + runName
    infoDialog.value = true
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

onMounted(async () => {
  loading.value = true
  const res = await ProductService.getValuationJobs()
  runJobs.value = res.data
  if (runJobs.value === undefined || runJobs.value === null) {
    runJobs.value = []
  }
  loading.value = false
  console.log(runJobs.value)
  totalPages.value = Math.ceil(runJobs.value.length / pageSize)
  console.log(totalPages.value)

  if (
    runJobs.value.length > 0 &&
    runJobs.value.some((job: any) => job.status === 'In Progress' || job.status === 'Queued')
  ) {
    pollTimer = setInterval(() => {
      if (
        runJobs.value.some((job: any) => job.status === 'In Progress' || job.status === 'Queued')
      ) {
        ProductService.getValuationJobs().then((response) => {
          runJobs.value = response.data
        })
      } else {
        clearInterval(pollTimer)
      }
    }, 3000)
  }
})
</script>

<style scoped>
/* Custom styling to minimize the spacing */
.custom-panel-title {
  padding: 0; /* Remove default padding */
  height: auto; /* Let height adjust automatically */
  display: flex;
  align-items: center; /* Align items vertically in the center */
}

/* Remove padding and margin from checkbox */
.no-padding-checkbox {
  padding: 0;
  margin: 0;
}

.v-checkbox {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
