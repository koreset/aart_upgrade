<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Claims</span>
          </template>
          <template #default>
            <v-row
              ><v-col
                ><v-btn color="primary" size="small" @click="lodgeClaim">Lodge Claim</v-btn>
              </v-col></v-row
            >
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const lodgeClaim = () => {
  console.log('Lodge Claim')
  router.push({ name: 'group-pricing-lodge-claim' })
}
</script>
<style lang="css" scoped></style>
