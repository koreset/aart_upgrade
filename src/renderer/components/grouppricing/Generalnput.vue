<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="quoteType"
            v-bind="quoteTypeAttrs"
            variant="outlined"
            density="compact"
            clearable
            placeholder="Choose quote type"
            label="Quote for"
            :error-messages="errors.quote_type"
            :items="groupStore.quoteTypes"
            @update:model-value="chooseQuoteFlow"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'New Business'" cols="4">
          <v-text-field
            v-model="schemeName"
            v-bind="schemeNameAttrs"
            variant="outlined"
            density="compact"
            label="Scheme Name"
            :error-messages="errors.scheme_name"
            placeholder="Enter a scheme name"
          ></v-text-field>
        </v-col>
        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'New Business'" cols="4">
          <v-text-field
            v-model="schemeContact"
            v-bind="schemeContactAttrs"
            variant="outlined"
            density="compact"
            label="Scheme Contact"
            placeholder="Enter a name of scheme contact"
            :error-messages="errors.scheme_contact"
          ></v-text-field>
        </v-col>
        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'New Business'" cols="4">
          <v-text-field
            v-model="schemeEmail"
            v-bind="schemeEmailAttrs"
            variant="outlined"
            density="compact"
            label="Scheme Email"
            placeholder="Enter an email of scheme contact"
            :error-messages="errors.scheme_email"
          ></v-text-field>
        </v-col>

        <v-col v-if="groupStore.group_pricing_quote.quote_type === 'Renewal'" cols="4">
          <v-select
            v-model="schemeName"
            clearable
            v-bind="schemeNameAttrs"
            variant="outlined"
            density="compact"
            label="Scheme Name"
            placeholder="Choose a scheme name"
            :error-messages="errors.scheme_name"
            :items="groupStore.groupSchemes"
            item-title="name"
            item-value="name"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="quoteBroker"
            v-bind="quoteBrokerAttrs"
            variant="outlined"
            density="compact"
            placeholder="Choose a broker"
            label="Broker"
            :error-messages="errors.quote_broker"
            :items="groupStore.brokers"
            item-title="name"
            item-value="id"
            return-object
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model:model-value="obligationType"
            v-bind="obligationTypeAttrs"
            variant="outlined"
            density="compact"
            label="Obligation Type"
            placeholder="Choose an obligation type"
            :error-messages="errors.obligation_type"
            :items="groupStore.obligationTypes"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-date-input
            v-model="commencementDate"
            v-bind="commencementDateAttrs"
            hide-actions
            locale="en-ZA"
            view-mode="month"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="outlined"
            density="compact"
            label="Commencement Date"
            placeholder="Select a date"
            :error-messages="errors.commencement_date"
          ></v-date-input>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="industry"
            v-bind="industryAttrs"
            variant="outlined"
            density="compact"
            label="Industry"
            placeholder="Choose an industry"
            :error-messages="errors.industry"
            :items="industries"
          >
          </v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="schemeType"
            v-bind="schemeTypeAttrs"
            variant="outlined"
            density="compact"
            placeholder="Choose a scheme type"
            label="Scheme Type"
            :error-messages="errors.scheme_type"
            :items="groupStore.schemeTypes"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="currency"
            v-bind="currencyAttrs"
            placeholder="Choose a currency"
            label="Currency"
            variant="outlined"
            density="compact"
            :error-messages="errors.currency"
            :items="groupStore.currencies"
          ></v-select>
        </v-col>
        <v-col v-if="groupStore.group_pricing_quote.currency === 'USD'" cols="4">
          <v-text-field
            v-model:model-value="exchangeRate"
            v-bind="exchangeRateAttrs"
            type="number"
            variant="outlined"
            density="compact"
            placeholder="Enter a value"
            :error-messages="errors.exchange_rate"
            label="Exchange Rate for USD"
          ></v-text-field>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-select
            v-model="experienceRating"
            v-bind="experienceRatingAttrs"
            variant="outlined"
            density="compact"
            label="Claims Experience"
            placeholder="Choose a claims experience?"
            :error-messages="errors.experience_rating"
            :items="groupStore.claimsExperiences"
          ></v-select>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
        >
          <v-checkbox
            v-model="enforceFCL"
            v-bind="enforceFCLAttrs"
            variant="outlined"
            density="compact"
            label="Enforce Free Cover Limit"
            placeholder="Enforce Free Cover Limit"
          ></v-checkbox>
        </v-col>
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null &&
            enforceFCL
          "
          cols="4"
        >
          <v-text-field
            v-model="freeCoverLimit"
            v-bind="freeCoverLimitAttrs"
            variant="outlined"
            density="compact"
            label="Free Cover Limit"
            type="number"
            placeholder="Free Cover Limit"
            :error-messages="errors.free_cover_limit"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { useGroupPricingStore } from '@/renderer/store/group_pricing'
import { VDateInput } from 'vuetify/labs/VDateInput'
import GroupPricingService from '@/renderer/api/GroupPricingService'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref } from 'vue'

const groupStore = useGroupPricingStore()
const industries = ['Administration', 'NGO', 'Banks']
const brokerList = ref([])

// validation schema
const validationSchema = yup.object({
  quote_type: yup
    .string()
    .nullable()
    .required('Quote type is required')
    .oneOf(groupStore.quoteTypes, 'Invalid quote type'),
  scheme_name: yup
    .string()
    .required('Scheme name is required')
    .min(3, 'Scheme name must be at least 3 characters long')
    .max(50, 'Scheme name must be at most 50 characters long')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Scheme name can only contain letters, numbers, and spaces')
    .test('unique', 'Scheme name must be unique', async (value) => {
      // const existingSchemes = groupStore.groupSchemes.map((scheme) => scheme.name)
      // return !existingSchemes.includes(value)
      return true
    }),
  scheme_contact: yup.string().when('quote_type', {
    is: (val) => val === 'New Business',
    then: (schema) => schema.required('Scheme contact is required'),
    otherwise: (schema) => schema.nullable()
  }),
  scheme_email: yup.string().when('quote_type', {
    is: (val) => val === 'New Business',
    then: (schema) =>
      schema.required('Scheme email is required').email('Scheme email must be a valid email'),
    otherwise: (schema) => schema.nullable()
  }),
  quote_broker: yup.object().required('Broker is required'),
  obligation_type: yup.string().required('Obligation type is required'),
  commencement_date: yup
    .date()
    .required('Commencement date is required')
    .typeError('Commencement date must be a valid date'),
  industry: yup.string().required('Industry is required'),
  scheme_type: yup.string().required('Scheme type is required'),
  currency: yup.string().required('Currency is required'),
  experience_rating: yup.string().when('quote_type', {
    is: (val) => val !== '' && val !== null,
    then: (schema) => schema.required('Experience rating is required'),
    otherwise: (schema) => schema.nullable()
  }),
  enforce_fcl: yup.boolean().nullable(),
  free_cover_limit: yup.number().when('enforce_fcl', {
    is: (val) => val === true,
    then: (schema) =>
      schema
        .required('Free cover limit is required')
        .min(1, 'Free cover limit must be greater than 0')
        .typeError('Free cover limit must be a number'),
    otherwise: (schema) => schema.nullable()
  }),
  exchangeRate: yup.number().when('currency', {
    is: (val) => val === 'USD',
    then: (schema) =>
      schema
        .required('Exchange rate is required')
        .typeError('Exchange rate must be a number')
        .min(0, 'Exchange rate must be at least 0'),
    otherwise: (schema) => schema.nullable()
  })
})

// methods
const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: {
    scheme_name: groupStore.group_pricing_quote.scheme_name,
    quote_type: groupStore.group_pricing_quote.quote_type,
    scheme_contact: groupStore.group_pricing_quote.scheme_contact,
    scheme_email: groupStore.group_pricing_quote.scheme_email,
    quote_broker: groupStore.group_pricing_quote.quote_broker,
    obligation_type: groupStore.group_pricing_quote.obligation_type,
    commencement_date: groupStore.group_pricing_quote.commencement_date,
    industry: groupStore.group_pricing_quote.industry,
    scheme_type: groupStore.group_pricing_quote.scheme_type,
    currency: groupStore.group_pricing_quote.currency,
    experience_rating: groupStore.group_pricing_quote.experience_rating,
    free_cover_limit: groupStore.group_pricing_quote.free_cover_limit,
    normal_retirement_age: groupStore.group_pricing_quote.normal_retirement_age,
    exchange_rate: groupStore.group_pricing_quote.exchangeRate,
    enforce_fcl: groupStore.group_pricing_quote.enforce_fcl
  }
})

const validateForm = handleSubmit(async (values) => {
  groupStore.group_pricing_quote.scheme_name = values.scheme_name
  return true
  // Perform any additional actions with the form values
})

const [schemeName, schemeNameAttrs] = defineField('scheme_name')
const [quoteType, quoteTypeAttrs] = defineField('quote_type')
const [schemeContact, schemeContactAttrs] = defineField('scheme_contact')
const [schemeEmail, schemeEmailAttrs] = defineField('scheme_email')
const [quoteBroker, quoteBrokerAttrs] = defineField('quote_broker')
const [obligationType, obligationTypeAttrs] = defineField('obligation_type')
const [commencementDate, commencementDateAttrs] = defineField('commencement_date')
const [industry, industryAttrs] = defineField('industry')
const [schemeType, schemeTypeAttrs] = defineField('scheme_type')
const [currency, currencyAttrs] = defineField('currency')
const [experienceRating, experienceRatingAttrs] = defineField('experience_rating')
const [freeCoverLimit, freeCoverLimitAttrs] = defineField('free_cover_limit')
const [exchangeRate, exchangeRateAttrs] = defineField('exchange_rate')
const [enforceFCL, enforceFCLAttrs] = defineField('enforce_fcl')

const chooseQuoteFlow = (value: string | null) => {
  if (value !== null) {
    groupStore.group_pricing_quote.quote_type = value
  }
}

defineExpose({
  validateForm
})

onMounted(async () => {
  // Fetch brokers from the API
  try {
    const response = await GroupPricingService.getBrokers()
    if (response) {
      brokerList.value = response.data
      groupStore.brokers = response.data
    }
  } catch (error) {
    console.error('Error fetching brokers:', error)
  }
})
</script>
<style lang="css" scoped></style>
