<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-date-input
            v-model="groupStore.groupPricingQuote.commencementDate"
            hide-actions
            locale="en-in"
            view-mode="month"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="outlined"
            density="compact"
            label="Commencement Date"
            placeholder="Select a date"
          ></v-date-input>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.industry"
            variant="outlined"
            density="compact"
            label="Industry"
            placeholder="Choose an industry"
            :items="industries"
          >
          </v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="groupStore.groupPricingQuote.schemeType"
            variant="outlined"
            density="compact"
            placeholder="Choose a scheme type"
            label="Scheme Type"
            :items="groupStore.schemeTypes"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
// import { ref } from 'vue'

const groupStore = useGroupPricingStore()
// const commencementDate = ref<string | null>(null)
const industries = ['Industry 1', 'Industry 2', 'Industry 3']
</script>
<style lang="css" scoped></style>
