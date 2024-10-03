<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Pricing Tables</span>
          </template>
          <template #default>
            <v-container fluid>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="selectedProduct"
                    density="compact"
                    variant="outlined"
                    label="Select a Product"
                    :items="productsList"
                    item-title="product_name"
                    item-value="id"
                    return-object
                    @update:modelValue="getModelPointsCount"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="selectedProduct !== null">
                <v-col>
                  <base-card v-if="selectedProduct" :show-actions="false">
                    <template #header
                      ><span class="headline">
                        Pricing Tables for {{ selectedProduct.product_name }}</span
                      ></template
                    >
                    <template #default>
                      <associated-pricing-table-display :product="selectedProduct" />
                    </template>
                  </base-card>
                  <v-card class="mt-6">
                    <v-card-title class="header-title accent white--text"
                      >Model Points</v-card-title
                    >
                    <v-card-text>
                      <v-row class="mt-3 mb-3">
                        <v-col>
                          <v-btn
                            outlined
                            depressed
                            rounded
                            small
                            @click.stop="modelPointsDialog = true"
                          >
                            <v-icon color="accent">mdi-file-upload</v-icon>
                            <span>Upload</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row
                        v-for="mp in modelPointSets"
                        :key="mp.version"
                        class="borderline blue-grey lighten-5 mx-2 mt-3 mb-1 accent-4--text"
                      >
                        <v-col cols="4">
                          <p>Model Point version: {{ mp.version }}</p>
                        </v-col>
                        <v-col cols="5">
                          <p>Model point count: {{ mp.count }}</p>
                        </v-col>
                        <v-col class="mr-1" cols="1">
                          <v-btn
                            depressed
                            rounded
                            small
                            @click.stop="getModelPoints(mp.model_points)"
                          >
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>INFO</span>
                          </v-btn>
                        </v-col>
                        <v-col class="mr-1 ml-3" cols="1">
                          <v-btn depressed rounded small @click.stop="deleteModelPoints(mp)">
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>DELETE</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <!-- <v-card class="mt-6">
                    <v-card-title class="header-title accent white--text"
                      >Global Tables</v-card-title
                    >
                    <v-card-text>
                      <v-row class="borderline blue-grey lighten-5 mx-2 mt-3 mb-1 accent-4--text">
                        <v-col cols="8">
                          <p>Pricing Parameters</p>
                        </v-col>
                        <v-col class="mr-1" cols="1">
                          <v-btn depressed rounded small @click.stop="getPricingParams()">
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>INFO</span>
                          </v-btn>
                        </v-col>
                        <v-col class="mr-4" cols="1">
                          <v-btn depressed rounded small @click.stop="uploadPricingParamsForm()">
                            <v-icon color="accent">mdi-file-upload</v-icon>
                            <span>Upload</span>
                          </v-btn>
                        </v-col>
                        <v-col class="mr-1 ml-3" cols="1">
                          <v-btn depressed rounded small @click.stop="deletePricingParameters()">
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>DELETE</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row class="borderline blue-grey lighten-5 mx-2 mt-3 mb-1 accent-4--text">
                        <v-col cols="8">
                          <p>Pricing Policy Demographics</p>
                        </v-col>
                        <v-col class="mr-1" cols="1">
                          <v-btn
                            depressed
                            rounded
                            small
                            @click.stop="getPricingPolicyDemographics()"
                          >
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>INFO</span>
                          </v-btn>
                        </v-col>
                        <v-col class="mr-4" cols="1">
                          <v-btn
                            depressed
                            rounded
                            small
                            @click.stop="uploadPricingDemographicsForm()"
                          >
                            <v-icon color="accent">mdi-file-upload</v-icon>
                            <span>Upload</span>
                          </v-btn>
                        </v-col>
                        <v-col class="mr-1 ml-3" cols="1">
                          <v-btn
                            depressed
                            rounded
                            small
                            @click.stop="deletePricingPolicyDemographics()"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>DELETE</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card> -->
                </v-col>
              </v-row>
              <!-- <v-row>
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
              </v-row> -->
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ text }}
      <v-btn rounded color="red" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="modelPointsDialog" width="600">
      <v-card class="rounded-lg mt-2">
        <v-card-title class="header-title accent white--text"> Upload Model points </v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-file-input
                    v-model="modelpointFile"
                    outlined
                    dense
                    show-size
                    accept=".csv"
                    :error="error"
                    :error-messages="errorMessages"
                    prepend-icon="mdi-paperclip"
                    placeholder="Click to select a model point file for upload"
                  >
                    <template #selection="{ text }">
                      <v-chip small label color="primary">{{ text }}</v-chip>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-btn rounded color="primary" small @click="uploadModelPoints">Upload</v-btn>
                  <v-btn
                    class="ml-4"
                    rounded
                    color="primary"
                    small
                    @click="dismissModelPointsDialog"
                    >Cancel</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- <table-uploader
      ref="tableUploader"
      :filePlaceHolder="filePlaceHolder"
      :formTitle="formTitle"
      :dialog="showDialog"
      @form-submitted="handleFormSubmitted"
      @close-dialog="closeDialog"
    /> -->
    <confirmation-dialog ref="confirmDelete" />
  </v-container>
</template>

<script setup lang="ts">
import PricingService from '@/renderer/api/PricingService'
import formatValues from '@/renderer/utils/format_values'
import ProductService from '@/renderer/api/ProductService'
import { ref, onMounted } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'
import AssociatedPricingTableDisplay from '@/renderer/components/AssociatedPricingTableDisplay.vue'

const confirmDelete = ref()
// const showDialog = ref(false)
// const pricingParamsFile: any = ref(null)
// const pricingDemographicsFile: any = ref(null)
const modelPointCount: any = ref(0)
const modelPointsDialog = ref(false)
const modelPoints: any = ref([])
const modelPointSets: any = ref([])
// const availableProducts: any = ref([])
// const pricingTables: any = ref([])
// const selectedProduct: any = ref(null)
const selectedYear = ref(null)
// const file: any = ref(null)
// const formTitle = ref('')
// const filePlaceHolder = ref('')
// const tableType = ref('')
// const selectedType = ref(null)
// const uploadSuccess = ref(false)
const loading = ref(false)
// const availableTypes = ref([{ name: 'Pricing Parameters' }])
const timeout = 3000
// const shocksData: any = ref([])
// const yieldCurveData: any = ref([])
// const marginsData: any = ref([])
// const parametersData: any = ref([])
// const globalTableData: any = ref([])
// const selectedTable = ref('')
// const globalTables = ref([{ name: 'Pricing Parameters' }])
const snackbar = ref(false)
const text = ref('')
const tableDialog = ref(false)
// const tableData: any = ref([])
const columnDefs: any = ref([])
const rowData: any = ref([])
// const dialog = ref(false)
const selectedTableName = ref('')
const loadingComplete = ref(false)
const modelpointFile: any = ref(null)
const error = ref(false)
const errorMessages: any = ref([])
// const errorParams = ref(false)
// const errorParamsMessages: any = ref([])
// const errorDemographicsParams = ref(false)
// const errorDemographicsMessages: any = ref([])
const productsList: any = ref([])
const uploadDisabled = ref(false)
const showFileUpload = ref(false)
const showDownloadTemplate: any = ref(false)
// const paramsAvailable = ref(false)
const allProducts: any = ref([])
const selectedProduct: any = ref(null)
const items: any = []

const getModelPointsCount = () => {
  PricingService.getModelPointCount(selectedProduct.value.product_code).then((res) => {
    console.log(res.data)
    modelPointCount.value = res.data.count
    modelPoints.value = res.data.model_points
    modelPointSets.value = res.data.model_point_sets
  })
}

const getModelPoints = (modelPoints) => {
  console.log('getting model points')
  console.log(modelPoints)
  loadingComplete.value = false
  if (modelPoints !== null && modelPoints.length > 0) {
    items.value = []
    columnDefs.value = []
    rowData.value = []
    createColumnDefs(modelPoints)
    modelPoints.forEach((item) => {
      const transformed = {}
      const keys = Object.keys(item)
      keys.forEach((i) => {
        if (isNaN(item[i])) {
          transformed[i] = item[i]
        } else {
          const value = Number(item[i])
          transformed[i] = value
        }
      })
      rowData.value.push(transformed)
    })
    loadingComplete.value = true
    selectedTableName.value = 'Model Points'
    tableDialog.value = true
  } else {
    text.value = 'No data was found for this product'
    snackbar.value = true
  }
}

const dismissModelPointsDialog = () => {
  modelPointsDialog.value = false
  errorMessages.value = []
  error.value = false
  modelpointFile.value = null
}

onMounted(async () => {
  console.log('Mounted')
  const prodResponse = await ProductService.getProducts()
  allProducts.value = prodResponse.data

  console.log('All Products', allProducts.value)

  allProducts.value.forEach((family: any) => {
    family.products.forEach((product: any) => {
      if (product.product_state !== 'pending') {
        productsList.value.push(product)
      }
    })
  })
})

const deleteModelPoints = (mp: any) => {
  console.log(mp)
  PricingService.deleteModelPoints(selectedProduct.value.product_code, mp.version).then(
    (response) => {
      text.value = response.data
      snackbar.value = true
      modelPointCount.value = 0
      modelPoints.value = []
    }
  )
  console.log('delete model points')
}

const uploadModelPoints = () => {
  if (modelpointFile.value === null) {
    errorMessages.value.push('Please select a file to upload')
    error.value = true
    return
  }

  uploadDisabled.value = true
  loading.value = true
  const formdata = new FormData()
  formdata.append('file', modelpointFile)
  ProductService.postProductPricingModelPoints(formdata, selectedProduct.value.id)
    .then(() => {
      showFileUpload.value = false
      modelPointsDialog.value = false
      error.value = false
      errorMessages.value = []
      modelpointFile.value = null
      selectedYear.value = null
      uploadDisabled.value = false
      loading.value = false

      PricingService.getModelPointCount(selectedProduct.value.product_code).then((res) => {
        modelPointCount.value = res.data.count
        modelPoints.value = res.data.model_points
      })
    })
    .catch((err) => {
      // //If its an unknown column message, strip puth
      errorMessages.value.push(err.data.error)
      error.value = true
      uploadDisabled.value = false
      loading.value = false
      showDownloadTemplate.value = true
    })
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.minWidth = 200
    header.valueFormatter = formatValues
    columnDefs.value.push(header)
  })
}

// export default {
//   validations: {
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
//   },

//   data() {
//     return {
//       showDialog: false,
//       pricingParamsFile: null,
//       pricingDemographicsFile: null,
//       modelpointCount: 0,
//       modelPointsDialog: false,
//       modelPoints: [],
//       modelPointSets: [],
//       availableProducts: [],
//       pricingTables: [],
//       selectedProduct: null,
//       file: null,
//       formTitle: '',
//       filePlaceHolder: '',
//       tableType: '',
//       selectedType: null,
//       uploadSuccess: false,
//       loading: false,
//       availableTypes: [{ name: 'Pricing Parameters' }],
//       timeout: 3000,
//       shocksData: [],
//       yieldCurveData: [],
//       marginsData: [],
//       parametersData: [],
//       globalTableData: [],
//       selectedTable: '',
//       globalTables: [{ name: 'Pricing Parameters' }],
//       snackbar: false,
//       text: '',
//       tableDialog: false,
//       tableData: [],
//       columnDefs: [],
//       rowData: [],
//       dialog: false,
//       selectedTableName: '',
//       loadingComplete: false,
//       modelpointFile: null,
//       error: false,
//       errorMessages: [],
//       errorParams: false,
//       errorParamsMessages: [],
//       errorDemographicsParams: false,
//       errorDemographicsMessages: []
//     }
//   },
//   computed: {
//     networkAvailable: function () {
//       return this.$store.state.backendAvailable
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
//     openDialog() {
//       this.showDialog = true
//     },
//     closeDialog() {
//       this.showDialog = false
//     },
//     handleFormSubmitted(formData) {
//       console.log('Form Data:', formData)
//       console.log('Form Title:', this.formTitle)
//       console.log('Table Type:', this.tableType)
//       this.loading = true
//       const payload = new FormData()
//       payload.append('file', formData.file)
//       payload.append('product_code', this.selectedProduct.product_code)

//       switch (this.tableType) {
//         case 'pricing_parameters':
//           PricingService.uploadPricingParameters({ formdata: payload }).then(() => {
//             this.loading = false
//             this.$refs.tableUploader.close()
//           })
//           break
//         case 'pricing_demographics':
//           PricingService.uploadPricingDemographics({ formdata: payload }).then(() => {
//             this.loading = false
//             this.$refs.tableUploader.close()
//           })
//           break
//         default:
//           this.loading = false
//           this.$refs.tableUploader.close()
//           break
//       }
//     },
//     getModelPointsCount() {
//       PricingService.getModelPointCount(this.selectedProduct.product_code).then((res) => {
//         console.log(res.data)
//         this.modelpointCount = res.data.count
//         this.modelpoints = res.data.model_points
//         this.modelPointSets = res.data.model_point_sets
//       })
//     },
//     dismissTableDialog(value) {
//       this.tableDialog = value
//     },
//     dismissModelPointsDialog() {
//       this.modelPointsDialog = false
//       this.errorMessages = []
//       this.error = false
//       this.modelpointFile = null
//     },
//     uploadPricingDemographicsForm() {
//       this.showDialog = true
//       this.formTitle = 'Upload Pricing Demographics'
//       this.filePlaceHolder = 'Click to select a pricing demographics file for upload'
//       this.tableType = 'pricing_demographics'
//     },
//     uploadPricingParamsForm() {
//       this.showDialog = true
//       this.formTitle = 'Upload Pricing Parameters'
//       this.filePlaceHolder = 'Click to select a pricing parameters file for upload'
//       this.tableType = 'pricing_parameters'
//     },

//     async deletePricingPolicyDemographics() {
//       const res = await this.$refs.confirmDelete.open(
//         'Deleting Pricing Demographics',
//         `Are you sure you want to delete demographics for ${this.selectedProduct.product_code}?`
//       )
//       if (!res) return
//       PricingService.deletePricingDemographics(this.selectedProduct.product_code)
//         .then(() => {
//           this.text = 'deleted successfully'
//           this.snackbar = true
//         })
//         .catch((err) => {
//           this.text = err.data.error
//           this.snackbar = true
//         })

//       console.log('delete pricing demographics')
//     },

//     getModelPoints(modelPoints) {
//       console.log('getting model points')
//       console.log(this.modelpoints)
//       this.loadingComplete = false
//       if (modelPoints !== null && modelPoints.length > 0) {
//         this.items = []
//         this.columnDefs = []
//         this.rowData = []
//         this.createColumnDefs(modelPoints)
//         modelPoints.forEach((item) => {
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
//         this.selectedTableName = 'Model Points'
//         this.tableDialog = true
//       } else {
//         this.text = 'No data was found for this product'
//         this.snackbar = true
//       }
//     },

//     deleteModelPoints(mp) {
//       console.log(mp)
//       PricingService.deleteModelPoints(this.selectedProduct.product_code, mp.version).then(
//         (response) => {
//           this.text = response.data
//           this.snackbar = true
//           this.modelpointCount = 0
//           this.modelpoints = []
//         }
//       )
//       console.log('delete model points')
//     },
//     showModelPoints() {
//       console.log('show model points')
//     },

//     confirmDelete(item) {
//       this.selectedTable = item.name
//       this.dialog = true
//     },
//     uploadModelPoints() {
//       if (this.modelpointFile === null) {
//         this.errorMessages.push('Please select a file to upload')
//         this.error = true
//         return
//       }
//       this.uploadDisabled = true
//       this.loading = true
//       const formdata = new FormData()
//       formdata.append('file', this.modelpointFile)
//       ProductService.postProductPricingModelPoints(formdata, this.selectedProduct.id)
//         .then(() => {
//           this.showFileUpload = false
//           this.modelPointsDialog = false
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

//     getPricingPolicyDemographics() {
//       this.loadingComplete = false
//       PricingService.getPricingDemographics(this.selectedProduct.product_code)
//         .then((res) => {
//           console.log(res.data)
//           const demographics = res.data.data
//           if (demographics !== null && demographics.length > 0) {
//             this.items = []
//             this.columnDefs = []
//             this.rowData = []
//             this.createColumnDefs(demographics)

//             demographics.forEach((item) => {
//               const transformed = {}
//               const keys = Object.keys(item)
//               keys.forEach((i) => {
//                 if (isNaN(item[i])) {
//                   transformed[i] = item[i]
//                 } else {
//                   const value = Number(item[i])
//                   transformed[i] = value
//                 }
//               })
//               this.rowData.push(transformed)
//             })
//           }

//           this.selectedTableName = 'Pricing Policy Demographics'
//           this.tableDialog = true
//           this.loadingComplete = true
//         })
//         .catch(() => {
//           this.text = 'No data was found for this product'
//           this.snackbar = true
//         })
//     },

//     getPricingParams() {
//       this.loadingComplete = false
//       PricingService.getPricingParams(this.selectedProduct.product_code)
//         .then((res) => {
//           const params = res.data.data
//           if (params !== null) {
//             this.items = []
//             this.columnDefs = []
//             this.rowData = []
//             this.createColumnDefs(params)

//             const transformed = {}
//             params.forEach((item) => {
//               const keys = Object.keys(item)
//               keys.forEach((i) => {
//                 if (isNaN(item[i])) {
//                   transformed[i] = item[i]
//                 } else {
//                   const value = Number(item[i])
//                   transformed[i] = value
//                 }
//               })
//               this.rowData.push(transformed)
//             })
//           }

//           this.selectedTableName = 'Pricing Parameters'
//           this.tableDialog = true
//           this.loadingComplete = true
//         })
//         .catch(() => {
//           this.text = 'No data was found for this product'
//           this.snackbar = true
//         })
//     },
//     async deletePricingParameters() {
//       const res = await this.$refs.confirmDelete.open(
//         'Deleting Pricing Parameters',
//         `Are you sure you want to delete parameters for ${this.selectedProduct.product_code}?`
//       )

//       if (!res) return
//       console.log('delete pricing parameters')

//       PricingService.deletePricingParameters(this.selectedProduct.product_code)
//         .then((response) => {
//           this.text = response.data
//           this.snackbar = true
//         })
//         .catch((err) => {
//           this.text = err.data.error
//           this.snackbar = true
//         })
//     },
//     async deletePricingTableData(table) {
//       const res = await this.$refs.confirmDelete.open(
//         'Deleting Pricing Table Data',
//         `Are you sure you want to delete data from ${table}?`
//       )

//       if (!res) return

//       PricingService.deletePricingTableData(table).then((response) => {
//         this.text = response.data
//         this.snackbar = true
//         this.dialog = false
//         this.globalTableData = []
//         this.selectedTable = ''
//       })
//     },
//     createColumnDefs(data) {
//       this.columnDefs = []
//       Object.keys(data[0]).forEach((element) => {
//         const header = {}
//         header.headerName = element
//         header.field = element
//         header.minWidth = 200
//         header.valueFormatter = formatValues
//         this.columnDefs.push(header)
//       })
//     },

//     uploadFile() {
//       this.loading = true
//       const formdata = new FormData()
//       console.log(this.pricingParamsFile)
//       formdata.append('file', this.pricingParamsFile)
//       PricingService.uploadBulkPricingParameters({ formdata })
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
//     }
//   }
// }
</script>

<style>
.borderline {
  border: 1px solid #9aaaba;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
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
</style>
