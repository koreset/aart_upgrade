import { defineStore } from 'pinia'

export const useFlashStore = defineStore('flash', {
  state: () => ({
    message: '' as string,
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    visible: false
  }),
  actions: {
    setMessage(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
      console.log('[Flash] setMessage:', message)

      this.message = message
      this.type = type
      this.visible = true
      setTimeout(() => this.clear(), 4000)
    },
    clear() {
      this.message = ''
      this.visible = false
    }
  }
})
