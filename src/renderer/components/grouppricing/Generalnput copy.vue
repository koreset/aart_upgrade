<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="groupStore.group_pricing_quote.quote_type"
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
        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'New Business'" cols="4">
          <v-text-field
            v-model="groupStore.group_pricing_quote.scheme_name"
            variant="outlined"
            density="compact"
            label="Scheme Name"
            placeholder="Enter a scheme name"
          ></v-text-field>
        </v-col>
        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'New Business'" cols="4">
          <v-text-field
            v-model="groupStore.group_pricing_quote.scheme_contact"
            variant="outlined"
            density="compact"
            label="Scheme Contact"
            placeholder="Enter a name of scheme contact"
          ></v-text-field>
        </v-col>
        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'New Business'" cols="4">
          <v-text-field
            v-model="groupStore.group_pricing_quote.scheme_email"
            variant="outlined"
            density="compact"
            label="Scheme Email"
            placeholder="Enter an email of scheme contact"
          ></v-text-field>
        </v-col>

        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'Renewal'" cols="4">
          <v-select
            v-model="groupStore.group_pricing_quote.scheme_name"
            variant="outlined"
            density="compact"
            label="Scheme Name"
            placeholder="Choose a scheme name"
            :items="groupStore.groupSchemes"
            item-title="name"
            item-value="name"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="groupStore.group_pricing_quote.quote_broker"
            variant="outlined"
            density="compact"
            placeholder="Choose a broker"
            label="Broker"
            :items="groupStore.brokers"
            item-title="name"
            item-value="id"
            return-object
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model:model-value="groupStore.group_pricing_quote.obligation_type"
            variant="outlined"
            density="compact"
            label="Obligation Type"
            placeholder="Choose an obligation type"
            :items="groupStore.obligationTypes"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-date-input
            v-model="groupStore.group_pricing_quote.commencement_date"
            hide-actions
            locale="en-ZA"
            view-mode="month"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="outlined"
            density="compact"
            label="Commencement Date"
            placeholder="Select a date"
          ></v-date-input>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="groupStore.group_pricing_quote.industry"
            variant="outlined"
            density="compact"
            label="Industry"
            placeholder="Choose an industry"
            :items="industries"
          >
          </v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="groupStore.group_pricing_quote.scheme_type"
            variant="outlined"
            density="compact"
            placeholder="Choose a scheme type"
            label="Scheme Type"
            :items="groupStore.schemeTypes"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="groupStore.group_pricing_quote.currency"
            placeholder="Choose a currency"
            label="Currency"
            variant="outlined"
            density="compact"
            :items="groupStore.currencies"
          ></v-select>
        </v-col>
        <v-col v-if="groupStore.group_pricing_quote.currency === 'USD'" cols="4">
          <v-text-field
            v-model:model-value="groupStore.group_pricing_quote.exchangeRate"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            label="Exchange Rate for USD"
          ></v-text-field>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="groupStore.group_pricing_quote.experience_rating"
            variant="outlined"
            density="compact"
            label="Claims Experience"
            placeholder="Choose a claims experience?"
            :items="groupStore.claimsExperiences"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="groupStore.group_pricing_quote.free_cover_limit"
            variant="outlined"
            density="compact"
            label="Free Cover Limit"
            type="number"
            placeholder="Free Cover Limit"
          >
          </v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="groupStore.group_pricing_quote.normal_retirement_age"
            variant="outlined"
            density="compact"
            label="Normal Retirement Age"
            type="number"
            placeholder="Normal Retirement Age"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import { VDateInput } from 'vuetify/labs/VDateInput'
// import GroupPricingService from '@/renderer/api/GroupPricingService'

const groupStore = useGroupPricingStore()
const industries = ['Administration', 'NGO', 'Banks']

// methods
const validateForm = async () => {
  return true
}

const chooseQuoteFlow = (value: string | null) => {
  if (value !== null) {
    groupStore.group_pricing_quote.quote_type = value
  }
}

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
