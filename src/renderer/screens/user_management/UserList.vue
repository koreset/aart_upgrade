<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">User Management</span>
          </template>
          <template #default>
            <data-grid v-if="rowData.length > 0" :column-defs="columnDefs" :row-data="rowData" />
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
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/helpers.js'

const appStore = useAppStore()
const columnDefs: any = ref([])
const rowData: any = ref([])

const orgUsers: any = ref([])

onMounted(async () => {
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
</script>
<style lang="css" scoped></style>
