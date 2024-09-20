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
                  <v-expansion-panel v-for="item in csmRuns" :key="item.id">
                    <v-expansion-panel-title>
                      <template #default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="3">{{ item.name }} - ( {{ item.measurement_type }} )</v-col>
                          <v-col cols="9" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
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
                                  {{ item.creation_date }} | Run duration:
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
                                  {{ item.creation_date }} | Run duration:
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
        </base-card>
      </v-col>
    </v-row>
    <!-- <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title
        >
        <v-card-text>Are you sure you want to delete </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" text @click="deleteJob(selectedJobId)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <confirm-dialog ref="confirmDeleteDialog"></confirm-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CsmEngine from '@/renderer/api/CsmEngine'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import { onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

let pollTimer
const confirmDeleteDialog = ref()
// const backSign = ref('<')
const dialog = ref(false)
// const selectedJobId = ref(null)
const csmRuns: any = ref([])
// const loadingComlete = ref(false)

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

const deleteJob = (id, type, runDate) => {
  CsmEngine.deleteIfrs17Job(id, type, runDate)
    .then(() => {
      csmRuns.value = csmRuns.value.filter(function (elem) {
        return elem.id !== id
      })

      dialog.value = false
    })
    .catch(() => {})
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

// export default {
//   data() {
//     return {
//       backSign: '<',
//       dialog: false,
//       selectedJobId: null,
//       csmRuns: [],
//       loadingComlete: false
//     }
//   },
//   filters: {
//     moment: function (date) {
//       return moment(date).format('MMM Do YYYY, h:mm:ss a')
//     },
//     toMinutes: function (number) {
//       let minutes, seconds
//       if (number < 60) {
//         minutes = 0
//         seconds = Math.floor(number)
//       } else {
//         // TODO
//         minutes = Math.floor(number / 60)
//         seconds = number % 60
//         seconds = Math.round(seconds)
//       }
//       return minutes + 'm, ' + seconds + 's'
//     },
//     roundPercent: function (number) {
//       return number.toFixed(2)
//     },
//     checkNumberValid(number) {
//       if (isNaN(number)) {
//         return 0
//       }
//       return number
//     }
//   },
//   methods: {
//     confirmDelete(id, type, run_date) {
//       this.selectedJobId = id
//       this.selectedMeasurementType = type
//       this.selectedRunDate = run_date
//       this.dialog = true
//     },
//     deleteJob(id) {
//       CsmEngine.deleteIfrs17Job(id, this.selectedMeasurementType, this.selectedRunDate)
//         .then(() => {
//           this.csmRuns = this.csmRuns.filter(function (elem) {
//             return elem.id !== id
//           })

//           this.dialog = false
//         })
//         .catch(() => {})
//     }
//   },

//   async mounted() {
//     const res = await CsmEngine.getCsmRuns()
//     this.csmRuns = res.data
//     if (
//       this.csmRuns.length > 0 &&
//       this.csmRuns.some(
//         (job) => job.processing_status === 'queued' || job.processing_status === 'running'
//       )
//     ) {
//       pollTimer = setInterval(() => {
//         if (
//           this.csmRuns.some(
//             (job) => job.processing_status === 'queued' || job.processing_status === 'running'
//           )
//         ) {
//           CsmEngine.getCsmRuns().then((res) => {
//             this.csmRuns = res.data
//           })
//         } else {
//           clearInterval(pollTimer)
//         }
//       }, 2000)
//     }
//   }
// }
</script>

<style></style>
