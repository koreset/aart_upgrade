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
                <component :is="step.component" ref="currentStep" />
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

                <v-btn
                  v-if="
                    position === steps.length &&
                    groupStore.groupPricingQuote.uploadData.memberDataFile
                  "
                  class="ml-9 mb-3"
                  size="small"
                  rounded
                  color="primary"
                  @click="generateQuote"
                  >Generate Quote</v-btn
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
import { ref, shallowRef, computed } from 'vue'
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import Generalnput from '@/renderer/components/grouppricing/Generalnput.vue'
import AdditionalBenefits from '@/renderer/components/grouppricing/AdditionalBenefits.vue'
import GlaInput from '@/renderer/components/grouppricing/GlaInput.vue'
import LoadingInput from '@/renderer/components/grouppricing/LoadingInput.vue'
import GlobalInput from '@/renderer/components/grouppricing/GlobalInput.vue'
import UploadData from '@/renderer/components/grouppricing/UploadData.vue'

const groupStore = useGroupPricingStore()

const position = ref(0)
const steps = shallowRef([
  { title: 'General', value: 1, component: Generalnput },
  { title: 'Global', value: 2, component: GlobalInput },
  { title: 'Loading', value: 3, component: LoadingInput },
  { title: 'GLA', value: 4, component: GlaInput },
  { title: 'Additional Benefits', value: 5, component: AdditionalBenefits },
  { title: 'Upload Data', value: 6, component: UploadData }
])
const isPrevDisabled = computed(() => position.value <= 1)
const isNextDisabled = computed(() => position.value >= steps.value.length)
const currentStep: any = ref()

const moveNext = async () => {
  // const isValid = currentStep.value
  //   ? await currentStep.value[position.value - 1].validateForm()
  //   : false
  // if (!isValid) {
  //   return
  // }
  position.value++
}

const movePrev = () => {
  position.value--
}

const generateQuote = () => {
  console.log('Generating quote')
  console.log(groupStore.groupPricingQuote)
  const formData = new FormData()
  if (groupStore.groupPricingQuote.uploadData.memberDataFile) {
    formData.append('memberDataFile', groupStore.groupPricingQuote.uploadData.memberDataFile)
  }
  if (groupStore.groupPricingQuote.uploadData.claimsExperienceFile) {
    formData.append(
      'claimsExperienceFile',
      groupStore.groupPricingQuote.uploadData.claimsExperienceFile
    )
  }
  console.log(groupStore.groupPricingQuote)
  console.log(JSON.stringify(groupStore.groupPricingQuote))

  formData.append('groupPricingQuote', JSON.stringify(groupStore.groupPricingQuote))

  GroupPricingService.generateQuote(formData)
}
</script>
<style lang="css" scoped>
.smaller-font {
  font-size: 14px;
}
</style>
