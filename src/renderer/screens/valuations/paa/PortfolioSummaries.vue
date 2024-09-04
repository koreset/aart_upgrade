<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Portfolio Summaries</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedPortfolio"
                  label="Choose a Portfolio"
                  variant="outlined"
                  density="compact"
                  :items="portfolios"
                  item-text="name"
                  item-title="name"
                  return-object
                  @update:model-value="getModelPointYears"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedModelPointYear"
                  label="Select a Model point year"
                  variant="outlined"
                  density="compact"
                  :items="modelPointYears"
                  item-title="year"
                  item-value="year"
                  @update:model-value="getModelPointVersions"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedModelPointVersion"
                  label="Select a Model point Version"
                  variant="outlined"
                  density="compact"
                  :items="modelPointVersions"
                  item-title="year"
                  item-value="year"
                  @update:model-value="getModelPointStats"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="!loadingData && modelpointStats.length > 0">
              <v-col>
                <v-card>
                  <v-card-title class="header-title accent white--text mb-3"
                    >Model Point Statistics</v-card-title
                  >
                  <v-card-text>
                    <v-table class="model-stats trans-tables">
                      <thead>
                        <tr>
                          <th>Variable</th>
                          <th>Min</th>
                          <th>Max</th>
                          <th>Average</th>
                          <th>Number of Zeroes</th>
                          <th>Distinct Values</th>
                          <th>Total Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in modelpointStats" :key="item.variable">
                          <td>{{ transformText(item.variable) }}</td>
                          <td>{{ item.min }}</td>
                          <td>{{ item.max }}</td>
                          <td>{{ reduceDecimal(item.average) }}</td>
                          <td>{{ item.number_of_zeroes }}</td>
                          <td>{{ item.distinct_values }}</td>
                          <td>{{ item.total_count }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import BaseCard from '../../../components/BaseCard.vue'

const selectedPortfolio = ref(null)
const selectedModelPointYear = ref(null)
const selectedModelPointVersion = ref(null)
const portfolios = ref([])
// const portfolioList = ref([]);
const modelPointYears = ref([])
const modelpointStats = ref([])
const modelPointVersions = ref([])
const loadingData = ref(false)
// const variableItems = ref([
//   "sub_product_code",
//   "term_months",
//   "locked_in_year",
//   "locked_in_month",
//   "ifrs17_group",
//   "ifrs17_group_treaty1",
//   "ifrs17_group_treaty2",
//   "ifrs17_group_treaty3",
//   "annual_premium",
//   "frequency",
//   "duration_in_force_months",
//   "original_loan",
//   "annual_interest_rate",
//   "monthly_instalment",
//   "outstanding_loan_term_months",
// ]);

onMounted(() => {
  loadingData.value = true
  ModifiedGMMService.getPaaPortfolios().then((res) => {
    portfolios.value = res.data
    loadingData.value = false
  })
})

const transformText = (text) => {
  text = text.replace(/_/g, ' ')
  text = toTitleCase(text)
  return text
}

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  })
}

const reduceDecimal = (number) => {
  return Math.round(number)
}

const getModelPointVersions = () => {
  if (selectedModelPointYear.value) {
    ModifiedGMMService.getAvailableMpVersions(
      selectedPortfolio.value.name,
      selectedModelPointYear.value
    ).then((res) => {
      console.log(res.data)
      modelPointVersions.value = res.data
    })
  }
}

const getModelPointYears = () => {
  if (selectedPortfolio.value) {
    modelPointYears.value = []
    modelPointVersions.value = []
    modelpointStats.value = []
    selectedModelPointVersion.value = null
    selectedModelPointYear.value = null

    if (selectedPortfolio.value.year_versions.length > 0) {
      modelPointYears.value = selectedPortfolio.value.year_versions
    }

    modelPointYears.value = selectedPortfolio.value.year_versions
  }
}

const getModelPointStats = () => {
  loadingData.value = true
  modelpointStats.value = []
  if (selectedModelPointVersion.value) {
    ModifiedGMMService.getModelPointStats(
      selectedPortfolio.value.name,
      selectedModelPointYear.value,
      selectedModelPointVersion.value
    ).then((res) => {
      modelpointStats.value = res.data
      loadingData.value = false
    })
  }
}
</script>

<style scoped></style>
