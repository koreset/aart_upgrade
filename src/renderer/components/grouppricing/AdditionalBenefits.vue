<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-checkbox v-model="groupStore.group_pricing_quote.ptd_benefit" label="PTD"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="groupStore.group_pricing_quote.ci_benefit" label="CI"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="groupStore.group_pricing_quote.sgla_benefit" label="SGLA"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="groupStore.group_pricing_quote.phi_benefit" label="PHI"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="groupStore.group_pricing_quote.ttd_benefit" label="TTD"></v-checkbox>
      </v-col>

      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.family_funeral_benefit"
          label="Family Funeral"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-divider v-if="anyBoxChecked" class="mb-7"></v-divider>
    <v-row v-if="groupStore.group_pricing_quote.ptd_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">PTD Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ptd.risk_type"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ptd.benefit_type"
                  placeholder="Choose a Benefit Type"
                  label="Benefit Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.benefitTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ptd.salary_multiple"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="PTD Salary Multiple"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ptd.cover_termination_age"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ptd.deferred_period"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ptd.disability_definition"
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
    <v-row v-if="groupStore.group_pricing_quote.ci_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Critical Illness Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ci.benefit_structure"
                  placeholder="Choose a Benefit Structure"
                  label="Benefit Structure"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.benefitStructures"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ci.max_benefit"
                  placeholder="Enter a value"
                  label="Maximum Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.ci.critical_illness_percentage
                  "
                  placeholder="Enter a value"
                  label="Critical Illness Salary Multiple"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ci.cover_termination_age"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col> </v-row
          ></template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="groupStore.group_pricing_quote.sgla_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Spouse Group Life Assurance Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.sgla.sgla_percentage"
                  placeholder="Enter a value"
                  label="SGLA Salary Multiple"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.sgla.max_benefit"
                  placeholder="Enter a value"
                  label="Maximum Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.sgla.cover_termination_age"
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
    <v-row v-if="groupStore.group_pricing_quote.phi_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">PHI Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.phi.risk_type"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.maximum_benefit"
                  placeholder="Enter a value"
                  label="Maximum Monthly Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.phi.monthly_benefit_percentage
                  "
                  placeholder="Enter a value"
                  label="Income Replacement %"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.group_pricing_quote.phi.premium_waiver"
                  placeholder="Enable Premium Waiver Benefit?"
                  label="Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
              </v-col>
              <v-col v-if="groupStore.group_pricing_quote.phi.premium_waiver == 'Yes'" cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.premium_waiver_percentage"
                  placeholder="Enter a value"
                  label="Premium Waiver Percentage"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.group_pricing_quote.phi.escalation_percentage"
                  placeholder="Choose an Escalation Percentage"
                  label="PHI Escalation Percentage"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.phiEscalationPercentages"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.max_premium_waiver"
                  placeholder="Enter a value"
                  label="Maximum Premium Waiver"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.cover_termination_age"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.waiting_period"
                  placeholder="Enter a value"
                  label="Waiting Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.number_monthly_payments"
                  placeholder="Enter a value"
                  label="Number of Monthly Payments"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.phi.deferred_period"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.phi.disability_definition"
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
    <v-row v-if="groupStore.group_pricing_quote.ttd_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">TTD Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ttd.risk_type"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.maximum_benefit"
                  placeholder="Enter a value"
                  label="Maximum Monthly Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.ttd.monthly_benefit_percentage
                  "
                  placeholder="Enter a value"
                  label="Income Replacement %"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.group_pricing_quote.ttd.premium_waiver"
                  placeholder="Enable Premium Waiver Benefit?"
                  label="Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
              </v-col>
              <v-col v-if="groupStore.group_pricing_quote.ttd.premium_waiver == 'Yes'" cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.premium_waiver_percentage"
                  placeholder="Enter a value"
                  label="Premium Waiver Percentage"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="groupStore.group_pricing_quote.ttd.escalation_percentage"
                  placeholder="Choose an Escalation Percentage"
                  label="TTD Escalation Percentage"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.phiEscalationPercentages"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.max_premium_waiver"
                  placeholder="Enter a value"
                  label="Maximum Premium Waiver"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.cover_termination_age"
                  placeholder="Enter a value"
                  label="Cover Termination Age"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.waiting_period"
                  placeholder="Enter a value"
                  label="Waiting Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.number_monthly_payments"
                  placeholder="Enter a value"
                  label="Number of Monthly Payments"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.ttd.deferred_period"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ttd.disability_definition"
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
    <v-row v-if="groupStore.group_pricing_quote.family_funeral_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Family Funeral Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.main_member_funeral_sum_assured
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Main Member Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.spouse_funeral_sum_assured
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Spouse Funeral Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.children_funeral_sum_assured
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Children Funeral Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.adult_dependant_sum_assured
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Dependant Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.parent_funeral_sum_assured
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Parent Funeral Sum Assured"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.number_children
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Maximum Number of Children"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="
                    groupStore.group_pricing_quote.family_funeral.number_adult_dependants
                  "
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Maximum Number of Dependants"
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
    groupStore.group_pricing_quote.ptd_benefit ||
    groupStore.group_pricing_quote.ci_benefit ||
    groupStore.group_pricing_quote.sgla_benefit ||
    groupStore.group_pricing_quote.phi_benefit ||
    groupStore.group_pricing_quote.ttd_benefit ||
    groupStore.group_pricing_quote.family_funeral_benefit
  )
})
</script>
<style lang="css" scoped></style>
