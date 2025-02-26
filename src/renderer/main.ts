import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/renderer/App.vue'
import AppLogin from '@/renderer/AppLogin.vue'
import AppSetup from '@/renderer/AppSetup.vue'
import LicenseWindow from '@/renderer/LicenseWindow.vue'
import router from '@/renderer/router'
import vuetify from '@/renderer/plugins/vuetify'
import i18n from '@/renderer/plugins/i18n'
import Vuelidate from 'vuelidate'
import { LicenseManager } from 'ag-grid-enterprise'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

LicenseManager.setLicenseKey(
  'DownloadDevTools_COM_NDEwMjM0NTgwMDAwMA==59158b5225400879a12a96634544f5b6'
)

// Add API key defined in contextBridge to window object type
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
    node?: any
  }
}

window.node?.setImmediate(() => {
  console.log('setImmediate is working!')
})

// save the license server url to the store. temp fix for now. This should be done in setup.
window.mainApi?.sendSync('msgSetLicenseServerUrl', import.meta.env.VITE_APP_LICENSE_SERVER)

const activated = window.mainApi?.sendSync('msgGetAppStatus')

let activeApp: any

if (activated) {
  const validLicense = window.mainApi?.sendSync('msgCheckLicenseValidity')

  switch (validLicense) {
    case 'VALID':
      activeApp = App
      break
    case 'SUSPENDED':
      activeApp = LicenseWindow
      break
    case 'EXPIRED':
      activeApp = LicenseWindow
      break
    case 'OVERDUE':
      // We need to execute a check in the background to see if the license is still valid
      activeApp = LicenseWindow
      break

    default:
      activeApp = LicenseWindow
  }

  if (activeApp === App) {
    const authenticatedUser = window.mainApi?.sendSync('msgGetAuthenticatedUser')
    if (authenticatedUser) {
      activeApp = App
    } else {
      activeApp = AppLogin
    }
  }
} else {
  activeApp = AppSetup
}

const app = createApp(activeApp)

const comps = import.meta.glob('./components/**/*.vue')
for (const path in comps) {
  let name = upperFirst(camelCase(path.replace(/^\.\//, '').replace(/\.\w+$/, '')))
  name = name
    .replace(/Components/g, '')
    .replace(/^\.\//, '')
    .replace(/\.\w+$/, '')
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .replace(/^-/, '')
    .toLowerCase()
  app.component(name, comps[path])
}

app.use(vuetify).use(Vuelidate).use(i18n).use(router).use(createPinia())

app.mount('#app')
