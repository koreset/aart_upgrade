<template>
  <v-container fluid>
    <v-row class="top-banner primary">
      <v-col cols="3"
        ><img class="ml-3 mb-3 mt-0" width="100%" src="/images/aart-logo-02.png"
      /></v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form>
          <v-container>
            <v-row>
              <v-col><h1>License Registration</h1></v-col>
            </v-row>
            <v-row>
              <v-col cols="8" class="d-flex flex-column">
                <v-text-field
                  v-model:model-value="license"
                  variant="outlined"
                  density="compact"
                  label="Enter license"
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
                  :maxlength="39"
                  :error-messages="keyErrors"
                  :messages="successMessages"
                  @update:modelValue="addDashes"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-btn class="mr-3" color="primary" rounded size="small" @click="activateLicense"
                  >Activate</v-btn
                >
                <v-btn v-if="validFlow" color="primary" rounded size="small" @click="restartApp"
                  >Restart App</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

// data
const keyErrors = ref<Array<string>>([])
const successMessages = ref<Array<string>>([])
const validFlow = ref(false)
const license: any = ref(null)

// methods
const restartApp = () => {
  window.mainApi?.send('msgRestartApplication')
}

const addDashes = () => {
  license.value = license.value.toUpperCase()
  if (license.value.length === 4 || license.value.length === 9) {
    license.value += '-'
  }

  if (license.value.length === 14 || license.value.length === 19) {
    license.value += '-'
  }
  if (license.value.length === 24 || license.value.length === 29) {
    license.value += '-'
  }
  if (license.value.length === 34) {
    license.value += '-'
  }
}

onBeforeMount(() => {
  window.mainApi?.send('msgResizeWindow', 1024, 600, false)
})

const activateLicense = async () => {
  keyErrors.value = []
  successMessages.value = []
  const result = window.mainApi?.sendSync('msgActivateLicense', license.value)

  if (result.license_data.meta.valid) {
    window.mainApi?.send('msgSetUserLicense', result.license_data)
    successMessages.value = ['License activated successfully']
    validFlow.value = true
  } else {
    switch (result.meta.constant) {
      case 'SUSPENDED':
        keyErrors.value.push('This license has been suspended. Please provide a valid license')
        break
      case 'EXPIRED':
        keyErrors.value.push('This license has expired. Please provide a valid license')
        break
      case 'NOT_FOUND':
        keyErrors.value.push(
          'This license does not exist. Please contact your admin for a valid license'
        )
        break
      case 'FINGERPRINT_SCOPE_MISMATCH':
        keyErrors.value.push(
          'This license cannot be registered on this machine. Please provide a valid license'
        )
        break
      default:
        keyErrors.value.push(
          'This license cannot be registered successfully. Please provide a valid license'
        )
    }
  }
}
</script>

<style scoped>
.input-info {
  justify-content: flex-end !important;
}
.v-input input {
  text-align: center !important;
}

.top-banner {
  height: 100px;
  background: rgba(40, 78, 103, 0.7);
}
</style>
