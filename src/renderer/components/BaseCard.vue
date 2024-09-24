<template>
  <v-card class="mb-5">
    <v-card-title class="grey mb-4 lighten-2">
      <slot name="header">{{ defaultHeader }}</slot>
    </v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions v-if="showActions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  defaultHeader: {
    type: String,
    default: 'Default Header'
  },
  showActions: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.v-card-title {
  font-size: small;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  background-color: rgb(104, 103, 103);
  color: white;
}
</style>
