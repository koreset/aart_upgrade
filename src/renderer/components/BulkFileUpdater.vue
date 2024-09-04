<template>
  <v-dialog v-model="dialog" persistent max-width="550px">
    <template #activator="{ props }">
      <v-btn variant="outlined" rounded size="small" v-bind="props">
        <v-icon color="accent">mdi-file-upload</v-icon>
        <span>Upload</span>
      </v-btn>
    </template>
    <v-card v-if="!uploadSuccess" class="rounded-lg">
      <v-card-title class="header-title accent white--text mb-4"
        >Upload data for {{ tableType }} (csv)</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col>
            <v-file-input
              v-model="file"
              variant="outlined"
              density="compact"
              show-size
              accept=".csv"
              placeholder="Click to choose a file"
              :label="tableType + ' File'"
              prepend-icon="mdi-paperclip"
            >
            </v-file-input>
          </v-col>
        </v-row>
        <v-row v-if="tableType === 'Yield Curve'">
          <v-col>
            <v-text-field
              v-model="yieldCurveCode"
              variant="outlined"
              density="compact"
              placeholder="Enter a yield curve code"
              label="Yield Curve Code"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="tableType === 'Yield Curve'">
          <v-col>
            <v-select
              v-model="selectedYear"
              variant="outlined"
              density="compact"
              label="Select a year for this data set"
              :items="availableYears"
              item-title="year"
              item-value="year"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="tableType === 'Yield Curve'">
            <v-select
              v-model="selectedMonth"
              variant="outlined"
              density="compact"
              label="Select a month for this yield curve table"
              :items="availableMonths"
              item-title="month"
              item-value="month"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              :loading="uploadInProgress"
              :disabled="uploadDisabled"
              rounded
              size="small"
              color="primary"
              class="primary mr-7"
              @click="uploadFile"
              >Upload</v-btn
            >
            <v-progress-circular
              class="mr-7"
              indeterminate
              :size="loaderSize"
              :width="2"
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded variant="text" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>Upload Status for {{ fileName }}</v-card-title>
      <v-card-text>
        <h4>Table was successfully uploaded</h4>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded variant="text" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { DataPayload } from './types'
const newprops = defineProps(['tableType', 'assumptionType', 'uploadComplete'])

const emit = defineEmits<{
  (e: 'uploadFile', payload: DataPayload): void
}>()

// data
const uploadInProgress: any = ref(false)
const uploadDisabled: any = ref(false)
const loaderSize: any = ref(0)
const uploadSuccess: any = ref(false)
const file: any = ref(null)
const dialog: any = ref(false)
const selectedYear: any = ref(null)
const selectedMonth: any = ref(null)
const yieldCurveCode: any = ref(null)
const selectedType: any = ref(null)
const fileName: any = ref(null)

// computed
const availableYears: any = computed(() => {
  const years: any = []
  const currentYear: any = new Date().getFullYear()

  for (let i = 0; i < 20; i++) {
    years.push(currentYear - i)
  }
  return years
})

const availableMonths: any = computed(() => {
  const months: any = []
  for (let i = 1; i < 13; i++) {
    months.push({ month: i })
  }
  return months
})

// methods
const closeDialog = () => {
  dialog.value = false
  uploadSuccess.value = false
  uploadInProgress.value = false
  selectedYear.value = null
  file.value = null
  yieldCurveCode.value = null
  selectedMonth.value = null
  uploadDisabled.value = false
}

// processing of the captured data will be delegated to the parent caller
const uploadFile = () => {
  console.log('uploading file')
  console.log(selectedType.value)
  console.log(newprops.tableType)
  console.log(file.value)
  if (file.value !== null) {
    const payload: DataPayload = {
      file: file.value,
      selectedYear: selectedYear.value,
      selectedMonth: selectedMonth.value,
      yieldCurveCode: yieldCurveCode.value,
      selectedType: newprops.tableType,
      fileName: file.value.name
    }
    uploadInProgress.value = true
    uploadDisabled.value = true

    emit('uploadFile', payload)
  }
}

watch(
  () => newprops.uploadComplete,
  (value) => {
    if (value) {
      closeDialog()
      uploadInProgress.value = false
      uploadDisabled.value = false
    }
  }
)
</script>
