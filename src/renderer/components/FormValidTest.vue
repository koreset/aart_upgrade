<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline"></span>
          </template>
          <template #default>
            <v-form @submit.prevent="onSubmit">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <h2>Order Details</h2>
                    <v-text-field
                      v-model="orderNumber.value.value"
                      :error-messages="errors['orderNumber']"
                      label="Order Number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <h2>User Profile</h2>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="firstName.value.value"
                      :error-messages="errors['user.firstName']"
                      label="First Name"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="lastName.value.value"
                      :error-messages="errors['user.lastName']"
                      label="Last Name"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="email.value.value"
                      :error-messages="errors['user.email']"
                      label="Email"
                      type="email"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <h3>Address</h3>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="street.value.value"
                      :error-messages="errors['user.address.street']"
                      label="Street"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="city.value.value"
                      :error-messages="errors['user.address.city']"
                      label="City"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="postalCode.value.value"
                      :error-messages="errors['user.address.postalCode']"
                      label="Postal Code"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="country.value.value"
                      :items="countryOptions"
                      item-title="text"
                      item-value="value"
                      :error-messages="errors['user.address.country']"
                      label="Country"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <h3>Preferences</h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="newsletter.value.value"
                      :error-messages="errors['user.preferences.newsletter']"
                      label="Subscribe to Newsletter"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="language.value.value"
                      :items="languageOptions"
                      item-title="text"
                      item-value="value"
                      :error-messages="errors['user.preferences.language']"
                      label="Preferred Language"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-btn type="submit" color="primary" class="mr-4">Submit</v-btn>
                    <v-btn type="button" @click="handleReset">Reset Form & Store</v-btn>
                  </v-col>
                </v-row>

                <v-row v-if="submittedValues">
                  <v-col cols="12">
                    <h3>Submitted Values:</h3>
                    <pre>{{ submittedValues }}</pre>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { ref, onMounted, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup' // Changed from @vee-validate/zod
import { myFormValidationSchema } from '@/renderer/components/validations' // Adjust path
import type { ValidatedMyFormData } from '@/renderer/components/validations' // Type import remains the same if defined with yup.InferType
import { useMyFormStore, MyFormData } from '@/renderer/store/my_form_store' // Adjust path
import { storeToRefs } from 'pinia'

// Pinia Store
const myFormStore = useMyFormStore()
const { formData: myStoreFormData } = storeToRefs(myFormStore)

// VeeValidate Form Handling
const {
  handleSubmit,
  errors,
  setValues,
  resetForm,
  values: formValues,
  meta
} = useForm<ValidatedMyFormData>({
  validationSchema: toTypedSchema(myFormValidationSchema),
  initialValues: JSON.parse(JSON.stringify(myStoreFormData.value)) as MyFormData,
  validateOnMount: false // <--- ADD THIS LINE
})

// Define fields using useField (remains the same)
const orderNumber = useField<string>('orderNumber')
const firstName = useField<string>('user.firstName')
const lastName = useField<string>('user.lastName')
const email = useField<string>('user.email')
const street = useField<string>('user.address.street')
const city = useField<string>('user.address.city')
const postalCode = useField<string>('user.address.postalCode')
const country = useField<string>('user.address.country')
const newsletter = useField<boolean>('user.preferences.newsletter')
const language = useField<string>('user.preferences.language')

// Data for select fields (remains the same)
const countryOptions = ref([
  { text: 'United States', value: 'US' },
  { text: 'Canada', value: 'CA' },
  { text: 'United Kingdom', value: 'GB' },
  { text: 'South Africa', value: 'ZA' }
])

const languageOptions = ref([
  { text: 'English', value: 'en' },
  { text: 'Spanish', value: 'es' },
  { text: 'French', value: 'fr' }
])

const submittedValues = ref<ValidatedMyFormData | null>(null)

// Synchronization watches (remain the same)
watch(
  myStoreFormData,
  (newData) => {
    // Only set values if they are different to avoid potential loops
    // and only if the form hasn't been touched by the user yet,
    // or if you explicitly want to override user input.
    if (!meta.value.dirty && JSON.stringify(newData) !== JSON.stringify(formValues)) {
      setValues(JSON.parse(JSON.stringify(newData)))
    }
  },
  { deep: true }
)

watch(
  formValues,
  (newValues) => {
    if (JSON.stringify(newValues) !== JSON.stringify(myStoreFormData.value)) {
      myFormStore.updateFormData(JSON.parse(JSON.stringify(newValues)) as MyFormData)
    }
  },
  { deep: true }
)

onMounted(() => {
  // With validateOnMount: false, initialValues are set without immediate validation.
  // If storeFormData might be populated asynchronously after mount,
  // you might still call setValues here, but the initial load error issue
  // should be resolved by validateOnMount: false.
  // The initialValues in useForm should handle the first sync from Pinia.
  // This explicit setValues might be redundant if Pinia's state is ready at creation.
  // Consider if this call to setValues is truly needed or if initialValues is sufficient.
  if (JSON.stringify(myStoreFormData.value) !== JSON.stringify(formValues)) {
    setValues(JSON.parse(JSON.stringify(myStoreFormData.value)))
  }
})

const onSubmit = handleSubmit(async (values) => {
  submittedValues.value = values
  myFormStore.updateFormData(JSON.parse(JSON.stringify(values)) as MyFormData)
  alert('Form submitted successfully! Check the console.')
  // Optionally, reset the form to a pristine state after submission
  // resetForm({
  //   values: JSON.parse(JSON.stringify(myFormStore.formData)), // Or to a new clean state
  // });
})

const handleReset = () => {
  myFormStore.resetStore()
  resetForm({
    values: JSON.parse(JSON.stringify(myFormStore.formData)) // Reset to Pinia's (now reset) state
  })
  // After resetForm, errors should be cleared. If you want to ensure touched state is also reset for UI:
  // Object.keys(formValues.value).forEach(key => {
  //   const field = useField(key as any);
  //   if (field && field.resetField) {
  //     field.resetField({ value: field.value.value }); // reset with current value to clear touched and errors
  //   }
  // });
  submittedValues.value = null
}
</script>

<style lang="css" scoped></style>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
