<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Experience Analysis Runs</span>
          </template>
          <template #default>
            <v-row v-if="runResults.length > 0 && !loading">
              <v-col>
                <v-expansion-panels>
                  <v-expansion-panel v-for="item in runResults" :key="item.id">
                    <v-expansion-panel-title>
                      <template #default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="3">{{ item.name }}</v-col>
                          <v-col cols="9" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
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
                                  {{ toMinutes(item.run_duration) }} | Status:
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
                                  {{ item.creation_date }} | Run duration:
                                  {{ toMinutes(item.run_duration) }} | Status:
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
                            size="small"
                            variant="outlined"
                            rounded
                            @click="confirmDelete(item.id)"
                            >Delete Run</v-btn
                          >
                          <v-btn
                            class="primary ml-5"
                            size="small"
                            variant="outlined"
                            rounded
                            :to="'/exp-analysis/run-detail/' + item.id"
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
            <v-row v-if="runResults.length == 0 && !loading">
              <v-col>
                <p>There are no available jobs to display.</p>
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
          <v-btn color="primary darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" text @click="deleteRun(selectedRunId)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import ExpService from '@/renderer/api/ExpAnalysisService.js'
import { onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'

// data
const selectedRunId = ref(null)
const runResults: any = ref([])
const loading = ref(false)
const dialog = ref(false)

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

const roundPercent = (number) => {
  return number.toFixed(2)
}

const getRunResults = async () => {
  loading.value = true
  try {
    const response = await ExpService.getRunResults()
    runResults.value = response.data
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

const deleteRun = async (runId) => {
  try {
    await ExpService.deleteRun(runId)
    getRunResults()
    dialog.value = false
  } catch (error) {
    console.log(error)
  }
}

const confirmDelete = (runId: any) => {
  selectedRunId.value = runId
  dialog.value = true
}

onMounted(() => {
  getRunResults()
})

// export default {
//   filters: {
//     moment: function (date) {
//       return moment(date).format('MMMM Do YYYY, h:mm:ss a')
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
//       return minutes + ' m, ' + seconds + ' s'
//     },
//     roundPercent: function (number) {
//       return number.toFixed(2)
//     }
//   },

//   data() {
//     return {
//       loading: false,
//       dialog: false,
//       runResults: []
//     }
//   },
//   created() {
//     this.getRunResults()
//   },
//   methods: {
//     confirmDelete(runId) {
//       this.selectedRunId = runId
//       this.dialog = true
//     },
//     deleteRun(runId) {
//       ExpService.deleteRun(runId)
//         .then(() => {
//           this.getRunResults()
//           this.dialog = false
//         })
//         .catch((error) => {
//           console.log(error)
//         })
//     },
//     async getRunResults() {
//       this.loading = true
//       ExpService.getRunResults()
//         .then((response) => {
//           this.runResults = response.data
//           this.loading = false
//         })
//         .catch((error) => {
//           console.log(error)
//         })
//     }
//   }
// }
</script>

<style lang="scss" scoped></style>
