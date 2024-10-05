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

.v-main {
  background: rgba(97, 136, 162, 0.7);
  /* flex: 1 1 auto;
  max-width: 100%;
  position: relative;
  width: 100vw;
  height: calc(100vh - 10px);
  flex-direction: column;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 20px !important;
  padding-top: 0 !important;
  padding-bottom: 20px !important; */
}

.table-col {
  min-width: 120px;
  font-size: 12px;
  white-space: nowrap;
}

.table-row {
  background-color: #223f54;
  color: white;
}

.v-table {
  border: 1px solid rgb(208, 207, 207);
}

.v-toolbar {
  height: 48px !important;
}
</style>
