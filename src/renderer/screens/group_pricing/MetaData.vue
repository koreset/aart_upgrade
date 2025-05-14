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
                      <v-col><data-grid :row-data="rowData" :column-defs="columnDefs" /> </v-col>
                    </v-row>
                  </template>
                </base-card>
              </v-col>
            </v-row>
            <v-divider class="my-5"></v-divider>
            <h4>Benefits Customization</h4>
            <benefit-mapper @submit="submitBenefits" />
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
import BenefitMapper from '@/renderer/components/grouppricing/BenefitMapper.vue'
import { onMounted, ref } from 'vue'
import ConfirmationDialog from '../../components/ConfirmDialog.vue'
import GroupPricingService from '../../api/GroupPricingService'
// import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import formatValues from '@/renderer/utils/format_values'

const confirmDialog = ref()

// broker data
const brokerName: any = ref('')
const brokers: any = ref([])
const rowData: any = ref([])
const columnDefs: any = ref([])

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
  email: '',
  logo: ''
})

const logoFile: any = ref(null)

// image cropping
const imagePreview: any = ref(null)

const imageToCrop = ref(null)

const createBroker = () => {
  const brokerPayload = {
    name: brokerName.value
  }
  GroupPricingService.createBroker(brokerPayload).then((res) => {
    brokers.value.push(res.data)
    brokerName.value = null
  })
}

// const deleteBroker = async (id: number) => {
// }

const submitBenefits = async (benefits: any) => {
  await GroupPricingService.saveBenefitMap(benefits)
}

const createInsurer = async () => {
  const formData = new FormData()
  formData.append('insurer', JSON.stringify(insurerData.value))
  formData.append('logo', logoFile.value)
  // insurerData.value.logo = imagePreview.value

  await GroupPricingService.createInsurer(formData)
}

onMounted(() => {
  GroupPricingService.getBrokers().then((res) => {
    if (res.data.length > 0) {
      brokers.value = res.data
      rowData.value = res.data
      createColumnDefs(res.data)
    } else {
      brokers.value = []
    }
  })
  GroupPricingService.getInsurer().then((res) => {
    if (res.data) {
      insurerData.value = res.data
      imagePreview.value = `data:image/*;base64,${insurerData.value.logo}`
    }
  })
})

const onFileChange = (e: any) => {
  const file = e.target.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        imagePreview.value = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    header.sortable = true
    header.filter = true
    header.resizable = true
    columnDefs.value.push(header)
  })
}
</script>

<style scoped></style>
