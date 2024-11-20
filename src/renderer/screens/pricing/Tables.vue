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
                  <v-autocomplete
                    v-model="selectedProduct"
                    density="compact"
                    variant="outlined"
                    label="Select a Product"
                    :items="productsList"
                    item-title="product_name"
                    item-value="id"
                    return-object
                    @update:modelValue="getModelPointsCount"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row v-if="selectedProduct !== null">
                <v-col>
                  <base-card v-if="pricingProduct" :show-actions="false">
                    <template #header
                      ><span class="headline">
                        Pricing Tables for {{ pricingProduct.product.product_name }}</span
                      ></template
                    >
                    <template #default>
                      <associated-pricing-table-display :product="selectedProduct" />
                    </template>
                  </base-card>
                  <base-card class="mt-6">
                    <template #header>
                      <span class="headline">Model Points</span>
                    </template>
                    <template #default>
                      <v-row class="mt-3 mb-3">
                        <v-col>
                          <v-btn
                            variant="outlined"
                            rounded
                            size="small"
                            @click.stop="modelPointsDialog = true"
                          >
                            <v-icon color="accent">mdi-upload</v-icon>
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
                        <v-col cols="3">
                          <v-btn
                            variant="outlined"
                            rounded
                            class="mr-3"
                            size="small"
                            @click.stop="getModelPoints(mp.model_points)"
                          >
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>
                          <v-btn
                            rounded
                            variant="outlined"
                            size="small"
                            @click.stop="deleteModelPoints(mp)"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </template>
                  </base-card>
                  <base-card class="mt-6">
                    <template #header>
                      <span class="headline">Global Tables</span>
                    </template>
                    <template #default>
                      <v-row class="borderline blue-grey lighten-5 mx-2 mt-3 mb-1 accent-4--text">
                        <v-col cols="7"> <p>Pricing Parameters</p> </v-col>
                        <v-col cols="5">
                          <v-btn
                            rounded
                            class="mr-3"
                            size="small"
                            variant="outlined"
                            @click.stop="getPricingParams()"
                          >
                            <v-icon color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>
                          <file-updater
                            :upload-complete="loadDataComplete"
                            :tableType="'Pricing Parameters'"
                            :actionName="'Upload Data'"
                            @uploadFile="handleFileUpload($event, 'pricing_parameters')"
                          >
                          </file-updater>

                          <v-btn
                            class="ml-3"
                            depressed
                            rounded
                            size="small"
                            variant="outlined"
                            @click.stop="deletePricingParameters()"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row class="borderline blue-grey lighten-5 mx-2 mt-3 mb-1 accent-4--text">
                        <v-col cols="7">
                          <p>Pricing Policy Demographics</p>
                        </v-col>
                        <v-col cols="5">
                          <v-btn
                            depressed
                            class="mr-3"
                            rounded
                            size="small"
                            variant="outlined"
                            @click.stop="getPricingPolicyDemographics()"
                          >
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>
                          <file-updater
                            :upload-complete="loadDataComplete"
                            :tableType="'Pricing Policy Demographics'"
                            :actionName="'Upload Data'"
                            @uploadFile="handleFileUpload($event, 'pricing_demographics')"
                          >
                          </file-updater>
                          <v-btn
                            class="ml-3"
                            depressed
                            rounded
                            size="small"
                            variant="outlined"
                            @click.stop="deletePricingPolicyDemographics()"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </template>
                  </base-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <file-info
                    :tableTitle="selectedTableName"
                    :rowData="rowData"
                    :columnDefs="columnDefs"
                    :onUpdate:isInfoDialogOpen="closeDialog"
                    :isDialogOpen="tableDialog"
                  />
                </v-col>
              </v-row>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ text }}
      <v-btn rounded color="red" variant="plain" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="modelPointsDialog" width="600">
      <base-card :show-actions="false">
        <template #header>
          <span class="headline"> Upload Model points </span>
        </template>
        <template #default>
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-file-input
                    v-model="modelpointFile"
                    variant="outlined"
                    density="compact"
                    accept=".csv"
                    prepend-icon="mdi-paperclip"
                    label="Model Points File (csv)"
                    placeholder="Click to select a model point file for upload"
                    show-size
                  >
                  </v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-btn
                    variant="outlined"
                    rounded
                    color="primary"
                    size="small"
                    @click="uploadModelPoints"
                    >Upload</v-btn
                  >
                  <v-btn
                    class="ml-4"
                    rounded
                    variant="outlined"
                    color="primary"
                    size="small"
                    @click="dismissModelPointsDialog"
                    >Cancel</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </template>
      </base-card>
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
import FileInfo from '@/renderer/components/FileInfo.vue'
// import { useAppStore } from '@/renderer/store/app'
import FileUpdater from '@/renderer/components/FileUpdater.vue'

// const appStore = useAppStore()
const confirmDelete = ref()
const showDialog = ref(false)
const loadDataComplete = ref(false)
const modelPointCount: any = ref(0)
const modelPointsDialog = ref(false)
const modelPoints: any = ref([])
const modelPointSets: any = ref([])
const selectedYear = ref(null)
const loading = ref(false)
const timeout = 3000
const snackbar = ref(false)
const text = ref('')
const tableDialog = ref(false)
const columnDefs: any = ref([])
const rowData: any = ref([])
const selectedTableName = ref('')
const loadingComplete = ref(false)
const modelpointFile: any = ref(null)
const error = ref(false)
const errorMessages: any = ref([])
const productsList: any = ref([])
const uploadDisabled = ref(false)
const showFileUpload = ref(false)
const showDownloadTemplate: any = ref(false)
const allProducts: any = ref([])
const selectedProduct: any = ref(null)
const pricingProduct: any = ref(null)
const items: any = []

const closeDialog = (value) => {
  showDialog.value = value
  tableDialog.value = value
}

const getModelPointsCount = async () => {
  pricingProduct.value = null
  const resp = await ProductService.getProductById(selectedProduct.value.id)
  pricingProduct.value = resp.data

  PricingService.getModelPointCount(selectedProduct.value.product_code).then((res) => {
    modelPointCount.value = res.data.count
    modelPoints.value = res.data.model_points
    modelPointSets.value = res.data.model_point_sets
  })
}

const getModelPoints = (modelPoints) => {
  loadingComplete.value = true
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
  const prodResponse = await ProductService.getProducts()
  allProducts.value = prodResponse.data
  // allProducts.value = appStore.getAllProducts


  allProducts.value.forEach((family: any) => {
    family.products.forEach((product: any) => {
      if (product.product_state !== 'pending') {
        productsList.value.push(product)
      }
    })
  })
})

const handleFileUpload = (event, tableType) => {
  loadDataComplete.value = true
  const payload = new FormData()
  payload.append('file', event.file)
  payload.append('product_code', selectedProduct.value.product_code)

  switch (tableType) {
    case 'pricing_parameters':
      PricingService.uploadPricingParameters({ formdata: payload }).then(() => {
        loadDataComplete.value = false
        text.value = 'data table successfully uploaded'
        snackbar.value = true
      })
      break
    case 'pricing_demographics':
      PricingService.uploadPricingDemographics({ formdata: payload }).then(() => {
        loadDataComplete.value = false
        text.value = 'data table successfully uploaded'
        snackbar.value = true
      })
      break
    default:
      loadDataComplete.value = false
      break
  }
}

const deleteModelPoints = (mp: any) => {
  PricingService.deleteModelPoints(selectedProduct.value.product_code, mp.version).then(
    (response) => {
      text.value = response.data
      snackbar.value = true
      modelPointCount.value = 0
      modelPoints.value = []
    }
  )
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
  formdata.append('file', modelpointFile.value)
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

const getPricingParams = () => {
  loadingComplete.value = false
  rowData.value = []

  PricingService.getPricingParams(selectedProduct.value.product_code)
    .then((res) => {
      const params = res.data.data
      if (params !== null) {
        items.value = []
        columnDefs.value = []
        rowData.value = []
        createColumnDefs(params)

        const transformed = {}
        params.forEach((item) => {
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
      }

      selectedTableName.value = 'Pricing Parameters'
      tableDialog.value = true
      loadingComplete.value = true
    })
    .catch(() => {
      text.value = 'No data was found for this product'
      snackbar.value = true
    })
}

const deletePricingParameters = async () => {
  const res = await confirmDelete.value.open(
    'Deleting Pricing Parameters',
    `Are you sure you want to delete parameters for ${selectedProduct.value.product_code}?`
  )

  if (!res) return

  PricingService.deletePricingParameters(selectedProduct.value.product_code)
    .then((response) => {
      text.value = response.data
      snackbar.value = true
    })
    .catch((err) => {
      text.value = err.data.error
      snackbar.value = true
    })
}

const getPricingPolicyDemographics = () => {
  loadingComplete.value = false
  rowData.value = []
  PricingService.getPricingDemographics(selectedProduct.value.product_code)
    .then((res) => {
      const demographics = res.data.data
      if (demographics !== null && demographics.length > 0) {
        items.value = []
        columnDefs.value = []
        rowData.value = []
        createColumnDefs(demographics)

        demographics.forEach((item) => {
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
      }

      selectedTableName.value = 'Pricing Policy Demographics'
      tableDialog.value = true
      loadingComplete.value = true
    })
    .catch(() => {
      text.value = 'No data was found for this product'
      snackbar.value = true
    })
}

const deletePricingPolicyDemographics = async () => {
  const res = await confirmDelete.value.open(
    'Deleting Pricing Demographics',
    `Are you sure you want to delete demographics for ${selectedProduct.value.product_code}?`
  )
  if (!res) return
  PricingService.deletePricingDemographics(selectedProduct.value.product_code)
    .then(() => {
      text.value = 'deleted successfully'
      snackbar.value = true
    })
    .catch((err) => {
      text.value = err.data.error
      snackbar.value = true
    })

}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.minWidth = 200
    header.sortable = true
    header.filter = true
    header.resizable = true

    header.valueFormatter = formatValues
    columnDefs.value.push(header)
  })
}
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
