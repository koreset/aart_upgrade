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
    <v-row>
      <v-col cols="4">
        <v-select
          key="user"
          v-model="groupStore.groupPricingQuote.reviewedBy"
          label="Choose a reviewer in your organisation"
          variant="outlined"
          density="compact"
          :items="orgUsers"
          item-title="user"
          item-value="user"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import ProductService from '@/renderer/api/ProductService'
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import { useAppStore } from '@/renderer/store/app'
import { computed, onMounted, ref } from 'vue'

const appStore = useAppStore()
const groupStore = useGroupPricingStore()
const orgUsers: any = ref([])
const organization = computed(() => appStore.getLicenseData.data.attributes.metadata.organization)

onMounted(() => {
  try {
    ProductService.getOrgUsers({ name: organization.value }).then((res) => {
      const uniqueData = Array.from(new Map(res.data.map((entry) => [entry.user, entry])).values())
      orgUsers.value = uniqueData
      console.log('Org Users:', orgUsers.value)
    })
  } catch (error) {
    console.log('Error:', error)
  }
})
</script>
<style lang="css" scoped></style>
