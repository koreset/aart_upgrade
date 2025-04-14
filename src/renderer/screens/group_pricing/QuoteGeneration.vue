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
                  v-if="position === steps.length"
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
import { ref, computed, onMounted, onBeforeMount, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import Generalnput from '@/renderer/components/grouppricing/Generalnput.vue'
import AdditionalBenefits from '@/renderer/components/grouppricing/AdditionalBenefits.vue'
import GlaInput from '@/renderer/components/grouppricing/GlaInput.vue'
import LoadingInput from '@/renderer/components/grouppricing/LoadingInput.vue'
// import UploadData from '@/renderer/components/grouppricing/UploadData.vue'

const groupStore = useGroupPricingStore()
const router = useRouter()
const route = useRoute()
const quoteId = ref(route.params.id)
const benefitMaps: any = ref([])

const getBenefitAlias = (benefit: any) => {
  console.log('Benefit', benefit)
  console.log('Benefit Maps', benefitMaps.value)
  const benefitMap = benefitMaps.value.find((map: any) => map.benefit_code === benefit)
  console.log('Benefit Map', benefitMap)
  return benefitMap.benefit_alias !== '' ? benefitMap.benefit_alias : benefit
  // return 'WORK'
}
const steps: any = shallowRef([])

onBeforeMount(async () => {
  const res = await GroupPricingService.getBenefitMaps()
  benefitMaps.value = res.data
  console.log('Benefit Maps', benefitMaps.value)
  steps.value = [
    { title: 'General', value: 1, component: Generalnput },
    { title: `${getBenefitAlias('GLA')}`, value: 2, component: GlaInput },
    { title: 'Additional Benefits', value: 3, component: AdditionalBenefits },
    { title: 'Loading', value: 4, component: LoadingInput }
  ]
})

const position = ref(1)

const isPrevDisabled = computed(() => position.value <= 1)
const isNextDisabled = computed(() => position.value >= steps.value.length)
const currentStep: any = ref(null)

const moveNext = async () => {
  try {
    console.log(currentStep.value)
    const isValid = currentStep.value
      ? await currentStep.value[position.value - 1].validateForm()
      : false
    if (!isValid) {
      return
    }
    position.value++
  } catch (e) {
    console.log(e)
  }
}

const movePrev = () => {
  position.value--
}

const goToQuotes = () => {
  groupStore.resetGroupPricingQuote()
  router.push({ name: 'group-pricing-quotes' })
}

// const getBenefitCode = (benefit: any) => {
//   const benefitMap = benefitMaps.value.find((map: any) => map.id === benefit.benefit_id)
//   return benefitMap ? benefitMap.benefit_code : ''
// }

const generateQuote = () => {
  console.log('Generating quote')
  console.log(groupStore.group_pricing_quote)
  const formData = new FormData()
  console.log(groupStore.group_pricing_quote)
  groupStore.group_pricing_quote.occupation_class = 0
  console.log(JSON.stringify(groupStore.group_pricing_quote))

  formData.append('group_pricing_quote', JSON.stringify(groupStore.group_pricing_quote))

  GroupPricingService.generateQuote(formData).then((res) => {
    console.log(res)
    // we should be cleaning out the store here
    groupStore.resetGroupPricingQuote()
    router.push({ name: 'group-pricing-quotes' })
  })
}

onMounted(() => {
  GroupPricingService.getBenefitMaps().then((res) => {
    groupStore.brokers = res.data
  })
  GroupPricingService.getIndustries().then((res) => {
    groupStore.industries = res.data
  })
  GroupPricingService.getSchemesInforce().then((res) => {
    groupStore.groupSchemes = res.data
  })
  if (quoteId.value) {
    GroupPricingService.getQuote(quoteId.value).then((res) => {
      console.log(res.data)
      groupStore.group_pricing_quote = res.data
      groupStore.group_pricing_quote.commencement_date = null
    })
  }
})
</script>
<style lang="css" scoped>
.smaller-font {
  font-size: 14px;
}
</style>
