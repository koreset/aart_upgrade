<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false" elevation="3" class="rounded-lg">
          <template #header>
            <span class="headline">Documentation</span>
          </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col cols="4"
                  ><v-select
                    v-model="selectedTopic"
                    variant="outlined"
                    density="compact"
                    label="Help Topic"
                    placeholder="Help Topic"
                    :items="topics"
                    @update:modelValue="getHelp"
                  ></v-select
                ></v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="search"
                    variant="outlined"
                    density="compact"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="docfile.length > 0">
                <v-col>
                  <v-data-table :headers="headers" :items="docfile" :search="search"></v-data-table>
                </v-col>
              </v-row>
              <v-row v-if="libraryFile.length > 0">
                <v-col>
                  <v-data-table :headers="headers" :items="libraryFile" :search="search">
                    <template #[`item.data_variable`]="{ item }">
                      {{ item.data_variable }}
                      <v-tooltip right>
                        <template #activator="{ props }">
                          <v-btn variant="plain" icon v-bind="props">
                            <v-icon>mdi-help-circle-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>
                          <pre><code :class="'language-' + language">{{ item.data_source }}</code></pre>
                        </span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { modelpointHelp } from '../data/modelpointhelp'
import { featuresHelp } from '../data/featureshelp'
import { paaLibrary } from '../data/paa_library'
import { gmmVfaLibrary } from '../data/gmm_vfa_library'
import { pricingLibrary } from '../data/pricing_library'
import { experienceAnalysis } from '../data/experience_analysis'
import BaseCard from '../components/BaseCard.vue'
// import documentMarkdown from "../docs/base.md"
import 'prismjs/themes/prism-dark.css' // Import the desired theme
import Prism from 'prismjs/components/prism-core' // Import only the languages you need

import { onMounted, ref } from 'vue'

// data
const search = ref('')
const docfile = ref([])
const libraryFile = ref([])
const selectedTopic = ref(null)
const topics = ref([
  'Modelpoints',
  'Features',
  'PAA Library',
  'GMM VFA Library',
  'Pricing Library',
  'Experience Analysis'
])
const headers: any = ref([])
const language: any = ref('javascript')

// lifecycle
onMounted(() => {
  Prism.highlightAll()
})

// methods
const getHelp = () => {
  console.log('selectedTopic.value: ', selectedTopic.value)
  docfile.value = []
  libraryFile.value = []
  if (selectedTopic.value === 'PAA Library') {
    libraryFile.value = paaLibrary
    headers.value = [
      {
        title: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { title: 'Description', value: 'data_description', width: '400' }
    ]
  }
  if (selectedTopic.value === 'GMM VFA Library') {
    libraryFile.value = gmmVfaLibrary
    headers.value = [
      {
        title: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { title: 'Description', value: 'data_description', width: '400' }
    ]
  }
  if (selectedTopic.value === 'Pricing Library') {
    libraryFile.value = pricingLibrary
    headers.value = [
      {
        title: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { title: 'Description', value: 'data_description', width: '400' }
    ]
  }
  if (selectedTopic.value === 'Experience Analysis') {
    libraryFile.value = experienceAnalysis
    headers.value = [
      {
        title: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { title: 'Description', value: 'data_description', width: '400' }
    ]
  }

  if (selectedTopic.value === 'Modelpoints') {
    docfile.value = modelpointHelp
    headers.value = [
      {
        title: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { title: 'Description', value: 'description', width: '600' },
      { title: 'Data Type', value: 'data_type' },
      { title: 'Constraints', value: 'constraints' },
      { title: 'Note', value: 'note', width: '600' }
    ]
  }

  if (selectedTopic.value === 'Features') {
    docfile.value = featuresHelp

    headers.value = [
      {
        title: 'Benefit Feature',
        align: 'start',
        filterable: true,
        value: 'benefit_feature'
      },
      { title: 'Description', value: 'description', width: '600' },
      { title: 'Product Association', value: 'product_association' },
      {
        title: 'Associated Required Tables',
        value: 'associated_required_tables',
        width: '400'
      },
      { title: 'Note', value: 'note', width: '600' }
    ]
  }
}
</script>
<style></style>
