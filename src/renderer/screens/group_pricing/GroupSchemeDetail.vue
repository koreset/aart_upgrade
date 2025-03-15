<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card v-if="scheme" :show-actions="false">
          <template #header>
            <span class="headline">{{ scheme.name }}</span>
          </template>
          <template #default>
            <v-row class="mb-n5">
              <v-col>
                <v-btn variant="plain" @click="goBack">{{ backText }}</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  class="table-row"
                  density="compact"
                  :headers="headers"
                  :items="schemes"
                  hide-default-footer
                >
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-table>
                  <tbody>
                    <tr v-for="item in relatedTables" :key="item.table_type">
                      <td :class="{ unpopulated: !item.populated }" style="width: 25%">{{
                        item.table_type
                      }}</td>
                      <td style="text-align: right">
                        <v-btn
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="viewTable(item)"
                        >
                          <v-icon left color="primary">mdi-information</v-icon>
                          <span>Info</span>
                        </v-btn>

                        <v-btn
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="openDialog(item)"
                        >
                          <v-icon left color="primary">mdi-upload</v-icon>
                          <span>Upload</span>
                        </v-btn>
                        <v-btn
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="openDialog(item)"
                        >
                          <v-icon left color="primary">mdi-upload</v-icon>
                          <span>Add Member</span>
                        </v-btn>
                        <v-btn
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="openDialog(item)"
                        >
                          <v-icon left color="primary">mdi-upload</v-icon>
                          <span>Remove Member</span>
                        </v-btn>

                        <v-btn
                          variant="outlined"
                          rounded
                          color="red"
                          size="small"
                          @click.stop="deleteTable(item)"
                        >
                          <v-icon left color="red">mdi-delete</v-icon>
                          <span>Delete</span>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-if="tableData.length > 0 && !loadingData">
              <v-col>
                <data-grid
                  :columnDefs="columnDefs"
                  :show-close-button="true"
                  :rowData="tableData"
                  :table-title="selectedTable"
                  :pagination="true"
                  :rowCount="rowCount"
                  @update:clear-data="clearData"
                />
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import formatValues from '@/renderer/utils/format_values'
import _ from 'lodash'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'

const backText = ref('< Back to listing')
const route = useRoute()
const router = useRouter()
const scheme: any = ref(null)
const schemes: any = ref([])
const tableData: any = ref([])
const selectedTable = ref('')
const loadingData = ref(false)
const rowCount = ref(0)
const columnDefs: any = ref([])

const snackbar = ref(false)
const timeout = 2000
const snackbarText = ref('')

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

const relatedTables = computed(() => {
  const tables: any = []
  tables.push({ table_type: 'Member Data', value: 'member_data', populated: true })
  tables.push({ table_type: 'Claims Experience', value: 'claims_experience', populated: true })

  return tables
})

const headers = computed(() => {
  const baseHeaders: any = [
    { title: 'Scheme Name', value: 'name' },
    { title: 'In Force', value: 'in_force' },
    { title: 'Annual Premium', value: 'annual_premium' },
    { title: 'Earned Premium', value: 'earned_premium' },
    { title: 'Duration in Force', value: 'duration_in_force' },
    { title: 'New Business', value: 'new_business' },
    {
      title: 'Renewal Date',
      key: 'renewal_date',
      width: '20%',
      value: (item: any) => parseDateString(item.renewal_date)
    },
    { title: 'Member Count', value: 'member_count' },
    { title: 'Commission', value: 'commission' },
    { title: 'Actual Claims', value: 'actual_claims' },
    { title: 'Expected Claims', value: 'expected_claims' },
    { title: 'Actual Claims Ratio', value: 'actual_claims_ratio' },
    { title: 'Expected Claims Ratio', value: 'expected_claims_ratio' },
    { title: 'Actual Loss Ratio', value: 'actual_loss_ratio' },
    { title: 'Expected Loss Ratio', value: 'expected_loss_ratio' },
    { title: 'Expected Expenses', value: 'expected_expenses' },
    { title: 'GLA Annual Premium', value: 'gla_annual_premium' },
    { title: 'SGLA Annual Premium', value: 'sgla_annual_premium' },
    { title: 'PTD Annual Premium', value: 'ptd_annual_premium' },
    { title: 'CI Annual Premium', value: 'ci_annual_premium' },
    { title: 'PHI Annual Premium', value: 'phi_annual_premium' },
    { title: 'TTD Annual Premium', value: 'ttd_annual_premium' },
    { title: 'Funeral Annual Premium', value: 'funeral_annual_premium' },
    { title: 'Contact Person', value: 'contact_person' },
    { title: 'Email', value: 'contact_email' },
    { title: 'Created By', value: 'created_by' },
    {
      title: 'Creation Date',
      key: 'creation_date',
      width: '20%',
      value: (item: any) => parseDateString(item.renewal_date)
    }
  ]

  return baseHeaders
})

const goBack = () => {
  router.go(-1)
}

const viewTable = async (item) => {
  try {
    const res = await GroupPricingService.getInforceDataTable(scheme.value.id, item.value)
    if (res.data.data !== null && res.data.data.length > 0) {
      const orderedData = res.data.data.map((item) =>
        _.fromPairs(res.data.json_tags.map((key) => [key, item[key]]))
      )

      tableData.value = orderedData
      selectedTable.value = item.table_type
      createColumnDefs(orderedData)
    } else {
      tableData.value = []
      selectedTable.value = ''
      snackbarText.value = 'No data found for this table'
      snackbar.value = true
    }
  } catch (error) {
    console.log('Error:', error)
  }
}

const openDialog = (item) => {
  console.log('Opening dialog:', item)
}

const deleteTable = (item) => {
  console.log('Deleting table:', item)
}

onMounted(() => {
  console.log(route.params.id)
  GroupPricingService.getScheme(route.params.id).then((response) => {
    scheme.value = response.data
    console.log(scheme)
    schemes.value.push(scheme.value)
  })
})

const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
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
