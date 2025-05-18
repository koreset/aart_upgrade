// stores/myFormStore.ts
import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

// Define types for your nested structure (remains the same)
export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  address: Address
  preferences: {
    newsletter: boolean
    language: string
  }
}

export interface MyFormData {
  user: UserProfile
  orderNumber: string
}

export const useMyFormStore = defineStore('myForm', () => {
  const formData: Ref<MyFormData> = ref({
    orderNumber: '',
    user: {
      firstName: '',
      lastName: '',
      email: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: ''
      },
      preferences: {
        newsletter: false,
        language: ''
      }
    }
  })

  function updateFormData(payload: Partial<MyFormData>) {
    formData.value = { ...formData.value, ...payload }
  }

  function setInitialData(data: MyFormData) {
    formData.value = JSON.parse(JSON.stringify(data))
  }

  function resetStore() {
    formData.value = {
      orderNumber: '',
      user: {
        firstName: '',
        lastName: '',
        email: '',
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        preferences: {
          newsletter: false,
          language: ''
        }
      }
    }
  }

  return {
    formData,
    updateFormData,
    setInitialData,
    resetStore
  }
})
