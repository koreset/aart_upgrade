<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline"> Application Configuration </span>
          </template>
          <template #default>
            <v-expansion-panels v-model="panels" class="mt-3" multiple>
              <v-expansion-panel>
                <v-expansion-panel-title> Licenses </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row v-if="license !== null">
                    <v-col>
                      <p>
                        Licensed to
                        {{ license.data.attributes.metadata.userName }} ({{
                          license.data.attributes.metadata.userEmail
                        }})
                      </p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-btn
                        class="primary"
                        variant="outlined"
                        size="small"
                        rounded
                        @click="getLicenseDetails"
                        >Change License</v-btn
                      ></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-title> API Server Configuration </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="5">
                      <v-text-field
                        v-model="apiServerUrl"
                        variant="outlined"
                        density="compact"
                        :error-messages="apiServerUrlErrors"
                        placeholder="Enter a valid url for the API Service"
                        label="API Server Url"
                        :messages="baseApiHint"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-btn variant="outlined" size="small" class="primary mr-2" rounded
                        >Edit</v-btn
                      >
                      <v-btn
                        class="primary"
                        variant="outlined"
                        size="small"
                        rounded
                        @click="updateApiUrl"
                        >Save</v-btn
                      ></v-col
                    >
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '../components/BaseCard.vue'
import { onMounted, ref } from 'vue'

// data
const panels = ref(0)
const license: any = ref(null)
const apiServerUrl: any = ref('')
const apiServerUrlErrors = ref([])
const baseApiHint = ref('')
const snackbar = ref(false)
const snackbarMessage = ref('')
const timeout = ref(3000)

// const editMode = ref(false)

onMounted(async () => {
  apiServerUrl.value = await window.mainApi?.sendSync('msgGetBaseUrl')
  license.value = await window.mainApi?.sendSync('msgGetUserLicense')
  console.log(license.value)
})

const getLicenseDetails = () => {
  // ipcRenderer.invoke('get-license').then((result) => {
  //   license.value = result
  // })
}

const updateApiUrl = () => {
  console.log('updateApiUrl', apiServerUrl.value)
  window.mainApi?.send('msgSaveBaseUrl', apiServerUrl.value)
  snackbarMessage.value = 'API Server URL updated. This will initiate an application restart.'
  snackbar.value = true
  timeout.value = 5000
  window.mainApi?.send('msgRestartApplication')
  // ipcRenderer.invoke('update-api-url', apiServerUrl.value).then(() => {
  //   window.mainApi?.send('msgGetProducts')
  //   baseApiHint.value = 'you will need to restart the application for this to take effect'
  // })
}

// export default {
//   data() {
//     return {
//       panels: 0,
//       license: null,
//       apiServerUrl: '',
//       apiServerUrlErrors: [],
//       baseApiHint: ''
//     }
//   },
//   mounted() {
//     this.apiServerUrl = store.get('base_api').slice(0, -1)
//     this.getLicenseDetails()
//   },

//   methods: {
//     clearHints() {
//       this.baseApiHint = ''
//     },
//     getLicenseDetails() {
//       ipcRenderer.invoke('get-license').then((result) => {
//         this.license = result
//       })
//     },
//     updateApiUrl() {
//       ipcRenderer.invoke('update-api-url', this.apiServerUrl).then(() => {
//         this.$store.dispatch('getProducts')
//         this.baseApiHint = 'you will need to restart the application for this to take effect'
//       })
//     }
//   },
//   validations: {
//     apiServerUrl: {
//       required
//     }
//   }
// }
</script>

<style></style>
