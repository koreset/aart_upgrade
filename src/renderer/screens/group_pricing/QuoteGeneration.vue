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
                <v-btn class="me-auto" rounded size="small" color="primary" @click="goToQuotes"
                  >Back to Quotes</v-btn
                >
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
                  class="ml-4"
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
                    groupStore.group_pricing_quote.uploadData.member_data_file
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
import { ref, shallowRef, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import Generalnput from '@/renderer/components/grouppricing/Generalnput.vue'
import AdditionalBenefits from '@/renderer/components/grouppricing/AdditionalBenefits.vue'
import GlaInput from '@/renderer/components/grouppricing/GlaInput.vue'
import LoadingInput from '@/renderer/components/grouppricing/LoadingInput.vue'
import UploadData from '@/renderer/components/grouppricing/UploadData.vue'

const groupStore = useGroupPricingStore()
const router = useRouter()

const position = ref(0)
const steps = shallowRef([
  { title: 'General', value: 1, component: Generalnput },
  { title: 'GLA', value: 2, component: GlaInput },
  { title: 'Additional Benefits', value: 3, component: AdditionalBenefits },
  { title: 'Loading', value: 4, component: LoadingInput },
  { title: 'Upload Data', value: 5, component: UploadData }
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

const goToQuotes = () => {
  router.push({ name: 'group-pricing-quotes' })
}

onMounted(() => {
  GroupPricingService.getBrokers().then((res) => {
    groupStore.brokers = res.data
  })
  GroupPricingService.getSchemes().then((res) => {
    groupStore.groupSchemes = res.data
  })
})

const generateQuote = () => {
  console.log('Generating quote')
  console.log(groupStore.group_pricing_quote)
  const formData = new FormData()
  if (groupStore.group_pricing_quote.uploadData.member_data_file) {
    formData.append('memberDataFile', groupStore.group_pricing_quote.uploadData.member_data_file)
  }
  if (groupStore.group_pricing_quote.uploadData.claims_experience_file) {
    formData.append(
      'claimsExperienceFile',
      groupStore.group_pricing_quote.uploadData.claims_experience_file
    )
  }
  console.log(groupStore.group_pricing_quote)
  groupStore.group_pricing_quote.occupation_class = 0
  console.log(JSON.stringify(groupStore.group_pricing_quote))

  formData.append('group_pricing_quote', JSON.stringify(groupStore.group_pricing_quote))

  GroupPricingService.generateQuote(formData)
}
</script>
<style lang="css" scoped>
.smaller-font {
  font-size: 14px;
}
</style>
