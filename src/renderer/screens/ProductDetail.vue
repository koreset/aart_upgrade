<template>
  <v-container>
    <base-card :show-actions="false">
      <template #header> Product Selector </template>
      <template #default>
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="selectedProductCategory"
              variant="outlined"
              density="compact"
              :items="productCategories"
              item-title="name"
              item-value="id"
              label="Select a product category"
              return-object
              @update:model-value="getProducts"
            />
          </v-col>
          <v-col v-if="selectedProductCategory" cols="3">
            <v-autocomplete
              v-model="selectedProduct"
              variant="outlined"
              density="compact"
              :items="products"
              item-title="product_name"
              item-value="product_code"
              label="Select a product"
              return-object
              @update:model-value="getProduct"
            />
          </v-col>
        </v-row>
      </template>
    </base-card>
    <base-card v-if="selectedProduct">
      <template #header>
        {{ selectedProduct.product_name }} [ {{ selectedProduct.product_code }} ]
      </template>
      <template #default>
        <v-expansion-panels variant="inset" class="my-4">
          <v-expansion-panel title="Model Point Variables">
            <v-expansion-panel-text>
              <model-point-variable-display :modelPointVars="modelPointVars" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Transition States">
            <v-expansion-panel-text>
              {{ transitionStates }}
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Transitions">
            <v-expansion-panel-text>
              <p
                v-for="item in selectedProduct.product_transitions"
                :key="item.end_state"
                class="mb-6"
              >
                {{ item.start_state }} => {{ item.end_state }}</p
              >
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Benefit Structure">
            <v-expansion-panel-text>
              <p v-for="item in benefitStructures" :key="item" class="mb-5">{{ item }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Associated Tables">
            <v-expansion-panel-text>
              <associated-table-display v-if="product != null" :product="product" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel
            v-if="selectedProduct.product_state != 'pending'"
            title="Product Model Points"
          >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="selectedYear"
                    variant="outlined"
                    density="compact"
                    label="Select an MP year"
                    :items="sortedUniqueYears"
                    @update:model-value="getVersions"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="mpVersions.length > 0">
                <v-col>
                  <v-table>
                    <thead>
                      <tr class="table-row">
                        <th class="table-col">Version</th><th class="table-col">Data Count</th
                        ><th class="table-col text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in mpVersions" :key="item.version"
                        ><td>{{ item.version }}</td
                        ><td>{{ item.count }}</td
                        ><td class="text-right">
                          <v-btn
                            variant="outlined"
                            class="mr-3"
                            rounded
                            :size="buttonSize"
                            @click="getModelPoints(item)"
                            >View</v-btn
                          >
                          <v-btn
                            variant="outlined"
                            class="mr-6"
                            size="small"
                            rounded
                            color="red"
                            @click="deleteModelPoints(item)"
                            >Delete Model Points</v-btn
                          >
                        </td></tr
                      >
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <loading-indicator :loading-data="loadingData" />
              <v-row v-if="mpData.length > 0 && !loadingData">
                <v-col>
                  <data-grid
                    :show-close-button="true"
                    :column-defs="columnDefs"
                    :row-data="mpData"
                    :table-title="`Model Points for ${selectedProduct.product_name}`"
                    @update:clear-data="clearData"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <template #actions>
        <v-btn
          v-if="selectedProduct.product_state == 'pending'"
          class="mr-9 mb-3"
          rounded
          :size="buttonSize"
          color="primary"
          @click="openActivateDialog"
          >Activate Product</v-btn
        >

        <v-btn
          :disabled="selectedProduct.product_state == 'pending'"
          class="mb-3"
          rounded
          :size="buttonSize"
          color="primary"
          @click="openDialog"
          >Upload Model Points</v-btn
        >
        <v-progress-circular
          v-if="uploadingData"
          :width="2"
          :size="20"
          class="mb-3"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <v-btn
          :disabled="selectedProduct.product_state == 'pending'"
          class="ml-9 mb-3"
          size="small"
          rounded
          color="primary"
          @click="runValuations"
          >Run Valuations</v-btn
        >
        <v-btn class="ml-9 mb-3" size="small" rounded color="primary" @click="editConfiguration"
          >Edit Product Configuration</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn class="ml-9 mb-3" size="small" rounded color="red" @click="deleteProduct"
          >Delete Product</v-btn
        >
      </template>
    </base-card>
    <file-upload-dialog
      :yearLabel="yearLabel"
      :isDialogOpen="isDialogOpen"
      :showModelPoint="true"
      :mpLabel="mpLabel"
      :table="'undefined'"
      :uploadTitle="uploadTitle"
      :years="years"
      @upload="handleUpload"
      @update:isDialogOpen="updateDialog"
    />
    <confirmation-dialog ref="confirmAction" />
    <v-dialog v-model="activateDialog" persistent max-width="600">
      <base-card>
        <template #header>
          <span class="headline">Activate {{ selectedProduct.product_name }}</span>
        </template>
        <template #default>
          <v-container>
            <v-textarea
              v-model="remarks"
              name="input-7-1"
              label="Remarks"
              auto-grow
              variant="outlined"
            ></v-textarea>
          </v-container>
        </template>
        <template #actions>
          <v-spacer></v-spacer>
          <v-btn rounded color="accent" variant="plain" @click="activateProduct(false)"
            >Decline</v-btn
          >
          <v-btn rounded color="accent" variant="plain" @click="activateProduct(true)"
            >Activate</v-btn
          >
        </template>
      </base-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import ProductService from '../api/ProductService'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModelPointVariableDisplay from '../components/ModelPointVariableDisplay.vue'
import AssociatedTableDisplay from '../components/AssociatedTableDisplay.vue'
import BaseCard from '../components/BaseCard.vue'
import FileUploadDialog from '../components/FileUploadDialog.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import DataGrid from '../components/tables/DataGrid.vue'
import { formatValues } from '../utils/format_values.js'
import ConfirmationDialog from '../components/ConfirmDialog.vue'
import TaskService from '../api/TaskService'
import ActivityService from '../api/ActivityService'

// import { useAppStore } from '../store/app'

// const route = useRoute()
const router = useRouter()
// const appStore = useAppStore()

const snackbar = ref(false)
const snackbarMessage = ref('')
const timeout = 3000

const remarks = ref('')
const allProducts: any = ref([])
const productCategories: any = ref([])
const products: any = ref([])
const selectedProductCategory: any = ref(null)
const selectedProduct: any = ref(null)

const mpData: any = ref([])
const columnDefs: any = ref([])
const loadingData: any = ref(false)
const product: any = ref({})
// const paramId: any = ref(0)
const modelPointVars: any = ref([])
const transitionStates: any = ref([])
const benefitStructures: any = ref([])
const isDialogOpen = ref(false)
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k))
const modelPointCount: any = ref([])
const uniqueYears: any = ref([])
const sortedUniqueYears: any = ref([])
const selectedYear: any = ref(null)
const mpVersions: any = ref([])
const selectedVersion: any = ref(null)
const confirmAction: any = ref()
const activateDialog = ref(false)
const progress = ref(0)
const uploadMessage = ref('')
const uploadingData = ref(false)

const openDialog = () => {
  isDialogOpen.value = true
}

const clearData = () => {
  mpData.value = []
}

const openActivateDialog = () => {
  activateDialog.value = true
}

const updateDialog = (value: boolean) => {
  isDialogOpen.value = value
}

const buttonSize = 'small'
const yearLabel = 'Select an applicable year for the model points'
const uploadTitle = 'Upload Model Points'
const mpLabel = 'Enter a modelpoint version'
const user: any = ref({})

const getVersions = async () => {
  selectedVersion.value = null
  mpVersions.value = []
  mpData.value = []
  const year = selectedYear.value
  mpVersions.value = modelPointCount.value.filter((item: { year: any }) => item.year === year)
}

const editConfiguration = () => {
  router.push({ name: 'product-edit', params: { id: selectedProduct.value.id } })
}

onMounted(async () => {
  user.value = await window.mainApi?.sendSync('msgGetAuthenticatedUser')

  const prodResponse = await ProductService.getProducts()
  allProducts.value = prodResponse.data
  // allProducts.value = await appStore.getAllProducts
  productCategories.value = allProducts.value.map((item: any) => ({
    id: item.id,
    name: item.name
  }))

  if (router.currentRoute.value.params.id && router.currentRoute.value.params.familyId) {
    const id = router.currentRoute.value.params.id
    const familyId = router.currentRoute.value.params.familyId
    selectedProductCategory.value = productCategories.value.find(
      (item: any) => item.id === Number(familyId)
    )

    getProducts()
    if (products.value.length > 0) {
      selectedProduct.value = products.value.find((item: any) => item.id === Number(id))
    }
  }
})

const runValuations = () => {
  router.push('/valuations/gmm/run-settings')
  // Only run projections if there are available model points
  // if (this.modelPointCount.length > 0) {
  //   this.$router.push('/run-valuations')
  // } else {
  //   this.snackbar = true
  //   this.text = 'You will need to upload model points for the product before running projections'
  // }
}

const activateProduct = async (value) => {
  const task: any = {}
  if (value) {
    const payload: any = {}

    payload.productId = selectedProduct.value.id
    payload.description = remarks.value

    const res = await ProductService.activateProduct(payload)
    if (res.status === 200) {
      selectedProduct.value.product_state = 'approved'
    }
    activateDialog.value = false
    task.product_id = selectedProduct.value.id
    task.product_code = selectedProduct.value.product_code
    task.product_name = selectedProduct.value.product_name
    task.approver = user.value.email

    task.comments = remarks.value
    task.status = 'completed'
  } else {
    activateDialog.value = false
    // Create a task and forward back to the creator.... There should be a product that's associated with the task.
    task.product_id = selectedProduct.value.id
    task.product_code = selectedProduct.value.product_code
    task.product_name = selectedProduct.value.product_name
    task.approver = user.value
    task.comments = remarks.value
    task.status = 'active'
  }

  TaskService.createTask(task).then(() => {})

  const activityPayload: any = {}
  activityPayload.type = 'product_activation'
  activityPayload.description =
    'Product ID: ' +
    product.value.id +
    ' with code:  ' +
    product.value.product_code +
    ' was activated'
  activityPayload.object_type = 'product'
  activityPayload.object_id = product.value.id
  ActivityService.createActivity(activityPayload)
}

const handleUploadProgress = (progressEvent) => {
  progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
  uploadMessage.value = 'Uploading ' + progress.value + '%'
  if (progress.value === 100) {
    uploadMessage.value = 'Processing file...'
  }
}

const handleUpload = async (data: {
  file: File | null
  fileName: string
  productCode: string
  year: number | null
}) => {
  // Handle the uploaded data here
  const formData = new FormData()
  formData.append('file', data.file as Blob)
  formData.append('year', data.year as any)
  formData.append('mp_version', data.fileName as any)

  uploadingData.value = true
  try {
    const resp = await ProductService.postProductModelPoints(
      formData,
      selectedProduct.value.id,
      handleUploadProgress
    )

    if (resp.status === 201) {
      uploadMessage.value = 'Model points uploaded successfully'
      uploadingData.value = false
      snackbarMessage.value = 'Model points uploaded successfully'
      snackbar.value = true
      isDialogOpen.value = false
      getProduct()
    }
  } catch (error) {
    console.log(error)
  }

  isDialogOpen.value = false
}

const getProducts = async () => {
  selectedProduct.value = null

  const matchedCategory = allProducts.value.find(
    (item: any) => item.id === selectedProductCategory.value.id
  )
  if (matchedCategory) {
    products.value = matchedCategory.products
  } else {
    products.value = [] // or any default value you see fit
  }
}

const getProduct = async () => {
  product.value = null
  const response = await ProductService.getProductById(selectedProduct.value.id)
  product.value = response.data
  try {
    const resp = await ProductService.getModelPointCountForProduct(selectedProduct.value.id)
    if (resp.data.results.length > 0) {
      modelPointCount.value = resp.data.results
      uniqueYears.value = Array.from(new Set(modelPointCount.value.map((item: any) => item.year)))
      if (uniqueYears.value.length > 0) {
        sortedUniqueYears.value = uniqueYears.value.sort((a: any, b: any) => b - a)
      }
    } else {
      modelPointCount.value = []
      uniqueYears.value = []
      sortedUniqueYears.value = []
    }
  } catch (error) {
    console.log(error)
    modelPointCount.value = []
    uniqueYears.value = []
    sortedUniqueYears.value = []
    selectedYear.value = null
  }

  modelPointVars.value = selectedProduct.value.product_modelpoint_variables

  transitionStates.value = selectedProduct.value.product_transition_states
    .map((item: { state: any }) => item.state)
    .join(', ')

  const trueKeys = Object.entries(selectedProduct.value.product_features)
    .filter(([key, value]) => value === true)
    .map(([key]) => key)

  benefitStructures.value = trueKeys.map((key) =>
    key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )
}

const deleteProduct = async () => {
  const result = await confirmAction.value.open(
    'Delete Product',
    'Are you sure you want to delete this product?'
  )
  if (result) {
    ProductService.deleteProduct(product.value.product.id).then(() => {
      router.push({ name: 'dashboard' })
    })
  }
}

const getModelPoints = (item) => {
  mpData.value = []
  loadingData.value = true
  ProductService.getModelPointsForProduct(product.value.product.id, item.year, item.version).then(
    (res) => {
      if (res.data !== null) {
        // items = [];
        columnDefs.value = []
        mpData.value = []
        createColumnDefs(res.data)
        res.data.forEach((item) => {
          const transformed: any = {}
          const keys = Object.keys(item)
          keys.forEach((i) => {
            if (isNaN(item[i])) {
              transformed[i] = item[i]
            } else {
              const value = Number(item[i])
              transformed[i] = value
            }
          })
          mpData.value.push(transformed)
        })
      }
      loadingData.value = false
    }
  )
}

const deleteModelPoints = async (item) => {
  const res = await confirmAction.value.open(
    'Delete Model Points',
    'Are you sure you want to delete the model points for this version?'
  )
  if (!res) return
  ProductService.deleteModelPointsForProduct(
    product.value.product.id,
    item.year,
    item.version
  ).then((res) => {
    mpVersions.value = mpVersions.value.filter((i) => i.version !== item.version)
  })
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 220
    header.filter = true
    header.resizable = true
    header.sortable = true
    columnDefs.value.push(header)
  })
}
</script>

<style scoped lang="css">
.btn-bg {
  background-color: maroon;
  color: white !important;
}

.text-subtitle {
  font-size: 1rem;
}

div.v-expansion-panel.v-expansion-panel--active > button {
  background-color: green !important;
  color: white !important;
}

button.v-expansion-panel-title {
  background-color: blue !important;
  color: white !important;
}

.v-expansion-panel--active > .v-expansion-panel-title {
  background-color: blueviolet !important;
  color: white !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
