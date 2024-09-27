<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">LIC Runs</span>
          </template>
          <template #default>
            <v-row v-if="runJobs.length > 0 && !loading">
              <v-col>
                <v-expansion-panels>
                  <v-expansion-panel v-for="item in paginatedJobs" :key="item.id">
                    <v-expansion-panel-title>
                      <template #default="{ expanded }">
                        <v-row no-gutters>
                          <v-col cols="3">{{ item.run_name }}</v-col>
                          <v-col cols="9" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="expanded" key="0">
                                <v-list-item-subtitle v-if="item.processing_status == 'processing'">
                                  Status: {{ item.processing_status }} | Current Progress:
                                  {{
                                    roundPercent(
                                      (item.processed_records / item.total_records) * 100
                                    )
                                  }}%
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                  Start:
                                  {{ item.creation_date }} | Run duration:
                                  {{ toMinutes(item.run_time) }} | Status:
                                  {{ item.processing_status }}
                                </v-list-item-subtitle>
                              </span>
                              <span v-else key="1">
                                <v-list-item-subtitle v-if="item.processing_status == 'processing'">
                                  Status: {{ item.processing_status }} | Current Progress:
                                  {{
                                    roundPercent(
                                      (item.processed_records / item.total_records) * 100
                                    )
                                  }}%
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                  Start:
                                  {{ runDateFormatted(item.creation_date) }} | Run duration:
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
                      <v-row v-if="item.failure_reason !== ''">
                        <v-col>
                          <p>Failure reason: {{ item.failure_reason }}</p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex justify-space-between">
                          <v-btn
                            class="primary"
                            variant="outlined"
                            size="small"
                            color="red"
                            rounded
                            @click="deleteRun(item.id)"
                            >Delete Run</v-btn
                          >
                          <v-btn
                            class="primary ml-5"
                            size="small"
                            variant="outlined"
                            rounded
                            :to="'/valuations/lic/run-details/' + item.id"
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
    <confirmation-dialog ref="confirmDeleteAction" />
  </v-container>
</template>

<script setup lang="ts">
import LicService from '@/renderer/api/LicService'
import { onMounted, ref, computed } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { DateTime } from 'luxon'
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'

let pollTimer

const confirmDeleteAction = ref()
const runJobs: any = ref([])
const loading = ref(false)
const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(3)

// methods

const paginatedJobs: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return runJobs.value.slice(start, end)
})

const runDateFormatted = (date) => {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED)
}

const toMinutes = (number) => {
  let minutes, seconds
  if (number < 60) {
    minutes = 0
    seconds = Math.floor(number)
  } else {
    // TODO
    minutes = Math.floor(number / 60)
    seconds = number % 60
    seconds = Math.round(seconds)
  }
  return minutes + ' m, ' + seconds + ' s'
}
// const roundPercent = (number) => {
//   return number.toFixed(2)
// }

const deleteRun = async (itemId: any) => {
  const confirmed = await confirmDeleteAction.value.open(
    'Deleting LIC Run',
    'Are you sure you want to delete this run?'
  )
  if (!confirmed) {
    return
  }
  LicService.deleteLicRun(itemId).then(() => {
    runJobs.value = runJobs.value.filter(function (elem: any) {
      return elem.id !== itemId
    })
  })
}

onMounted(async () => {
  loading.value = true

  const res = await LicService.getLicRuns()
  runJobs.value = res.data
  loading.value = false
  if (
    runJobs.value.length > 0 &&
    runJobs.value.some((job: any) => job.processing_status === 'processing')
  ) {
    pollTimer = setInterval(() => {
      if (runJobs.value.some((job: any) => job.processing_status === 'processing')) {
        LicService.getLicRuns().then((response) => {
          runJobs.value = response.data
        })
      } else {
        clearInterval(pollTimer)
      }
    }, 2000)
  }
  totalPages.value = Math.ceil(runJobs.value.length / pageSize)
})

const roundPercent = (number: any) => {
  return number.toFixed(2)
}
</script>

<style></style>
