import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    licenseData: null
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    setLicense(licenseData: any) {
      this.licenseData = licenseData
    },
    clearUser() {
      this.user = null
    },
    clearLicenseData() {
      this.licenseData = null
    },
    clearAll() {
      this.user = null
      this.licenseData = null
    }
  },
  getters: {
    getUser: (state): any => state.user,
    getLicenseData: (state): any => state.licenseData
  }
})
