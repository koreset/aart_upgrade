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
                        <v-btn size="small" variant="text"> Assign Role </v-btn>
                        <v-select
                          v-model="selectedRole"
                          variant="outlined"
                          density="compact"
                          :items="availableRoles"
                          item-title="role_name"
                          item-value="role_name"
                          return-object
                          @update:model-value="updateRole(user)"
                        ></v-select>
                        <v-btn size="small" variant="text"> Remove Role </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
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

const appStore = useAppStore()
const columnDefs: any = ref([])
const rowData: any = ref([])
const selectedRole: any = ref(null)
const availableRoles: any = ref([
  { role_name: 'Admin', slug: 'admin' },
  { role_name: 'User', slug: 'user' },
  { role_name: 'Viewer', slug: 'viewer' }
])
const orgUsers: any = ref([])

onMounted(async () => {
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

const updateRole = async (user) => {
  console.log('Selected Role:', selectedRole.value)
  console.log('User:', user)
  // try {
  //   const response = await ProductService.updateUserRole(user.id, selectedRole.value)
  //   if (response.status !== 200) {
  //     throw new Error('Network response was not ok')
  //   }
  //   console.log('Role updated successfully:', response.data)
  // } catch (error) {
  //   console.error('Error updating role:', error)
  // }
}
</script>
<style lang="css" scoped></style>
