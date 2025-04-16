<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="win-height mt-10">
            <v-card-title>No Internet</v-card-title>
            <v-card-text class="mt-10">
              <p
                >There is no connection to the internet. This application requires a connection to
                the internet to function</p
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'

onBeforeMount(() => {
  window.mainApi?.send('msgResizeWindow', 1024, 600, false)
})
onMounted(() => {})

// const authUrl = import.meta.env.VITE_APP_AUTH_URL
// const forgotPasswordFlow = ref(false)
// const username = ref('')
// const password = ref('')
// const errors = ref('')

// const login = async () => {
//   errors.value = ''
//   try {
//     const response = await fetch(authUrl + '/login', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         password: password.value,
//         username: username.value
//       })
//     })
//     if (response.status === 401) {
//       errors.value = 'the username, email or password is invalid'
//     }
//     if (response.status === 201 || response.status === 200) {
//       const data = await response.json()
//       const token = data.access_token
//       // STORE
//       const result = await window.mainApi?.sendSync('msgStoreAuthenticatedUser', token)
//       if (result) {
//         window.mainApi?.send('msgRestartApplication')
//       }
//     } else {
//       await window.mainApi?.sendSync('msgStoreAuthenticatedUser', null)
//     }
//   } catch (error) {
//     console.log('Error:', error)
//   }
// }
</script>

<style scoped>
.v-main {
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
