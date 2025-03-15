<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.group_pricing_quote.loadings.accelerated_benefit_discount"
            variant="outlined"
            density="compact"
            type="number"
            label="Accelerated Benefit Discount"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.group_pricing_quote.loadings.commission_loading"
            variant="outlined"
            density="compact"
            type="number"
            label="Commission Rate (%)"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.group_pricing_quote.loadings.profit_loading"
            variant="outlined"
            density="compact"
            type="number"
            label="Profit Loading (%)"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.group_pricing_quote.loadings.expense_loading"
            variant="outlined"
            density="compact"
            type="number"
            label="Expense Loading (%)"
            placeholder="Enter a value"
          ></v-text-field>
        </v-col>
        <v-col cols="4"
          ><v-text-field
            v-model="groupStore.group_pricing_quote.loadings.discount"
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

const validateForm = () => {
  console.log('Validating form')
  return true
}

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
