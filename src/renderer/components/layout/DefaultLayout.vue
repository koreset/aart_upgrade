<script setup lang="tsx">
import NavigationDrawer from '@/renderer/components/NavigationDrawer.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/renderer/store/app'
import ProductService from '@/renderer/api/ProductService'
import log from 'electron-log'
// import { ipcRenderer } from 'electron'

const appStore = useAppStore()
const drawer = ref(true)

const route: any = useRoute()
const titleKey: string = (route?.meta?.titleKey || 'title.main') as string

const toggleDrawer = (): void => {
  drawer.value = !drawer.value
}

// ipcRenderer.on('update_available', (event) => {
//   log.info('Update Available', event)
//   alert('Update Available')
// })

window.mainApi?.on('update_not_available', () => {
  log.info('Update not Available')
  alert('Update not Available')
})

onMounted(async () => {
  window.mainApi?.on('update_available', () => {
    log.info('Update Available')
    alert('Update Available')
  })

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
