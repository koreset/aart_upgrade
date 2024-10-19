<template>
  <v-container>
    <v-card>
      <v-card-title class="header-title accent white--text mb2">
        <h3>Application Configuration</h3>
      </v-card-title>
      <v-card-text>
        <v-expansion-panels v-model="panels" class="mt-3" multiple>
          <v-expansion-panel>
            <v-expansion-panel-header> Licenses </v-expansion-panel-header>
            <v-expansion-panel-content>
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
                  <v-btn class="primary" small rounded @click="getLicenseDetails"
                    >Change License</v-btn
                  ></v-col
                >
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header> API Server Configuration </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="5">
                  <v-text-field
                    v-model="apiServerUrl"
                    outlined
                    dense
                    :error-messages="apiServerUrlErrors"
                    placeholder="Enter a valid url for the API Service"
                    label="API Server Url"
                    :messages="baseApiHint"
                    @input="$v.apiServerUrl.$touch()"
                    @blur="$v.apiServerUrl.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-btn class="primary" small rounded @click="updateApiUrl">Save</v-btn></v-col
                >
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { ipcRenderer } from 'electron'
const Store = require('electron-store')
const store = new Store()

export default {
  data() {
    return {
      panels: 0,
      license: null,
      apiServerUrl: '',
      apiServerUrlErrors: [],
      baseApiHint: ''
    }
  },
  mounted() {
    this.apiServerUrl = store.get('base_api').slice(0, -1)
    this.getLicenseDetails()
  },

  methods: {
    clearHints() {
      this.baseApiHint = ''
    },
    getLicenseDetails() {
      ipcRenderer.invoke('get-license').then((result) => {
        this.license = result
      })
    },
    updateApiUrl() {
      ipcRenderer.invoke('update-api-url', this.apiServerUrl).then(() => {
        this.$store.dispatch('getProducts')
        this.baseApiHint = 'you will need to restart the application for this to take effect'
      })
    }
  },
  validations: {
    apiServerUrl: {
      required
    }
  }
}
</script>

<style></style>
