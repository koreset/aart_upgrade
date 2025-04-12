import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    licenseData: null,
    organization: null,
    entitlements: [],
    allProducts: []
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    setLicense(licenseData: any) {
      this.licenseData = licenseData
    },
    setEntitlements(entitlements: any) {
      this.entitlements = entitlements
    },
    getEntitlements() {
      return this.entitlements
    },
    clearEntitlement() {
      this.entitlements = []
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
    },
    setProducts(products: any) {
      this.allProducts = products
    }
  },
  getters: {
    getUser: (state): any => state.user,
    getLicenseData: (state): any => state.licenseData,
    getAllProducts: (state): any => state.allProducts
  }
})
