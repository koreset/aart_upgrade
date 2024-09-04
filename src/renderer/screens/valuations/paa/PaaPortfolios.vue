<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">PAA Portfolios</span>
          </template>
          <template #default>
            <v-row class="mt-9 mx-5">
              <v-col cols="3">
                <v-text-field
                  v-model="portfolioName"
                  class="mr-9"
                  placeholder="Portfolio Name"
                  label="Portfolio Name"
                  variant="outlined"
                  density="compact"
                  :error-messages="portfolioNameErrors"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="discountOption"
                  placeholder="Select a Discount Option"
                  label="Discount Option"
                  variant="outlined"
                  density="compact"
                  :items="discountTypes"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="premiumEarningPattern"
                  placeholder="Select a Premium Earning Pattern"
                  label="Premium Earning Pattern"
                  variant="outlined"
                  density="compact"
                  :items="earningPatterns"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="selectedInsuranceType"
                  placeholder="Select an Insurance Type"
                  label="Insurance Type"
                  variant="outlined"
                  density="compact"
                  :items="insuranceTypes"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col class="d-flex align-baseline" cols="3">
                <v-btn rounded class="primary mt-1" small @click="createPortfolio"
                  >Add Portfolio</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="portfolios.length > 0" class="mx-5">
              <v-col>
                <base-card :showActions="false">
                  <template #header>
                    <span class="headline">Portfolios List</span>
                  </template>
                  <template #default>
                    <v-expansion-panels v-model="activePanel">
                      <v-expansion-panel
                        v-for="item in portfolios"
                        :key="item.name"
                        @group:selected="checkClass"
                      >
                        <v-expansion-panel-title :class="expansionColor">
                          <template #default="{ expanded }">
                            <v-row no-gutters>
                              <v-col cols="4">
                                {{ item.name }}
                              </v-col>
                              <v-col cols="8">
                                <v-fade-transition leave-absolute>
                                  <v-row v-if="expanded" no-gutters style="width: 100%">
                                    <v-col class="d-flex justify-end">
                                      <v-btn
                                        class="ml-7 pb-2 mr-9"
                                        variant="text"
                                        icon
                                        @click="deletePortfolio(item.id)"
                                      >
                                        <v-icon color="red">mdi-delete</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-fade-transition>
                              </v-col>
                            </v-row>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-row class="mt-5">
                            <v-col> <b>Discount Option:</b> {{ item.discount_option }} </v-col>
                            <v-col>
                              <b>Premium Earning Pattern: </b>
                              {{ item.premium_earning_pattern }}
                            </v-col>
                            <v-col> <b>Insurance Type: </b> {{ item.insurance_type }} </v-col>
                          </v-row>
                          <v-row> </v-row>
                          <v-row> </v-row>
                          <v-row>
                            <v-col>
                              <p class="mpc-border"><b>Model Point Counts</b></p>
                              <v-row
                                v-if="item.year_versions == null || item.year_versions.length == 0"
                              >
                                <v-col>
                                  There are no model points uploaded for this portfolio
                                </v-col>
                              </v-row>
                              <v-row v-for="elem in item.year_versions" :key="elem.year">
                                <v-col class="mt-2" cols="2">Year: {{ elem.year }}</v-col>
                                <v-col class="mt-2" cols="2">Version: {{ elem.mp_version }}</v-col>
                                <v-col class="mt-2" cols="2">Count: {{ elem.count }}</v-col>
                                <v-col cols="1">
                                  <v-btn
                                    variant="plain"
                                    icon
                                    small
                                    @click="
                                      showData(item.id, item.name, elem.year, elem.mp_version)
                                    "
                                  >
                                    <v-icon color="accent">mdi-information</v-icon></v-btn
                                  >
                                </v-col>
                                <v-col cols="1">
                                  <v-btn
                                    variant="plain"
                                    icon
                                    small
                                    @click="deleteData(item.id, elem.year, elem.mp_version)"
                                  >
                                    <v-icon color="red">mdi-delete</v-icon></v-btn
                                  >
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </template>
                </base-card>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../../../components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import ModifiedGMMService from '../../../api/ModifiedGMMService'

const activePanel = ref([])
const expansionColor = ref('')
const portfolioName = ref('')
const discountOption = ref('')
const premiumEarningPattern = ref('')
const selectedInsuranceType = ref('')
const loadDataComplete = ref(false)

const portfolios: any = ref([])

const discountTypes = [
  { text: 'Undiscounted', value: 'undiscounted' },
  { text: 'Discounted', value: 'discounted' }
]

const earningPatterns = [
  { text: 'Passage of Time', value: 'passageoftime' },
  { text: 'Specified by User', value: 'userdefined' }
]

const insuranceTypes = [
  { text: 'Reinsurance', value: 'reinsurance' },
  { text: 'Direct', value: 'direct' }
]

const portfolioNameErrors = ref([])

const createPortfolio = () => {
  console.log('Creating Portfolio')
}

const deletePortfolio = (id: number) => {
  console.log('Deleting Portfolio', id)
}

const deleteData = (id: number, year: number, version: number) => {
  console.log('Deleting Data', id, year, version)
}

const showData = (id: number, name: string, year: number, version: number) => {
  console.log('Showing Data', id, name, year, version)
}

const checkClass = (item: any) => {
  console.log('Checking Class', item)
  if (item) {
    console.log('activePanel', activePanel.value)
    expansionColor.value = 'expanded'
  } else {
    console.log('activePanel', activePanel.value)
    expansionColor.value = ''
  }
}

onMounted(() => {
  ModifiedGMMService.getPaaPortfolios().then((res) => {
    if (res.data.length > 0) {
      portfolios.value = res.data
    } else {
      portfolios.value = []
      loadDataComplete.value = true
    }
  })
})
</script>

<style scoped>
.v-expansion-panel-title--active {
  background-color: rgb(243, 243, 243) !important;
}
</style>
