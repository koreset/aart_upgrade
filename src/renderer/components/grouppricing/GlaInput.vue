<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.group_pricing_quote.gla.salary_multiple"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="GLA Salary Multiple"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="groupStore.group_pricing_quote.gla.terminal_illness_benefit"
            variant="outlined"
            density="compact"
            label="Terminal Illness Benefit"
            placeholder="Add Terminal Illness Benefit"
            :items="groupStore.terminalIllnessBenefits"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.group_pricing_quote.gla.waiting_period"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Waiting Period"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.group_pricing_quote.gla.cover_termination_age"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Cover Termination Age"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="groupStore.group_pricing_quote.gla.educator_benefit"
            variant="outlined"
            density="compact"
            label="Educator Benefit"
            placeholder="Enable Educator Benefit"
            :items="groupStore.yesNoItems"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'

const groupStore = useGroupPricingStore()
const validateForm = () => {
  console.log('Validating form')
  return true
}

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
