<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Projection Runs</span>
          </template>
          <template #default>
            <v-row v-if="runJobs.length > 0 && !loading">
              <v-col>
                <v-expansion-panels>
                  <v-expansion-panel v-for="item in paginatedJobs" :key="item.id">
                    <v-expansion-panel-title>
                      <template #default="{ expanded }">
                        <v-row no-gutters>
                          <v-col cols="3" class="text-container"> {{ item.name }}</v-col>
                          <v-col cols="9" class="text--secondary pl-1">
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
                      <v-row v-if="item.failure_reason !== null && item.failure_reason !== ''">
                        <v-col>
                          <b>Reason for failure: {{ item.failure_reason }}</b>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex justify-space-between">
                          <v-btn class="primary" small rounded @click="confirmDelete(item.id)"
                            >Delete Run</v-btn
                          >
                          <v-btn
                            class="primary ml-5"
                            small
                            rounded
                            :to="'/valuations/paa/run-detail/' + item.id"
                            >View Results</v-btn
                          >
                        </v-col>
                      </v-row>
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
            <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
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
</template>

<script setup lang="ts">
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import { onMounted, ref, computed } from 'vue'
import toMinutes from '../../../utils/helpers'
import { DateTime } from 'luxon'
import BaseCard from '../../../components/BaseCard.vue'

const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(3)

const paginatedJobs: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return runJobs.value.slice(start, end)
})

const selectedRunId = ref(null)
const dialog = ref(false)
const runJobs: any = ref([])
const loading = ref(false)
let pollTimer: any = null

const formatDateString = (dateString: any) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
}

const confirmDelete = (jobId: any) => {
  dialog.value = true
  selectedRunId.value = jobId
}

const deleteRun = (itemId: any) => {
  ModifiedGMMService.deleteRun(itemId)
  runJobs.value = runJobs.value.filter(function (elem: any) {
    return elem.id !== itemId
  })

  dialog.value = false
}

onMounted(async () => {
  loading.value = true
  const res = await ModifiedGMMService.getProjectionJobs()
  runJobs.value = res.data
  console.log(runJobs.value)
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
</style>
