<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">PAA Runs</span>
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
                  color="red"
                  variant="outlined"
                  @click="deleteRuns(selectedItems)"
                  >Delete Selected</v-btn
                >
              </v-col></v-row
            >
            <v-row v-if="runJobs.length > 0 && !loading">
              <v-col>
                <v-expansion-panels>
                  <v-expansion-panel v-for="item in paginatedJobs" :key="item.id">
                    <v-expansion-panel-title class="custom-panel-title px-3">
                      <template #default="{ expanded }">
                        <v-row no-gutters>
                          <v-col class="d-flex align-center justify-start" cols="4">
                            <v-checkbox
                              v-if="showSelect"
                              density="compact"
                              class="mr-2 no-padding-checkbox"
                              hide-details
                              :modelValue="isSelected(item.id)"
                              @click.stop="toggleSelect(item.id)"
                            />
                            {{ item.name }}
                          </v-col>

                          <v-col cols="8" class="text--secondary pl-1">
                            <v-fade-transition leave-absolute>
                              <span v-if="expanded" key="0">
                                <v-list-item-subtitle v-if="item.processing_status == 'processing'">
                                  Status: {{ item.processing_status }} | Current Progress:
                                  {{ (item.processed_records / item.total_records) * 100 }}%
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                  Start:
                                  {{ formatDateString(item.creation_date) }} | Duration:
                                  {{ toMinutes(item.run_time) }} | Status:
                                  {{ item.processing_status }} | User:
                                  {{ item.user_name }}
                                </v-list-item-subtitle>
                              </span>
                              <span v-else key="1">
                                <v-list-item-subtitle v-if="item.processing_status == 'processing'">
                                  Status: {{ item.processing_status }} | Current Progress:
                                  {{ (item.processed_records / item.total_records) * 100 }}%
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                  Start:
                                  {{ formatDateString(item.creation_date) }} | Duration:
                                  {{ toMinutes(item.run_time) }} | Status:
                                  {{ item.processing_status }} | User:
                                  {{ item.user_name }}
                                </v-list-item-subtitle>
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-list-item v-for="run in item.gmm_run_settings" :key="run.id">
                        <v-list-item-title>
                          <v-container>
                            <v-row>
                              <v-col cols="9">
                                {{ run.name }}
                              </v-col>
                              <v-col cols="3">
                                <v-btn
                                  v-if="run.status !== 'Failed'"
                                  variant="outlined"
                                  rounded
                                  size="small"
                                  color="primary"
                                  :to="'/valuations/paa/run-detail/' + run.id"
                                  >View Results</v-btn
                                >
                                <v-btn
                                  v-if="run.status !== 'Failed'"
                                  variant="outlined"
                                  rounded
                                  class="ml-2"
                                  size="small"
                                  color="red"
                                  @click.stop="confirmDelete(run.id)"
                                  >Delete</v-btn
                                >
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="run.status == 'Failed'">
                          <p>Run Error: {{ run.status_error }}</p>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <!-- <v-row v-if="item.failure_reason !== null && item.failure_reason !== ''">
                        <v-col>
                          <b>Reason for failure: {{ item.failure_reason }}</b>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex justify-space-between">
                          <v-btn
                            class="primary"
                            size="small"
                            color="red"
                            rounded
                            variant="outlined"
                            @click="confirmDelete(item.id)"
                            >Delete Run</v-btn
                          >
                          <v-btn
                            class="primary ml-5"
                            size="small"
                            color="primary"
                            rounded
                            variant="outlined"
                            :to="'/valuations/paa/run-detail/' + item.id"
                            >View Results</v-btn
                          >
                        </v-col>
                      </v-row> -->
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-row v-if="loading">
              <v-col>
                <p class="mt-3">Loading...</p>
                <v-progress-linear
                  buffer-value="20"
                  color="primary"
                  stream
                  value="10"
                ></v-progress-linear>
              </v-col>
            </v-row>

            <v-row v-if="runJobs.length == 0 && !loading">
              <v-col>
                <p>There are no available jobs to display.</p>
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
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title
        >
        <v-card-text>Are you sure you want to delete </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="plain" @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" variant="plain" @click="deleteRun(selectedRunId)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <confirm-dialog ref="confirmationDialog" />
</template>

<script setup lang="ts">
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'

import ModifiedGMMService from '../../../api/ModifiedGMMService'
import { onMounted, ref, computed } from 'vue'
import toMinutes from '../../../utils/helpers'
import { DateTime } from 'luxon'
import BaseCard from '../../../components/BaseCard.vue'

// selection variables
const selectedItems: any = ref([])
const selectBtnText = ref('Show Selection')
const showSelect = ref(false)

const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(3)

const paginatedJobs: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return runJobs.value.slice(start, end)
})

const confirmationDialog = ref()
const selectedRunId = ref(null)
const dialog = ref(false)
const runJobs: any = ref([])
const loading = ref(false)
let pollTimer: any = null

// selection methods
const isSelected = (id) => {
  return selectedItems.value.includes(id)
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

const deleteRuns = async (items: any) => {
  try {
    const result = await confirmationDialog.value.open(
      'Delete Valuation Jobs',
      'Are you sure you want to delete the selected valuation jobs?'
    )

    if (!result) {
      return
    }

    items.forEach((item) => {
      deleteRun(item)
    })
  } catch (e) {
    console.log(e)
  }
}

// other methods
const formatDateString = (dateString: any) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
}

const confirmDelete = (jobId: any) => {
  dialog.value = true
  selectedRunId.value = jobId
}

const deleteRun = async (itemId: any) => {
  ModifiedGMMService.deleteRun(itemId)
  runJobs.value = runJobs.value.filter(function (elem: any) {
    return elem.id !== itemId
  })

  dialog.value = false
}

onMounted(async () => {
  loading.value = true
  const resv2 = await ModifiedGMMService.getProjectionJobsv2()
  console.log(resv2.data)
  const res = await ModifiedGMMService.getProjectionJobs()
  console.log(res.data)

  runJobs.value = resv2.data
  console.log(runJobs.value)
  totalPages.value = Math.ceil(runJobs.value.length / pageSize)
  console.log(totalPages.value)
  loading.value = false
  if (
    runJobs.value.length > 0 &&
    runJobs.value.some((job: any) => job.processing_status === 'processing')
  ) {
    pollTimer = setInterval(() => {
      if (runJobs.value.some((job: any) => job.processing_status === 'processing')) {
        ModifiedGMMService.getProjectionJobs().then((response) => {
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
.text-container {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width 0.3s ease;
}

.text-container:hover {
  max-width: none;
  /* Allows the text to expand to its full length */
  white-space: normal;
  /* Allows the text to wrap */
}

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
