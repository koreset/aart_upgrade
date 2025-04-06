<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Pricing Runs</span>
          </template>
          <template v-if="runJobs.length === 0 && !loading" #default
            ><h4 class="ma-4">There are no available Pricing runs at this time</h4></template
          >
          <template v-else #default>
            <v-expansion-panels>
              <v-expansion-panel v-for="job in runJobs" :key="job.id">
                <v-expansion-panel-title>
                  <template #default="{ expanded }">
                    <v-row no-gutters>
                      <v-col cols="3">{{ job.name }}</v-col>
                      <v-col cols="9" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="expanded" key="0">
                            <v-list-item-subtitle v-if="job.status == 'in progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ reduceDecimal(job.progress) }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                              Run Status: {{ job.status }}
                            </v-list-item-subtitle>
                          </span>
                          <span v-else key="1">
                            <v-list-item-subtitle v-if="job.status == 'in progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ reduceDecimal(job.progress) }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="job.status == 'complete'">
                              Run Date: {{ formatDateString(job.run_date) }} | Duration
                              {{ toMinutes(job.run_time) }} | User: {{ job.user }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="job.status == 'failed'">
                              Run Date: {{ formatDateString(job.run_date) }} | Status:
                              {{ job.status }} | Duration {{ toMinutes(job.run_time) }} | User:
                              {{ job.user }}
                            </v-list-item-subtitle>
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row
                    v-if="job.status === 'failed'"
                    class="mb-6"
                    justify="space-around"
                    no-gutters
                  >
                    <v-col>
                      <h4>Failure Reason: {{ job.failure_reason }}</h4>
                    </v-col>
                  </v-row>
                  <v-row justify="space-around" no-gutters>
                    <v-col>
                      <v-btn
                        rounded
                        size="small"
                        color="red"
                        variant="outlined"
                        class="primary text--white mr-4"
                        @click="confirmDelete(job.id)"
                        >Delete {{ job.name }}</v-btn
                      >
                      <v-btn
                        v-if="job.status !== 'failed'"
                        rounded
                        size="small"
                        variant="outlined"
                        :to="'/pricing/run-details/' + job.id"
                        class="primary text--white mr-4"
                        >View Results</v-btn
                      >
                      <v-btn
                        v-if="job.status !== 'failed'"
                        rounded
                        size="small"
                        variant="outlined"
                        class="primary text--white mr-4"
                        @click="downloadResults(job.id)"
                        >Download Results</v-btn
                      >
                      <v-btn
                        v-if="job.status !== 'failed'"
                        rounded
                        size="small"
                        variant="outlined"
                        class="primary text--white mr-4"
                        @click="reRun(job.id)"
                        >Re Run Job</v-btn
                      >

                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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
          <v-btn rounded color="primary darken-1" variant="plain" @click="dialog = false">No</v-btn>
          <v-btn
            rounded
            color="primary darken-1"
            variant="plain"
            @click="deletePricingJob(selectedJobId)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import ProductService from '@/renderer/api/ProductService.js'
// import moment from 'moment'
import PricingService from '@/renderer/api/PricingService.js'
import { onMounted, ref } from 'vue'
import { DateTime } from 'luxon'
import BaseCard from '@/renderer/components/BaseCard.vue'
// import LoadingIndicator from '@/renderer/components/LoadingIndicator.vue'

let pollTimer
const reduceDecimal = (number) => {
  return number.toFixed(2)
}

const formatDateString = (dateString: any) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
}

const toMinutes = (number) => {
  // number = number
  const minutes = Math.floor(number / 60) // 7
  let seconds = ((number % 60) / 100) * 60 // 30
  seconds = Math.round(seconds)
  return minutes + ' minutes, ' + seconds + ' seconds'
}

// data
const dialog = ref(false)
const selectedJobId = ref(null)
const runJobs: any = ref([])
const loading = ref(false)
// const value = ref(30)

onMounted(async () => {
  loading.value = true
  const res = await ProductService.getPricingJobs()
  runJobs.value = res.data
  if (runJobs.value === undefined || runJobs.value === null) {
    runJobs.value = []
  }
  if (runJobs.value.length > 0 && runJobs.value.some((job) => job.status === 'in progress')) {
    pollTimer = setInterval(() => {
      if (runJobs.value.some((job) => job.status === 'in progress')) {
        ProductService.getPricingJobs().then((response) => {
          runJobs.value = response.data
        })
      } else {
        clearInterval(pollTimer)
      }
    }, 3000)
  }
})

const confirmDelete = (jobId) => {
  dialog.value = true
  selectedJobId.value = jobId
}

const deletePricingJob = (id) => {
  PricingService.deletePricing(id)
  runJobs.value = runJobs.value.filter(function (elem) {
    return elem.id !== id
  })
  dialog.value = false
}

const downloadResults = (jobId) => {
  PricingService.getPricingExcelResults(jobId).then((response) => {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const fileLink = document.createElement('a')

    fileLink.href = fileURL
    fileLink.setAttribute('download', 'pricing-results-' + jobId + '.xlsx')
    document.body.appendChild(fileLink)

    fileLink.click()
  })
}

const reRun = (jobId) => {
  PricingService.reRunPricingJob(jobId).then((response) => {
    runJobs.value = runJobs.value.filter(function (elem) {
      return elem.id !== jobId
    })
    runJobs.value.push(response.data)
  })
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
  font-size: 0.7rem;
}
</style>
