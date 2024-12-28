<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.quoteType"
            variant="outlined"
            density="compact"
            clearable
            placeholder="Choose quote type"
            label="Quote for"
            :items="groupStore.quoteTypes"
            @update:model-value="chooseQuoteFlow"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="groupStore.groupPricingQuote.quoteType === 'New Business'" cols="4">
          <v-text-field
            v-model="groupStore.groupPricingQuote.schemeName"
            variant="outlined"
            density="compact"
            label="Scheme Name"
            placeholder="Enter a scheme name"
          ></v-text-field>
        </v-col>
        <v-col v-if="groupStore.groupPricingQuote.quoteType === 'Renewal'" cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.schemeName"
            variant="outlined"
            density="compact"
            label="Scheme Name"
            placeholder="Choose a scheme name"
            :items="schemes"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.groupPricingQuote.quoteType !== '' &&
            groupStore.groupPricingQuote.quoteType !== null
          "
          cols="3"
        >
          <v-select
            v-model="groupStore.groupPricingQuote.quoteBroker"
            variant="outlined"
            density="compact"
            placeholder="Choose a broker"
            label="Broker"
            :items="brokers"
            item-title="name"
            item-value="id"
            return-object
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.groupPricingQuote.quoteType !== '' &&
            groupStore.groupPricingQuote.quoteType !== null
          "
          cols="4"
        >
          <v-select
            v-model:model-value="groupStore.groupPricingQuote.obligationType"
            variant="outlined"
            density="compact"
            label="Obligation Type"
            placeholder="Choose an obligation type"
            :items="groupStore.obligationTypes"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'

const groupStore = useGroupPricingStore()
const schemes = ['Scheme 1', 'Scheme 2', 'Scheme 3']
const brokers = [
  { id: 1, name: 'Broker 1' },
  { id: 2, name: 'Broker 2' },
  { id: 3, name: 'Broker 3' }
]

// methods
const chooseQuoteFlow = (value: string | null) => {
  console.log('Choosing quote flow')
  console.log(value)
  if (value !== null) {
    groupStore.groupPricingQuote.quoteType = value
  }
}
</script>
<style lang="css" scoped></style>
