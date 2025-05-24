<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Roles Management</span>
          </template>
          <template #default>
            <v-row>
              <v-col>
                <v-btn color="primary" size="small" rounded @click="addRole = true"
                  >Add a Role</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="addRole">
              <v-col>
                <v-form>
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                        v-model="roleName"
                        label="Role Name"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="roleDescription"
                        label="Description"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-select
                        v-model="selectedPermissions"
                        :items="permissions"
                        item-title="name"
                        item-value="slug"
                        label="Select Permissions"
                        multiple
                        chips
                        variant="outlined"
                        density="compact"
                        return-object
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn color="primary" size="small" rounded @click="saveRole">Save</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="table-col text-left">Role Name</th>
                      <th class="table-col text-left">Description</th>
                      <th class="table-col text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="role in userRoles" :key="role.role_name">
                      <td>{{ role.role_name }}</td>
                      <td>
                        {{ role.description }}
                      </td>
                      <td class="text-right">
                        <v-btn size="small" variant="text" @click="viewPermissions(role)">
                          View Permissions
                        </v-btn>
                        <v-btn size="small" variant="text" @click="assignPermissions(role)">
                          Assign Permissions
                        </v-btn>
                        <v-btn size="small" variant="text"> Remove Permissions </v-btn>
                        <v-btn size="small" variant="text" icon @click="deleteRole(role)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-if="rolePermissions.length > 0">
              <v-col>
                <v-table>
                  <thead>
                    <tr class="table-row">
                      <th class="table-col text-left">Permission Name</th>
                      <th class="table-col text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="permission in rolePermissions" :key="permission.slug">
                      <td>{{ permission.name }}</td>
                      <td>{{ permission.description }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="table-row">
                      <td colspan="2" class="text-center">
                        <v-btn size="small" variant="text" @click="closeTable">Close</v-btn>
                      </td>
                    </tr>
                  </tfoot>
                </v-table>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'

const snackbar = ref(false)
const snackbarMessage = ref('')
const timeout = ref(3000)

const addRole = ref(false)
const roleName = ref('')
const roleDescription = ref('')
const permissions: any = ref([])
const selectedPermissions: any = ref([])
const rolePermissions: any = ref([])

const userRoles: any = ref([
  { role_name: 'Admin', description: 'Administrator role with full access' },
  { role_name: 'User', description: 'Standard user role with limited access' }
])

onMounted(() => {
  // Fetch roles from the API
  fetchRoles()
  fetchPermissions()
})

const closeTable = () => {
  rolePermissions.value = []
}

const assignPermissions = (role) => {
  // Logic to assign permissions to the selected role
  console.log('Assigning permissions')
  selectedPermissions.value = role.permissions
  roleName.value = role.role_name
  roleDescription.value = role.description
  addRole.value = true
}

const fetchRoles = async () => {
  try {
    const response = await GroupPricingService.getUserRoles()
    if (response.status !== 200) {
      throw new Error('Network response was not ok')
    }
    userRoles.value = response.data
    console.log(userRoles.value)
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const fetchPermissions = async () => {
  try {
    const response = await GroupPricingService.getPermissions()
    if (response.status !== 200) {
      throw new Error('Network response was not ok')
    }
    permissions.value = response.data
    console.log(permissions.value)
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

const saveRole = async () => {
  try {
    const response = await GroupPricingService.createUserRole({
      role_name: roleName.value,
      description: roleDescription.value,
      permissions: selectedPermissions.value
    })

    console.log('Save response:', response)

    const newRole = {
      role_name: roleName.value,
      description: roleDescription.value,
      permissions: selectedPermissions.value
    }

    userRoles.value.push(newRole)
    addRole.value = false
    roleName.value = ''
    roleDescription.value = ''
    selectedPermissions.value = []
  } catch (error) {
    console.error('Error saving role:', error)
  }
}

const deleteRole = async (role: any) => {
  try {
    const response = await GroupPricingService.deleteUserRole(role.id)
    console.log('Delete response:', response)
    if (response.status !== 200) {
      throw new Error('Network response was not ok')
    }
    userRoles.value = userRoles.value.filter((r: any) => r.id !== role.id)
  } catch (error) {
    console.error('Error deleting role:', error)
    snackbarMessage.value = 'cannot delete a role that is in use'
    snackbar.value = true
  }
}

const viewPermissions = (role: any) => {
  // Logic to view permissions for the selected role
  console.log('View permissions for role:', role)
  GroupPricingService.getRolePermissions(role.id)
    .then((response) => {
      // if (response.status !== 200) {
      //   throw new Error('Network response was not ok')
      // }
      console.log('Permissions for role:', response.data)
      rolePermissions.value = response.data
    })
    .catch((error) => {
      console.error('Error fetching permissions:', error)
    })
}
</script>
<style lang="css" scoped></style>
