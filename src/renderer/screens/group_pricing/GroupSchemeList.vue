<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="true">
          <template #header>
            <span class="headline">Group Pricing Schemes In Force</span>
          </template>
          <template #default>
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
                    <v-tooltip>
                      <template #activator="{ props }">
                        <v-btn
                          v-if="selectedScheme[0].id === item.id"
                          icon
                          size="small"
                          variant="plain"
                          color="primary"
                          v-bind="props"
                          @click="editScheme(item)"
                        >
                          <v-icon>mdi-wrench</v-icon>
                        </v-btn>
                      </template>
                      <span>Maintain Scheme</span>
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
import { formatValues, roundUpToTwoDecimalsAccounting } from '@/renderer/utils/format_values'
import { useRouter } from 'vue-router'

const router = useRouter()
const confirmDialog = ref()
const schemes: any = ref([])
const selectedScheme: any = ref([])

const columnDefs: any = ref([])
const rowData = ref([])
const search = ref('')

const headers = computed(() => {
  const baseHeaders: any = [
    { title: 'Scheme Name', value: 'name' },
    { title: 'In Force', value: 'in_force' },
    {
      title: 'Annual Premium',
      key: 'annual_premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.annual_premium)
    },
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

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

// const createScheme = () => {
//   const schemPayload = {
//     name: schemeName.value
//   }
//   GroupPricingService.createScheme(schemPayload).then((res) => {
//     schemes.value.push(res.data)
//     schemeName.value = null
//   })
// }

// const deleteBroker = async (id: number) => {
// }

const editScheme = (item) => {
  router.push({ name: 'group-pricing-schemes-detail', params: { id: item.id } })
}

onMounted(() => {
  GroupPricingService.getSchemesInforce().then((res) => {
    if (res.data.length > 0) {
      rowData.value = res.data
      schemes.value = res.data
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
