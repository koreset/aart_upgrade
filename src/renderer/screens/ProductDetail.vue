<template>
  <v-container>
    <base-card :show-actions="false">
      <template #header>
        Product Selector
      </template>
      <template #default>
        <v-row>
          <v-col cols="3">
            <v-select v-model="selectedProductCategory" variant="outlined" density="compact" :items="productCategories"
              item-title="name" item-value="id" label="Select a product category" @update:model-value="getProducts" />
          </v-col>
          <v-col v-if="selectedProductCategory" cols="3">
            <v-select v-model="selectedProduct" variant="outlined" density="compact" :items="products"
              item-title="product_name" item-value="product_code" label="Select a product category" return-object
              @update:model-value="getProduct" />
          </v-col>
          <!-- <v-col v-if="selectedProduct" cols="3">
            <v-btn class="btn-bg mt-2" rounded :size="buttonSize" @click="openDialog">Show Product</v-btn>
          </v-col> -->
        </v-row>
      </template>
    </base-card>
    <base-card v-if="selectedProduct">
      <template #header>
        {{ selectedProduct.product_name }}
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
              <p v-for="item in selectedProduct.product_transitions" :key="item.end_state" class="mb-6">
                {{ item.start_state }} => {{ item.end_state }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Benefit Structure">
            <v-expansion-panel-text>
              <p v-for="item in benefitStructures" :key="item" class="mb-5">{{ item }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Associated Tables">
            <v-expansion-panel-text>
              <associated-table-display :product="selectedProduct" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <v-card-title class="text-subtitle">Model Point Count</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="3">
                    <v-select v-model="selectedYear" variant="outlined" density="compact" label="Select an MP year"
                      :items="sortedUniqueYears" @update:model-value="getVersions"></v-select>
                  </v-col>
                  <v-col v-if="mpVersions.length > 0" cols="3">
                    <v-select v-model="selectedVersion" variant="outlined" density="compact" label="Select a version"
                      :items="mpVersions" item-title="version" item-value="version"></v-select>
                  </v-col>
                  <v-col v-if="selectedVersion" class="mt-2" cols="2">Data count: {{ countForVersion }}</v-col>
                  <v-col v-if="selectedVersion" class="d-flex" cols="4">
                    <v-btn variant="outlined" class="mb-3" rounded :size="buttonSize"
                      @click="getModelPoints">View</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" class="mb-3" size="small" rounded color="red">Delete Model Points</v-btn>
                  </v-col>
                </v-row>
                <loading-indicator :loading-data="loadingData" />
                <v-row v-if="mpData.length > 0 && !loadingData">
                  <v-col>
                    <data-grid :column-defs="columnDefs" :row-data="mpData" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-col>
        </v-row>
        <v-divider class="mt-4"></v-divider>
      </template>
      <template #actions>
        <v-btn class="ml-9 mb-3" rounded :size="buttonSize" color="primary" @click="openDialog">Upload Model
          Points</v-btn>
        <v-btn class="ml-9 mb-3" size="small" rounded color="primary">Run Valuations</v-btn>
        <v-btn class="ml-9 mb-3" size="small" rounded color="primary">Edit Product Configuration</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="ml-9 mb-3" size="small" rounded color="red" @click="deleteProduct">Delete Product</v-btn>
      </template>
    </base-card>
    <file-upload-dialog :yearLabel="yearLabel" :isDialogOpen="isDialogOpen" :showModelPoint="true" :mpLabel="mpLabel"
      :uploadTitle="uploadTitle" :years="years" @upload="handleUpload" @update:isDialogOpen="updateDialog" />
    <confirmation-dialog ref="confirmAction" />
  </v-container>
</template>

<script setup lang="ts">
import ProductService from '../api/ProductService'
import { ref, onMounted, computed } from 'vue'
import {  useRouter } from 'vue-router'
import ModelPointVariableDisplay from '../components/ModelPointVariableDisplay.vue'
import AssociatedTableDisplay from '../components/AssociatedTableDisplay.vue'
import BaseCard from '../components/BaseCard.vue'
import FileUploadDialog from '../components/FileUploadDialog.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import DataGrid from '../components/tables/DataGrid.vue'
import { formatValues } from '../utils/format_values.js'
import ConfirmationDialog from '../components/ConfirmDialog.vue'


// const route = useRoute()
const router = useRouter()

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
const isDialogOpen = ref(false);
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k));
const modelPointCount: any = ref([])
const uniqueYears: any = ref([])
const sortedUniqueYears: any = ref([])
const selectedYear: any = ref(null)
const mpVersions: any = ref([])
const selectedVersion: any = ref(null)
const confirmAction: any = ref()

const openDialog = () => {
  console.log('Open Dialog')
  isDialogOpen.value = true;
};

const updateDialog = (value: boolean) => {
  isDialogOpen.value = value;
};

const buttonSize = 'small'
const yearLabel = 'Select an applicable year for the model points'
const uploadTitle = 'Upload Model Points'
const mpLabel = 'Enter a modelpoint version'

const getVersions = async () => {
  selectedVersion.value = null
  mpData.value = []
  const year = selectedYear.value
  mpVersions.value = modelPointCount.value.filter((item: { year: any }) => item.year === year)
  console.log(mpVersions.value)
}

const countForVersion = computed(() => {
  const selectedItem = modelPointCount.value.find(item => item.version === selectedVersion.value);
  console.log("selected item: ", selectedItem)
  return selectedItem ? selectedItem.count : null;
});


const handleUpload = (data: { file: File | null; fileName: string; productCode: string; year: number | null }) => {
  // Handle the uploaded data here
  console.log(data);
  isDialogOpen.value = false;
};

const getProducts = async () => {
  const matchedCategory = allProducts.value.find((item: any) => item.id === selectedProductCategory.value);
  if (matchedCategory) {
    products.value = matchedCategory.products;
    console.log('Get products', products.value);
  } else {
    console.log('No matching category found');
    products.value = []; // or any default value you see fit
  }
}



const getProduct = async () => {
  console.log('Get product', selectedProduct.value)
  const response = await ProductService.getProductById(selectedProduct.value.id)
  product.value = response.data
  console.log("Product Value", product.value)
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
  const result = await confirmAction.value.open('Delete Product', 'Are you sure you want to delete this product?');
  console.log(result)
  if (result) {
    ProductService.deleteProduct(product.value.product.id).then(() => {
      console.log('Product deleted')
      router.push({ name: 'dashboard' })
    })
  }
}

const getModelPoints = () => {
  console.log(product.value)
  mpData.value = []
  ProductService.getModelPointsForProduct(product.value.product.id, selectedYear.value, selectedVersion.value).then(
    (res) => {
      console.log(res.data);
      if (res.data !== null) {
        // this.items = [];
        columnDefs.value = [];
        mpData.value = [];
        createColumnDefs(res.data);
        res.data.forEach((item) => {
          const transformed: any = {};
          const keys = Object.keys(item);
          keys.forEach((i) => {
            if (isNaN(item[i])) {
              transformed[i] = item[i];
            } else {
              const value = Number(item[i]);
              transformed[i] = value;
            }
          });
          mpData.value.push(transformed);
        });
      }

      // this.selectedTableName = "Model Points";
      // this.tableDialog = true;
      // this.loadingComplete = true;
    }
  );
}

const createColumnDefs = (data) => {
  columnDefs.value = [];
  Object.keys(data[0]).forEach((element) => {
    const header: any = {};
    header.headerName = element;
    header.field = element;
    header.valueFormatter = formatValues;
    header.minWidth = 220;
    header.filter = true;
    header.resizable = true;
    header.sortable = true;
    columnDefs.value.push(header);
  });
}



/// Watches for changes in the route params and fetches the product data

// watchEffect(async () => {
//   try {
//     console.log('Watch effect')
//     paramId.value = route.params.id
//     const response = await ProductService.getProductById(paramId.value)
//     product.value = response.data
//     modelPointVars.value = response.data.product.product_modelpoint_variables

//     sortedUniqueYears.value = [] // Clear the data
//     const resp = await ProductService.getModelPointCountForProduct(paramId.value)
//     modelPointCount.value = resp.data.results
//     mpData.value = [] // Clear the data
//     console.log(mpData.value)
//     uniqueYears.value = Array.from(new Set(modelPointCount.value.map((item: any) => item.year)))
//     if (uniqueYears.value.length > 0) {
//       sortedUniqueYears.value = uniqueYears.value.sort((a: any, b: any) => b - a)
//     }
//     transitionStates.value = response.data.product.product_transition_states
//       .map((item: { state: any }) => item.state)
//       .join(', ')
//     const trueKeys = Object.entries(response.data.product.product_features)
//       .filter(([key, value]) => value === true)
//       .map(([key]) => key)

//     benefitStructures.value = trueKeys.map((key) =>
//       key
//         .split('_')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ')
//     )
//   } catch (error) {
//     console.log(error)
//   }
// })

onMounted(async () => {
  console.log('Mounted')
  const prodResponse = await ProductService.getProducts()
  allProducts.value = prodResponse.data

  console.log('All Products', allProducts.value)

  productCategories.value = allProducts.value.map((item: any) => ({
    id: item.id,
    name: item.name
  }))

})
</script>

<style scoped>
.btn-bg {
  background-color: maroon;
  color: white !important;
}

.text-subtitle {
  font-size: 1rem;
}
</style>
