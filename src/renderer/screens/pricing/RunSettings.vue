<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false" elevation="3" class="rounded-lg">
          <template #header> <span class="headline">Pricing Run Settings</span> </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="runName"
                    density="compact"
                    variant="outlined"
                    placeholder="Give this run a name"
                    label="Pricing Run Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="selectedProduct"
                    variant="outlined"
                    density="compact"
                    label="Choose a product for this run"
                    :items="productsList"
                    item-title="product_name"
                    item-value="id"
                    :error="error"
                    :error-messages="errorMessages"
                    return-object
                    @update:modelValue="setProductType"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="selectedProduct"> </v-row>
              <v-row>
                <v-col>
                  <base-card v-if="selectedProduct !== null">
                    <template #header>
                      <span class="headline">
                        Create Scenarios for {{ selectedProduct.product_name }}
                      </span>
                    </template>
                    <template #default>
                      <v-form>
                        <v-container>
                          <v-row>
                            <v-col cols="5">
                              <v-text-field
                                v-model="clonedDescription"
                                :hint="infoText"
                                variant="outlined"
                                density="compact"
                                dense
                                placeholder="Enter a description for this scenario"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col v-if="selectedProduct" cols="4">
                              <v-select
                                v-model="selectedMpVersion"
                                :error-messages="selectedMpVersionErrors"
                                variant="outlined"
                                density="compact"
                                label="Choose a modelpoint version for this run"
                                :items="mpVersions"
                                item-title="version"
                                item-value="version"
                              ></v-select>
                            </v-col>
                            <v-col cols="4">
                              <v-select
                                v-model="selectedShockBasis"
                                variant="outlined"
                                density="compact"
                                label="Choose a shock basis"
                                :items="shockBases"
                              ></v-select>
                            </v-col>
                            <v-col cols="4">
                              <v-select
                                v-model="selectedParameterBasis"
                                variant="outlined"
                                density="compact"
                                label="Choose a parameter basis"
                                :items="paramsBases"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                              v-for="(value, name) in clonedPricingConfig"
                              :key="name"
                              cols="3"
                            >
                              <v-checkbox
                                v-if="value !== 'description' && value !== 'product_type'"
                                v-model="clonedPricingConfig[name]"
                                :label="name.toString()"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-btn
                                size="small"
                                variant="outlined"
                                rounded
                                class="primary"
                                @click="addToScenarios"
                                >Add Scenario</v-btn
                              >
                            </v-col>
                          </v-row>
                          <v-row v-if="pricingScenarios.length > 0">
                            <v-col>
                              <v-table>
                                <thead>
                                  <tr class="table-row">
                                    <th
                                      v-for="(k, v) in pricingScenarios[0]"
                                      :key="k"
                                      class="table-col"
                                      >{{ v }}</th
                                    >
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="item in pricingScenarios" :key="item.description">
                                    <td v-for="k in item" :key="k">{{ k }}</td>
                                    <td>
                                      <v-btn
                                        small
                                        variant="plain"
                                        color="red"
                                        @click="removeScenario(item)"
                                      >
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </td>
                                  </tr>
                                </tbody>
                              </v-table>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </template>
                  </base-card>
                </v-col>
              </v-row>
              <v-row v-if="selectedProduct !== null">
                <v-col cols="3">
                  <v-checkbox v-model="runSingle" :label="`Use a Single Model Point`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="runGoalSeek" :label="`Use Goal Seek`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="profitSignature" :label="`Profit Signature`"></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    variant="outlined"
                    size="small"
                    rounded
                    :disabled="!paramsAvailable"
                    class="primary"
                    @click="runPricing"
                    >Process run</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ feedBackMessage }}
      <v-btn size="small" rounded variant="outlined" color="red" @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import PricingService from '@/renderer/api/PricingService'
import ProductService from '@/renderer/api/ProductService'
import { funeralConfig } from '@/renderer/data/funeralconfig'
import { creditlifeConfig } from '@/renderer/data/creditlifeconfig'
// import { required } from 'vuelidate/lib/validators'
// import formatValues from '@/renderer/utils/format_values'
import { onMounted, ref } from 'vue'
// import { useAppStore } from '@/renderer/store/app'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { useRouter } from 'vue-router'

// data
// const appStore = useAppStore()
const $router = useRouter()
const infoText = ref('')
const profitSignature = ref(false)
const pricingScenarios: any = ref([])
const feedBackMessage: any = ref(null)
const runSingle = ref(false)
const runGoalSeek = ref(false)
const runName = ref('')
const selectedProduct: any = ref(null)
const pricingConfig: any = ref(null)
const clonedPricingConfig: any = ref(null)
const clonedDescription = ref(null)
const clonedProductType = ref(null)
const pricingParams = ref(null)
const modelpointCount = ref(0)
const modelpoints = ref([])
const paramsAvailable = ref(false)
const snackbar = ref(false)
const timeout = ref(5000)
const error = ref(false)
const errorMessages: any = ref([])
const runPossible = ref(true)
const mpVersions = ref([])
const selectedMpVersion = ref(null)
const selectedParameterBasis = ref(null)
const selectedShockBasis = ref(null)
const shockBases: any = ref([])
const paramsBases = ref([])
const productsList: any = ref([])
const allProducts = ref([])
const selectedMpVersionErrors = ref([])

// lifecycle hooks
onMounted(async () => {
  console.log('Mounted')
  const prodResponse = await ProductService.getProducts()
  allProducts.value = prodResponse.data
  // allProducts.value = appStore.getAllProducts

  console.log('All Products', allProducts.value)

  allProducts.value.forEach((family: any) => {
    family.products.forEach((product: any) => {
      if (product.product_state !== 'pending') {
        productsList.value.push(product)
      }
    })
  })
})

// methods
const removeScenario = (item: any) => {
  pricingScenarios.value = pricingScenarios.value.filter(
    (scenario: any) => scenario.description !== item.description
  )
}

const addToScenarios = () => {
  const allTablesPopulated = selectedProduct.value.product_pricing_tables.every(
    (item: any) => item.populated === true
  )

  if (!allTablesPopulated) {
    feedBackMessage.value =
      'One or more rating tables associated with this product is not populated. Please populate all rating tables before running pricing'
    snackbar.value = true
    resetSettings()
    return
  }

  if (clonedDescription.value === null) {
    feedBackMessage.value = 'Please enter a description for this scenario'
    snackbar.value = true
    return
  }
  console.log(clonedPricingConfig.value)
  console.log(clonedDescription.value)
  const scenario = {
    description: clonedDescription.value,
    ...clonedPricingConfig.value
  }
  scenario.parameter_basis = selectedParameterBasis.value
  scenario.mp_version = selectedMpVersion.value
  scenario.shock_basis = selectedShockBasis.value
  pricingScenarios.value.push(scenario)

  clonedDescription.value = null
  clonedPricingConfig.value = {
    ...pricingConfig.value[0]
  }
  clonedProductType.value = clonedPricingConfig.value.product_type
  delete clonedPricingConfig.value.product_type
  delete clonedPricingConfig.value.description
  delete clonedPricingConfig.value.run
  selectedMpVersion.value = null
  selectedParameterBasis.value = null
  selectedShockBasis.value = null
}

const resetSettings = () => {
  pricingScenarios.value = []
  clonedDescription.value = null
  clonedPricingConfig.value = {
    ...pricingConfig.value[0]
  }
  clonedProductType.value = clonedPricingConfig.value.product_type
  delete clonedPricingConfig.value.product_type
  delete clonedPricingConfig.value.description
  delete clonedPricingConfig.value.run
  selectedMpVersion.value = null
  selectedParameterBasis.value = null
  selectedShockBasis.value = null
}

const setProductType = async () => {
  // Will figure out how to get out this hard coding.
  pricingConfig.value = []
  mpVersions.value = []
  console.log('selected_product:', selectedProduct)
  // Funeral
  if (selectedProduct.value.product_features.funeral_cover) {
    pricingConfig.value = funeralConfig
    clonedPricingConfig.value = {
      ...funeralConfig[0]
    }
    clonedProductType.value = clonedPricingConfig.value.product_type
    delete clonedPricingConfig.value.product_type
    delete clonedPricingConfig.value.description
    delete clonedPricingConfig.value.run

    infoText.value = 'All scenarios created will contain the Main Member by default.'
  } else {
    pricingScenarios.value = []
    pricingConfig.value = creditlifeConfig
    clonedPricingConfig.value = {
      ...creditlifeConfig[0]
    }
    delete clonedPricingConfig.value.product_type
    delete clonedPricingConfig.value.description
    delete clonedPricingConfig.value.run
    infoText.value = ''
  }

  console.log('selected_product:', selectedProduct)

  let res = await PricingService.getPricingParams(selectedProduct.value.product_code)
  if (res.data.error === null && res.data.data.length > 0) {
    paramsAvailable.value = true
    pricingParams.value = res.data.data[0]
    error.value = false
    errorMessages.value = []
    runPossible.value = true
  } else {
    paramsAvailable.value = false

    error.value = true
    errorMessages.value.push('no matching pricing parameters found. Please update pricing tables')
    runPossible.value = false
  }

  res = await PricingService.getModelPointCount(selectedProduct.value.product_code)

  if (res.status === 200) {
    modelpointCount.value = res.data.count
    modelpoints.value = res.data.model_points
    mpVersions.value = res.data.versions
    if (mpVersions.value.length > 0) {
      runPossible.value = true
    } else {
      runPossible.value = false
      error.value = true
      errorMessages.value.push('no matching model points found. Please update pricing tables')
    }
  } else {
    modelpointCount.value = 0
    modelpoints.value = []
    error.value = true
    errorMessages.value.push('no matching model points found. Please update pricing tables')
    runPossible.value = false
  }

  // need pricing product parameter bases and shock bases

  PricingService.getProductPricingParams(selectedProduct.value.product_code).then((res) => {
    console.log('product pricing params:', res.data)
    if (res.data.error === null) {
      paramsBases.value = res.data.bases
      // add an N/A option at the beginning of the array
      shockBases.value = res.data.shock_bases
      shockBases.value = shockBases.value.filter((item) => item !== '')
      // add an N/A option at the beginning of the array
      shockBases.value.unshift('N/A')
    }
  })
}

// const checkRun = () => {
//   scenarioSelected.value = false

//   if (pricingConfig.value.length > 0) {
//     pricingConfig.value.forEach((item: any) => {
//       if (item.run === true) {
//         scenarioSelected.value = true
//       }
//     })
//   }
//   // pricingConfig.value[index].run = !pricingConfig.value[index].run;
// }

const runPricing = () => {
  try {
    const allTablesPopulated = selectedProduct.value.product_pricing_tables.every(
      (item: any) => item.populated === true
    )

    if (!allTablesPopulated) {
      feedBackMessage.value =
        'One or more rating tables associated with this product is not populated. /n Please populate all rating tables before running pricing'
      snackbar.value = true
      return
    }

    if (pricingScenarios.value.length <= 0) {
      feedBackMessage.value = 'Please select at least one scenario to run'
      snackbar.value = true
      return
    }

    // Ensure all related pricing tables for this product are available

    const payload: any = {}

    runName.value = runName.value.trim()
    if (runName.value === '') {
      feedBackMessage.value = 'Please enter a name for this run'
      snackbar.value = true
      return
    }

    console.log('pricing scenarios:', pricingScenarios.value)
    payload.pricing_config = pricingScenarios.value
    payload.product_id = selectedProduct.value.id
    payload.run_single = runSingle.value
    payload.run_goal_seek = runGoalSeek.value
    payload.profit_signature = profitSignature.value
    payload.name = runName.value
    PricingService.runPricing(payload).then((res) => {
      pricingConfig.value.forEach((item: any) => {
        if (item.run === true) {
          item.run = false
        }
      })
      feedBackMessage.value = 'Pricing run has been successfully initiated'
      snackbar.value = true
      setTimeout(() => {
        $router.push({ name: 'pricing-run-settings' })
      }, 3000)
    })
  } catch (error) {
    console.log('Error:', error)
    feedBackMessage.value = 'An error occurred while running pricing'
    snackbar.value = true
  }
}

// const runNameDuplicate = async (value) => {
//   if (value) {
//     const result = await PricingService.checkRunName(value)
//     return result.data
//   }
//   return true
// }
</script>
<style>
.v-input__slot {
  align-items: center;
  justify-content: center;
}

.active-list {
  color: white !important;
  background-color: #96abbc !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.associated-list {
  border: 1px solid grey;
  border-radius: 3px;
}

#app
  > div.v-application--wrap
  > main
  > div
  > div
  > div.row
  > div
  > div
  > div.v-card__text
  > div
  > div:nth-child(5)
  > div
  > div
  > div
  > div
  > div
  > table
  > thead
  > tr {
  background-color: #283e52;
}

.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}

/* selector-column class should make the background light blue */
.selector-column {
  background-color: #b0d3e7 !important;
}
</style>
