<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.ptd_benefit"
          :label="ptdLabel"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.ci_benefit"
          :label="ciLabel"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.sgla_benefit"
          :label="sglaLabel"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.phi_benefit"
          :label="phiLabel"
        ></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.ttd_benefit"
          :label="ttdLabel"
        ></v-checkbox>
      </v-col>

      <v-col cols="2">
        <v-checkbox
          v-model="groupStore.group_pricing_quote.family_funeral_benefit"
          :label="familyFuneralLabel"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-divider v-if="anyBoxChecked" class="mb-7"></v-divider>
    <v-row v-if="groupStore.group_pricing_quote.ptd_benefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ ptdLabel }} Benefit</span>
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
              <v-col cols="4">
                <v-select
                  v-model="groupStore.group_pricing_quote.ptd.educator_benefit"
                  variant="outlined"
                  density="compact"
                  label="Educator Benefit"
                  placeholder="Enable Educator Benefit"
                  :items="groupStore.yesNoItems"
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
            <span class="headline">{{ ciLabel }} Benefit</span>
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
                <v-select
                  v-model="groupStore.group_pricing_quote.ci.benefit_definition"
                  placeholder="Choose a Benefit Definition"
                  label="Benefit Definition"
                  variant="outlined"
                  density="compact"
                  :items="benefitDefinitions"
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
                    groupStore.group_pricing_quote.ci.critical_illness_salary_multiple
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
            <span class="headline">{{ sglaLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="groupStore.group_pricing_quote.sgla.sgla_salary_multiple"
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
            <span class="headline">{{ phiLabel }} Benefit</span>
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
                    groupStore.group_pricing_quote.phi.income_replacement_percentage
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
              <v-col cols="4">
                <v-select
                  v-model:model-value="
                    groupStore.group_pricing_quote.phi.medical_aid_premium_waiver
                  "
                  placeholder="Enable Medical Aid Premium Waiver Benefit?"
                  label="Medical Aid Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
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
            <span class="headline">{{ ttdLabel }} Benefit</span>
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
                    groupStore.group_pricing_quote.ttd.income_replacement_percentage
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
            <span class="headline">{{ familyFuneralLabel }} Benefit</span>
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
                    groupStore.group_pricing_quote.family_funeral.max_number_children
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
                    groupStore.group_pricing_quote.family_funeral.max_number_adult_dependants
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
import { computed, onBeforeMount, ref } from 'vue'
import BaseCard from '../BaseCard.vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'

const groupStore = useGroupPricingStore()
const benefitMaps: any = ref([])

const ptdLabel = ref('PTD')
const ciLabel = ref('CI')
const sglaLabel = ref('SGLA')
const phiLabel = ref('PHI')
const ttdLabel = ref('TTD')
const familyFuneralLabel = ref('Family Funeral')
const benefitDefinitions: any = ref(['Lump Sum', 'Monthly'])

onBeforeMount(async () => {
  // get benefit definitions from the API
  const benefitResponse = await GroupPricingService.getBenefitDefinitions()
  benefitDefinitions.value = benefitResponse.data
  const res = await GroupPricingService.getBenefitMaps()
  benefitMaps.value = res.data
  console.log('Benefit Maps', benefitMaps.value)
  ptdLabel.value = getBenefitAlias('PTD')
  ciLabel.value = getBenefitAlias('CI')
  sglaLabel.value = getBenefitAlias('SGLA')
  phiLabel.value = getBenefitAlias('PHI')
  ttdLabel.value = getBenefitAlias('TTD')
  familyFuneralLabel.value = getBenefitAlias('GFF')
})

const getBenefitAlias = (benefit: any) => {
  console.log('Benefit', benefit)
  console.log('Benefit Maps', benefitMaps.value)
  const benefitMap = benefitMaps.value.find((map: any) => map.benefit_code === benefit)
  console.log('Benefit Map', benefitMap)
  return benefitMap.benefit_alias !== '' ? benefitMap.benefit_alias : benefit
  // return 'WORK'
}

const validateForm = () => {
  console.log('Validating form')
  return true
}

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

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
