<script setup lang="tsx">
import { DefaultLayout } from '@/renderer/components/layout'
import { useAppStore } from '@/renderer/store/app'
import { onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductService from '@/renderer/api/ProductService'

const router = useRouter()
const appStore = useAppStore()
const licenseUrl = import.meta.env.VITE_APP_LICENSE_SERVER

const getEntitlements = async (licenseId) => {
  console.log('Fetching entitlements for license ID:', licenseId)
  if (!licenseId) {
    console.error('License ID is required to fetch entitlements.')
    return
  }
  const validation = await fetch(licenseUrl + '/licenses/' + licenseId + '/get-entitlements', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  const rs = await validation.json()
  console.log('Entitlements response', rs)
  const entitlementList: any = []
  if (rs && rs.data && rs.data.length > 0) {
    rs.data.forEach((entitlement: any) => {
      entitlementList.push(entitlement.attributes.name)
    })
  }

  appStore.setEntitlements(entitlementList)
}

onBeforeMount(() => {
  window.mainApi?.send('msgResizeWindow', 1024, 600, true)
})

onMounted(async () => {
  const response = await ProductService.getProducts()
  appStore.setProducts(response.data)

  const result = await window.mainApi?.sendSync('msgGetUserLicense')
  if (result) {
    appStore.setLicense(result)
  }

  await getEntitlements(result.data.id)

  const entitlements: any = appStore.entitlements
  if (entitlements && entitlements.length > 0) {
    if (entitlements.includes('dashboard') || entitlements.includes('all-features')) {
      await router.push('/')
    } else if (entitlements.includes('group-pricing-dashboard')) {
      await router.push('/group-pricing/dashboard')
    } else {
      // fallback or unauthorized
      await router.push({ name: entitlements[0] })
      // await router.push('/no-entitlements')
    }
  } else {
    await router.push('/no-entitlements')
  }
})
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
  white-space: nowrap;
}

.v-table {
  border: 1px solid rgb(208, 207, 207);
}

.v-toolbar {
  height: 48px !important;
}
.v-expansion-panel--active > .v-expansion-panel-title {
  background-color: rgba(97, 136, 162, 0.7) !important;
  color: white !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  min-height: 50px !important;
}
</style>
