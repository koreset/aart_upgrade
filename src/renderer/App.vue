<script setup lang="tsx">
import { DefaultLayout } from '@/renderer/components/layout'
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<style>
html {
  overflow-y: auto !important;
  user-select: none;
}
html,
body {
  width: 100%;
  height: 100%;
}
/* Do not force capitalization of button text */
.v-btn {
  text-transform: unset !important;
}

.table-col {
  min-width: 120px;
  font-size: 12px;
  white-space: nowrap;
}

.table-row {
  background-color: rgb(169, 169, 169);
  color: white;
}

.v-table {
  border: 1px solid rgb(208, 207, 207);
}

.v-toolbar {
  height: 48px !important;
}
</style>
