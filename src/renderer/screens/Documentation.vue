<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="3" class="rounded-lg">
          <v-card-title class="mb-4 header-title accent white--text">Documentation</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="5">
                  <pre><code :class="'language-' + language">{{ codeSnippet }}</code></pre>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4"
                  ><v-select
                    v-model="selectedTopic"
                    outlined
                    dense
                    label="Help Topic"
                    placeholder="Help Topic"
                    :items="topics"
                    @change="getHelp"
                  ></v-select
                ></v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="search"
                    outlined
                    dense
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
              <!-- <v-row v-if="libraryfile.length > 0">
                <v-col>
                  <v-data-table :headers="headers" :items="libraryfile" :search="search">
                    <template #item.data_variable="{ item }">
                      {{ item.data_variable }}
                      <v-tooltip right>
                        <template #activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
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
              </v-row> -->
            </v-container>
          </v-card-text>
        </v-card>
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
// import documentMarkdown from "../docs/base.md"
import 'prismjs/themes/prism.css' // Import the desired theme
import Prism from 'prismjs/components/prism-core' // Import only the languages you need

import { onMounted, ref } from 'vue'

// data
const search = ref('')
const docfile = ref([])
const libraryfile = ref([])
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
const codeSnippet = ref(
  'IF (NOT (ISNULL ( [Modelpoint].[Modelpoint ID] ))) THEN\n\t[Modelpoint].[Modelpoint ID]\nELSE\n\tNULL\nENDIF'
)
const language = ref('javascript')

// lifecycle
onMounted(() => {
  Prism.highlightAll()
})

// methods
const getHelp = () => {
  docfile.value = []
  libraryfile.value = []
  if (selectedTopic.value === 'PAA Library') {
    libraryfile.value = paaLibrary
    headers.value = [
      {
        text: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { text: 'Description', value: 'data_description', width: '400' }
    ]
  }
  if (selectedTopic.value === 'GMM VFA Library') {
    libraryfile.value = gmmVfaLibrary
    headers.value = [
      {
        text: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { text: 'Description', value: 'data_description', width: '400' }
    ]
  }
  if (selectedTopic.value === 'Pricing Library') {
    libraryfile.value = pricingLibrary
    headers.value = [
      {
        text: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { text: 'Description', value: 'data_description', width: '400' }
    ]
  }
  if (selectedTopic.value === 'Experience Analysis') {
    libraryfile.value = experienceAnalysis
    headers.value = [
      {
        text: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { text: 'Description', value: 'data_description', width: '400' }
    ]
  }

  if (selectedTopic.value === 'Modelpoints') {
    docfile.value = modelpointHelp
    headers.value = [
      {
        text: 'Data Variable',
        align: 'start',
        filterable: true,
        value: 'data_variable'
      },
      { text: 'Description', value: 'description', width: '600' },
      { text: 'Data Type', value: 'data_type' },
      { text: 'Constraints', value: 'constraints' },
      { text: 'Note', value: 'note', width: '600' }
    ]
  }

  if (selectedTopic.value === 'Features') {
    docfile.value = featuresHelp
    headers.value = [
      {
        text: 'Benefit Feature',
        align: 'start',
        filterable: true,
        value: 'benefit_feature'
      },
      { text: 'Description', value: 'description', width: '600' },
      { text: 'Product Association', value: 'product_association' },
      {
        text: 'Associated Required Tables',
        value: 'associated_required_tables',
        width: '400'
      },
      { text: 'Note', value: 'note', width: '600' }
    ]
  }
}

// export default {
//   data() {
//     return {
//       search: '',
//       docfile: [],
//       libraryfile: [],
//       selectedTopic: null,
//       topics: [
//         'Modelpoints',
//         'Features',
//         'PAA Library',
//         'GMM VFA Library',
//         'Pricing Library',
//         'Experience Analysis'
//       ],
//       headers: [],
//       codeSnippet:
//         'IF (NOT (ISNULL ( [Modelpoint].[Modelpoint ID] ))) THEN\n\t[Modelpoint].[Modelpoint ID]\nELSE\n\tNULL\nENDIF',
//       language: 'javascript'
//     }
//   },
//   mounted() {
//     Prism.highlightAll()
//   },
//   methods: {
//     getHelp() {
//       docfile.value = []
//       this.libraryfile = []
//       if (this.selectedTopic == 'PAA Library') {
//         this.libraryfile = paa_library
//         this.headers = [
//           {
//             text: 'Data Variable',
//             align: 'start',
//             filterable: true,
//             value: 'data_variable'
//           },
//           { text: 'Description', value: 'data_description', width: '400' }
//         ]
//       }
//       if (this.selectedTopic == 'GMM VFA Library') {
//         this.libraryfile = gmm_vfa_library
//         this.headers = [
//           {
//             text: 'Data Variable',
//             align: 'start',
//             filterable: true,
//             value: 'data_variable'
//           },
//           { text: 'Description', value: 'data_description', width: '400' }
//         ]
//       }
//       if (this.selectedTopic == 'Pricing Library') {
//         this.libraryfile = pricing_library
//         this.headers = [
//           {
//             text: 'Data Variable',
//             align: 'start',
//             filterable: true,
//             value: 'data_variable'
//           },
//           { text: 'Description', value: 'data_description', width: '400' }
//         ]
//       }
//       if (this.selectedTopic == 'Experience Analysis') {
//         this.libraryfile = experience_analysis
//         this.headers = [
//           {
//             text: 'Data Variable',
//             align: 'start',
//             filterable: true,
//             value: 'data_variable'
//           },
//           { text: 'Description', value: 'data_description', width: '400' }
//         ]
//       }

//       if (this.selectedTopic == 'Modelpoints') {
//         this.docfile = modelpointHelp
//         this.headers = [
//           {
//             text: 'Data Variable',
//             align: 'start',
//             filterable: true,
//             value: 'data_variable'
//           },
//           { text: 'Description', value: 'description', width: '600' },
//           { text: 'Data Type', value: 'data_type' },
//           { text: 'Constraints', value: 'constraints' },
//           { text: 'Note', value: 'note', width: '600' }
//         ]
//       }

//       if (this.selectedTopic === 'Features') {
//         this.docfile = featuresHelp
//         this.headers = [
//           {
//             text: 'Benefit Feature',
//             align: 'start',
//             filterable: true,
//             value: 'benefit_feature'
//           },
//           { text: 'Description', value: 'description', width: '600' },
//           { text: 'Product Association', value: 'product_association' },
//           {
//             text: 'Associated Required Tables',
//             value: 'associated_required_tables',
//             width: '400'
//           },
//           { text: 'Note', value: 'note', width: '600' }
//         ]
//       }
//     }
//   }
// }
</script>
<style></style>
