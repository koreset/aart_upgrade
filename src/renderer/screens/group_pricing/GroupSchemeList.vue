<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="true">
          <template #header>
            <span class="headline">Group Pricing Schemes</span>
          </template>
          <template #default>
            <v-row class="mt-9 mx-5">
              <v-col cols="3">
                <v-text-field
                  v-model="schemeName"
                  class="mr-9"
                  placeholder="Scheme Name"
                  label="Scheme Name"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex align-baseline" cols="3">
                <v-btn
                  rounded
                  class="primary mt-1"
                  size="small"
                  variant="outlined"
                  @click="createScheme"
                  >Add Group Scheme</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="rowData.length > 0" class="mx-5">
              <v-col>
                <base-card :showActions="false">
                  <template #header>
                    <span class="headline">Scheme List</span>
                  </template>
                  <template #default>
                    <v-row>
                      <v-col>
                        <data-grid
                          :columnDefs="columnDefs"
                          :show-close-button="true"
                          :rowData="rowData"
                          :table-title="selectedTable"
                          :pagination="true"
                          @update:clear-data="clearData"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </base-card>
              </v-col>
            </v-row>
          </template>
          <template #actions> </template>
        </base-card>
      </v-col>
    </v-row>
    <confirmation-dialog ref="confirmDialog"></confirmation-dialog>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../../components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import ConfirmationDialog from '../../components/ConfirmDialog.vue'
import GroupPricingService from '../../api/GroupPricingService'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/format_values'

const confirmDialog = ref()
const schemeName: any = ref('')
const schemes: any = ref([])
const selectedTable = ref('Group Schemes In Force')

const columnDefs: any = ref([])
const rowData = ref([])

const createScheme = () => {
  console.log('Creating Portfolio')
  const schemPayload = {
    name: schemeName.value
  }
  GroupPricingService.createScheme(schemPayload).then((res) => {
    schemes.value.push(res.data)
    schemeName.value = null
  })
}

// const deleteBroker = async (id: number) => {
//   console.log('Deleting Portfolio', id)
// }

onMounted(() => {
  GroupPricingService.getSchemesInforce().then((res) => {
    if (res.data.length > 0) {
      rowData.value = res.data
      console.log(res.data)
      createColumnDefs(res.data)
    } else {
      schemes.value = []
    }
  })
})

const clearData = () => {
  rowData.value = []
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    header.sortable = true
    header.filter = true
    header.resizable = true
    columnDefs.value.push(header)
  })
}
</script>

<style scoped></style>
