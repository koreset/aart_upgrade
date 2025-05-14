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
                          @click.stop="openMemberDialog(item)"
                        >
                          <v-icon left color="primary">mdi-upload</v-icon>
                          <span>Add Member</span>
                        </v-btn>
                        <v-btn
                          class="mr-3"
                          variant="outlined"
                          rounded
                          size="small"
                          @click.stop="openRemoveMemberDialog(item)"
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
    <v-row>
      <v-col>
        <file-upload-dialog
          :yearLabel="yearLabel"
          :isDialogOpen="isDialogOpen"
          :showModelPoint="showModelPoint"
          :mpLabel="mpLabel"
          :table="'undefined'"
          :uploadTitle="uploadTitle"
          :years="years"
          @upload="handleUpload"
          @update:isDialogOpen="updateDialog"
        />
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmAction" />
    <v-dialog v-model="addMemberDialog" persistent max-width="1024px">
      <base-card>
        <template #header>
          <span class="headline">Add Member</span>
        </template>
        <template #default>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="member.member_name"
                variant="outlined"
                density="compact"
                label="Member Name"
                placeholder="Enter member name"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-date-input
                v-model="member.date_of_birth"
                hide-actions
                locale="en-ZA"
                view-mode="month"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                variant="outlined"
                density="compact"
                label="Date of Birth"
                placeholder="Select a date"
              ></v-date-input>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="member.gender"
                variant="outlined"
                density="compact"
                placeholder="Choose a gender"
                label="Gender"
                :items="genderItems"
              ></v-select>
            </v-col>
            <v-col class="d-flex">
              <v-text-field
                v-model="member.member_id_number"
                class="mr-9"
                variant="outlined"
                density="compact"
                label="ID Number"
                placeholder="ID or Passport Number"
              ></v-text-field>
              <v-radio-group v-model="member.member_id_type" inline>
                <v-radio label="National ID" value="national_id"></v-radio>
                <v-radio label="Passport" value="passport"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="member.annual_salary"
                variant="outlined"
                density="compact"
                label="Annual Salary"
                type="number"
                placeholder="Enter Annual Salary"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="member.benefit_salary_multiple"
                variant="outlined"
                density="compact"
                label="Salary Multiple"
                type="number"
                placeholder="Enter Salary Multiple"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-date-input
                v-model="member.entry_date"
                hide-actions
                locale="en-ZA"
                view-mode="month"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                variant="outlined"
                density="compact"
                label="Entry Date"
                placeholder="Select a date"
              ></v-date-input>
            </v-col>
          </v-row>
        </template>
        <template #actions>
          <v-btn color="primary" @click="addMember">Add to Scheme</v-btn>
          <v-btn color="red" @click="addMemberDialog = false">Cancel</v-btn>
        </template>
      </base-card>
    </v-dialog>
    <v-dialog v-model="removeMemberDialog" persistent max-width="1024px">
      <base-card>
        <template #header>
          <span class="headline">Remove Member</span>
        </template>
        <template #default>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="selected"
                variant="outlined"
                density="compact"
                :items="items"
                :loading="loading"
                :search="search"
                label="Search"
                item-title="firstName"
                item-value="id"
                no-data-text="No results found"
                hide-no-data
                hide-selected
                return-object
                @update:model-value="displayUser"
                @update:search="onSearchUpdate"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="member.member_name"
                variant="outlined"
                density="compact"
                label="Member Name"
                placeholder="Enter member name"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-date-input
                v-model="member.date_of_birth"
                hide-actions
                locale="en-ZA"
                view-mode="month"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                variant="outlined"
                density="compact"
                label="Date of Birth"
                placeholder="Select a date"
              ></v-date-input>
            </v-col>
          </v-row>
        </template>
        <template #actions>
          <v-btn color="primary" @click="removeMember">Remove from Scheme</v-btn>
          <v-btn color="red" @click="removeMemberDialog = false">Cancel</v-btn>
        </template>
      </base-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GroupPricingService from '@/renderer/api/GroupPricingService'
// import formatValues from '@/renderer/utils/format_values'
import { formatValues, roundUpToTwoDecimalsAccounting } from '@/renderer/utils/format_values'

import _ from 'lodash'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import FileUploadDialog from '@/renderer/components/FileUploadDialog.vue'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import formatDateString from '@/renderer/utils/helpers.js'

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
const genderItems = ['Male', 'Female']

const showModelPoint = ref(false)
const yearLabel = ref('') // 'Select a year'
const uploadTitle = ref('')
const mpLabel = ref('')
const isDialogOpen = ref(false)
const addMemberDialog = ref(false)
const removeMemberDialog = ref(false)
const member = ref({
  member_name: '',
  member_id_number: '',
  member_id_type: '',
  annual_salary: 0,
  date_of_birth: null,
  entry_date: null,
  benefit_salary_multiple: 0,
  gender: '',
  scheme_id: 0,
  scheme_name: '',
  quote_id: 0
})
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k))
const updateDialog = (value: boolean) => {
  isDialogOpen.value = value
}

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
  return tables
})

const headers = computed(() => {
  const baseHeaders: any = [
    { title: 'Scheme Name', value: 'name' },
    { title: 'In Force', value: 'in_force' },
    {
      title: 'Annual Premium',
      key: 'annual_premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.annual_premium)
    },
    {
      title: 'Earned Premium',
      key: 'earned_premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.earned_premium)
    },

    { title: 'Broker', value: 'broker.name', key: 'broker', width: '20%' },
    { title: 'Type', value: 'quote.obligation_type' },
    { title: 'SGLA', value: 'quote.sgla_benefit' },
    { title: 'PHI', value: 'quote.phi_benefit' },
    { title: 'TTD', value: 'quote.ttd_benefit' },
    { title: 'PTD', value: 'quote.ptd_benefit' },
    { title: 'CI', value: 'quote.ci_benefit' },
    { title: 'Funeral', value: 'quote.family_funeral_benefit' },
    { title: 'Duration in Force', value: 'duration_in_force' },
    { title: 'New Business', value: 'new_business' },
    {
      title: 'Renewal Date',
      key: 'renewal_date',
      width: '20%',
      value: (item: any) => parseDateString(item.renewal_date)
    },
    { title: 'Member Count', value: 'member_count' },
    {
      title: 'Commission',
      key: 'commission',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.commission)
    },
    {
      title: 'Actual Claims',
      key: 'actual_claims',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.actual_claims)
    },
    {
      title: 'Expected Claims',
      key: 'expected_claims',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.expected_claims)
    },
    { title: 'Actual Claims Ratio', value: 'actual_claims_ratio' },
    { title: 'Expected Claims Ratio', value: 'expected_claims_ratio' },
    { title: 'Actual Loss Ratio', value: 'actual_loss_ratio' },
    { title: 'Expected Loss Ratio', value: 'expected_loss_ratio' },
    {
      title: 'Expected Expenses',
      key: 'expected_expenses',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.expected_expenses)
    },
    {
      title: 'GLA Annual Premium',
      key: 'gla_annual_premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.gla_annual_premium)
    },
    {
      title: 'SGLA Annual Premium',
      key: 'sgla_annual_premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.sgla_annual_premium)
    },
    {
      title: 'PTD Annual Premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.ptd_annual_premium),
      key: 'ptd_annual_premium'
    },
    {
      title: 'CI Annual Premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.ci_annual_premium),
      key: 'ci_annual_premium'
    },
    {
      title: 'PHI Annual Premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.phi_annual_premium),
      key: 'phi_annual_premium'
    },
    {
      title: 'TTD Annual Premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.ttd_annual_premium),
      key: 'phi_annual_premium'
    },
    {
      title: 'Funeral Annual Premium',
      value: (item: any) => roundUpToTwoDecimalsAccounting(item.funeral_annual_premium),
      key: 'funeral_annual_premium'
    },
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

const addMember = () => {
  member.value.scheme_id = scheme.value.id
  member.value.scheme_name = scheme.value.name
  member.value.quote_id = scheme.value.quote_id
  member.value.annual_salary = Number(member.value.annual_salary) || 0
  member.value.benefit_salary_multiple = Number(member.value.benefit_salary_multiple) || 0
  member.value.date_of_birth = member.value.date_of_birth
    ? formatDateString(member.value.date_of_birth, true, true, true)
    : null


  GroupPricingService.addMember(member.value)
    .then((res) => {

      snackbarText.value = 'Member added successfully'
      snackbar.value = true
      addMemberDialog.value = false
      member.value = {
        member_name: '',
        member_id_number: '',
        member_id_type: '',
        annual_salary: 0,
        date_of_birth: null,
        entry_date: null,
        benefit_salary_multiple: 0,
        gender: '',
        scheme_id: 0,
        scheme_name: '',
        quote_id: 0
      }
    })
    .catch((error) => {
      console.log('Error:', error)
      snackbarText.value = 'Failed to add member'
      snackbar.value = true
      addMemberDialog.value = false
    })
}

const removeMember = () => {
  GroupPricingService.removeMember(member.value)
    .then((res) => {
      snackbarText.value = 'Member removed successfully'
      snackbar.value = true
      removeMemberDialog.value = false
    })
    .catch((error) => {
      console.log('Error:', error)
      snackbarText.value = 'Failed to remove member'
      snackbar.value = true
      removeMemberDialog.value = false
    })
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

const openMemberDialog = (item: any) => {
  addMemberDialog.value = true
}

const openRemoveMemberDialog = (item: any) => {
  removeMemberDialog.value = true
}

const deleteTable = (item) => {
  console.log('Deleting table:', item)
}

onMounted(() => {
  GroupPricingService.getScheme(route.params.id).then((response) => {
    scheme.value = response.data
    schemes.value.push(scheme.value)
  })
})

const clearData = () => {
  tableData.value = []
  selectedTable.value = ''
}

const handleUpload = async (payload: any) => {
  // const formdata = new FormData()
  // formdata.append('file', payload.file)
  // formdata.append('quote_id', quote.value.id)
  // formdata.append('table_type', selectedTable.value.table_type)
  // GroupPricingService.uploadQuoteTable(formdata)
  //   .then((res) => {
  //     console.log('Response:', res.data)
  //     const count = res.data
  //     snackbarText.value = 'Upload Successful'
  //     snackbar.value = true
  //     if (selectedTable.value.table_type === 'Member Data') {
  //       quote.value.member_data_count = count
  //     } else if (selectedTable.value.table_type === 'Claims Experience') {
  //       quote.value.claims_experience_count = count
  //     } else if (selectedTable.value.table_type === 'Member Rating Results') {
  //       quote.value.member_rating_result_count = count
  //     } else if (selectedTable.value.table_type === 'Member Premium Schedules') {
  //       quote.value.member_premium_schedule_count = count
  //     }
  //   })
  //   .catch((error) => {
  //     console.log('Error:', error)
  //     snackbarText.value = 'Upload Failed'
  //     snackbar.value = true
  //   })
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

/// test code
// State
const selected = ref(null)
const search = ref('')
const items = ref<any[]>([])
const loading = ref(false)
let searchTimeout: any = null

// Watch search input and debounce API call
const onSearchUpdate = (val: string) => {
  search.value = val
  if (searchTimeout) clearTimeout(searchTimeout)

  // Debounce API call
  searchTimeout = setTimeout(() => {
    fetchItems(val)
  }, 500)
}

// Simulated API call
const fetchItems = async (query: string) => {
  if (!query) {
    items.value = []
    return
  }

  loading.value = true
  try {
    // Replace this with your actual API call
    const response = await fetch(`https://dummyjson.com/users/search?q=${query}`)
    const result = await response.json()
    items.value = result.users || []
  } catch (err) {
    console.error('Error fetching items:', err)
    items.value = []
  } finally {
    loading.value = false
  }
}

const displayUser = (val: any) => {
  // if (val) {
  //   member.value.member_name = val.firstName + ' ' + val.lastName
  //   member.value.date_of_birth = val.dateOfBirth
  // }
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
