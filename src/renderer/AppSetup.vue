<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col>
          <h2>Application Setup</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <activation />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'
import Activation from '@/renderer/components/setup/Activation.vue'
// import Database from '@/renderer/components/setup/Database.vue'

onBeforeMount(() => {
  console.log('Login component before mount')
  window.mainApi?.send('msgResizeWindow', 1024, 600, false)
})
onMounted(() => {
  console.log('Login component mounted')
})
</script>

<style scoped>
/* Add your component styles here */
.stepper-height {
  height: 100%;
}

.v-stepper.v-sheet {
  color: black !important;
}
</style>
