<template>
  <base-card :show-actions="false">
    <template #header>
      <span class="headline">Select a Year and Version to delete</span>
    </template>
    <template #default>
      <v-dialog
        :model-value="modelValue"
        persistent
        max-width="500px"
        activator="parent"
        @update:model-value="closeDialog"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Select Year and Version</span>
          </v-card-title>
          <v-card-subtitle>
            For table: <strong>{{ tableName }}</strong>
          </v-card-subtitle>

          <v-card-text>
            <v-container v-if="isLoading">
              <v-row justify="center" class="py-6">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <p class="text-center mt-4 grey--text text--darken-1"
                  >Loading available versions...</p
                >
              </v-row>
            </v-container>

            <v-container v-else-if="fetchError">
              <v-alert type="error" prominent border="start" variant="tonal">
                {{ fetchError }}
              </v-alert>
            </v-container>

            <v-container v-else-if="!allYearVersionsData.length">
              <v-alert type="info" prominent border="start" variant="tonal">
                No specific year/version data found for the table "{{ tableName }}".
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
            <v-btn color="primary" @click="handleConfirmSelection"> Confirm Selection </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </base-card>
</template>
<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { ref, watch, computed, onMounted } from 'vue'
import CsmEngine from '@/renderer/api/CsmEngine' // Adjust path as needed

interface YearVersion {
  year: number
  version: string
}

interface Props {
  modelValue: boolean // For v-model:dialogVisible or similar
  tableName: string | null
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
const allYearVersionsData = ref<YearVersion[]>([])
const selectedYearRef = ref<number | null>(null)
const selectedVersionRef = ref<string | null>(null)

const lowerCaseAndSnakeCase = (value: string): string => {
  return value.toLowerCase().replace(/ /g, '_')
}

const availableYears = computed(() => {
  if (!allYearVersionsData.value.length) return []
  const years = new Set(allYearVersionsData.value.map((item) => item.year))
  return Array.from(years).sort((a, b) => b - a) // Sort descending
})

const availableVersionsForSelectedYear = computed(() => {
  if (!selectedYearRef.value || !allYearVersionsData.value.length) return []
  return allYearVersionsData.value
    .filter((item) => item.year === selectedYearRef.value)
    .map((item) => item.version)
    .sort()
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
  fetchError.value = null // Clear previous errors
  allYearVersionsData.value = [] // Clear previous data
  selectedYearRef.value = null
  selectedVersionRef.value = null

  try {
    const lowerTableType = lowerCaseAndSnakeCase(nameOfTable)
    const resp = await CsmEngine.getTableYearVersions(lowerTableType)
    allYearVersionsData.value = resp.data || []
    if (!allYearVersionsData.value.length) {
      // fetchError.value = `No year/versions found for table: ${nameOfTable}`; // Or handle as info in template
      console.warn(`No year/versions found for table: ${nameOfTable}`)
    }
  } catch (e: any) {
    console.error('Error fetching table year versions:', e)
    fetchError.value = `Failed to fetch versions for ${nameOfTable}. ${e.message || 'Please try again.'}`
    allYearVersionsData.value = []
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
      // Reset when dialog is closed externally
      resetComponentState()
    }
  }
)

// Also watch tableName in case it changes while dialog is open (less common for this use case but good for robustness)
watch(
  () => props.tableName,
  (newTableName, oldTableName) => {
    if (props.modelValue && newTableName && newTableName !== oldTableName) {
      fetchYearVersions(newTableName)
    }
  }
)

const onYearSelectedInternal = () => {
  selectedVersionRef.value = null // Reset version when year changes
}

const handleConfirmSelection = () => {
  if (selectedYearRef.value && selectedVersionRef.value && props.tableName) {
    emit('selected', {
      year: selectedYearRef.value,
      version: selectedVersionRef.value,
      tableName: props.tableName
    })
    closeDialog(false) // Close dialog after selection
  }
}

const handleCancel = () => {
  emit('cancelled')
  closeDialog(false)
}

const closeDialog = (value: boolean) => {
  emit('update:modelValue', value)
  if (!value) {
    resetComponentState() // Ensure reset if closed via prop change
  }
}

// If the component is initially visible and tableName is set, fetch data.
// This handles cases where the dialog might be opened programmatically right after mount.
onMounted(() => {
  if (props.modelValue && props.tableName) {
    fetchYearVersions(props.tableName)
  }
})
</script>
<style lang="css" scoped></style>
