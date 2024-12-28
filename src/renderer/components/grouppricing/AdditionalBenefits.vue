<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.groupPricingQuote.ptdBenefit"
          label="PTD Benefit"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.groupPricingQuote.ciBenefit"
          label="CI Benefit"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.groupPricingQuote.sglaBenefit"
          label="SGLA Benefit"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.groupPricingQuote.phiTtdBenefit"
          label="PHI/TTD Benefit"
        ></v-checkbox>
      </v-col>
      <v-col cols="3">
        <v-checkbox
          v-model="groupStore.groupPricingQuote.familyFuneralBenefit"
          label="Family Funeral Benefit"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-divider v-if="anyBoxChecked" class="mb-7"></v-divider>
    <v-row v-if="groupStore.groupPricingQuote.ptdBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">PTD Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.groupPricingQuote.ptd.riskType"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.groupPricingQuote.ptd.benefitType"
                  placeholder="Choose a Benefit Type"
                  label="Benefit Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.benefitTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.ptd.salaryMultiple"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Salary Multiple"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.ptd.coverTerminationAge"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.ptd.deferredPeriod"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.groupPricingQuote.ptd.disabilityDefinition"
                  placeholder="Choose a Definition"
                  label="Disability Definition"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.disabilityDefinitions"
                ></v-select>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="groupStore.groupPricingQuote.ciBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Critical Illness Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.groupPricingQuote.ci.benefitStructure"
                  placeholder="Choose a Benefit Structure"
                  label="Benefit Structure"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.benefitStructures"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.ci.maxBenefit"
                  placeholder="Enter a value"
                  label="Maximum Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.ci.criticalIllnessPercentage"
                  placeholder="Enter a value"
                  label="Critical Illness Percentage"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.ci.coverTerminationAge"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                ></v-text-field>
              </v-col> </v-row
          ></template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="groupStore.groupPricingQuote.sglaBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Spouse Group Life Assurance Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.sgla.sglaPercentage"
                  placeholder="Enter a value"
                  label="SGLA Percentage of Annual Salary"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.sgla.maxBenefit"
                  placeholder="Enter a value"
                  label="Maximum Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.sgla.coverTerminationAge"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="groupStore.groupPricingQuote.phiTtdBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">PHI/TTD Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.groupPricingQuote.phi.productType"
                  placeholder="Choose a Product Type"
                  label="Product Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.productTypes"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.groupPricingQuote.phi.riskType"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.maxBasicBenefit"
                  placeholder="Enter a value"
                  label="Maximum Basic Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.monthlyBenefitPercentage"
                  placeholder="Enter a value"
                  label="Monthly Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.groupPricingQuote.phi.premiuimWaiverBenefit"
                  placeholder="Enable Premium Waiver Benefit?"
                  label="Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
              </v-col>
              <v-col
                v-if="groupStore.groupPricingQuote.phi.premiuimWaiverBenefit == 'Yes'"
                cols="4"
              >
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.premiumWaiverPercentage"
                  placeholder="Enter a value"
                  label="Premium Waiver Percentage"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.groupPricingQuote.phi.phiEscalationPercentage"
                  placeholder="Choose an Escalation Percentage"
                  label="PHI Escalation Percentage"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.phiEscalationPercentages"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.maxPremiumWaiver"
                  placeholder="Enter a value"
                  label="Maximum Premium Waiver"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.coverTerminationAge"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col
                v-if="
                  groupStore.groupPricingQuote.phi.productType === 'PHI' ||
                  groupStore.groupPricingQuote.phi.productType === 'PHI & TTD'
                "
                cols="4"
              >
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.waitingPeriodMonths"
                  placeholder="Enter a value"
                  label="Waiting Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col
                v-if="
                  groupStore.groupPricingQuote.phi.productType === 'TTD' ||
                  groupStore.groupPricingQuote.phi.productType === 'PHI & TTD'
                "
                cols="4"
              >
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.numberAnnualPayments"
                  placeholder="Enter a value"
                  label="Number of Annual Payments"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.phi.deferredPeriodMonths"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.groupPricingQuote.phi.disabilityDefinition"
                  placeholder="Choose a Definition"
                  label="Disability Definition"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.disabilityDefinitions"
                ></v-select>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="groupStore.groupPricingQuote.familyFuneralBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Family Funeral Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.groupFamilyFuneral.member"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Member"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.groupFamilyFuneral.spouse"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Spouse"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.groupPricingQuote.groupFamilyFuneral.children"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Children"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.groupPricingQuote.groupFamilyFuneral.adultDependantSumAssured
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Adult Dependant Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.groupPricingQuote.groupFamilyFuneral.maxChildrenCovered
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Maximum Children Covered"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.groupPricingQuote.groupFamilyFuneral.numberAdultDependants
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Number of Adult Dependants"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import { computed } from 'vue'
import BaseCard from '../BaseCard.vue'

const groupStore = useGroupPricingStore()

const anyBoxChecked = computed(() => {
  return (
    groupStore.groupPricingQuote.ptdBenefit ||
    groupStore.groupPricingQuote.ciBenefit ||
    groupStore.groupPricingQuote.sglaBenefit ||
    groupStore.groupPricingQuote.phiTtdBenefit ||
    groupStore.groupPricingQuote.familyFuneralBenefit
  )
})
</script>
<style lang="css" scoped></style>
