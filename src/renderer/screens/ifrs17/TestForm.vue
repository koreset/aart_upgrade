<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Test Form</span>
          </template>
          <template #default>
            <v-row>
              <v-col>
                <form @submit.prevent="addToJobs">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="name.value.value"
                        density="compact"
                        variant="outlined"
                        :counter="10"
                        :error-messages="name.errorMessage.value"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="phone.value.value"
                        density="compact"
                        variant="outlined"
                        :counter="7"
                        :error-messages="phone.errorMessage.value"
                        label="Phone Number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="email.value.value"
                        density="compact"
                        variant="outlined"
                        :error-messages="email.errorMessage.value"
                        label="E-mail"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="anotherField"
                        density="compact"
                        variant="outlined"
                        label="Another field"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        v-model="select.value.value"
                        density="compact"
                        variant="outlined"
                        :error-messages="select.errorMessage.value"
                        :items="items"
                        label="Select"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-checkbox
                        v-model="checkbox.value.value"
                        :error-messages="checkbox.errorMessage.value"
                        label="Option"
                        type="checkbox"
                        value="1"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row
                    ><v-col>
                      <v-btn class="me-4" type="submit"> submit </v-btn>

                      <v-btn @click="handleReset"> clear </v-btn>
                    </v-col></v-row
                  >
                </form>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import BaseCard from '../../components/BaseCard.vue'
import * as yup from 'yup'

// const { handleSubmit, handleReset } = useForm({
//   validationSchema: {
//     name(value) {
//       if (value?.length >= 2) return true

//       return 'Name needs to be at least 2 characters.'
//     },
//     phone(value) {
//       if (/^[0-9-]{7,}$/.test(value)) return true

//       return 'Phone number needs to be at least 7 digits.'
//     },
//     email(value) {
//       if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

//       return 'Must be a valid e-mail.'
//     },
//     select(value) {
//       if (value) return true

//       return 'Select an item.'
//     },
//     checkbox(value) {
//       if (value === '1') return true

//       return 'Must be checked.'
//     }
//   }
// })
// const name = useField('name')
// const phone = useField('phone')
// const email = useField('email')
// const select = useField('select')
// const checkbox = useField('checkbox')

// Define the validation schema using yup
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .test('unique-name', 'Name is already taken', async (value) => {
      if (!value) return false
      const isDuplicate = await isNameDuplicate(value)
      return !isDuplicate // Valid if it's NOT a duplicate
    }),
  phone: yup
    .string()
    .required('Hey, Number is required')
    .matches(/^[0-9-]{7,}$/, 'Phone number must be at least 7 digits'),
  email: yup.string().email('Must be a valid e-mail').required('E-mail is required'),
  select: yup.string().required('Please select an item'),
  checkbox: yup.string().oneOf(['1'], 'Option must be checked')
})

// Initialize the form with schema
const { handleSubmit, handleReset } = useForm({
  validationSchema: schema
})

const name = useField('name')
const phone = useField('phone')
const email = useField('email')
const select = useField('select')
const checkbox = useField('checkbox')
const anotherField = ref(null)

const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 4'])

const isNameDuplicate = async (name: string) => {
  const existingNames = ['Jome', 'Tega', 'Efe', 'Osariemen'] // Example existing names in the database
  return existingNames.includes(name)
}

const addToJobs = handleSubmit((values) => {
  console.log(values)
  // alert(JSON.stringify(values, null, 2))
  console.log('unhandled field:', anotherField.value)
})
</script>
