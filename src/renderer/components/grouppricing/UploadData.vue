<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-file-input
          v-model:model-value="groupStore.groupPricingQuote.uploadData.memberDataFile"
          variant="outlined"
          density="compact"
          show-size
          accept=".csv"
          placeholder="Click to upload member data"
          label="Member Data"
          prepend-icon="mdi-paperclip"
        >
        </v-file-input>
      </v-col>
      <v-col cols="6">
        <v-file-input
          v-model:model-value="groupStore.groupPricingQuote.uploadData.claimsExperienceFile"
          variant="outlined"
          density="compact"
          show-size
          accept=".csv"
          placeholder="Click to upload claims experience data"
          label="Claims Experience"
          prepend-icon="mdi-paperclip"
        >
        </v-file-input>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
const groupStore = useGroupPricingStore()
</script>
<style lang="css" scoped></style>
