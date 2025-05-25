<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    max-width="500px"
    @update:model-value="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-subtitle>
        For table: <strong>{{ tableType }}</strong>
      </v-card-subtitle>

      <v-card-text>
        <v-container v-if="isLoading">
          <v-row justify="center" class="py-6">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="text-center mt-4 grey--text text--darken-1">Loading available data...</p>
          </v-row>
        </v-container>

        <v-container v-else-if="fetchError">
          <v-alert type="error" prominent border="start" variant="tonal">
            {{ fetchError }}
          </v-alert>
        </v-container>

        <v-container
          v-else-if="!allYearVersionsData.length && props.fetchMode === 'yearsAndVersions'"
        >
          <v-alert type="info" prominent border="start" variant="tonal">
            No specific year/version data found for the table "{{ tableType }}".
          </v-alert>
        </v-container>

        <v-container v-else-if="!availableYears.length && props.fetchMode === 'yearsOnly'">
          <v-alert type="info" prominent border="start" variant="tonal">
            No specific year data found for the table "{{ tableType }}".
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
            v-if="props.fetchMode === 'yearsAndVersions'"
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
        <v-btn color="primary" :disabled="isConfirmDisabled" @click="handleConfirmSelection">
          Confirm Selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import CsmEngine from '@/renderer/api/CsmEngine' // Adjust path as needed

// Interface for year and its versions
interface YearVersion {
  year: number
  version: string[] // Array of version strings for a given year
}

// Props definition
interface Props {
  modelValue: boolean // For v-model for dialog visibility
  tableName: string | null
  tableType: string | null // Used for display purposes
  fetchMode?: 'yearsOnly' | 'yearsAndVersions' // New prop
}

// Emits definition
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'selected', payload: { year: number; version?: string; tableName: string }): void // Version is now optional
  (e: 'cancelled'): void
}

const props = withDefaults(defineProps<Props>(), {
  fetchMode: 'yearsAndVersions' // Default to fetching years and versions
})
const emit = defineEmits<Emits>()

const isLoading = ref(false)
const fetchError = ref<string | null>(null)
// This will hold YearVersion objects regardless of fetchMode.
// For 'yearsOnly', version array will be empty.
const allYearVersionsData = ref<YearVersion[]>([])
const selectedYearRef = ref<number | null>(null)
const selectedVersionRef = ref<string | null>(null)

const lowerCaseAndSnakeCase = (value: string): string => {
  if (!value) return ''
  return value.toLowerCase().replace(/ /g, '_')
}

const dialogTitle = computed(() => {
  return props.fetchMode === 'yearsOnly' ? 'Select Year' : 'Select Year and Version'
})

const availableYears = computed(() => {
  if (!allYearVersionsData.value.length) return []
  // Extracts unique years from allYearVersionsData
  const years = new Set(allYearVersionsData.value.map((item) => item.year))
  return Array.from(years).sort((a, b) => b - a) // Sort descending
})

const availableVersionsForSelectedYear = computed(() => {
  if (
    props.fetchMode === 'yearsOnly' ||
    !selectedYearRef.value ||
    !allYearVersionsData.value.length
  ) {
    return []
  }
  const yearData = allYearVersionsData.value.find((item) => item.year === selectedYearRef.value)
  // Returns sorted versions if yearData and its versions exist, otherwise an empty array
  return yearData && yearData.version ? yearData.version.slice().sort() : []
})

const isConfirmDisabled = computed(() => {
  if (isLoading.value || !selectedYearRef.value) {
    return true
  }
  if (props.fetchMode === 'yearsAndVersions' && !selectedVersionRef.value) {
    return true
  }
  return false
})

const resetComponentState = () => {
  isLoading.value = false
  fetchError.value = null
  allYearVersionsData.value = []
  selectedYearRef.value = null
  selectedVersionRef.value = null
}

const fetchData = async (nameOfTable: string) => {
  if (!nameOfTable) {
    fetchError.value = 'Table name is not provided.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  fetchError.value = null
  // Reset data and selections before fetching
  allYearVersionsData.value = []
  selectedYearRef.value = null
  selectedVersionRef.value = null

  try {
    const lowerTableType = lowerCaseAndSnakeCase(nameOfTable)

    if (props.fetchMode === 'yearsOnly') {
      // Fetch only distinct years
      // Assuming CsmEngine.getTableYears returns Promise<{ data: number[] } | null | undefined>
      const resp = await CsmEngine.getTableYears(lowerTableType)
      const yearsArray = resp?.data || []
      // Transform to YearVersion[] format with empty versions
      allYearVersionsData.value = yearsArray.map((year) => ({ year, version: [] }))
      console.log('Fetched years data:', allYearVersionsData.value)
      if (!allYearVersionsData.value.length) {
        console.warn(`No years found for table: ${props.tableType}`)
      }
    } else {
      // Fetch years and versions
      // Assuming CsmEngine.getTableYearVersions returns Promise<{ data: YearVersion[] } | null | undefined>
      const resp = await CsmEngine.getTableYearVersions(lowerTableType)
      allYearVersionsData.value = resp?.data || []
      console.log('Fetched year/versions data:', allYearVersionsData.value)
      if (!allYearVersionsData.value.length) {
        console.warn(`No year/versions found for table: ${props.tableType}`)
      }
    }
  } catch (e: any) {
    console.error(`Error fetching data for table ${props.tableType} (mode: ${props.fetchMode}):`, e)
    fetchError.value = `Failed to fetch data for ${props.tableType}. ${e.message || 'Please try again.'}`
    allYearVersionsData.value = [] // Ensure data is cleared on error
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.tableName) {
      fetchData(props.tableName)
    } else if (!newValue) {
      resetComponentState()
    }
  }
)

watch(
  () => props.tableName,
  (newTableName, oldTableName) => {
    if (props.modelValue && newTableName && newTableName !== oldTableName) {
      fetchData(newTableName)
    }
  }
)

// Watch for changes in fetchMode as well, if the dialog might stay open and mode changes
watch(
  () => props.fetchMode,
  (newMode) => {
    if (props.modelValue && props.tableName) {
      console.log(`Workspace mode changed to: ${newMode}. Refetching data.`)
      fetchData(props.tableName) // Refetch data if mode changes while dialog is open
    }
  }
)

const onYearSelectedInternal = () => {
  // Reset version only if in 'yearsAndVersions' mode
  if (props.fetchMode === 'yearsAndVersions') {
    selectedVersionRef.value = null
  }
}

const handleConfirmSelection = () => {
  if (selectedYearRef.value && props.tableName) {
    const payload: { year: number; version?: string; tableName: string } = {
      year: selectedYearRef.value,
      tableName: props.tableName
    }
    if (props.fetchMode === 'yearsAndVersions' && selectedVersionRef.value) {
      payload.version = selectedVersionRef.value
    } else if (props.fetchMode === 'yearsAndVersions' && !selectedVersionRef.value) {
      // Should not happen if isConfirmDisabled is working correctly
      console.warn('Version not selected in yearsAndVersions mode.')
      return
    }
    emit('selected', payload)
    closeDialog(false)
  }
}

const handleCancel = () => {
  emit('cancelled')
  closeDialog(false)
}

const closeDialog = (value: boolean) => {
  emit('update:modelValue', value)
  if (!value) {
    // The watch on props.modelValue handles reset, but ensure it for explicit close.
    resetComponentState()
  }
}

onMounted(() => {
  if (props.modelValue && props.tableName) {
    fetchData(props.tableName)
  }
})
</script>

<style lang="css" scoped>
/* Your existing styles here - no changes needed based on the refactoring request */
.grey--text.text--darken-1 {
  color: #757575 !important; /* Example, adjust if your Vuetify theme is different */
}
</style>
