<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model:model-value="selectedTransitions"
          clearable
          multiple
          chips
          variant="outlined"
          density="compact"
          :items="transitions"
          item-title="state"
          item-value="id"
          placeholder="Select transition states"
          return-object
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useProductStore } from '@/renderer/store/product_config'
import { inject, onMounted, Ref, ref, watch } from 'vue'
import ProductService from '@/renderer/api/ProductService.js'

const store = useProductStore()
// const product = store.getProduct
const transitions: any = ref([])
const selectedTransitions: any = ref(null)
const resetFields = inject<Ref<boolean>>('resetFields', ref(false))

onMounted(() => {
  ProductService.getTransitionStates().then((resp) => {
    transitions.value = resp.data
  })
  if (store.getProductTransitionStates.length > 0) {
    selectedTransitions.value = store.getProductTransitionStates
  }
})

const validateForm = async () => {
  if (!selectedTransitions.value) {
    return false
  }

  store.setProductTransitionStates(selectedTransitions.value)
  return true
}

defineExpose({
  validateForm
})





watch(resetFields, (value) => {
  if (value) {
    selectedTransitions.value = null
  }
})
</script>

<style scoped></style>
