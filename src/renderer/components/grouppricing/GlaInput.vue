<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="salaryMultiple"
            v-bind="salaryMultipleAttrs"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            :error-messages="errors.salary_multiple"
            label="GLA Salary Multiple"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="terminalIllnessBenefit"
            v-bind="terminalIllnessBenefitAttrs"
            variant="outlined"
            density="compact"
            label="Terminal Illness Benefit"
            placeholder="Add Terminal Illness Benefit"
            :error-messages="errors.terminal_illness_benefit"
            :items="groupStore.terminalIllnessBenefits"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="waitingPeriod"
            v-bind="waitingPeriodAttrs"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            :error-messages="errors.waiting_period"
            label="Waiting Period"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model:model-value="coverTerminationAge"
            v-bind="coverTerminationAgeAttrs"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            :error-messages="errors.cover_termination_age"
            label="Cover Termination Age"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="educatorBenefit"
            v-bind="educatorBenefitAttrs"
            variant="outlined"
            density="compact"
            label="Educator Benefit"
            placeholder="Enable Educator Benefit"
            :error-messages="errors.educator_benefit"
            :items="groupStore.yesNoItems"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const groupStore = useGroupPricingStore()

const validationSchema = yup.object({
  salary_multiple: yup
    .number()
    .required('Salary multiple is required')
    .positive('Salary multiple must be a positive number'),
  terminal_illness_benefit: yup.string().required('Terminal illness benefit is required'),
  waiting_period: yup
    .number()
    .required('Waiting period is required')
    .positive('Waiting period must be a positive number'),
  cover_termination_age: yup
    .number()
    .required('Cover termination age is required')
    .positive('Cover termination age must be a positive number'),
  educator_benefit: yup.string().required('Educator benefit is required')
})

const { handleSubmit, errors, defineField } = useForm({
  validationSchema,
  initialValues: {
    salary_multiple: groupStore.group_pricing_quote.gla.salary_multiple,
    terminal_illness_benefit: groupStore.group_pricing_quote.gla.terminal_illness_benefit,
    waiting_period: groupStore.group_pricing_quote.gla.waiting_period,
    cover_termination_age: groupStore.group_pricing_quote.gla.cover_termination_age,
    educator_benefit: groupStore.group_pricing_quote.gla.educator_benefit
  }
})

const validateForm = handleSubmit((values) => {
  console.log('Form values:', values)
  return true
})

const [salaryMultiple, salaryMultipleAttrs] = defineField('salary_multiple')
const [terminalIllnessBenefit, terminalIllnessBenefitAttrs] = defineField(
  'terminal_illness_benefit'
)
const [waitingPeriod, waitingPeriodAttrs] = defineField('waiting_period')
const [coverTerminationAge, coverTerminationAgeAttrs] = defineField('cover_termination_age')
const [educatorBenefit, educatorBenefitAttrs] = defineField('educator_benefit')

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
