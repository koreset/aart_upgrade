<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Lodge a Claim</span>
          </template>
          <template #default>
            <v-row class="d-flex">
              <v-col cols="4">
                <v-autocomplete
                  v-model="selectedScheme"
                  variant="outlined"
                  density="compact"
                  :items="groupSchemes"
                  label="Scheme"
                  placeholder="Select a Scheme"
                  item-title="name"
                  item-value="id"
                  return-object
                  @update:model-value="getSchemeMembers"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="selectedMember"
                  variant="outlined"
                  density="compact"
                  :items="groupSchemeMembers"
                  label="Member"
                  placeholder="Select a Scheme Member"
                  item-title="member_name"
                  item-value="id"
                  return-object
                  @update:model-value="checkSchemeMember"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="selectedMember"
                  v-model="selectedMember.annual_salary"
                  readonly
                  variant="outlined"
                  density="compact"
                  label="Member Salary"
                  placeholder="Member Salary"
                >
                </v-text-field>
              </v-col>
              <v-col cols="4"
                ><v-select
                  v-model="selectedMemberType"
                  variant="outlined"
                  density="compact"
                  :items="memberTypes"
                  item-title="name"
                  item-value="value"
                  label="Member Type"
                  placeholder="Select a Member Type"
                  @update:model-value="getClaimAmount"
                ></v-select>
              </v-col>
              <v-col cols="4"
                ><v-select
                  v-model="selectedClaimType"
                  variant="outlined"
                  density="compact"
                  :items="claimTypes"
                  item-title="name"
                  item-value="value"
                  label="Claim Type"
                  placeholder="Select a Claim Type"
                  @update:model-value="getClaimAmount"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="amountClaimed"
                  variant="outlined"
                  density="compact"
                  label="Claim Amount"
                  placeholder="Claim Amount"
                  type="number"
                >
                </v-text-field>
              </v-col>

              <v-col cols="4"
                ><v-select
                  v-model="selectedPaymentType"
                  variant="outlined"
                  density="compact"
                  :items="paymentTypes"
                  item-title="name"
                  item-value="value"
                  label="Payment Type"
                  placeholder="Select a Payment Type"
                ></v-select>
              </v-col>

              <v-col cols="4">
                <v-date-input
                  v-model="dateReported"
                  hide-actions
                  locale="en-ZA"
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Date Reported"
                  placeholder="Select a date"
                ></v-date-input>
              </v-col>
              <v-col cols="4">
                <v-date-input
                  v-model="dateOfClaim"
                  hide-actions
                  locale="en-ZA"
                  view-mode="month"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  variant="outlined"
                  density="compact"
                  label="Date of Claim"
                  placeholder="Select a date"
                ></v-date-input>
              </v-col>
              <v-col cols="4"
                ><v-select
                  v-model="selectedClaimCause"
                  variant="outlined"
                  density="compact"
                  :items="claimCauses"
                  item-title="name"
                  item-value="value"
                  label="Claim Cause"
                  placeholder="Select a Claim Cause"
                ></v-select>
              </v-col>
            </v-row>
            <v-row
              ><v-col class="d-flex justify-end">
                <v-btn
                  :disabled="disableSubmit()"
                  class="mr-6"
                  size="small"
                  rounded
                  color="primary"
                  @click="submitClaim"
                  >Submit Claim</v-btn
                >
                <v-btn size="small" rounded color="primary" @click="closeForm">Close</v-btn>
              </v-col></v-row
            ></template
          >
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import { VDateInput } from 'vuetify/labs/VDateInput'
import router from '@/renderer/router'

const selectedScheme: any = ref(null)
const groupSchemes = ref([])
const groupSchemeMembers = ref([])
const selectedMember: any = ref(null)
const selectedClaimType = ref(null)
const claimTypes = [
  { name: 'GLA', value: 'gla' },
  { name: 'SGLA', value: 'sgla' },
  { name: 'PTD', value: 'ptd' },
  { name: 'CI', value: 'ci' },
  { name: 'TTD', value: 'ttd' },
  { name: 'PHI', value: 'phi' },
  { name: 'GroupFuneral', value: 'group_funeral' }
]
const selectedMemberType = ref(null)
const memberTypes = [
  { name: 'Member', value: 'member' },
  { name: 'Spouse', value: 'spouse' },
  { name: 'Child', value: 'child' },
  { name: 'Parent', value: 'parent' },
  { name: 'Dependant', value: 'dependant' }
]
const dateReported = ref(null)
const dateOfClaim = ref(null)
const amountClaimed = ref(0)
const selectedClaimCause = ref(null)
const claimCauses = [
  { name: 'Accident', value: 'accident' },
  { name: 'Natural', value: 'natural' }
]
const selectedPaymentType = ref(null)
const paymentTypes = [
  { name: 'Lump Sum', value: 'lump_sum' },
  { name: 'Regular Payments', value: 'regular_payments' }
]

const getSchemeMembers = async (scheme: any) => {
  const response = await GroupPricingService.getMembersInForce(scheme.id)
  groupSchemeMembers.value = response.data
}

onMounted(() => {
  GroupPricingService.getSchemesInforce().then((response) => {
    groupSchemes.value = response.data
  })
})

const disableSubmit = () => {
  return (
    !selectedScheme.value ||
    !selectedMember.value ||
    !selectedClaimType.value ||
    !selectedMemberType.value ||
    !dateReported.value ||
    !dateOfClaim.value ||
    !amountClaimed.value ||
    !selectedClaimCause.value
  )
}

const submitClaim = async () => {
  // validate data
  if (
    !selectedScheme.value ||
    !selectedMember.value ||
    !selectedClaimType.value ||
    !selectedMemberType.value ||
    !dateReported.value ||
    !dateOfClaim.value ||
    !amountClaimed.value ||
    !selectedClaimCause.value
  ) {
    return
  }

  const transformDateString = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const data = {
    scheme_name: selectedScheme.value.name,
    scheme_id: selectedScheme.value.id,
    member_name: selectedMember.value.member_name,
    occupation: '',
    member_date_of_birth: transformDateString(selectedMember.value.date_of_birth),
    date_joined_scheme: selectedMember.value.entry_date,
    claim_type: selectedClaimType.value,
    claim_member_type: selectedMemberType.value,
    claim_amount: Number(amountClaimed.value),
    claim_payment_type: selectedPaymentType.value,
    date_of_claim_event: dateOfClaim.value,
    date_reported: dateReported.value,
    claim_cause: selectedClaimCause.value,
    member_salary: Number(selectedMember.value.annual_salary),
    gla: '',
    sgla: '',
    ptd: '',
    ci: '',
    ttd: '',
    phi: '',
    group_funeral: '',
    deferred_period: '',
    claim_decision: '',
    repudiation_reason: ''
  }

  await GroupPricingService.submitClaim(data)

  resetFields()
}

const getClaimAmount = async () => {
  if (
    selectedClaimType.value !== null &&
    selectedMemberType.value !== null &&
    selectedMember.value !== null
  ) {
    GroupPricingService.getMemberRating(
      selectedScheme.value.name,
      selectedScheme.value.quote_id,
      selectedMember.value.id
    ).then((response) => {
      if (selectedClaimType.value === 'gla') {
        amountClaimed.value = response.data.gla_capped_sum_assured //* response.data.gla_sum_assured
      } else if (selectedClaimType.value === 'sgla') {
        amountClaimed.value = response.data.spouse_gla_capped_sum_assured //* response.data.spouse_gla_sum_assured
      } else if (selectedClaimType.value === 'ptd') {
        amountClaimed.value = response.data.ptd_capped_sum_assured //* response.data.ptd_sum_assured
      } else if (selectedClaimType.value === 'ci') {
        amountClaimed.value = response.data.ci_capped_sum_assured //* response.data.ci_sum_assured
      } else if (selectedClaimType.value === 'ttd') {
        amountClaimed.value = response.data.ttd_capped_sum_assured //* response.data.ttd_sum_assured
      } else if (selectedClaimType.value === 'phi') {
        amountClaimed.value = response.data.phi_capped_sum_assured //* response.data.phi_sum_assured
      } else if (selectedClaimType.value === 'group_funeral') {
        if (selectedMemberType.value === 'member') {
          amountClaimed.value = response.data.member_funeral_sum_assured
        } else if (selectedMemberType.value === 'spouse') {
          amountClaimed.value = response.data.spouse_funeral_sum_assured
        } else if (selectedMemberType.value === 'child') {
          amountClaimed.value = response.data.child_funeral_sum_assured
        } else if (selectedMemberType.value === 'parent') {
          amountClaimed.value = response.data.parent_funeral_sum_assured
        } else if (selectedMemberType.value === 'dependant') {
          amountClaimed.value = response.data.dependant_funeral_sum_assured
        }
      }
      // console.log('Claim Amount:', response.data.claim_amount)
      // amountClaimed.value = response.data.claim_amount
    })
  }
}

const resetFields = () => {
  selectedScheme.value = null
  selectedMember.value = null
  selectedClaimType.value = null
  selectedMemberType.value = null
  dateReported.value = null
  dateOfClaim.value = null
  amountClaimed.value = 0
  selectedClaimCause.value = null
}

const closeForm = () => {
  resetFields()
  router.push({ name: 'group-pricing-claims-list' })
}

const checkSchemeMember = () => {
  console.log('Checking Scheme Member:', selectedMember.value)
}
</script>
<style lang="css" scoped></style>
