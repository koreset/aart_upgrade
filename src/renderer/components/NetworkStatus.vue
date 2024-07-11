<template>
  <div>
    <div v-if="!isOnline" class="network-status">
      You are currently offline. Please check your internet connection.
    </div>
    <div v-if="isOnline && !isServiceAvailable" class="network-status">
      The service is currently unavailable. Please try again later.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useNetworkStatusStore } from '../store/network_status'

const networkStatusStore = useNetworkStatusStore()
// const isOnline = ref(networkStatusStore.isOnline);
// const isServiceAvailable = ref(networkStatusStore.isServiceAvailable);

const isOnline = computed(() => networkStatusStore.isOnline)
const isServiceAvailable = computed(() => networkStatusStore.isServiceAvailable)

const updateOnlineStatus = () => {
  networkStatusStore.updateOnlineStatus()
  // isOnline.value = networkStatusStore.isOnline;
  // isServiceAvailable.value = networkStatusStore.isServiceAvailable;
}

// const checkServiceAvailability = () => {
//   networkStatusStore.checkServiceAvailability();
//   isServiceAvailable.value = networkStatusStore.isServiceAvailable;
// };

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  if (isOnline.value) {
    networkStatusStore.startCheckingService()
  }
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  networkStatusStore.stopCheckingService()
})
</script>

<style>
.network-status {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
