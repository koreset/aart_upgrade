<template>
  <v-container>
    <v-row>
      <!-- <v-col v-for="benefit in benefitCheckboxes" :key="benefit.key" cols="2">
        <v-checkbox v-model="groupStore.group_pricing_quote[benefit.key]" :label="benefit.label" />
      </v-col> -->
      <v-col cols="2">
        <v-checkbox v-model="ptdBenefit" v-bind="ptdBenefitAttrs" :label="ptdLabel"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="ciBenefit" v-bind="ciBenefitAttrs" :label="ciLabel"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="sglaBenefit" v-bind="sglaBenefitAttrs" :label="sglaLabel"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="phiBenefit" v-bind="phiBenefitAttrs" :label="phiLabel"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="ttdBenefit" v-bind="ttdBenefitAttrs" :label="ttdLabel"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="familyFuneralBenefit"
          v-bind="familyFuneralBenefitAttrs"
          :label="familyFuneralLabel"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-divider v-if="anyBoxChecked" class="mb-7"></v-divider>
    <v-row v-if="ptdBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ ptdLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="ptdRiskType"
                  v-bind="ptdRiskTypeAttrs"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :error-messages="errors.ptd_risk_type"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="ptdBenefitType"
                  v-bind="ptdBenefitTypeAttrs"
                  :error-messages="errors.ptd_benefit_type"
                  placeholder="Choose a Benefit Type"
                  label="Benefit Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.benefitTypes"
                ></v-select>
              </v-col>
              <v-col v-if="!groupStore.group_pricing_quote.use_global_salary_multiple" cols="4">
                <v-text-field
                  v-model:model-value="ptdSalaryMultiple"
                  v-bind="ptdSalaryMultipleAttrs"
                  :error-messages="errors.ptd_salary_multiple"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="PTD Salary Multiple"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ptdDeferredPeriod"
                  v-bind="ptdDeferredPeriodAttrs"
                  :error-messages="errors.ptd_deferred_period"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="ptdDisabilityDefinition"
                  v-bind="ptdDisabilityDefinitionAttrs"
                  :error-messages="errors.ptd_disability_definition"
                  placeholder="Choose a Definition"
                  label="Disability Definition"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.disabilityDefinitions"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="ptdEducatorBenefit"
                  v-bind="ptdEducatorBenefitAttrs"
                  :error-messages="errors.ptd_educator_benefit"
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
    <v-row v-if="ciBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ ciLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="ciBenefitStructure"
                  v-bind="ciBenefitStructureAttrs"
                  :error-messages="errors.ci_benefit_structure"
                  placeholder="Choose a Benefit Structure"
                  label="Benefit Structure"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.benefitStructures"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="ciBenefitDefinition"
                  v-bind="ciBenefitDefinitionAttrs"
                  :error-messages="errors.ci_benefit_definition"
                  placeholder="Choose a Benefit Definition"
                  label="Benefit Definition"
                  variant="outlined"
                  density="compact"
                  :items="benefitDefinitions"
                ></v-select>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ciMaxBenefit"
                  v-bind="ciMaxBenefitAttrs"
                  :error-messages="errors.ci_max_benefit"
                  placeholder="Enter a value"
                  label="Maximum Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col v-if="!groupStore.group_pricing_quote.use_global_salary_multiple" cols="4">
                <v-text-field
                  v-model:model-value="ciCriticalIllnessSalaryMultiple"
                  v-bind="ciCriticalIllnessSalaryMultipleAttrs"
                  :error-messages="errors.ci_critical_illness_salary_multiple"
                  placeholder="Enter a value"
                  label="Critical Illness Salary Multiple"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col> </v-row
          ></template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="sglaBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ sglaLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col v-if="!groupStore.group_pricing_quote.use_global_salary_multiple" cols="4">
                <v-text-field
                  v-model:model-value="sglaSalaryMultiple"
                  v-bind="sglaSalaryMultipleAttrs"
                  :error-messages="errors.sgla_salary_multiple"
                  placeholder="Enter a value"
                  label="SGLA Salary Multiple"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="sglaMaxBenefit"
                  v-bind="sglaMaxBenefitAttrs"
                  :error-messages="errors.sgla_max_benefit"
                  placeholder="Enter a value"
                  label="Maximum Benefit"
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
    <v-row v-if="phiBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ phiLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="phiRiskType"
                  v-bind="phiRiskTypeAttrs"
                  :error-messages="errors.phi_risk_type"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="phiMaximumBenefit"
                  v-bind="phiMaximumBenefitAttrs"
                  :error-messages="errors.phi_maximum_benefit"
                  placeholder="Enter a value"
                  label="Maximum Monthly Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="phiIncomeReplacementPercentage"
                  v-bind="phiIncomeReplacementPercentageAttrs"
                  :error-messages="errors.phi_income_replacement_percentage"
                  placeholder="Enter a value"
                  label="Income Replacement %"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="phiPremiumWaiver"
                  v-bind="phiPremiumWaiverAttrs"
                  :error-messages="errors.phi_premium_waiver"
                  placeholder="Enable Premium Waiver Benefit?"
                  label="Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="phiMedicalAidPremiumWaiver"
                  v-bind="phiMedicalAidPremiumWaiverAttrs"
                  :error-messages="errors.phi_medical_aid_premium_waiver"
                  placeholder="Enable Medical Aid Premium Waiver Benefit?"
                  label="Medical Aid Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
              </v-col>

              <v-col cols="4">
                <v-select
                  v-model:model-value="phiEscalationPercentage"
                  v-bind="phiEscalationPercentageAttrs"
                  :error-messages="errors.phi_escalation_percentage"
                  placeholder="Choose an Escalation Percentage"
                  label="PHI Escalation Percentage"
                  variant="outlined"
                  density="compact"
                  :items="incomeEscalations"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="phiMaxPremiumWaiver"
                  v-bind="phiMaxPremiumWaiverAttrs"
                  :error-messages="errors.phi_max_premium_waiver"
                  placeholder="Enter a value"
                  label="Maximum Premium Waiver"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="phiWaitingPeriod"
                  v-bind="phiWaitingPeriodAttrs"
                  :error-messages="errors.phi_waiting_period"
                  placeholder="Select Waiting Period"
                  label="Waiting Period (Months)"
                  variant="outlined"
                  density="compact"
                  :items="phiWaitingPeriods"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="phiNumberMonthlyPayments"
                  v-bind="phiNumberMonthlyPaymentsAttrs"
                  :error-messages="errors.phi_number_monthly_payments"
                  placeholder="Enter a value"
                  label="Number of Monthly Payments"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="phiDeferredPeriod"
                  v-bind="phiDeferredPeriodAttrs"
                  :error-messages="errors.phi_deferred_period"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="phiDisabilityDefinition"
                  v-bind="phiDisabilityDefinitionAttrs"
                  :error-messages="errors.phi_disability_definition"
                  placeholder="Choose a Definition"
                  label="Disability Definition"
                  variant="outlined"
                  density="compact"
                  :items="ptdDisabilityDefinitions"
                ></v-select>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="ttdBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ ttdLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="ttdRiskType"
                  v-bind="ttdRiskTypeAttrs"
                  :error-messages="errors.ttd_risk_type"
                  placeholder="Choose a Risk Type"
                  label="Risk Type"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.riskTypes"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ttdMaximumBenefit"
                  v-bind="ttdMaximumBenefitAttrs"
                  :error-messages="errors.ttd_maximum_benefit"
                  placeholder="Enter a value"
                  label="Maximum Monthly Benefit"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ttdIncomeReplacementPercentage"
                  v-bind="ttdIncomeReplacementPercentageAttrs"
                  :error-messages="errors.ttd_income_replacement_percentage"
                  placeholder="Enter a value"
                  label="Income Replacement %"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="ttdPremiumWaiver"
                  v-bind="ttdPremiumWaiverAttrs"
                  :error-messages="errors.ttd_premium_waiver"
                  placeholder="Enable Premium Waiver Benefit?"
                  label="Premium Waiver Benefit"
                  variant="outlined"
                  density="compact"
                  :items="groupStore.yesNoItems"
                ></v-select>
              </v-col>
              <v-col v-if="groupStore.group_pricing_quote.ttd.premium_waiver == 'Yes'" cols="4">
                <v-text-field
                  v-model:model-value="ttdPremiumWaiverPercentage"
                  v-bind="ttdPremiumWaiverPercentageAttrs"
                  :error-messages="errors.ttd_premium_waiver_percentage"
                  placeholder="Enter a value"
                  label="Premium Waiver Percentage"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="ttdEscalationPercentage"
                  v-bind="ttdEscalationPercentageAttrs"
                  :error-messages="errors.ttd_escalation_percentage"
                  placeholder="Choose an Escalation Percentage"
                  label="TTD Escalation Percentage"
                  variant="outlined"
                  density="compact"
                  :items="incomeEscalations"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ttdMaxPremiumWaiver"
                  v-bind="ttdMaxPremiumWaiverAttrs"
                  :error-messages="errors.ttd_max_premium_waiver"
                  placeholder="Enter a value"
                  label="Maximum Premium Waiver"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model:model-value="ttdWaitingPeriod"
                  v-bind="ttdWaitingPeriodAttrs"
                  :error-messages="errors.ttd_waiting_period"
                  placeholder="Select Waiting Period"
                  label="Waiting Period (Months)"
                  variant="outlined"
                  density="compact"
                  :items="ttdWaitingPeriods"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ttdNumberMonthlyPayments"
                  v-bind="ttdNumberMonthlyPaymentsAttrs"
                  :error-messages="errors.ttd_number_monthly_payments"
                  placeholder="Enter a value"
                  label="Number of Monthly Payments"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="ttdDeferredPeriod"
                  v-bind="ttdDeferredPeriodAttrs"
                  :error-messages="errors.ttd_deferred_period"
                  placeholder="Enter a value"
                  label="Deferred Period (Months)"
                  variant="outlined"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="ttdDisabilityDefinition"
                  v-bind="ttdDisabilityDefinitionAttrs"
                  :error-messages="errors.ttd_disability_definition"
                  placeholder="Choose a Definition"
                  label="Disability Definition"
                  variant="outlined"
                  density="compact"
                  :items="ttdDisabilityDefinitions"
                ></v-select>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-row v-if="familyFuneralBenefit" class="mb-5">
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">{{ familyFuneralLabel }} Benefit</span>
          </template>
          <template #default>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralMainMemberFuneralSumAssured"
                  v-bind="familyFuneralMainMemberFuneralSumAssuredAttrs"
                  :error-messages="errors.family_funeral_main_member_funeral_sum_assured"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Main Member Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralSpouseFuneralSumAssured"
                  v-bind="familyFuneralSpouseFuneralSumAssuredAttrs"
                  :error-messages="errors.family_funeral_spouse_funeral_sum_assured"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Spouse Funeral Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralChildrenFuneralSumAssured"
                  v-bind="familyFuneralChildrenFuneralSumAssuredAttrs"
                  :error-messages="errors.family_funeral_children_funeral_sum_assured"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Children Funeral Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralAdultDependantSumAssured"
                  v-bind="familyFuneralAdultDependantSumAssuredAttrs"
                  :error-messages="errors.family_funeral_adult_dependant_sum_assured"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Dependant Sum Assured"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralParentFuneralSumAssured"
                  v-bind="familyFuneralParentFuneralSumAssuredAttrs"
                  :error-messages="errors.family_funeral_parent_funeral_sum_assured"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Parent Funeral Sum Assured"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralMaxNumberChildren"
                  v-bind="familyFuneralMaxNumberChildrenAttrs"
                  :error-messages="errors.family_funeral_max_number_children"
                  type="number"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter a value"
                  label="Maximum Number of Children"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model:model-value="familyFuneralMaxNumberAdultDependants"
                  v-bind="familyFuneralMaxNumberAdultDependantsAttrs"
                  :error-messages="errors.family_funeral_max_number_adult_dependants"
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
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import BaseCard from '../BaseCard.vue'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const groupStore = useGroupPricingStore()
const benefitMaps: any = ref([])

const ptdLabel = ref('PTD')
const ciLabel = ref('CI')
const sglaLabel = ref('SGLA')
const phiLabel = ref('PHI')
const ttdLabel = ref('TTD')
const familyFuneralLabel = ref('Family Funeral')
const benefitDefinitions: any = ref(['Lump Sum', 'Monthly'])
const incomeEscalations: any = ref([])
const ptdDisabilityDefinitions: any = ref([])
const ttdDisabilityDefinitions: any = ref([])
const ciWaitingPeriods: any = ref([])
const ptdWaitingPeriods: any = ref([])
const ttdWaitingPeriods: any = ref([])
const phiWaitingPeriods: any = ref([])

const validationSchema = yup.object({
  ptd_benefit: yup.boolean().nullable(),
  ci_benefit: yup.boolean().nullable(),
  sgla_benefit: yup.boolean().nullable(),
  phi_benefit: yup.boolean().nullable(),
  ttd_benefit: yup.boolean().nullable(),
  family_funeral_benefit: yup.boolean().nullable(),
  ptd_salary_multiple: yup.number().when(['ptd_benefit'], {
    is: (ptdBenefit) => {
      // Access groupStore directly for the second condition
      return ptdBenefit === true && !groupStore.group_pricing_quote.use_global_salary_multiple
    },
    then: (schema) =>
      schema
        .required('Salary multiple is required')
        .positive('Salary multiple must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  ptd_risk_type: yup.string().when('ptd_benefit', {
    is: true,
    then: (schema) => schema.required('Risk type is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ptd_benefit_type: yup.string().when('ptd_benefit', {
    is: true,
    then: (schema) => schema.required('Benefit type is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ptd_deferred_period: yup.number().when('ptd_benefit', {
    is: true,
    then: (schema) =>
      schema.required('Deferred period is required').min(0, 'Deferred period must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  ptd_disability_definition: yup.string().when('ptd_benefit', {
    is: true,
    then: (schema) => schema.required('Disability definition is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ptd_educator_benefit: yup.string().when('ptd_benefit', {
    is: true,
    then: (schema) => schema.required('Educator benefit is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ci_benefit_structure: yup.string().when('ci_benefit', {
    is: true,
    then: (schema) => schema.required('Benefit structure is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ci_benefit_definition: yup.string().when('ci_benefit', {
    is: true,
    then: (schema) => schema.required('Benefit definition is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ci_max_benefit: yup.number().when('ci_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum benefit is required')
        .positive('Maximum benefit must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  ci_critical_illness_salary_multiple: yup.number().when(['ci_benefit'], {
    is: (ciBenefit) => {
      return ciBenefit === true && !groupStore.group_pricing_quote.use_global_salary_multiple
    },
    then: (schema) =>
      schema
        .required('Critical illness salary multiple is required')
        .positive('Critical illness salary multiple must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  sgla_salary_multiple: yup.number().when(['sgla_benefit'], {
    is: (sglaBenefit) => {
      return sglaBenefit === true && !groupStore.group_pricing_quote.use_global_salary_multiple
    },
    then: (schema) =>
      schema
        .required('SGLA salary multiple is required')
        .positive('SGLA salary multiple must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  sgla_max_benefit: yup.number().when('sgla_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum benefit is required')
        .positive('Maximum benefit must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_maximum_benefit: yup.number().when('phi_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum benefit is required')
        .positive('Maximum benefit must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_income_replacement_percentage: yup.number().when('phi_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Income replacement percentage is required')
        .positive('Income replacement percentage must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_premium_waiver: yup.string().when('phi_benefit', {
    is: true,
    then: (schema) => schema.required('Premium waiver is required'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_medical_aid_premium_waiver: yup.string().when('phi_benefit', {
    is: true,
    then: (schema) => schema.required('Medical aid premium waiver is required'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_escalation_percentage: yup.string().when('phi_benefit', {
    is: true,
    then: (schema) => schema.required('Escalation percentage is required'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_max_premium_waiver: yup.number().when('phi_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum premium waiver is required')
        .positive('Maximum premium waiver must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_waiting_period: yup.number().when('phi_benefit', {
    is: true,
    then: (schema) =>
      schema.required('Waiting period is required').min(0, 'Waiting period must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_number_monthly_payments: yup.number().when('phi_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Number of monthly payments is required')
        .positive('Number of monthly payments must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_deferred_period: yup.number().when('phi_benefit', {
    is: true,
    then: (schema) =>
      schema.required('Deferred period is required').min(0, 'Deferred period must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_disability_definition: yup.string().when('phi_benefit', {
    is: true,
    then: (schema) => schema.required('Disability definition is required'),
    otherwise: (schema) => schema.nullable()
  }),
  phi_risk_type: yup.string().when('phi_benefit', {
    is: true,
    then: (schema) => schema.required('Risk type is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_maximum_benefit: yup.number().when('ttd_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum benefit is required')
        .positive('Maximum benefit must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_income_replacement_percentage: yup.number().when('ttd_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Income replacement percentage is required')
        .positive('Income replacement percentage must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_premium_waiver: yup.string().when('ttd_benefit', {
    is: true,
    then: (schema) => schema.required('Premium waiver is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_escalation_percentage: yup.string().when('ttd_benefit', {
    is: true,
    then: (schema) => schema.required('Escalation percentage is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_max_premium_waiver: yup.number().when('ttd_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum premium waiver is required')
        .positive('Maximum premium waiver must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_waiting_period: yup.number().when('ttd_benefit', {
    is: true,
    then: (schema) =>
      schema.required('Waiting period is required').min(0, 'Waiting period must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_number_monthly_payments: yup.number().when('ttd_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Number of monthly payments is required')
        .positive('Number of monthly payments must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_deferred_period: yup.number().when('ttd_benefit', {
    is: true,
    then: (schema) =>
      schema.required('Deferred period is required').min(0, 'Deferred period must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_disability_definition: yup.string().when('ttd_benefit', {
    is: true,
    then: (schema) => schema.required('Disability definition is required'),
    otherwise: (schema) => schema.nullable()
  }),
  ttd_risk_type: yup.string().when('ttd_benefit', {
    is: true,
    then: (schema) => schema.required('Risk type is required'),
    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_main_member_funeral_sum_assured: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Main member funeral sum assured is required')
        .positive('Main member funeral sum assured must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_spouse_funeral_sum_assured: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Spouse funeral sum assured is required')
        .min(0, 'Spouse funeral sum assured must be at least 0'),

    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_children_funeral_sum_assured: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Children funeral sum assured is required')
        .min(0, 'Children funeral sum assured must be at least 0'),

    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_adult_dependant_sum_assured: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Adult dependant sum assured is required')
        .min(0, 'Adult dependant sum assured must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_parent_funeral_sum_assured: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Parent funeral sum assured is required')
        .min(0, 'Parent funeral sum assured must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_max_number_children: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum number of children is required')
        .min(0, 'Maximum number of children must be at least 0'),
    otherwise: (schema) => schema.nullable()
  }),
  family_funeral_max_number_adult_dependants: yup.number().when('family_funeral_benefit', {
    is: true,
    then: (schema) =>
      schema
        .required('Maximum number of adult dependants is required')
        .min(0, 'Maximum number of adult dependants must be at least 0'),
    otherwise: (schema) => schema.nullable()
  })
})

const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: {
    use_global_salary_multiple: groupStore.group_pricing_quote.use_global_salary_multiple,
    ptd_benefit: groupStore.group_pricing_quote.ptd_benefit,
    ci_benefit: groupStore.group_pricing_quote.ci_benefit,
    sgla_benefit: groupStore.group_pricing_quote.sgla_benefit,
    phi_benefit: groupStore.group_pricing_quote.phi_benefit,
    ttd_benefit: groupStore.group_pricing_quote.ttd_benefit,
    family_funeral_benefit: groupStore.group_pricing_quote.family_funeral_benefit,
    ptd_risk_type: groupStore.group_pricing_quote.ptd.risk_type,
    ptd_benefit_type: groupStore.group_pricing_quote.ptd.benefit_type,
    ptd_salary_multiple: groupStore.group_pricing_quote.ptd.salary_multiple,
    ptd_deferred_period: groupStore.group_pricing_quote.ptd.deferred_period,
    ptd_disability_definition: groupStore.group_pricing_quote.ptd.disability_definition,
    ptd_educator_benefit: groupStore.group_pricing_quote.ptd.educator_benefit,
    ci_benefit_structure: groupStore.group_pricing_quote.ci.benefit_structure,
    ci_benefit_definition: groupStore.group_pricing_quote.ci.benefit_definition,
    ci_max_benefit: groupStore.group_pricing_quote.ci.max_benefit,
    ci_critical_illness_salary_multiple:
      groupStore.group_pricing_quote.ci.critical_illness_salary_multiple,
    sgla_salary_multiple: groupStore.group_pricing_quote.sgla.sgla_salary_multiple,
    sgla_max_benefit: groupStore.group_pricing_quote.sgla.max_benefit,
    phi_maximum_benefit: groupStore.group_pricing_quote.phi.maximum_benefit,
    phi_income_replacement_percentage:
      groupStore.group_pricing_quote.phi.income_replacement_percentage,
    phi_premium_waiver: groupStore.group_pricing_quote.phi.premium_waiver,
    phi_medical_aid_premium_waiver: groupStore.group_pricing_quote.phi.medical_aid_premium_waiver,
    phi_escalation_percentage: groupStore.group_pricing_quote.phi.escalation_percentage,
    phi_max_premium_waiver: groupStore.group_pricing_quote.phi.max_premium_waiver,
    phi_waiting_period: groupStore.group_pricing_quote.phi.waiting_period,
    phi_number_monthly_payments: groupStore.group_pricing_quote.phi.number_monthly_payments,
    phi_deferred_period: groupStore.group_pricing_quote.phi.deferred_period,
    phi_disability_definition: groupStore.group_pricing_quote.phi.disability_definition,
    phi_risk_type: groupStore.group_pricing_quote.phi.risk_type,
    ttd_maximum_benefit: groupStore.group_pricing_quote.ttd.maximum_benefit,
    ttd_income_replacement_percentage:
      groupStore.group_pricing_quote.ttd.income_replacement_percentage,
    ttd_premium_waiver: groupStore.group_pricing_quote.ttd.premium_waiver,
    ttd_premium_waiver_percentage: groupStore.group_pricing_quote.ttd.premium_waiver_percentage,
    ttd_escalation_percentage: groupStore.group_pricing_quote.ttd.escalation_percentage,
    ttd_max_premium_waiver: groupStore.group_pricing_quote.ttd.max_premium_waiver,
    ttd_waiting_period: groupStore.group_pricing_quote.ttd.waiting_period,
    ttd_number_monthly_payments: groupStore.group_pricing_quote.ttd.number_monthly_payments,
    ttd_deferred_period: groupStore.group_pricing_quote.ttd.deferred_period,
    ttd_disability_definition: groupStore.group_pricing_quote.ttd.disability_definition,
    ttd_risk_type: groupStore.group_pricing_quote.ttd.risk_type,
    family_funeral_main_member_funeral_sum_assured:
      groupStore.group_pricing_quote.family_funeral.main_member_funeral_sum_assured,
    family_funeral_spouse_funeral_sum_assured:
      groupStore.group_pricing_quote.family_funeral.spouse_funeral_sum_assured,
    family_funeral_children_funeral_sum_assured:
      groupStore.group_pricing_quote.family_funeral.children_funeral_sum_assured,
    family_funeral_adult_dependant_sum_assured:
      groupStore.group_pricing_quote.family_funeral.adult_dependant_sum_assured,
    family_funeral_parent_funeral_sum_assured:
      groupStore.group_pricing_quote.family_funeral.parent_funeral_sum_assured,
    family_funeral_max_number_children:
      groupStore.group_pricing_quote.family_funeral.max_number_children,
    family_funeral_max_number_adult_dependants:
      groupStore.group_pricing_quote.family_funeral.max_number_adult_dependants
  }
})

const [ptdBenefit, ptdBenefitAttrs] = defineField('ptd_benefit')
const [ciBenefit, ciBenefitAttrs] = defineField('ci_benefit')
const [sglaBenefit, sglaBenefitAttrs] = defineField('sgla_benefit')
const [phiBenefit, phiBenefitAttrs] = defineField('phi_benefit')
const [ttdBenefit, ttdBenefitAttrs] = defineField('ttd_benefit')
const [familyFuneralBenefit, familyFuneralBenefitAttrs] = defineField('family_funeral_benefit')
const [ptdRiskType, ptdRiskTypeAttrs] = defineField('ptd_risk_type')
const [ptdBenefitType, ptdBenefitTypeAttrs] = defineField('ptd_benefit_type')
const [ptdSalaryMultiple, ptdSalaryMultipleAttrs] = defineField('ptd_salary_multiple')
const [ptdDeferredPeriod, ptdDeferredPeriodAttrs] = defineField('ptd_deferred_period')
const [ptdDisabilityDefinition, ptdDisabilityDefinitionAttrs] = defineField(
  'ptd_disability_definition'
)
const [ptdEducatorBenefit, ptdEducatorBenefitAttrs] = defineField('ptd_educator_benefit')
const [ciBenefitStructure, ciBenefitStructureAttrs] = defineField('ci_benefit_structure')
const [ciBenefitDefinition, ciBenefitDefinitionAttrs] = defineField('ci_benefit_definition')
const [ciMaxBenefit, ciMaxBenefitAttrs] = defineField('ci_max_benefit')
const [ciCriticalIllnessSalaryMultiple, ciCriticalIllnessSalaryMultipleAttrs] = defineField(
  'ci_critical_illness_salary_multiple'
)
const [sglaSalaryMultiple, sglaSalaryMultipleAttrs] = defineField('sgla_salary_multiple')
const [sglaMaxBenefit, sglaMaxBenefitAttrs] = defineField('sgla_max_benefit')

const [phiMaximumBenefit, phiMaximumBenefitAttrs] = defineField('phi_maximum_benefit')
const [phiIncomeReplacementPercentage, phiIncomeReplacementPercentageAttrs] = defineField(
  'phi_income_replacement_percentage'
)
const [phiPremiumWaiver, phiPremiumWaiverAttrs] = defineField('phi_premium_waiver')
const [phiMedicalAidPremiumWaiver, phiMedicalAidPremiumWaiverAttrs] = defineField(
  'phi_medical_aid_premium_waiver'
)
const [phiEscalationPercentage, phiEscalationPercentageAttrs] = defineField(
  'phi_escalation_percentage'
)
const [phiMaxPremiumWaiver, phiMaxPremiumWaiverAttrs] = defineField('phi_max_premium_waiver')

const [phiWaitingPeriod, phiWaitingPeriodAttrs] = defineField('phi_waiting_period')
const [phiNumberMonthlyPayments, phiNumberMonthlyPaymentsAttrs] = defineField(
  'phi_number_monthly_payments'
)
const [phiDeferredPeriod, phiDeferredPeriodAttrs] = defineField('phi_deferred_period')
const [phiDisabilityDefinition, phiDisabilityDefinitionAttrs] = defineField(
  'phi_disability_definition'
)
const [phiRiskType, phiRiskTypeAttrs] = defineField('phi_risk_type')
const [ttdMaximumBenefit, ttdMaximumBenefitAttrs] = defineField('ttd_maximum_benefit')
const [ttdIncomeReplacementPercentage, ttdIncomeReplacementPercentageAttrs] = defineField(
  'ttd_income_replacement_percentage'
)
const [ttdPremiumWaiver, ttdPremiumWaiverAttrs] = defineField('ttd_premium_waiver')
const [ttdPremiumWaiverPercentage, ttdPremiumWaiverPercentageAttrs] = defineField(
  'ttd_premium_waiver_percentage'
)
const [ttdEscalationPercentage, ttdEscalationPercentageAttrs] = defineField(
  'ttd_escalation_percentage'
)
const [ttdMaxPremiumWaiver, ttdMaxPremiumWaiverAttrs] = defineField('ttd_max_premium_waiver')

const [ttdWaitingPeriod, ttdWaitingPeriodAttrs] = defineField('ttd_waiting_period')
const [ttdNumberMonthlyPayments, ttdNumberMonthlyPaymentsAttrs] = defineField(
  'ttd_number_monthly_payments'
)
const [ttdDeferredPeriod, ttdDeferredPeriodAttrs] = defineField('ttd_deferred_period')
const [ttdDisabilityDefinition, ttdDisabilityDefinitionAttrs] = defineField(
  'ttd_disability_definition'
)
const [ttdRiskType, ttdRiskTypeAttrs] = defineField('ttd_risk_type')
const [familyFuneralMainMemberFuneralSumAssured, familyFuneralMainMemberFuneralSumAssuredAttrs] =
  defineField('family_funeral_main_member_funeral_sum_assured')
const [familyFuneralSpouseFuneralSumAssured, familyFuneralSpouseFuneralSumAssuredAttrs] =
  defineField('family_funeral_spouse_funeral_sum_assured')
const [familyFuneralChildrenFuneralSumAssured, familyFuneralChildrenFuneralSumAssuredAttrs] =
  defineField('family_funeral_children_funeral_sum_assured')
const [familyFuneralAdultDependantSumAssured, familyFuneralAdultDependantSumAssuredAttrs] =
  defineField('family_funeral_adult_dependant_sum_assured')
const [familyFuneralParentFuneralSumAssured, familyFuneralParentFuneralSumAssuredAttrs] =
  defineField('family_funeral_parent_funeral_sum_assured')
const [familyFuneralMaxNumberChildren, familyFuneralMaxNumberChildrenAttrs] = defineField(
  'family_funeral_max_number_children'
)
const [familyFuneralMaxNumberAdultDependants, familyFuneralMaxNumberAdultDependantsAttrs] =
  defineField('family_funeral_max_number_adult_dependants')

onBeforeMount(async () => {
  // get benefit definitions from the API
  const benefitResponse = await GroupPricingService.getBenefitDefinitions()
  benefitDefinitions.value = benefitResponse.data
  const res = await GroupPricingService.getBenefitMaps()
  benefitMaps.value = res.data
  ptdLabel.value = getBenefitAlias('PTD')
  ciLabel.value = getBenefitAlias('CI')
  sglaLabel.value = getBenefitAlias('SGLA')
  phiLabel.value = getBenefitAlias('PHI')
  ttdLabel.value = getBenefitAlias('TTD')
  familyFuneralLabel.value = getBenefitAlias('GFF')
})

const getBenefitAlias = (benefit: any) => {
  const benefitMap = benefitMaps.value.find((map: any) => map.benefit_code === benefit)
  return benefitMap.benefit_alias !== '' ? benefitMap.benefit_alias : benefit
  // return 'WORK'
}

// const validateForm = handleSubmit((values) => {
//   return true
// })

const validateForm = handleSubmit((values) => {
  console.log('Errors:', errors)
  console.log('Handling form values:', values)
  // --- Update boolean flags for benefits ---
  groupStore.group_pricing_quote.ptd_benefit = !!values.ptd_benefit // Ensure boolean
  groupStore.group_pricing_quote.ci_benefit = !!values.ci_benefit
  groupStore.group_pricing_quote.sgla_benefit = !!values.sgla_benefit
  groupStore.group_pricing_quote.phi_benefit = !!values.phi_benefit
  groupStore.group_pricing_quote.ttd_benefit = !!values.ttd_benefit
  groupStore.group_pricing_quote.family_funeral_benefit = !!values.family_funeral_benefit

  // --- PTD Benefit Details ---
  if (values.ptd_benefit) {
    const ptdStore = groupStore.group_pricing_quote.ptd
    ptdStore.risk_type = values.ptd_risk_type
    ptdStore.benefit_type = values.ptd_benefit_type
    ptdStore.salary_multiple = values.ptd_salary_multiple
    ptdStore.deferred_period = values.ptd_deferred_period
    ptdStore.disability_definition = values.ptd_disability_definition
    ptdStore.educator_benefit = values.ptd_educator_benefit
  }

  // --- CI Benefit Details ---
  if (values.ci_benefit) {
    const ciStore = groupStore.group_pricing_quote.ci
    ciStore.benefit_structure = values.ci_benefit_structure
    ciStore.benefit_definition = values.ci_benefit_definition
    ciStore.max_benefit = values.ci_max_benefit
    ciStore.critical_illness_salary_multiple = values.ci_critical_illness_salary_multiple
  }

  // --- SGLA Benefit Details ---
  if (values.sgla_benefit) {
    const sglaStore = groupStore.group_pricing_quote.sgla
    sglaStore.sgla_salary_multiple = values.sgla_salary_multiple
    sglaStore.max_benefit = values.sgla_max_benefit
  }

  // --- PHI Benefit Details ---
  if (values.phi_benefit) {
    const phiStore = groupStore.group_pricing_quote.phi
    phiStore.risk_type = values.phi_risk_type
    phiStore.maximum_benefit = values.phi_maximum_benefit
    phiStore.income_replacement_percentage = values.phi_income_replacement_percentage
    phiStore.premium_waiver = values.phi_premium_waiver
    phiStore.medical_aid_premium_waiver = values.phi_medical_aid_premium_waiver
    phiStore.escalation_percentage = values.phi_escalation_percentage
    phiStore.max_premium_waiver = values.phi_max_premium_waiver
    phiStore.waiting_period = values.phi_waiting_period
    phiStore.number_monthly_payments = values.phi_number_monthly_payments
    phiStore.deferred_period = values.phi_deferred_period
    phiStore.disability_definition = values.phi_disability_definition
  }

  // --- TTD Benefit Details ---
  if (values.ttd_benefit) {
    const ttdStore = groupStore.group_pricing_quote.ttd
    ttdStore.risk_type = values.ttd_risk_type
    ttdStore.maximum_benefit = values.ttd_maximum_benefit
    ttdStore.income_replacement_percentage = values.ttd_income_replacement_percentage
    ttdStore.premium_waiver = values.ttd_premium_waiver
    // Only save ttd_premium_waiver_percentage if premium_waiver is 'Yes'
    if (values.ttd_premium_waiver === 'Yes') {
      ttdStore.premium_waiver_percentage = values.ttd_premium_waiver_percentage
    }
    ttdStore.escalation_percentage = values.ttd_escalation_percentage
    ttdStore.max_premium_waiver = values.ttd_max_premium_waiver
    ttdStore.waiting_period = values.ttd_waiting_period
    ttdStore.number_monthly_payments = values.ttd_number_monthly_payments
    ttdStore.deferred_period = values.ttd_deferred_period
    ttdStore.disability_definition = values.ttd_disability_definition
  }

  // --- Family Funeral Benefit Details ---
  if (values.family_funeral_benefit) {
    // ensureBenefitObject('family_funeral')
    const ffStore = groupStore.group_pricing_quote.family_funeral
    ffStore.main_member_funeral_sum_assured = values.family_funeral_main_member_funeral_sum_assured
    ffStore.spouse_funeral_sum_assured = values.family_funeral_spouse_funeral_sum_assured
    ffStore.children_funeral_sum_assured = values.family_funeral_children_funeral_sum_assured
    ffStore.adult_dependant_sum_assured = values.family_funeral_adult_dependant_sum_assured
    ffStore.parent_funeral_sum_assured = values.family_funeral_parent_funeral_sum_assured
    ffStore.max_number_children = values.family_funeral_max_number_children
    ffStore.max_number_adult_dependants = values.family_funeral_max_number_adult_dependants
  }

  return true
})

onMounted(() => {
  console.log('Quote Benefits Mounted', groupStore.group_pricing_quote)
  // Load income escalations from the store
  GroupPricingService.getIncomeEscalations().then((response) => {
    incomeEscalations.value = response.data
  })
  GroupPricingService.getPtdDisabilityDefinitions().then((response) => {
    ptdDisabilityDefinitions.value = response.data
  })
  GroupPricingService.getTtdDisabilityDefinitions().then((response) => {
    ttdDisabilityDefinitions.value = response.data
  })
  GroupPricingService.getWaitingPeriods('ci_rates').then((response) => {
    ciWaitingPeriods.value = response.data
    console.log('CI Waiting Periods:', ciWaitingPeriods.value)
  })
  GroupPricingService.getWaitingPeriods('ptd_rates').then((response) => {
    ptdWaitingPeriods.value = response.data
    console.log('PTD Waiting Periods:', ptdWaitingPeriods.value)
  })
  GroupPricingService.getWaitingPeriods('ttd_rates').then((response) => {
    ttdWaitingPeriods.value = response.data
    console.log('TTD Waiting Periods:', ttdWaitingPeriods.value)
  })
  GroupPricingService.getWaitingPeriods('phi_rates').then((response) => {
    phiWaitingPeriods.value = response.data
    console.log('PHI Waiting Periods:', phiWaitingPeriods.value)
  })
})

const anyBoxChecked = computed(() => {
  return (
    ptdBenefit.value ||
    ciBenefit.value ||
    sglaBenefit.value ||
    phiBenefit.value ||
    ttdBenefit.value ||
    familyFuneralBenefit.value
  )
})

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
