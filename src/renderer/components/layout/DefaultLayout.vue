<script setup lang="tsx">
import NavigationDrawer from '@/renderer/components/NavigationDrawer.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/renderer/store/app'
import ProductService from '@/renderer/api/ProductService'
import log from 'electron-log'
// import { ipcRenderer } from 'electron'
import ConfirmDialog from '../ConfirmDialog.vue'

const appStore = useAppStore()
const drawer = ref(true)
const confirmationDialog = ref()

const route: any = useRoute()
const titleKey: string = (route?.meta?.titleKey || 'title.main') as string

const toggleDrawer = (): void => {
  drawer.value = !drawer.value
}

window.mainApi?.on('update_available', async () => {
  log.info('Update Available')
  const res = await confirmationDialog.value?.open(
    'Update Available',
    'A new version of the application is available. Do you want to update now? This will restart the application.'
  )
  if (res) {
    console.log('Update Now')
    window.mainApi?.send('msgRestartApplication', true)
  }
})

onMounted(async () => {
  const response = await ProductService.getProducts()
  console.log('App Products:', response)
  appStore.setProducts(response.data)

  const result = await window.mainApi?.sendSync('msgGetUserLicense')
  console.log('License:', result)
  if (result) {
    appStore.setLicense(result)
  }
})
</script>

<template>
  <v-app>
    <v-app-bar
      scroll-behavior="elevate"
      scroll-threshold="688"
      class="custom-app"
      color="primary"
      density="compact"
    >
      <v-app-bar-nav-icon variant="text" @click="toggleDrawer()"></v-app-bar-nav-icon>
      <v-app-bar-title class="app-title">{{ $t(titleKey) }}</v-app-bar-title>
    </v-app-bar>
    <NavigationDrawer :drawer="drawer" />
    <v-main>
      <slot />
    </v-main>
    <confirm-dialog ref="confirmationDialog" />
  </v-app>
</template>

<style scoped>
.custom-app {
  height: 40px;
}

.app-title {
  font-size: 14px;
  font-weight: 500;
}
</style>
