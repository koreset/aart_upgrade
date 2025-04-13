<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">No Entitlements For License</span>
          </template>
          <template #default>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-text>
                    <p class="text-h6">No entitlements found for this license key.</p>
                    <p class="text-h6">Please contact your administrator.</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
</script>
<style lang="css" scoped></style>
