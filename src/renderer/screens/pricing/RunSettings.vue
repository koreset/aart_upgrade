<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="3" class="rounded-lg">
          <v-card-title class="mb-4 header-title accent white--text"
            >Pricing Run Settings</v-card-title
          >
          <v-card-text>
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
                  <v-card v-if="selectedProduct !== null">
                    <v-card-title class="header-title accent white--text">
                      Create Scenarios for {{ selectedProduct.product_name }}
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-container>
                          <v-row>
                            <v-col cols="5">
                              <v-text-field
                                v-model="clonedDescription"
                                :hint="infoText"
                                persistent-hint
                                outlined
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
                                :label="name"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-btn rounded class="primary" @click="addToScenarios"
                                >Add Scenario</v-btn
                              >
                            </v-col>
                          </v-row>
                          <v-row v-if="pricingScenarios.length > 0">
                            <v-col>
                              <v-table>
                                <thead>
                                  <tr>
                                    <th v-for="(k, v) in pricingScenarios[0]" :key="k">{{ v }}</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="item in pricingScenarios" :key="item.description">
                                    <td v-for="k in item" :key="k">{{ k }}</td>
                                    <td>
                                      <v-btn small text color="red" @click="removeScenario(item)">
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
                    </v-card-text>
                  </v-card>
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
                  <v-btn rounded :disabled="!paramsAvailable" class="primary" @click="runPricing"
                    >Process run</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ feedBackMessage }}
      <v-btn rounded color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-row>
      <v-col>
        <file-info
          :tableDialog="tableDialog"
          :tableName="selectedTableName"
          :selectedRowData="rowData"
          :selectedColumnDefs="columnDefs"
          :loadingComplete="loadingComplete"
          @resetTableDialog="dismissTableDialog"
        />
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title
        >
        <v-card-text v-if="selectedProduct !== null && deleteType == 'model_points'">
          Are you sure you want to delete pricing model points for
          {{ selectedProduct.product_name }}?
        </v-card-text>
        <v-card-text v-if="selectedProduct !== null && deleteType == 'pricing_params'">
          Are you sure you want to delete pricing parameters for
          {{ selectedProduct.product_name }}?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" text @click="deletePricingModelpoints()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { useAppStore } from '@/renderer/store/app'

// data
const appStore = useAppStore()
const infoText = ref('')
const profitSignature = ref(false)
const pricingScenarios: any = ref([])
// const file: any = ref(null)
const deleteType = ref(null)
const dialog = ref(false)
// const modelpointFile: any = ref(null)
// const loading = ref(false)
// const uploadSuccess = ref(false)
const feedBackMessage: any = ref(null)
// const runType = ref(1)
const runSingle = ref(false)
const runGoalSeek = ref(false)
// const runDescription = ref('Pricing')
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
// const scenarioSelected = ref(false)
const snackbar = ref(false)
// const text = ref('')
// const paramsText = ref('')
const timeout = ref(5000)
// const uploadDisabled = ref(false)
const error = ref(false)
const errorMessages: any = ref([])
// const errorParams: any = ref(false)
// const errorParamsMessages: any = ref([])
const runPossible = ref(true)
// const showFileUpload = ref(false)
// const showDownloadTemplate = ref(true)
const tableDialog = ref(false)
const selectedTableName: any = ref(null)
// const tableData = ref([])
const columnDefs: any = ref([])
const rowData: any = ref([])
const loadingComplete = ref(false)
const mpVersions = ref([])
const selectedMpVersion = ref(null)
const selectedParameterBasis = ref(null)
const selectedShockBasis = ref(null)
const shockBases: any = ref([])
const paramsBases = ref([])
const productsList: any = ref([])
const allProducts = ref([])
// const items = ref([])
// const uploadFileDialog = ref(false)
// const selectedYear = ref(null)
const selectedMpVersionErrors = ref([])

// lifecycle hooks
onMounted(async () => {
  console.log('Mounted')
  // const prodResponse = await ProductService.getProducts()
  // allProducts.value = prodResponse.data
  allProducts.value = appStore.getAllProducts

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

const dismissTableDialog = (value: any) => {
  tableDialog.value = value
}

// const confirmDelete = (deleteType: any) => {
//   dialog.value = true
//   deleteType.value = deleteType
// }

// const createColumnDefs = (data: any) => {
//   columnDefs.value = []
//   Object.keys(data[0]).forEach((element) => {
//     const header: any = {}
//     header.headerName = element
//     header.field = element
//     header.valueFormatter = formatValues
//     header.minWidth = 220
//     header.filter = true
//     header.resizable = true
//     header.sortable = true
//     columnDefs.value.push(header)
//   })
// }

// const getPricingParams = () => {
//   loadingComplete.value = false
//   PricingService.getPricingParams(selectedProduct.value.product_code)
//     .then((res) => {
//       const params = res.data.data[0]
//       if (params !== null) {
//         items.value = []
//         columnDefs.value = []
//         rowData.value = []
//         createColumnDefs([params])
//         const transformed = {}
//         const keys = Object.keys(params)
//         keys.forEach((i) => {
//           if (isNaN(params[i])) {
//             transformed[i] = params[i]
//           } else {
//             const value = Number(params[i])
//             transformed[i] = value
//           }
//         })
//         rowData.value.push(transformed)
//       }

//       selectedTableName.value = 'Pricing Parameters'
//       tableDialog.value = true
//       loadingComplete.value = true
//     })
//     .catch(() => {
//       feedBackMessage.value = 'No data was found for this product'
//       snackbar.value = true
//     })
// }

const deletePricingModelpoints = () => {
  console.log('deleting model points')
  console.log(selectedProduct.value.product_code)
  if (deleteType.value === 'model_points') {
    ProductService.deleteProductPricingModelPoints(selectedProduct.value.id)
      .then(() => {
        modelpoints.value = []
        modelpointCount.value = 0
        feedBackMessage.value = 'Model points deleted successfully'
        snackbar.value = true
      })
      .catch(() => {
        feedBackMessage.value = 'Error deleting model points'
        snackbar.value = true
      })
  }

  if (deleteType.value === 'pricing_params') {
    ProductService.deleteProductPricingParameters(selectedProduct.value.id)
      .then(() => {
        pricingParams.value = null
        feedBackMessage.value = 'Pricing parameters deleted successfully'
        snackbar.value = true
      })
      .catch(() => {
        feedBackMessage.value = 'Error deleting pricing parameters'
        snackbar.value = true
      })
  }
  dialog.value = false
}

// const getModelPoints = () => {
//   console.log('getting model points')
//   console.log(modelpoints.value)
//   loadingComplete.value = false
//   if (modelpoints.value !== null) {
//     items.value = []
//     columnDefs.value = []
//     rowData.value = []
//     createColumnDefs(modelpoints.value)
//     modelpoints.value.forEach((item: any) => {
//       const transformed = {}
//       const keys = Object.keys(item)
//       keys.forEach((i) => {
//         if (isNaN(item[i])) {
//           transformed[i] = item[i]
//         } else {
//           const value = Number(item[i])
//           transformed[i] = value
//         }
//       })
//       rowData.value.push(transformed)
//     })
//     loadingComplete.value = true
//   }

//   selectedTableName.value = 'Model Points'
//   tableDialog.value = true
// }

// const uploadModelPoints = () => {
//   uploadDisabled.value = true
//   loading.value = true
//   const formdata = new FormData()
//   formdata.append('file', modelpointFile.value)
//   ProductService.postProductPricingModelPoints(formdata, selectedProduct.value.id)
//     .then(() => {
//       showFileUpload.value = false
//       uploadFileDialog.value = false
//       error.value = false
//       errorMessages.value = []
//       modelpointFile.value = null
//       selectedYear.value = null
//       uploadDisabled.value = false
//       loading.value = false

//       PricingService.getModelPointCount(selectedProduct.value.product_code).then((res) => {
//         modelpointCount.value = res.data.count
//         modelpoints.value = res.data.model_points
//       })
//     })
//     .catch((err) => {
//       // //If its an unknown column message, strip puth
//       errorMessages.value.push(err.data.error)
//       error.value = true
//       uploadDisabled.value = false
//       loading.value = false
//       showDownloadTemplate.value = true
//     })
// }

// const cancelUpload = () => {
//   showFileUpload.value = false
//   uploadFileDialog.value = false
//   uploadDisabled.value = false
//   modelpointFile.value = null
//   loading.value = false
//   error.value = false
//   errorMessages.value = []
// }

// const showDetail = () => {
//   error.value = false
//   errorMessages.value = []
// }

// const uploadFile = () => {
//   loading.value = true
//   const formdata = new FormData()
//   formdata.append('file', file.value)
//   formdata.append('product_code', selectedProduct.value.product_code)
//   PricingService.uploadPricingParameters({ formdata })
//     .then(() => {
//       uploadSuccess.value = true
//       paramsAvailable.value = true
//       loading.value = false
//       errorParams.value = false
//       errorParamsMessages.value = []
//     })
//     .catch((err) => {
//       errorParams.value = true
//       errorParamsMessages.value.push(err.data.error)
//       uploadSuccess.value = false
//       paramsAvailable.value = false
//       loading.value = false
//     })
// }

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
  })
}

// const runNameDuplicate = async (value) => {
//   if (value) {
//     const result = await PricingService.checkRunName(value)
//     return result.data
//   }
//   return true
// }

// export default {
//   data: () => ({
//     infoText: '',
//     profitSignature: false,
//     pricingScenarios: [],
//     file: null,
//     deleteType: null,
//     dialog: false,
//     modelpointFile: null,
//     loading: false,
//     uploadSuccess: false,
//     feedBackMessage: null,
//     runType: 1,
//     runSingle: false,
//     runGoalSeek: false,
//     runDescription: 'Pricing',
//     runName: '',
//     selectedProduct: null,
//     pricingConfig: null,
//     clonedPricingConfig: null,
//     clonedDescription: null,
//     clonedProductType: null,
//     pricingParams: null,
//     modelpointCount: 0,
//     modelpoints: [],
//     paramsAvailable: false,
//     scenarioSelected: false,
//     snackbar: false,
//     text: '',
//     paramsText: '',
//     timeout: 5000,
//     uploadDisabled: false,
//     error: false,
//     errorMessages: [],
//     errorParams: false,
//     errorParamsMessages: [],
//     runPossible: true,
//     showFileUpload: false,
//     showDownloadTemplate: true,
//     tableDialog: false,
//     selectedTableName: null,
//     tableData: [],
//     columnDefs: [],
//     rowData: [],
//     loadingComplete: false,
//     mpVersions: [],
//     selectedMpVersion: null,
//     selectedParameterBasis: null,
//     selectedShockBasis: null,
//     shockBases: [],
//     paramsBases: []
//   }),

//   computed: {
//     networkAvailable: function () {
//       return this.$store.state.backendAvailable
//     },
//     selectedMpVersionErrors() {
//       const errors = []
//       if (!this.$v.selectedMpVersion.$dirty) return errors
//       !this.$v.selectedMpVersion.required && errors.push('Modelpoint Version is required.')
//       return errors
//     },
//     runNameErrors() {
//       const errors = []
//       if (!this.$v.runName.$dirty) return errors
//       !this.$v.runName.required && errors.push('Run Name is required.')
//       !this.$v.runName.runNameDuplicate && errors.push('The Run Name already exists')
//       return errors
//     },

//     productsList: function () {
//       const productList = []
//       this.$store.state.productFamilies.forEach((family) => {
//         family.products.forEach((product) => {
//           if (product.product_state !== 'pending') {
//             productList.push(product)
//           }
//         })
//       })
//       return productList
//     }
//   },

//   methods: {
//     removeScenario(item) {
//       this.pricingScenarios = this.pricingScenarios.filter(
//         (scenario) => scenario.description !== item.description
//       )
//     },
//     addToScenarios() {
//       if (this.clonedDescription === null) {
//         this.feedBackMessage = 'Please enter a description for this scenario'
//         this.snackbar = true
//         return
//       }
//       console.log(this.clonedPricingConfig)
//       console.log(this.clonedDescription)
//       const scenario = {
//         description: this.clonedDescription,
//         ...this.clonedPricingConfig
//       }
//       scenario.parameter_basis = this.selectedParameterBasis
//       scenario.mp_version = this.selectedMpVersion
//       scenario.shock_basis = this.selectedShockBasis
//       this.pricingScenarios.push(scenario)

//       this.clonedDescription = null
//       this.clonedPricingConfig = {
//         ...this.pricingConfig[0]
//       }
//       this.clonedProductType = this.clonedPricingConfig.product_type
//       delete this.clonedPricingConfig.product_type
//       delete this.clonedPricingConfig.description
//       delete this.clonedPricingConfig.run
//       this.selectedMpVersion = null
//       this.selectedParameterBasis = null
//       this.selectedShockBasis = null
//     },
//     dismissTableDialog(value) {
//       this.tableDialog = value
//     },
//     confirmDelete(deleteType) {
//       this.deleteType = deleteType
//       this.dialog = true
//     },
//     createColumnDefs(data) {
//       this.columnDefs = []
//       Object.keys(data[0]).forEach((element) => {
//         const header = {}
//         header.headerName = element
//         header.field = element
//         header.valueFormatter = formatValues
//         header.minWidth = 220
//         header.filter = true
//         header.resizable = true
//         header.sortable = true
//         this.columnDefs.push(header)
//       })
//     },

//     getPricingParams() {
//       this.loadingComplete = false
//       PricingService.getPricingParams(this.selectedProduct.product_code)
//         .then((res) => {
//           const params = res.data.data[0]
//           if (params !== null) {
//             this.items = []
//             this.columnDefs = []
//             this.rowData = []
//             this.createColumnDefs([params])
//             const transformed = {}
//             const keys = Object.keys(params)
//             keys.forEach((i) => {
//               if (isNaN(params[i])) {
//                 transformed[i] = params[i]
//               } else {
//                 const value = Number(params[i])
//                 transformed[i] = value
//               }
//             })
//             this.rowData.push(transformed)
//           }

//           this.selectedTableName = 'Pricing Parameters'
//           this.tableDialog = true
//           this.loadingComplete = true
//         })
//         .catch(() => {
//           this.feedBackMessage = 'No data was found for this product'
//           this.snackbar = true
//         })
//     },
//     deletePricingModelpoints() {
//       console.log('deleting model points')
//       console.log(this.selectedProduct.product_code)
//       if (this.deleteType == 'model_points') {
//         ProductService.deleteProductPricingModelPoints(this.selectedProduct.id)
//           .then(() => {
//             this.modelpoints = []
//             this.modelpointCount = 0
//             this.feedBackMessage = 'Model points deleted successfully'
//             this.snackbar = true
//           })
//           .catch(() => {
//             this.feedBackMessage = 'Error deleting model points'
//             this.snackbar = true
//           })
//       }

//       if (this.deleteType == 'pricing_params') {
//         ProductService.deleteProductPricingParameters(this.selectedProduct.id)
//           .then(() => {
//             this.pricingParams = null
//             this.feedBackMessage = 'Pricing parameters deleted successfully'
//             this.snackbar = true
//           })
//           .catch(() => {
//             this.feedBackMessage = 'Error deleting pricing parameters'
//             this.snackbar = true
//           })
//       }
//       this.dialog = false
//     },

//     getModelPoints() {
//       console.log('getting model points')
//       console.log(this.modelpoints)
//       this.loadingComplete = false
//       if (this.modelpoints !== null) {
//         this.items = []
//         this.columnDefs = []
//         this.rowData = []
//         this.createColumnDefs(this.modelpoints)
//         this.modelpoints.forEach((item) => {
//           const transformed = {}
//           const keys = Object.keys(item)
//           keys.forEach((i) => {
//             if (isNaN(item[i])) {
//               transformed[i] = item[i]
//             } else {
//               const value = Number(item[i])
//               transformed[i] = value
//             }
//           })
//           this.rowData.push(transformed)
//         })
//         this.loadingComplete = true
//       }

//       this.selectedTableName = 'Model Points'
//       this.tableDialog = true
//     },
//     uploadModelPoints() {
//       this.uploadDisabled = true
//       this.loading = true
//       const formdata = new FormData()
//       formdata.append('file', this.modelpointFile)
//       ProductService.postProductPricingModelPoints(formdata, this.selectedProduct.id)
//         .then(() => {
//           this.showFileUpload = false
//           this.uploadFileDialog = false
//           this.error = false
//           this.errorMessages = []
//           this.modelpointFile = null
//           this.selectedYear = null
//           this.uploadDisabled = false
//           this.loading = false

//           PricingService.getModelPointCount(this.selectedProduct.product_code).then((res) => {
//             this.modelpointCount = res.data.count
//             this.modelpoints = res.data.model_points
//           })
//         })
//         .catch((err) => {
//           // //If its an unknown column message, strip puth
//           this.errorMessages.push(err.data.error)
//           this.error = true
//           this.uploadDisabled = false
//           this.loading = false
//           this.showDownloadTemplate = true
//         })
//     },
//     cancelUpload() {
//       this.showFileUpload = false
//       this.uploadFileDialog = false
//       this.uploadDisabled = false
//       this.modelpointFile = null
//       this.loading = false
//       this.error = false
//       this.errorMessages = []
//     },
//     showDetail() {
//       this.error = false
//       this.errorMessages = []
//     },
//     uploadFile() {
//       this.loading = true
//       const formdata = new FormData()
//       formdata.append('file', this.file)
//       formdata.append('product_code', this.selectedProduct.product_code)
//       PricingService.uploadPricingParameters({ formdata })
//         .then(() => {
//           this.uploadSuccess = true
//           this.paramsAvailable = true
//           this.loading = false
//           this.errorParams = false
//           this.errorParamsMessages = []
//         })
//         .catch((err) => {
//           this.errorParams = true
//           this.errorParamsMessages.push(err.data.error)
//           this.uploadSuccess = false
//           this.paramsAvailable = false
//           this.loading = false
//         })
//     },
//     async setProductType() {
//       // Will figure out how to get out this hard coding.
//       this.pricingConfig = []
//       this.mpVersions = []
//       console.log('selected_product:', this.selectedProduct)
//       // Funeral
//       if (this.selectedProduct.product_features.funeral_cover) {
//         this.pricingConfig = funeralConfig
//         this.clonedPricingConfig = {
//           ...funeralConfig[0]
//         }
//         this.clonedProductType = this.clonedPricingConfig.product_type
//         delete this.clonedPricingConfig.product_type
//         delete this.clonedPricingConfig.description
//         delete this.clonedPricingConfig.run

//         this.infoText = 'All scenarios created will contain the Main Member by default.'
//       } else {
//         this.pricingScenarios = []
//         this.pricingConfig = creditlifeConfig
//         this.clonedPricingConfig = {
//           ...creditlifeConfig[0]
//         }
//         delete this.clonedPricingConfig.product_type
//         delete this.clonedPricingConfig.description
//         delete this.clonedPricingConfig.run
//         this.infoText = ''
//       }

//       console.log('selected_product:', this.selectedProduct)

//       let res = await PricingService.getPricingParams(this.selectedProduct.product_code)
//       if (res.data.error === null && res.data.data.length > 0) {
//         this.paramsAvailable = true
//         this.pricingParams = res.data.data[0]
//         this.error = false
//         this.errorMessages = []
//         this.runPossible = true
//       } else {
//         this.paramsAvailable = false

//         this.error = true
//         this.errorMessages.push(
//           'no matching pricing parameters found. Please update pricing tables'
//         )
//         this.runPossible = false
//       }

//       res = await PricingService.getModelPointCount(this.selectedProduct.product_code)

//       if (res.status === 200) {
//         this.modelpointCount = res.data.count
//         this.modelpoints = res.data.model_points
//         this.mpVersions = res.data.versions
//         if (this.mpVersions.length > 0) {
//           this.runPossible = true
//         } else {
//           this.runPossible = false
//           this.error = true
//           this.errorMessages.push('no matching model points found. Please update pricing tables')
//         }
//       } else {
//         this.modelpointCount = 0
//         this.modelpoints = []
//         this.error = true
//         this.errorMessages.push('no matching model points found. Please update pricing tables')
//         this.runPossible = false
//       }

//       // need pricing product parameter bases and shock bases

//       PricingService.getProductPricingParams(this.selectedProduct.product_code).then((res) => {
//         console.log('product pricing params:', res.data)
//         if (res.data.error === null) {
//           this.paramsBases = res.data.bases
//           // add an N/A option at the beginning of the array
//           this.shockBases = res.data.shock_bases
//           this.shockBases = this.shockBases.filter((item) => item !== '')
//           // add an N/A option at the beginning of the array
//           this.shockBases.unshift('N/A')
//         }
//       })
//     },

//     checkRun() {
//       this.scenarioSelected = false

//       if (this.pricingConfig.length > 0) {
//         this.pricingConfig.forEach((item) => {
//           if (item.run === true) {
//             this.scenarioSelected = true
//           }
//         })
//       }
//       // this.pricingConfig[index].run = !this.pricingConfig[index].run;
//     },
//     async runPricing() {
//       const allTablesPopulated = this.selectedProduct.product_pricing_tables.every(
//         (item) => item.populated === true
//       )

//       if (!allTablesPopulated) {
//         this.feedBackMessage =
//           'One or more rating tables associated with this product is not populated. /n Please populate all rating tables before running pricing'
//         this.snackbar = true
//         return
//       }

//       if (!this.pricingScenarios.length > 0) {
//         this.feedBackMessage = 'Please select at least one scenario to run'
//         this.snackbar = true
//         return
//       }

//       // Ensure all related pricing tables for this product are available

//       const payload = {}

//       this.$v.runName.$touch()

//       if (!this.$v.runName.$invalid) {
//         console.log('pricing scenarios:', this.pricingScenarios)
//         payload.pricing_config = this.pricingScenarios
//         payload.product_id = this.selectedProduct.id
//         payload.run_single = this.runSingle
//         payload.run_goal_seek = this.runGoalSeek
//         payload.profit_signature = this.profitSignature
//         payload.name = this.runName
//         PricingService.runPricing(payload).then((res) => {
//           this.pricingConfig.forEach((item) => {
//             if (item.run === true) {
//               item.run = false
//             }
//           })
//           this.feedBackMessage = res.data.message
//           this.snackbar = true
//           setTimeout(() => {
//             this.$router.push({ path: '/pricing-jobs' })
//           }, 3000)
//         })
//       }
//       // Filter out the unselected scenarios from pricingConfug...
//     }
//   },
//   validations: {
//     selectedMpVersion: {
//       required
//     },
//     runName: {
//       required,
//       runNameDuplicate: async function (value) {
//         if (value) {
//           let result
//           result = await PricingService.checkRunName(value)
//           return result.data
//         }
//         return true
//       }
//     }
//   }
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
