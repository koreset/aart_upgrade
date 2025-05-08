import { defineStore } from 'pinia'

export const useGroupUserPermissionsStore = defineStore('group_user_permissions', {
  state: () => ({
    permissions: {}
  }),
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions
    },
    hasPermission(permission) {
      return this.permissions[permission] || false
    }
  }
})
