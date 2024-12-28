<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.groupPricingQuote.acceleratedBenefitDiscount"
            variant="outlined"
            density="compact"
            type="number"
            label="Accelerated Benefit Discount"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.groupPricingQuote.commissionRate"
            variant="outlined"
            density="compact"
            type="number"
            label="Commission Rate (%)"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.groupPricingQuote.profitLoading"
            variant="outlined"
            density="compact"
            type="number"
            label="Profit Loading (%)"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.groupPricingQuote.expenseLoading"
            variant="outlined"
            density="compact"
            type="number"
            label="Expense Loading (%)"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.groupPricingQuote.overallPremiumDiscount"
            variant="outlined"
            density="compact"
            type="number"
            label="Overall Premium Discount"
            placeholder="Enter a value"
          ></v-text-field>
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
