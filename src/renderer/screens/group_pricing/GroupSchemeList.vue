<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="true">
          <template #header>
            <span class="headline">Group Pricing Schemes In Force</span>
          </template>
          <template #default>
            <!-- <v-row class="mt-9 mx-5">
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
            </v-row> -->
            <!-- <v-row v-if="selectedScheme.length > 0">
              <v-col class="d-flex justify-end">
                <v-btn icon size="small" variant="plain" color="primary" @click="editScheme(null)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="plain" size="small" color="error">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-tooltip>
                  <template #activator="{ props }">
                    <v-btn icon color="primary" variant="plain" size="small" v-bind="props">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>View Item</span>
                </v-tooltip>
                <v-tooltip>
                  <template #activator="{ props }">
                    <v-btn icon color="primary" variant="plain" size="small" v-bind="props">
                      <v-icon>mdi-file-eye-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Submit for Review</span>
                </v-tooltip>
                <v-tooltip>
                  <template #activator="{ props }">
                    <v-btn icon color="primary" variant="plain" size="small" v-bind="props">
                      <v-icon>mdi-file-send-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Generate Quote</span>
                </v-tooltip>
              </v-col>
            </v-row> -->
            <v-row v-if="schemes">
              <v-col>
                <v-data-table
                  v-model:model-value="selectedScheme"
                  show-select
                  select-strategy="single"
                  class="table-row"
                  density="compact"
                  :headers="headers"
                  :items="schemes"
                  :search="search"
                  return-object
                >
                  <!-- Slot for Actions Column -->
                  <template #[`item.actions`]="{ item }: { item: any }">
                    <v-btn
                      v-if="selectedScheme[0].id === item.id"
                      icon
                      size="small"
                      variant="plain"
                      color="primary"
                      @click="editScheme(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="selectedScheme[0].id === item.id"
                      icon
                      variant="plain"
                      size="small"
                      color="error"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-tooltip>
                      <template #activator="{ props }">
                        <v-btn
                          v-if="selectedScheme[0].id === item.id"
                          icon
                          color="primary"
                          variant="plain"
                          size="small"
                          v-bind="props"
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span>View Item</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
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
import { computed, onMounted, ref } from 'vue'
import ConfirmationDialog from '../../components/ConfirmDialog.vue'
import GroupPricingService from '../../api/GroupPricingService'
import formatValues from '@/renderer/utils/format_values'

const confirmDialog = ref()
// const schemeName: any = ref('')
const schemes: any = ref([])
const selectedScheme: any = ref([])

const columnDefs: any = ref([])
const rowData = ref([])
const search = ref('')

const headers = computed(() => {
  const baseHeaders: any = [
    { title: 'Scheme Name', value: 'name' },
    { title: 'In Force', value: 'in_force' },
    { title: 'Annual Premium', value: 'annual_premium' },
    { title: 'Duration in Force', value: 'duration_in_force' },
    {
      title: 'Renewal Date',
      key: 'renewal_date',
      width: '20%',
      value: (item: any) => parseDateString(item.renewal_date)
    },
    { title: 'Member Count', value: 'member_count' },
    { title: 'Earned Premium', value: 'earned_premium' }
  ]

  if (selectedScheme.value.length > 0) {
    baseHeaders.unshift({ title: 'Actions', value: 'actions', align: 'center', sortable: false })
  }

  return baseHeaders
})
// [
// { title: 'Scheme Name', value: 'name', key: 'name' },
// { title: 'In Force', value: 'in_force', key: 'in_force' },
// { title: 'Annual Premium', value: 'annual_premium', key: 'annual_premium' },
// { title: 'Duration in Force', value: 'duration_in_force' },
// {
//   title: 'Renewal Date',
//   key: 'renewal_date',
//   width: '20%',
//   value: (item: any) => parseDateString(item.renewal_date)
// },
// { title: 'Member Count', value: 'member_count' },
// { title: 'Earned Premium', value: 'earned_premium' }
// { title: 'PTD', value: 'ptd_benefit' },
// { title: 'CI', value: 'ci_benefit' },
// { title: 'Funeral', value: 'family_funeral_benefit' },
// { title: 'Basis', value: 'basis' },
// { title: 'Status', value: 'status' },

// { title: 'Submitted By', value: 'created_by' },
// { title: 'Reviewer', value: 'reviewer' },
// { title: 'Actions', value: 'actions', align: 'center' as 'center', sortable: false }
// ]

console.log('headers:', headers)

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

// const createScheme = () => {
//   console.log('Creating Portfolio')
//   const schemPayload = {
//     name: schemeName.value
//   }
//   GroupPricingService.createScheme(schemPayload).then((res) => {
//     schemes.value.push(res.data)
//     schemeName.value = null
//   })
// }

// const deleteBroker = async (id: number) => {
//   console.log('Deleting Portfolio', id)
// }

const editScheme = (item) => {
  console.log('editing:', item)
}

onMounted(() => {
  GroupPricingService.getSchemesInforce().then((res) => {
    if (res.data.length > 0) {
      rowData.value = res.data
      schemes.value = res.data
      console.log('schemes:', res.data)
      createColumnDefs(res.data)
    } else {
      schemes.value = []
    }
  })
})

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

<style scoped>
.table-row {
  white-space: nowrap;
}

::v-deep(.v-data-table thead th) {
  background-color: #223f54 !important;
  color: white;
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  min-width: 150px;
}

.search-box {
  width: 100%;
}
.v-table__wrapper > table > thead {
  background-color: #223f54 !important;
  color: white;
  white-space: nowrap;
}
</style>
