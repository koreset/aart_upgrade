<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">IFRS17 Runs</span>
          </template>
          <template #default>
            <v-row v-if="csmRuns.length == 0">
              <v-col><h3 class="my-3"> There are no available runs to display here. </h3></v-col>
            </v-row>
            <v-row v-if="csmRuns.length > 0">
              <v-col>
                <v-expansion-panels>
                  <v-expansion-panel v-for="item in paginatedJobs" :key="item.id">
                    <v-expansion-panel-title>
                      <template #default="{ expanded }">
                        <v-row no-gutters>
                          <v-col cols="3">{{ item.name }} - ( {{ item.measurement_type }} )</v-col>
                          <v-col cols="9" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="expanded" key="0">
                                <v-list-item-subtitle
                                  v-if="
                                    item.processing_status == 'queued' ||
                                    item.processing_status == 'running'
                                  "
                                >
                                  Status: {{ item.processing_status }} | Current Progress:
                                  {{
                                    roundPercent((item.processed_groups / item.total_groups) * 100)
                                  }}%
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                  Start:
                                  {{ formatDateString(item.creation_date) }} | Run duration:
                                  {{ toMinutes(item.run_time) }} | Status:
                                  {{ item.processing_status }}
                                </v-list-item-subtitle>
                              </span>
                              <span v-else key="1">
                                <v-list-item-subtitle
                                  v-if="
                                    item.processing_status == 'queued' ||
                                    item.processing_status == 'running'
                                  "
                                >
                                  Status: {{ item.processing_status }} | Current Progress:
                                  {{
                                    roundPercent((item.processed_groups / item.total_groups) * 100)
                                  }}%
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                  Start:
                                  {{ formatDateString(item.creation_date) }} | Run duration:
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
                      <v-row v-if="item.failure_reason && item.failure_reason.trim().length > 0">
                        <v-col>
                          <p>Failure Reason: {{ item.failure_reason }}</p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex justify-space-between">
                          <v-btn
                            class="primary"
                            size="small"
                            variant="outlined"
                            rounded
                            color="red"
                            @click="deleteJob(item.id, item.measurement_type, item.run_date)"
                            >Delete Run</v-btn
                          >
                          <v-btn
                            v-if="item.measurement_type == 'GMM' || item.measurement_type == 'VFA'"
                            class="primary ml-5"
                            size="small"
                            variant="outlined"
                            rounded
                            :to="'/ifrs17/aos-run-detail/' + item.id + '/' + item.run_date"
                            >View Results</v-btn
                          >
                          <v-btn
                            v-else
                            class="primary ml-5"
                            size="small"
                            variant="outlined"
                            rounded
                            :to="'/ifrs17/paa-run-detail/' + item.paa_run_id + '/' + item.run_date"
                            >View PAA Results</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
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
    <confirm-dialog ref="confirmDeleteDialog"></confirm-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import { onMounted, ref, computed } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { DateTime } from 'luxon'
let pollTimer
const confirmDeleteDialog = ref()
// const backSign = ref('<')
const dialog = ref(false)
// const selectedJobId = ref(null)
const csmRuns: any = ref([])
// const loadingComlete = ref(false)

const pageSize = 10
const currentPage = ref(1)
const totalPages = ref(3)

const paginatedJobs: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return csmRuns.value.slice(start, end)
})

const formatDateString = (dateString: any) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
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
  return minutes + 'm, ' + seconds + 's'
}

const roundPercent = (number) => {
  number = checkNumberValid(number)
  return number.toFixed(2)
}

const deleteJob = async (id, type, runDate) => {
  try {
    const res = await confirmDeleteDialog.value.open(
      'Delete Confirmation',
      'Are you sure you want to delete?'
    )
    if (res) {
      CsmEngine.deleteIfrs17Job(id, type, runDate)
        .then(() => {
          csmRuns.value = csmRuns.value.filter(function (elem) {
            return elem.id !== id
          })

          dialog.value = false
        })
        .catch(() => {})
    }
  } catch (error) {
    console.log(error)
  }
}

const checkNumberValid = (number) => {
  if (isNaN(number)) {
    return 0
  }
  return number
}

onMounted(async () => {
  const res = await CsmEngine.getCsmRuns()
  csmRuns.value = res.data
  if (
    csmRuns.value.length > 0 &&
    csmRuns.value.some(
      (job) => job.processing_status === 'queued' || job.processing_status === 'running'
    )
  ) {
    pollTimer = setInterval(() => {
      if (
        csmRuns.value.some(
          (job) => job.processing_status === 'queued' || job.processing_status === 'running'
        )
      ) {
        CsmEngine.getCsmRuns().then((res) => {
          csmRuns.value = res.data
        })
      } else {
        clearInterval(pollTimer)
      }
    }, 2000)
  }
})
</script>

<style></style>
