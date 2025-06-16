<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col v-if="!groupStore.group_pricing_quote.use_global_salary_multiple" cols="4">
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
import { onMounted } from 'vue'

const groupStore = useGroupPricingStore()

const validationSchema = yup.object({
  salary_multiple: yup.number().when([], {
    is: () => !groupStore.group_pricing_quote.use_global_salary_multiple,
    then: (schema) =>
      schema
        .required('Salary multiple is required')
        .positive('Salary multiple must be a positive number'),
    otherwise: (schema) => schema.nullable()
  }),
  terminal_illness_benefit: yup.string().required('Terminal illness benefit is required'),
  waiting_period: yup
    .number()
    .required('Waiting period is required')
    .min(0, 'Waiting period must be at least 0'),
  educator_benefit: yup.string().required('Educator benefit is required')
})

const { handleSubmit, errors, defineField } = useForm({
  validationSchema,
  initialValues: {
    salary_multiple: groupStore.group_pricing_quote.gla.salary_multiple,
    terminal_illness_benefit: groupStore.group_pricing_quote.gla.terminal_illness_benefit,
    waiting_period: groupStore.group_pricing_quote.gla.waiting_period,
    educator_benefit: groupStore.group_pricing_quote.gla.educator_benefit
  }
})

onMounted(() => {
  console.log('filled quote: ', groupStore.group_pricing_quote)
})

const validateForm = handleSubmit((values) => {
  // Assign validated values to the Pinia store
  groupStore.group_pricing_quote.gla.salary_multiple = values.salary_multiple
  groupStore.group_pricing_quote.gla.terminal_illness_benefit = values.terminal_illness_benefit
  groupStore.group_pricing_quote.gla.waiting_period = values.waiting_period
  groupStore.group_pricing_quote.gla.educator_benefit = values.educator_benefit

  // console.log('Updated groupStore.group_pricing_quote.gla:', groupStore.group_pricing_quote.gla);
  return true // Indicate successful handling
})

const [salaryMultiple, salaryMultipleAttrs] = defineField('salary_multiple')
const [terminalIllnessBenefit, terminalIllnessBenefitAttrs] = defineField(
  'terminal_illness_benefit'
)
const [waitingPeriod, waitingPeriodAttrs] = defineField('waiting_period')
const [educatorBenefit, educatorBenefitAttrs] = defineField('educator_benefit')

defineExpose({
  validateForm
})
</script>
<style lang="css" scoped></style>
