<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-select
          v-model="selectedProductFamily"
          clearable
          variant="outlined"
          density="compact"
          label="Select a product category"
          :items="productFamilies"
          item-value="id"
          item-title="name"
          :error-messages="productFamilyErrorMessage"
          @update:model-value="showData"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productName"
          placeholder="Enter a product name"
          label="Product Name"
          variant="outlined"
          density="compact"
          :error-messages="productNameErrorMessage"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productCode"
          placeholder="Enter a product code"
          label="Product Code"
          variant="outlined"
          density="compact"
          :error-messages="productCodeErrorMessage"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { ref, onMounted, inject, Ref, watch } from 'vue'
import { useProductStore } from '@/renderer/store/product_config'
import ProductService from '@/renderer/api/ProductService'

const resetFields = inject<Ref<boolean>>('resetFields', ref(false))
const store = useProductStore()
const productFamilies: any = ref([])
const selectedProductFamily: any = ref(null)

const productName: any = ref('')
const productCode: any = ref('')
const productCodeErrorMessage: any = ref('')
const productNameErrorMessage: any = ref('')
const productFamilyErrorMessage: any = ref('')

const showData = () => {}
// Define validation rules
const rules = {
  selectedProductFamily: { required },
  productName: { required },
  productCode: { required }
}

// Use Vuelidate
const v$ = useVuelidate(rules, { selectedProductFamily, productName, productCode })

// const formIsValid = ref(true)
const validateForm = async () => {
  // reset vuelidate errors
  v$.value.$reset()
  productFamilyErrorMessage.value = ''
  productNameErrorMessage.value = ''
  productCodeErrorMessage.value = ''

  const result = await v$.value.$validate()

  if (!result) {
    const errors: any = v$.value.$errors

    errors.forEach((error: any) => {
      if (error.$propertyPath === 'selectedProductFamily') {
        productFamilyErrorMessage.value = error.$message
      }
      if (error.$propertyPath === 'productName') {
        productNameErrorMessage.value = error.$message
      }
      if (error.$propertyPath === 'productCode') {
        productCodeErrorMessage.value = error.$message
      }
    })
    return false
  }
  store.setProductFamilyId(selectedProductFamily.value)
  store.setProductName(productName.value)
  store.setProductCode(productCode.value)
  v$.value.$reset()
  productFamilyErrorMessage.value = ''
  productNameErrorMessage.value = ''
  productCodeErrorMessage.value = ''
  return true
}

defineExpose({ validateForm })

watch(resetFields, (newVal) => {
  if (newVal) {
    selectedProductFamily.value = null
    productName.value = ''
    productCode.value = ''
    productFamilyErrorMessage.value = ''
    productNameErrorMessage.value = ''
    productCodeErrorMessage.value = ''
  }
})

onMounted(async () => {
  const response = await ProductService.getProductFamilies()
  if (response.status !== 200) {
    productFamilyErrorMessage.value = 'Error retrieving product families'
    return
  }
  productFamilies.value = response.data
})
</script>

<style scoped></style>
