<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <base-card>
          <template #header>
            <span class="headline"> Available Tasks </span>
          </template>
          <template #default>
            <v-expansion-panels class="mt-4">
              <v-expansion-panel v-for="(item, i) in tasks" :key="i">
                <v-expansion-panel-title
                  >Product Configuration - {{ item.product_code }}</v-expansion-panel-title
                >
                <v-expansion-panel-text>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-textarea
                          variant="outlined"
                          label="Task Comments"
                          :value="item.comments"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn
                          rounded
                          size="small"
                          class="primary"
                          :to="{
                            name: 'product-detail',
                            params: { id: item.product_id }
                          }"
                          >Review/Edit</v-btn
                        >
                        <v-btn
                          rounded
                          size="small"
                          class="primary ml-4"
                          @click="confirmDelete(item.id)"
                          >Delete Task</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title
        >
        <v-card-text>Are you sure you want to delete </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="plain" @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" variant="plain" @click="deleteTask(taskId)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import TaskService from '@/renderer/api/TaskService'
import { onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
// const { ipcRenderer } = require('electron')

// data
const dialog = ref(false)
const tasks: any = ref(null)
const deleteTaskId = ref(null)
const taskId = ref(null)

// lifecycle
onMounted(() => {
  getTasks()
})

// methods
const confirmDelete = (taskId) => {
  dialog.value = true
  deleteTaskId.value = taskId
}

const deleteTask = (id) => {
  TaskService.deleteTask(id).then(() => {
    getTasks()
  })
}

const getTasks = async () => {
  const licensedUser = await window.mainApi?.sendSync('msgGetAuthenticatedUser')

  const user: any = {}

  user.UserName = licensedUser?.username
  user.UserEmail = licensedUser?.email

  TaskService.getTasks(user).then((res) => {
    tasks.value = res.data
  })
}
</script>

<style></style>
