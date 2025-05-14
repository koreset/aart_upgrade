<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Customize Benefit Names</span>
          </template>
          <template #default>
            <v-row v-for="(benefit, index) in benefits" :key="index" class="d-flex my-2">
              <v-col cols="3">
                <strong>{{ benefit.benefit_name }}</strong>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="benefit.benefit_alias"
                  :label="`Alias for ${benefit.benefit_name}`"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col v-if="benefit.benefit_alias" cols="4">
                <v-text-field
                  v-model="benefit.benefit_alias_code"
                  :label="`Code for ${benefit.benefit_alias}`"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            <v-btn rounded size="small" color="primary" class="mt-4" @click="submitBenefits">
              Save Mappings
            </v-btn>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import GroupPricingSerivce from '@/renderer/api/GroupPricingService'

interface Benefit {
  id: number
  benefit_name: string
  benefit_alias: string
  benefit_code: string
  benefit_alias_code: string
  is_mapped: boolean
}

const emit = defineEmits<{
  (e: 'submit', value: Benefit[]): void
}>()

const benefits = ref<Benefit[]>([])

onMounted(() => {
  GroupPricingSerivce.getBenefitMaps().then((res) => {
    if (res.data.length > 0) {
      benefits.value = res.data.map((benefit: any) => ({
        id: benefit.id,
        benefit_name: benefit.benefit_name,
        benefit_alias: benefit.benefit_alias,
        benefit_code: benefit.benefit_code,
        benefit_alias_code: benefit.benefit_alias_code,
        is_mapped: benefit.is_mapped
      }))
    }
  })
})

function submitBenefits() {
  emit('submit', benefits.value)
}
</script>
<style lang="css" scoped></style>
