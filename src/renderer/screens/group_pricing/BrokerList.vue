<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="true">
          <template #header>
            <span class="headline">Group Pricing Metadata</span>
          </template>
          <template #default>
            <h4>Insurer Data</h4>
            <v-row class="mt-9 mx-5">
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.name"
                  variant="outlined"
                  density="compact"
                  label="Insurer Name"
                  placeholder="Insurer Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-5">
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.address_line_1"
                  variant="outlined"
                  density="compact"
                  label="Address Line 1"
                  placeholder="Insurer Name"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.address_line_2"
                  variant="outlined"
                  density="compact"
                  label="Address Line 2"
                  placeholder="Insurer Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-5">
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.city"
                  variant="outlined"
                  density="compact"
                  label="City"
                  placeholder="City"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.province"
                  variant="outlined"
                  density="compact"
                  label="Province"
                  placeholder="Province"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.post_code"
                  variant="outlined"
                  density="compact"
                  label="Postal Code"
                  placeholder="Postal Code"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-5">
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.email"
                  variant="outlined"
                  density="compact"
                  label="Email"
                  placeholder="Email"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="insurerData.telephone"
                  variant="outlined"
                  density="compact"
                  label="Telephone"
                  placeholder="Telephone"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-5">
              <v-col cols="4">
                <v-file-input
                  v-model="logoFile"
                  density="compact"
                  label="Company Logo"
                  accept="image/*"
                  variant="outlined"
                  prepend-icon="mdi-file-image"
                  required
                  @change="onFileChange"
                />
              </v-col>
              <v-col cols="6">
                <div v-if="imagePreview" style="max-width: 200px">
                  <img
                    ref="imageToCrop"
                    :src="imagePreview"
                    style="max-width: 100%"
                    alt="To Crop"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-btn
                  rounded
                  class="primary mt-1"
                  size="small"
                  variant="outlined"
                  @click="createInsurer"
                  >Save Insurer</v-btn
                >
              </v-col>
            </v-row>

            <v-divider class="my-5"></v-divider>
            <h4>Broker Data</h4>
            <v-row class="mt-9 mx-5">
              <v-col cols="3">
                <v-text-field
                  v-model="brokerName"
                  class="mr-9"
                  placeholder="Broker Name"
                  label="Broker Name"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex align-baseline" cols="3">
                <v-btn
                  rounded
                  class="primary mt-1"
                  size="small"
                  variant="outlined"
                  @click="createBroker"
                  >Add Broker</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="brokers.length > 0" class="mx-5">
              <v-col>
                <base-card :showActions="false">
                  <template #header>
                    <span class="headline">Broker List</span>
                  </template>
                  <template #default>
                    <v-row>
                      <v-col> Broker Table Here </v-col>
                    </v-row>
                  </template>
                </base-card>
              </v-col>
            </v-row>
            <v-divider class="my-5"></v-divider>
            <h4>Scheme Data</h4>
          </template>
          <template #actions> </template>
        </base-card>
      </v-col>
    </v-row>
    <confirmation-dialog ref="confirmDialog"></confirmation-dialog>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../../components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import ConfirmationDialog from '../../components/ConfirmDialog.vue'
import GroupPricingService from '../../api/GroupPricingService'
// import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const confirmDialog = ref()

// broker data
const brokerName: any = ref('')
const brokers: any = ref([])

// insurer data
const insurerData: any = ref({
  name: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  province: '',
  post_code: '',
  country: '',
  telephone: '',
  email: ''
})

const logoFile: any = ref(null)

// image cropping
const imagePreview: any = ref(null)

const imageToCrop = ref(null)

const createBroker = () => {
  console.log('Creating Portfolio')
  const brokerPayload = {
    name: brokerName.value
  }
  GroupPricingService.createBroker(brokerPayload).then((res) => {
    brokers.value.push(res.data)
    brokerName.value = null
  })
}

// const deleteBroker = async (id: number) => {
//   console.log('Deleting Portfolio', id)
// }

const createInsurer = () => {
  console.log('Creating Insurer')
  const formData = new FormData()
  formData.append('insurer', JSON.stringify(insurerData.value))
  formData.append('logo', logoFile.value)

  GroupPricingService.createInsurer(formData).then((res) => {
    console.log('Insurer Created', res.data)
  })
  // const insurerPayload = {
  //   name: insurerData.value.name,
  //   address1: insurerData.value.address1,
  //   address2: insurerData.value.address2,
  //   city: insurerData.value.city,
  //   province: insurerData.value.province,
  //   postCode: insurerData.value.postCode,
  //   country: insurerData.value.country,
  //   phone: insurerData.value.phone,
  //   email: insurerData.value.email,
  //   logo: insurerData.value.logo
  // }
  // GroupPricingService.createInsurer(insurerPayload).then((res) => {
  //   console.log('Insurer Created', res.data)
  // })
}

onMounted(() => {
  GroupPricingService.getBrokers().then((res) => {
    if (res.data.length > 0) {
      brokers.value = res.data
    } else {
      brokers.value = []
    }
  })
  GroupPricingService.getInsurer().then((res) => {
    if (res.data) {
      insurerData.value = res.data
      console.log('Insurer Data', res.data)
      imagePreview.value = `data:image/*;base64,${insurerData.value.logo}`
    }
  })
})

const onFileChange = (e: any) => {
  const file = e.target.files[0]
  console.log('File Changed', file)

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        imagePreview.value = e.target.result
        console.log('Image Preview', imagePreview.value)
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped></style>
