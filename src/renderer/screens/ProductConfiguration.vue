<template>
  <v-container>
    <v-row>
      <v-col>
        <v-stepper v-model:model-value="position" class="smaller-font" dark alt-labels>
          <v-stepper-header>
            <template v-for="(step, index) in steps" :key="step.value">
              <v-stepper-item :title="step.title" :value="step.value"></v-stepper-item>
              <v-divider v-if="index < steps.length - 1"></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-window>
            <template v-for="step in steps" :key="step.value">
              <v-stepper-window-item :value="step.value">
                <component
                  :is="step.component"
                  ref="currentStep"
                  :editMode="editMode"
                  v-bind="step.props"
                />
              </v-stepper-window-item>
            </template>
            <v-divider class="my-5"></v-divider>
            <v-row>
              <v-col class="d-flex">
                <v-btn
                  class="ml-2 mb-3"
                  size="small"
                  rounded
                  color="primary"
                  :disabled="isPrevDisabled"
                  @click="movePrev"
                  >Prev</v-btn
                >

                <v-btn
                  class="ml-4 me-auto"
                  size="small"
                  rounded
                  color="primary"
                  :disabled="isNextDisabled"
                  @click="moveNext"
                  >Next</v-btn
                >

                <v-btn class="ml-9 mb-3" size="small" rounded color="primary" @click="resetForm"
                  >Reset configuration</v-btn
                >
              </v-col>
            </v-row>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, shallowRef, provide } from 'vue'
import { useRoute } from 'vue-router'
import ProductService from '../api/ProductService'
import { useProductStore } from '../store/product_config'

import CreateProduct from '@/renderer/components/productconfig/CreateProduct.vue'
import TransitionStates from '@/renderer/components/productconfig/TransitionStates.vue'
import Transitions from '@/renderer/components/productconfig/Transitions.vue'
import RatingFactors from '@/renderer/components/productconfig/RatingFactors.vue'
import Features from '@/renderer/components/productconfig/Features.vue'
import ModelPoints from '@/renderer/components/productconfig/ModelPoints.vue'
import Upload from '../components/productconfig/Upload.vue'

const productStore = useProductStore()
const route = useRoute()
const position = ref(1)
const editMode = ref(false)
const currentStep: any = ref()
const resetFields: any = ref(false)
const editProduct: any = ref(null)

// Define steps with titles, components, and any props you want to pass
const steps = shallowRef([
  { title: 'Create Product', value: 1, component: CreateProduct },
  { title: 'Transition States', value: 2, component: TransitionStates },
  { title: 'Transitions', value: 3, component: Transitions },
  { title: 'Rating Factors', value: 4, component: RatingFactors },
  { title: 'Benefit Structure', value: 5, component: Features },
  { title: 'Model Points', value: 6, component: ModelPoints },
  { title: 'Save Product', value: 7, component: Upload, props: { editMode } }
])

onMounted(() => {
  if (route.params.id) {
    editMode.value = true
    ProductService.getProductById(route.params.id).then((response) => {
      editProduct.value = response.data.product
      productStore.setProductState(editProduct.value)
    })
  }
})

provide('resetFields', resetFields)

// Computed properties for button states
const isPrevDisabled = computed(() => position.value <= 1)
const isNextDisabled = computed(() => position.value >= steps.value.length)

const moveNext = async () => {
  const isValid = currentStep.value
    ? await currentStep.value[position.value - 1].validateForm()
    : false
  if (!isValid) {
    return
  }
  position.value++
}

const movePrev = () => {
  position.value--
}

const resetForm = () => {
  // provide code to emit an event to reset the child forms
  resetFields.value = true
  productStore.resetProductState()
  position.value = 1

  // Reset after some time (for demonstration purposes)
  setTimeout(() => {
    resetFields.value = false
  }, 2000)
}
</script>

<style scoped>
.title {
  color: green;
}
.title2 {
  color: red;
}
.v-stepper.v-sheet {
  color: black !important;
}
.color-black {
  color: black;
}
.smaller-font {
  font-size: 14px;
}
</style>

///////////////////////// ProductConfiguration.vue /////////////////////////
