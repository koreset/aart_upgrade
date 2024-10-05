<template>
  <v-container>
    <v-row v-if="networkAvailable">
      <v-col>
        <v-card class="rounded-lg">
          <v-card-title class="mb-4 header-title accent white--text">Pricing Runs</v-card-title>
          <v-card-text v-if="runJobs.length === 0"
            ><h2 class="ma-4">There are no available Pricing runs at this time</h2></v-card-text
          >
          <v-card-text v-else>
            <v-expansion-panels>
              <v-expansion-panel v-for="job in runJobs" :key="job.id">
                <v-expansion-panel-header>
                  <template #default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="2">{{ job.name }}</v-col>
                      <v-col cols="10" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0">
                            <v-list-item-subtitle v-if="job.status == 'in progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ job.progress | reduceDecimal }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                              Run Status: {{ job.status }}
                            </v-list-item-subtitle>
                          </span>
                          <span v-else key="1">
                            <v-list-item-subtitle v-if="job.status == 'in progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ job.progress | reduceDecimal }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="job.status == 'complete'">
                              Run Date: {{ job.run_date }} | Duration
                              {{ job.run_time | toMinutes }} | User: {{ job.user }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="job.status == 'failed'">
                              Run Date: {{ job.run_date }} | Status: {{ job.status }} | Duration
                              {{ job.run_time | toMinutes }} | User: {{ job.user }}
                            </v-list-item-subtitle>
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
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
                        small
                        class="primary text--white mr-4"
                        @click="confirmDelete(job.id)"
                        >Delete {{ job.name }}</v-btn
                      >
                      <v-btn
                        v-if="job.status !== 'failed'"
                        rounded
                        small
                        :to="'/pricing-jobs/' + job.id"
                        class="primary text--white mr-4"
                        >View Results</v-btn
                      >
                      <v-btn
                        v-if="job.status !== 'failed'"
                        rounded
                        small
                        class="primary text--white mr-4"
                        @click="downloadResults(job.id)"
                        >Download Results</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <server-unavailable />
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
          <v-btn rounded color="primary darken-1" text @click="dialog = false">No</v-btn>
          <v-btn rounded color="primary darken-1" text @click="deletePricingJob(selectedJobId)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import ProductService from '../services/ProductService.js'
import moment from 'moment'
import PricingService from '../services/PricingService.js'
let pollTimer
export default {
  filters: {
    reduceDecimal(number) {
      return number.toFixed(2)
    },
    moment: function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    toMinutes: function (number) {
      // number = number
      const minutes = Math.floor(number / 60) // 7
      let seconds = ((number % 60) / 100) * 60 // 30
      seconds = Math.round(seconds)
      return minutes + ' minutes, ' + seconds + ' seconds'
    }
  },
  data: () => {
    return {
      dialog: false,
      selectedJobId: null,
      runJobs: [],
      value: 30,
      loading: false
    }
  },
  computed: {
    networkAvailable: function () {
      return this.$store.state.backendAvailable
    }
  },
  beforeUnmount() {
    clearInterval(pollTimer)
  },
  async mounted() {
    this.loading = true
    const res = await ProductService.getPricingJobs()
    this.runJobs = res.data
    console.log(this.runJobs)
    if (this.runJobs === undefined || this.runJobs === null) {
      this.runJobs = []
    }
    if (this.runJobs.length > 0 && this.runJobs.some((job) => job.status === 'in progress')) {
      pollTimer = setInterval(() => {
        if (this.runJobs.some((job) => job.status === 'in progress')) {
          ProductService.getPricingJobs().then((response) => {
            this.runJobs = response.data
          })
        } else {
          clearInterval(pollTimer)
        }
      }, 3000)
    }
  },
  methods: {
    confirmDelete(jobId) {
      this.dialog = true
      this.selectedJobId = jobId
    },
    deletePricingJob(id) {
      PricingService.deletePricing(id)
      this.runJobs = this.runJobs.filter(function (elem) {
        return elem.id !== id
      })
      this.dialog = false
    },
    downloadResults(jobId) {
      PricingService.getPricingExcelResults(jobId).then((response) => {
        this.excelLoading = false
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute('download', 'pricing-results-' + jobId + '.xlsx')
        document.body.appendChild(fileLink)

        fileLink.click()
      })
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
  font-size: 0.7rem;
}
</style>
