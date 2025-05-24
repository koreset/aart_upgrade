<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    max-width="500px"
    @update:model-value="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Select Year and Version</span>
      </v-card-title>
      <v-card-subtitle>
        For table: <strong>{{ tableType }}</strong>
      </v-card-subtitle>

      <v-card-text>
        <v-container v-if="isLoading">
          <v-row justify="center" class="py-6">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="text-center mt-4 grey--text text--darken-1">Loading available versions...</p>
          </v-row>
        </v-container>

        <v-container v-else-if="fetchError">
          <v-alert type="error" prominent border="start" variant="tonal">
            {{ fetchError }}
          </v-alert>
        </v-container>

        <v-container v-else-if="!allYearVersionsData.length">
          <v-alert type="info" prominent border="start" variant="tonal">
            No specific year/version data found for the table "{{ tableType }}".
          </v-alert>
        </v-container>

        <v-container v-else>
          <v-select
            v-model="selectedYearRef"
            :items="availableYears"
            label="Select Year"
            variant="outlined"
            density="compact"
            class="mb-4"
            clearable
            :disabled="isLoading"
            @update:model-value="onYearSelectedInternal"
          ></v-select>
          <v-select
            v-model="selectedVersionRef"
            :items="availableVersionsForSelectedYear"
            label="Select Version"
            variant="outlined"
            density="compact"
            clearable
            :disabled="!selectedYearRef || isLoading"
          ></v-select>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded size="small" variant="plain" :disabled="isLoading" @click="handleCancel"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          :disabled="isLoading || !selectedYearRef || !selectedVersionRef"
          @click="handleConfirmSelection"
        >
          Confirm Selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import CsmEngine from '@/renderer/api/CsmEngine' // Adjust path as needed

// Updated interface to match the new API response structure
interface YearVersion {
  year: number
  version: string[] // Changed from string to string[]
}

interface Props {
  modelValue: boolean // For v-model:dialogVisible or similar
  tableName: string | null
  tableType: string // Used for display purposes
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'selected', payload: { year: number; version: string; tableName: string }): void
  (e: 'cancelled'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLoading = ref(false)
const fetchError = ref<string | null>(null)
const allYearVersionsData = ref<YearVersion[]>([]) // This will now hold the new structure
const selectedYearRef = ref<number | null>(null)
const selectedVersionRef = ref<string | null>(null)

const lowerCaseAndSnakeCase = (value: string): string => {
  return value.toLowerCase().replace(/ /g, '_')
}

const availableYears = computed(() => {
  if (!allYearVersionsData.value.length) return []
  // This logic remains the same as 'item.year' is still directly accessible
  const years = new Set(allYearVersionsData.value.map((item) => item.year))
  return Array.from(years).sort((a, b) => b - a) // Sort descending
})

// Updated computed property for available versions
const availableVersionsForSelectedYear = computed(() => {
  if (!selectedYearRef.value || !allYearVersionsData.value.length) return []

  // Find the data for the selected year
  const yearData = allYearVersionsData.value.find((item) => item.year === selectedYearRef.value)

  // If yearData is found, its 'version' property is the array of version strings
  // We return a sorted copy of this array
  return yearData ? yearData.version.slice().sort() : []
})

const resetComponentState = () => {
  isLoading.value = false
  fetchError.value = null
  allYearVersionsData.value = []
  selectedYearRef.value = null
  selectedVersionRef.value = null
}

const fetchYearVersions = async (nameOfTable: string) => {
  if (!nameOfTable) {
    fetchError.value = 'Table name is not provided.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  fetchError.value = null
  allYearVersionsData.value = []
  selectedYearRef.value = null
  selectedVersionRef.value = null

  try {
    const lowerTableType = lowerCaseAndSnakeCase(nameOfTable)
    // Ensure CsmEngine.getTableYearVersions returns data in the new format:
    // Promise<{ data: YearVersion[] } | null | undefined>
    const resp = await CsmEngine.getTableYearVersions(lowerTableType)

    // Assuming resp.data is now of type YearVersion[]
    // e.g., [ { year: 2023, version: ["January"] }, { year: 2024, version: ["Mar", "April"] } ]
    allYearVersionsData.value = resp?.data || []
    console.log('Fetched year/versions data:', allYearVersionsData.value)

    if (!allYearVersionsData.value.length) {
      console.warn(`No year/versions found for table: ${props.tableType}`)
      // You might want to set an info message here if not handled by the template's
      // "!allYearVersionsData.length" condition specifically for "no versions" vs "fetch error".
      // The current template already handles this specific case.
    }
  } catch (e: any) {
    console.error('Error fetching table year versions:', e)
    fetchError.value = `Failed to fetch versions for ${props.tableType}. ${e.message || 'Please try again.'}`
    allYearVersionsData.value = [] // Ensure data is cleared on error
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.tableName) {
      fetchYearVersions(props.tableName)
    } else if (!newValue) {
      // Reset when dialog is closed externally or via internal actions that set modelValue to false
      resetComponentState()
    }
  }
)

// Also watch tableName in case it changes while dialog is open
watch(
  () => props.tableName,
  (newTableName, oldTableName) => {
    if (props.modelValue && newTableName && newTableName !== oldTableName) {
      fetchYearVersions(newTableName)
    }
  }
)

const onYearSelectedInternal = () => {
  selectedVersionRef.value = null // Reset version when year changes, this is still correct
}

const handleConfirmSelection = () => {
  if (selectedYearRef.value && selectedVersionRef.value && props.tableName) {
    emit('selected', {
      year: selectedYearRef.value,
      version: selectedVersionRef.value, // This will be one of the strings from the version array
      tableName: props.tableName
    })
    closeDialog(false) // Close dialog after selection
  }
}

const handleCancel = () => {
  emit('cancelled')
  closeDialog(false)
}

// This function is called to update the v-model and also when actions explicitly close the dialog
const closeDialog = (value: boolean) => {
  emit('update:modelValue', value)
  // The watch on props.modelValue will handle the reset if newValue is false.
  // Explicitly calling resetComponentState() here might be redundant if props.modelValue
  // watcher is guaranteed to fire immediately after this emit.
  // However, to be absolutely sure state is reset if closed programmatically via this function:
  if (!value) {
    resetComponentState()
  }
}

onMounted(() => {
  if (props.modelValue && props.tableName) {
    fetchYearVersions(props.tableName)
  }
})
</script>

<style lang="css" scoped>
/* Your existing styles here - no changes needed based on the refactoring request */
.grey--text.text--darken-1 {
  color: #757575 !important; /* Example, adjust if your Vuetify theme is different */
}
</style>
