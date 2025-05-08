<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">User Management</span>
          </template>
          <template #default>
            <v-row>
              <v-col>
                <v-table class="trans-tables">
                  <thead>
                    <tr class="table-row">
                      <th class="table-col text-left">Name</th>
                      <th class="table-col text-left">Email</th>
                      <th class="table-col text-left">Role</th>
                      <th class="table-col text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in orgUsers" :key="user">
                      <td>{{ user.name }}</td>
                      <td>
                        {{ user.email }}
                      </td>
                      <td>
                        {{ user.gp_role }}
                      </td>
                      <td class="text-right">
                        <v-btn size="small" variant="text" @click="assignRole(user)">
                          Assign Role
                        </v-btn>
                        <v-btn size="small" variant="text" @click="removeRole(user)">
                          Remove Role
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-dialog v-model="dialog" max-width="400px">
                  <v-card>
                    <v-card-title>Select Role</v-card-title>
                    <v-card-text>
                      <v-select
                        v-model="selectedRole"
                        :items="availableRoles"
                        item-title="role_name"
                        item-value="role_name"
                        label="Choose a role"
                        variant="outlined"
                        density="compact"
                        return-object
                      ></v-select>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
                      <v-btn variant="text" @click="applyRoleChange">Apply</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <v-dialog></v-dialog>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/renderer/store/app'
import ProductService from '@/renderer/api/ProductService'
import formatValues from '@/renderer/utils/helpers.js'
import GroupPricingService from '@/renderer/api/GroupPricingService'

const appStore = useAppStore()
const columnDefs: any = ref([])
const rowData: any = ref([])
const selectedRole: any = ref(null)
const selectedUser: any = ref(null)
const availableRoles: any = ref([
  { role_name: 'Admin', slug: 'admin' },
  { role_name: 'User', slug: 'user' },
  { role_name: 'Viewer', slug: 'viewer' }
])
const orgUsers: any = ref([])

const dialog = ref(false)

const applyRoleChange = async () => {
  console.log('Selected Role:', selectedRole.value)
  console.log('Selected User:', selectedUser.value)
  // call api to update the user role
  // updateRole(user)
  // update the user role in the orgUsers array
  const user = orgUsers.value.find((user) => user.id === selectedUser.value.id)
  console.log('User found:', user)
  if (user) {
    user.gp_role = selectedRole.value.role_name
    user.gp_role_id = selectedRole.value.id
    GroupPricingService.updateUserRole(user)
      .then((response) => {
        console.log('Response:', response)
        if (response.status !== 201) {
          throw new Error('Network response was not ok')
        }
        console.log('Role updated successfully:', response.data)
      })
      .catch((error) => {
        console.error('Error updating role:', error)
      })
  }
  console.log('Updated User:', user)

  dialog.value = false
}

const assignRole = (user) => {
  console.log('Assigning role to user:', user)
  selectedRole.value = user.gp_role
  selectedUser.value = user
  dialog.value = true
}

const removeRole = (user) => {
  console.log('Removing role from user:', user)
  GroupPricingService.removeUserRole(user)
    .then((response) => {
      console.log('Response:', response)
      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }
      console.log('Role removed successfully:', response.data)
    })
    .catch((error) => {
      console.error('Error removing role:', error)
    })
}

onMounted(async () => {
  const res = await GroupPricingService.getUserRoles()
  console.log('User Roles:', res.data)
  availableRoles.value = res.data

  console.log(appStore)
  const testData = appStore.getOrganization()

  console.log('Organization:', testData)
  try {
    const result = await ProductService.getOrgUsers({ name: 'AART' })
    orgUsers.value = result.data
    console.log('Org Users', orgUsers.value)
    rowData.value = orgUsers.value
    createColumnDefs(rowData.value)
  } catch (error) {
    console.log('Error:', error)
  }
})

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 220
    header.filter = true
    header.resizable = true
    header.sortable = true
    columnDefs.value.push(header)
  })
}

// const updateRole = async (user) => {
//   console.log('Selected Role:', selectedRole.value)
//   console.log('User:', user)
//   // try {
//   //   const response = await ProductService.updateUserRole(user.id, selectedRole.value)
//   //   if (response.status !== 200) {
//   //     throw new Error('Network response was not ok')
//   //   }
//   //   console.log('Role updated successfully:', response.data)
//   // } catch (error) {
//   //   console.error('Error updating role:', error)
//   // }
// }
</script>
<style lang="css" scoped></style>
