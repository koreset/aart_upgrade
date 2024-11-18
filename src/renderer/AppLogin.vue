<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="6">
          <img width="100%" class="ml-1 mt-4" src="/images/aart-logo-02.png" />
        </v-col>
        <v-col cols="6">
          <v-card v-if="!forgotPasswordFlow" class="win-height mt-10">
            <v-card-title>Login</v-card-title>
            <v-card-text class="mt-10">
              <v-form>
                <v-text-field
                  v-model="username"
                  label="Username"
                  density="compact"
                  variant="outlined"
                  prepend-icon="mdi-account"
                  type="text"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  class="mt-7"
                  label="Password"
                  variant="outlined"
                  density="compact"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                  :error-messages="errors"
                ></v-text-field>
                <v-btn rounded small color="primary" class="mr-4 mt-4" @click="login">Login</v-btn>
                <v-btn
                  rounded
                  small
                  color="primary"
                  class="mr-4 mt-4"
                  @click="forgotPasswordFlow = true"
                  >Forgot Password</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
          <v-card v-if="forgotPasswordFlow" class="win-height mt-10">
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="userEmail"
                  label="Email"
                  dense
                  outlined
                  prepend-icon="mdi-account"
                  type="text"
                  required
                ></v-text-field>
                <v-btn rounded small color="primary" class="mr-4 mt-4" @click="doForgotPassword"
                  >Send Reset Link</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'

onBeforeMount(() => {
  console.log('Login component before mount')
  window.mainApi?.send('msgResizeWindow', 1024, 600, false)
})
onMounted(() => {
  console.log('Login component mounted')
})

const authUrl = import.meta.env.VITE_APP_AUTH_URL
const forgotPasswordFlow = ref(false)
const username = ref('')
const password = ref('')
const errors = ref('')
const userEmail = ref('')

console.log(typeof errors.value)

const login = async () => {
  errors.value = ''
  console.log('AuthURL: ', authUrl)
  try {
    const response = await fetch(authUrl + '/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password.value,
        username: username.value
      })
    })
    console.log('Response: ', response)
    if (response.status === 401) {
      console.log('Unauthorized')
      errors.value = 'the username, email or password is invalid'
    }
    if (response.status === 201 || response.status === 200) {
      const data = await response.json()
      const token = data.access_token
      // STORE
      const result = await window.mainApi?.sendSync('msgStoreAuthenticatedUser', token)
      if (result) {
        window.mainApi?.send('msgRestartApplication')
      }
    } else {
      const result = await window.mainApi?.sendSync('msgStoreAuthenticatedUser', null)
      console.log(result)
    }
  } catch (error) {
    console.log('Error:', error)
  }
}

const doForgotPassword = () => {
  console.log('Forgot Password')
  forgotPasswordFlow.value = false
  const email = userEmail.value
  fetch(authUrl + '/forgotPassword', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipient: email })
  }).then((response) => console.log(response))
}
</script>

<style scoped>
.v-application__wrap {
  background-color: rgba(97, 136, 162, 0.7) !important;
  /* flex: 1 1 auto;
  max-width: 100%;
  position: relative;
  width: 100vw;
  height: calc(100vh - 10px);
  flex-direction: column;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 20px !important;
  padding-top: 0 !important;
  padding-bottom: 20px !important; */
}

/* .v-application__wrap {
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  background-color: green;
} */
</style>
