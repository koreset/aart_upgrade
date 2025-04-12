<script setup lang="tsx">
import NavigationDrawer from '@/renderer/screens/NavigationDrawer.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import ServerUnavailable from '../ServerUnavailable.vue'
import log from 'electron-log'
// import { ipcRenderer } from 'electron'
import ConfirmDialog from '../ConfirmDialog.vue'

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
    window.mainApi?.send('msgRestartApplication', true)
  }
})

window.mainApi?.on('logout', async () => {
  log.info('Logout')
  const res = await confirmationDialog.value?.open('Logout', 'Are you sure you want to logout?')
  if (res) {
    window.mainApi?.send('msgLogout')
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
      <server-unavailable />

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
