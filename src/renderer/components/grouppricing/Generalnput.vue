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
            :items="currencyOptions"
            item-title="label"
            item-value="value"
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
        <v-col
          v-if="
            groupStore.group_pricing_quote.quote_type !== '' &&
            groupStore.group_pricing_quote.quote_type !== null
          "
          cols="4"
        >
          <v-checkbox
            v-model="useGlobalSalaryMultiple"
            v-bind="useGlobalSalaryMultipleAttrs"
            variant="outlined"
            density="compact"
            label="Use Global Salary Multiple"
            :error-messages="errors.use_global_salary_multiple"
          ></v-checkbox>
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
import { onMounted, ref, watch } from 'vue'

const groupStore = useGroupPricingStore()
const industries = ref(['Administration', 'NGO', 'Banks'])
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
  use_global_salary_multiple: yup.boolean().nullable(),
  free_cover_limit: yup.number().when('enforce_fcl', {
    is: (val) => val === true,
    then: (schema) =>
      schema
        .required('Free cover limit is required')
        .min(1, 'Free cover limit must be greater than 0')
        .typeError('Free cover limit must be a number'),
    otherwise: (schema) => schema.nullable()
  })
})

// methods
const { handleSubmit, defineField, errors, resetForm } = useForm({
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
    enforce_fcl: groupStore.group_pricing_quote.enforce_fcl,
    use_global_salary_multiple: groupStore.group_pricing_quote.use_global_salary_multiple
  }
})

// const validateForm = handleSubmit(async (values) => {
//   groupStore.group_pricing_quote.scheme_name = values.scheme_name
//   return true
//   // Perform any additional actions with the form values
// })

const validateForm = handleSubmit(async (values) => {
  // 'values' contains all the validated form fields
  // Assign them to your Pinia store state

  console.log('Form values:', values)

  // Quote Type is already handled by chooseQuoteFlow, but can be set here for consistency
  if (values.quote_type !== undefined) {
    // Check if defined, as it might be null
    groupStore.group_pricing_quote.quote_type = values.quote_type
  }

  groupStore.group_pricing_quote.scheme_name = values.scheme_name

  // Conditionally update New Business fields
  if (groupStore.group_pricing_quote.quote_type === 'New Business') {
    groupStore.group_pricing_quote.scheme_contact = values.scheme_contact
    groupStore.group_pricing_quote.scheme_email = values.scheme_email
  } else {
    // Optionally clear them if not New Business
    groupStore.group_pricing_quote.scheme_contact = null
    groupStore.group_pricing_quote.scheme_email = null
  }

  // Fields common to all quote types (if a quote_type is selected)
  if (values.quote_type !== '' && values.quote_type !== null) {
    groupStore.group_pricing_quote.quote_broker = values.quote_broker // This is an object
    groupStore.group_pricing_quote.obligation_type = values.obligation_type
    groupStore.group_pricing_quote.commencement_date = values.commencement_date
    groupStore.group_pricing_quote.industry = values.industry
    groupStore.group_pricing_quote.scheme_type = values.scheme_type
    groupStore.group_pricing_quote.currency = values.currency
    groupStore.group_pricing_quote.experience_rating = values.experience_rating
    groupStore.group_pricing_quote.enforce_fcl = values.enforce_fcl
    groupStore.group_pricing_quote.use_global_salary_multiple = values.use_global_salary_multiple

    if (values.enforce_fcl) {
      groupStore.group_pricing_quote.free_cover_limit = values.free_cover_limit
    } else {
      groupStore.group_pricing_quote.free_cover_limit = 0 // Or appropriate default
    }

    if (values.currency === 'USD') {
      // Assuming your defineField for exchangeRate is ('exchange_rate')
      // and your store property is groupStore.group_pricing_quote.exchangeRate
      groupStore.group_pricing_quote.exchangeRate = values.exchange_rate
    } else {
      groupStore.group_pricing_quote.exchangeRate = 0 // Or appropriate default
    }
  }

  // console.log('Updated groupStore.group_pricing_quote:', groupStore.group_pricing_quote);
  return true // Indicate successful handling
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
const [enforceFCL, enforceFCLAttrs] = defineField('enforce_fcl')
const [useGlobalSalaryMultiple, useGlobalSalaryMultipleAttrs] = defineField(
  'use_global_salary_multiple'
)

const chooseQuoteFlow = (value: string | null) => {
  if (value !== null) {
    groupStore.group_pricing_quote.quote_type = value
  }
}

defineExpose({
  validateForm
})

watch(
  () => groupStore.group_pricing_quote,
  (newQuoteData) => {
    console.log('New quote data:', newQuoteData)
    // Ensure newQuoteData is what you expect, e.g., not null or empty
    // before resetting the form. You might want a more specific trigger,
    // like an `isLoaded` flag or watching a specific ID property.
    if (newQuoteData && newQuoteData.quote_type) {
      // Example condition
      resetForm({
        values: {
          quote_type: newQuoteData.quote_type,
          scheme_name: newQuoteData.scheme_name,
          scheme_contact: newQuoteData.scheme_contact,
          scheme_email: newQuoteData.scheme_email,
          quote_broker: newQuoteData.quote_broker,
          obligation_type: newQuoteData.obligation_type,
          commencement_date: newQuoteData.commencement_date,
          industry: newQuoteData.industry,
          scheme_type: newQuoteData.scheme_type,
          currency: newQuoteData.currency,
          experience_rating: newQuoteData.experience_rating,
          enforce_fcl: newQuoteData.enforce_fcl || false,
          free_cover_limit: newQuoteData.free_cover_limit,
          exchange_rate: newQuoteData.exchangeRate,
          use_global_salary_multiple: newQuoteData.use_global_salary_multiple
        }
      })
    }
  },
  { deep: true, immediate: false }
)

onMounted(async () => {
  // Fetch brokers from the API
  try {
    const response = await GroupPricingService.getBrokers()
    if (response) {
      brokerList.value = response.data
      groupStore.brokers = response.data
    }
    const industryResponse = await GroupPricingService.getIndustries()
    if (industryResponse) {
      industries.value = industryResponse.data
      groupStore.industries = industryResponse.data
    }
  } catch (error) {
    console.error('Error fetching brokers:', error)
  }
})

// Currency options for the dropdown
const currencyOptions = [
  { label: 'South African Rand', value: 'ZAR' },
  { label: 'US Dollar', value: 'USD' },
  { label: 'Euro', value: 'EUR' },
  { label: 'British Pound', value: 'GBP' },
  { label: 'Japanese Yen', value: 'JPY' },
  { label: 'Swiss Franc', value: 'CHF' },
  { label: 'Canadian Dollar', value: 'CAD' },
  { label: 'Australian Dollar', value: 'AUD' },
  { label: 'Chinese Yuan', value: 'CNY' }
  // Add more as needed
]
</script>
<style lang="css" scoped></style>
