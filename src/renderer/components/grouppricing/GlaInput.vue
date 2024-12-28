<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.currency"
            placeholder="Choose a currency"
            label="Currency"
            variant="outlined"
            density="compact"
            :items="groupStore.currencies"
          ></v-select>
        </v-col>
        <v-col v-if="groupStore.groupPricingQuote.currency === 'USD'" cols="4">
          <v-text-field
            v-model:model-value="groupStore.groupPricingQuote.exchangeRate"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Exchange Rate for USD"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.groupPricingQuote.salaryMultiple"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Salary Multiple"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.groupPricingQuote.currentFcl"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Current FCL"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.terminalIllnessBenefit"
            variant="outlined"
            density="compact"
            label="Terminal Illness Benefit"
            placeholder="Add Terminal Illness Benefit"
            :items="groupStore.terminalIllnessBenefits"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.groupPricingQuote.normalRetirementAge"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Normal Retirement Age"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="groupStore.groupPricingQuote.coverTerminationAge"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Cover Termination Age"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.claimsExperience"
            variant="outlined"
            density="compact"
            label="Claims Experience"
            placeholder="Choose a claims experience?"
            :items="groupStore.claimsExperiences"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'

const groupStore = useGroupPricingStore()
</script>
<style lang="css" scoped></style>
