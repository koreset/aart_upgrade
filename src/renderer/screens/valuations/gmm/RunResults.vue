<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Valuation Run Results</span>
          </template>
          <template #default>
            <v-expansion-panels>
              <v-expansion-panel v-for="job in paginatedJobs" :key="job.id">
                <v-expansion-panel-title>
                  <template #default="{ expanded }">
                    <v-row no-gutters>
                      <v-col class="d-flex justify-start" cols="3">
                        {{ job.run_name }}
                      </v-col>
                      <v-col class="text-grey" cols="9">
                        <v-fade-transition leave-absolute>
                          <span v-if="expanded" key="0">
                            <v-list-item-subtitle v-if="job.status == 'In Progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ (job.points_done / job.total_points) * 100 }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                              Start: {{ formatDateString(job.creation_date) }} |
                              Duration: {{ toMinutes(job.run_time) }} |
                              Status: {{ job.status }} | User:
                              {{ job.user_name }}
                            </v-list-item-subtitle>

                          </span>
                          <span v-else key="1">
                            <v-list-item-subtitle v-if="job.status == 'In Progress'">
                              Status: {{ job.status }} | Current Progress:
                              {{ (job.points_done / job.total_points) * 100 }}%
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                              Start: {{ formatDateString(job.creation_date) }} |
                              Duration: {{ toMinutes(job.run_time) }} |
                              Status: {{ job.status }} | User:
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
                            <v-btn v-if="job.status !== 'Failed'" variant="plain" rounded size="small" color="primary"
                              :to="'/valuation-jobs/' +
                run.id +
                '/' +
                run.product_id +
                '/' +
                run.product_name +
                '/' +
                job.run_name +
                '/control'
                ">View Control</v-btn>
                            <v-btn v-if="job.status !== 'Failed'" variant="plain" rounded size="small" color="primary"
                              :to="'/valuations/gmm/run-detail/' +
                run.id +
                '/' +
                run.product_id +
                '/' +
                run.product_name +
                '/' +
                job.run_name
                ">View Results</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="job.status == 'Failed'">
                      <p>Run Error: {{ job.status_error }}</p>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-btn variant="plain" rounded size="small" color="primary" @click="deleteRun(job.id)">Delete {{
                job.run_name
              }}</v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template #actions>
            <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../../../components/BaseCard.vue'
import { computed, onMounted, ref } from 'vue'
import ProductService from '../../../api/ProductService'
import { DateTime } from 'luxon'

const loading = ref(false)
const runJobs = ref([])
const pageSize = 10;
const currentPage = ref(1);
const totalPages = ref(3)
let pollTimer: any = null;

const paginatedJobs: any = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return runJobs.value.slice(start, end);
});

const formatDateString = (dateString: any) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED);
}

const toMinutes = (number: any) => {
  number = number * 60;
  const minutes = Math.floor(number / 60); // 7
  let seconds = ((number % 60) / 100) * 60; // 30
  seconds = Math.round(seconds);
  return minutes + " m, " + seconds + " s";
}

const deleteRun = async (runId: any) => {
  // loading.value = true;
  // await ProductService.deleteValuationJob(runId);
  // const res = await ProductService.getValuationJobs();
  // runJobs.value = res.data;
  // if (runJobs.value === undefined || runJobs.value === null) {
  //   runJobs.value = [];
  // }
  // totalPages.value = Math.ceil(runJobs.value.length / pageSize);
  // loading.value = false;
}

onMounted(async () => {
  loading.value = true;
  const res = await ProductService.getValuationJobs();
  runJobs.value = res.data;
  if (runJobs.value === undefined || runJobs.value === null) {
    runJobs.value = [];
  }
  loading.value = false;
  console.log(runJobs.value);
  totalPages.value = Math.ceil(runJobs.value.length / pageSize);
  console.log(totalPages.value);

  if (
    runJobs.value.length > 0 &&
    runJobs.value.some((job: any) => job.status === "In Progress" || job.status === "Queued")
  ) {
    pollTimer = setInterval(() => {
      if (runJobs.value.some((job: any) => job.status === "In Progress" || job.status === "Queued")) {
        ProductService.getValuationJobs().then((response) => {
          runJobs.value = response.data;
        });
      } else {
        clearInterval(pollTimer);
      }
    }, 3000);
  }
})
</script>

<style scoped></style>
