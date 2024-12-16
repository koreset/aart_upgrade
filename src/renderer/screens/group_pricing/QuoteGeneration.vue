<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Quote Generation</span>
          </template>
          <template #default>
            <v-row>
              <v-col>
                <h4>Quote Generation</h4>
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
