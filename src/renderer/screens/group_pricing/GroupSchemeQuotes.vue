<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Quote List</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  class="search-box mb-2"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  single-line
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-btn class="mt-1" color="primary" size="small" rounded @click="goToQuoteCreation"
                  >New Quote</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  class="table-row"
                  density="compact"
                  :headers="headers"
                  :items="quotes"
                  :search="search"
                >
                  <!-- Slot for Status-->
                  <template #[`item.status`]="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      text-color="white"
                      small
                      class="ma-1"
                      variant="flat"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <!-- Slot for Actions Column -->
                  <template #[`item.actions`]="{ item }">
                    <v-btn
                      icon
                      size="small"
                      variant="plain"
                      color="primary"
                      @click="editItem(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="plain"
                      size="small"
                      color="error"
                      @click="deleteItem(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-tooltip>
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          color="primary"
                          variant="plain"
                          size="small"
                          v-bind="props"
                          @click="viewItem(item)"
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span>View Item</span>
                    </v-tooltip>
                    <v-tooltip>
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          color="primary"
                          variant="plain"
                          size="small"
                          v-bind="props"
                          @click="submitReview(item)"
                        >
                          <v-icon>mdi-file-eye-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Submit for Review</span>
                    </v-tooltip>
                    <v-tooltip>
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          color="primary"
                          variant="plain"
                          size="small"
                          v-bind="props"
                          @click="submitQuoteGeneration(item)"
                        >
                          <v-icon>mdi-file-send-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Generate Quote</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="400">
      <base-card>
        <template #header>
          <span class="headline">Submit for Review</span>
        </template>
        <template #default>
          <!-- Select Field -->
          <v-select
            v-model="selectedReviewer"
            variant="outlined"
            density="compact"
            :items="reviewers"
            item-title="name"
            item-value="name"
            label="Select Reviewer"
            return-object
          ></v-select>
        </template>
        <template #actions>
          <!-- Cancel Button -->
          <v-btn variant="plain" @click="dialog = false">Cancel</v-btn>
          <!-- Ok Button -->
          <v-btn color="primary" @click="submitForReview">Ok</v-btn>
        </template>
      </base-card>
    </v-dialog>
    <confirm-dialog ref="confirmDeleteDialog"></confirm-dialog>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import { useAppStore } from '@/renderer/store/app'
import { useRouter } from 'vue-router'
import { onMounted, ref, watchEffect } from 'vue'
import ProductService from '@/renderer/api/ProductService'
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import ConfirmDialog from '@/renderer/components/ConfirmDialog.vue'

interface Quote {
  id: number
  scheme_name: string
  quote_type: string
  commencement_date: string
  basis: string
  status: string
  quote_broker: { name: string }
  obligation_type: string
  sgla_benefit: number
  phi_benefit: number
  ttd_benefit: number
  ptd_benefit: number
  ci_benefit: number
  family_funeral_benefit: number
  creation_date: string
  created_by: string
  reviewer: string
}

const confirmDeleteDialog = ref()
const groupStore = useGroupPricingStore()
const router = useRouter()
const appStore = useAppStore()
const quotes = ref<Quote[]>([])
const search = ref('')
const selectedReviewer: any = ref(null)
const reviewers: any = ref([])
const dialog = ref(false)
const selectedQuote: any = ref({})
const organization: any = ref(null)
const benefitMaps: any = ref([])

const headers = ref([
  { title: 'Actions', value: 'actions', align: 'center' as 'center', sortable: false },
  { title: 'Scheme Name', value: 'scheme_name', key: 'scheme_name', width: '120px' },
  { title: 'In Force', value: 'quote_type', key: 'quote_type', width: '20%' },
  {
    title: 'Commencement Date',
    key: 'commencement_date',
    width: '20%',
    value: (item: any) => parseDateString(item.commencement_date)
  },
  { title: 'Basis', value: 'basis' },
  { title: 'Status', value: 'status' },
  { title: 'Broker', value: 'quote_broker.name', key: 'quote_broker', width: '20%' },
  { title: 'Type', value: 'obligation_type' },
  { title: 'SGLA', value: 'sgla_benefit' },
  { title: 'PHI', value: 'phi_benefit' },
  { title: 'TTD', value: 'ttd_benefit' },
  { title: 'PTD', value: 'ptd_benefit' },
  { title: 'CI', value: 'ci_benefit' },
  { title: 'GFF', value: 'family_funeral_benefit' },
  {
    title: 'Creation Date',
    key: 'creation_date',
    width: '20%',
    value: (item: any) => parseDateString(item.creation_date)
  },
  { title: 'Submitted By', value: 'created_by' },
  { title: 'Reviewer', value: 'reviewer' }
])

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending Review':
      return '#FFE699'
    case 'InForce':
      return '#70AD47'
    case 'Approved':
      return '#E2EFDA'
    case 'In Progress':
      return '#F8CBAD'
    default:
      return 'black'
  }
}

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

const goToQuoteCreation = () => {
  router.push({ name: 'group-pricing-quote-generation' })
}

const editItem = (item) => {
  router.push({ name: 'group-pricing-quote-generation-edit', params: { id: item.id } })
}

const deleteItem = async (item) => {
  try {
    const res = await confirmDeleteDialog.value.open(
      'Delete Quote',
      'Are you sure you want to delete this quote?'
    )
    if (res) {
      GroupPricingService.deleteQuote(item.id)
      quotes.value = quotes.value.filter((quote: any) => quote.id !== item.id)
    }
  } catch (error) {
    console.log('Error:', error)
  }
}

const viewItem = (item) => {
  groupStore.selectedQuote = item
  router.push({ name: 'group-pricing-scheme-details', params: { id: item.id } })
}
const submitReview = (item) => {
  selectedQuote.value = item
  dialog.value = true
}

const submitForReview = () => {
  selectedQuote.value.reviewer = selectedReviewer.value.name
  selectedQuote.value.status = 'Pending Review'
  GroupPricingService.changeQuoteStatus(selectedQuote.value)
  dialog.value = false
}

const submitQuoteGeneration = (item) => {
  router.push({ name: 'group-pricing-quotes-generation', params: { quoteId: item.id } })
}

onMounted(() => {
  // Start fetching data that doesn't depend on organization.value immediately
  GroupPricingService.getBenefitMaps()
    .then((res) => {
      benefitMaps.value = res.data
      headers.value = headers.value.map((header) => {
        const bff = benefitMaps.value.find((map) => map.benefit_code === header.title)
        if (bff && bff.benefit_alias !== '') {
          return {
            ...header,
            title: bff.benefit_alias
          }
        }
        return header
      })
    })
    .catch((error) => {
      console.error('Error fetching benefit maps:', error)
      // Handle error appropriately, e.g., set default headers or show a message
    })

  GroupPricingService.getAllQuotes()
    .then((res) => {
      if (res.data && res.data.length > 0) {
        quotes.value = res.data
        console.log('Quotes:', quotes.value)
      } else {
        quotes.value = []
      }
    })
    .catch((error) => {
      console.error('Error fetching all quotes:', error)
      quotes.value = [] // Ensure quotes is an array on error
    })

  // Watch for appStore.getLicenseData to be populated
  watchEffect(() => {
    const licenseData = appStore.getLicenseData // Access it once
    if (
      licenseData &&
      licenseData.data &&
      licenseData.data.attributes &&
      licenseData.data.attributes.metadata &&
      licenseData.data.attributes.metadata.organization
    ) {
      const orgName = licenseData.data.attributes.metadata.organization
      if (organization.value !== orgName) {
        // Only update and fetch if it changed or was null
        organization.value = orgName

        // Now that organization.value is reliably set, fetch dependent data
        ProductService.getOrgUsers({ name: organization.value })
          .then((res) => {
            // Ensure res.data is an array before processing
            if (res && Array.isArray(res.data)) {
              const uniqueData = Array.from(
                new Map(res.data.map((entry) => [entry.name, entry])).values()
              )
              reviewers.value = uniqueData
            } else {
              console.warn('Org Users response is not as expected or data is missing:', res)
              reviewers.value = []
            }
          })
          .catch((error) => {
            console.error('Error fetching org users:', error)
            reviewers.value = [] // Ensure reviewers is an array on error
          })
      }
    } else {
      // This will log until the data is available
      // Avoid resetting organization.value to null if it was already set and watchEffect
      // is re-running for another reason, unless that's desired behavior.
    }
  })
})
</script>
<style lang="css" scoped>
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
