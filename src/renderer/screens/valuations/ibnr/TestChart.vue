<template>
  <v-container>
    <!-- Button to open the dialog -->
    <v-btn color="primary" @click="dialog = true">Open List Dialog</v-btn>

    <!-- Dialog containing the list component -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Move Items Between Lists</v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <!-- Available Items List -->
              <v-col>
                <v-card>
                  <v-card-title>Available Items</v-card-title>
                  <v-card-text>
                    <v-list class="scrollable-list">
                      <v-list-item-group multiple>
                        <v-list-item
                          v-for="(item, index) in availableItems"
                          :key="index"
                          :class="{
                            'selected-item': selectedFromAvailable.includes(item)
                          }"
                          @click="toggleSelection(item, 'available')"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col>
                <!-- Buttons for moving items -->
                <v-row justify="center" align="center">
                  <v-btn
                    :disabled="selectedFromAvailable.length === 0"
                    @click="moveSelectedToTarget"
                  >
                    Move →
                  </v-btn>
                  <v-btn :disabled="availableItems.length === 0" @click="moveAllToTarget">
                    Move All →
                  </v-btn>
                  <v-btn :disabled="selectedItems.length === 0" @click="moveAllToAvailable">
                    ← Move All
                  </v-btn>
                  <v-btn
                    :disabled="selectedFromTarget.length === 0"
                    @click="moveSelectedToAvailable"
                  >
                    ← Move
                  </v-btn>
                </v-row>
              </v-col>

              <!-- Target Items List -->
              <v-col>
                <v-card>
                  <v-card-title>Selected Items</v-card-title>
                  <v-card-text>
                    <v-list class="scrollable-list">
                      <v-list-item-group multiple>
                        <v-list-item
                          v-for="(item, index) in selectedItems"
                          :key="index"
                          :class="{
                            'selected-item': selectedFromTarget.includes(item)
                          }"
                          @click="toggleSelection(item, 'target')"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// State to control dialog visibility
const dialog = ref(false)

const availableItems = ref([
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9'
])
const selectedItems = ref<string[]>([])
const selectedFromAvailable = ref<string[]>([])
const selectedFromTarget = ref<string[]>([])

// Function to move selected items to the target list
const moveSelectedToTarget = () => {
  selectedItems.value.push(...selectedFromAvailable.value)
  availableItems.value = availableItems.value.filter(
    (item) => !selectedFromAvailable.value.includes(item)
  )
  selectedFromAvailable.value = []
}

// Function to move selected items back to the available list
const moveSelectedToAvailable = () => {
  availableItems.value.push(...selectedFromTarget.value)
  selectedItems.value = selectedItems.value.filter(
    (item) => !selectedFromTarget.value.includes(item)
  )
  selectedFromTarget.value = []
}

// Function to move all available items to the target list
const moveAllToTarget = () => {
  selectedItems.value.push(...availableItems.value)
  availableItems.value = []
  selectedFromAvailable.value = [] // Clear selection
}

// Function to move all target items back to the available list
const moveAllToAvailable = () => {
  availableItems.value.push(...selectedItems.value)
  selectedItems.value = []
  selectedFromTarget.value = [] // Clear selection
}

// Function to handle item selection
const toggleSelection = (item: string, list: string) => {
  if (list === 'available') {
    if (!selectedFromAvailable.value.includes(item)) {
      selectedFromAvailable.value.push(item)
    } else {
      selectedFromAvailable.value = selectedFromAvailable.value.filter((i) => i !== item)
    }
  } else if (list === 'target') {
    if (!selectedFromTarget.value.includes(item)) {
      selectedFromTarget.value.push(item)
    } else {
      selectedFromTarget.value = selectedFromTarget.value.filter((i) => i !== item)
    }
  }
}
</script>

<style scoped>
.selected-item {
  background-color: #e0f7fa; /* Light cyan */
  color: #006064; /* Dark cyan */
}

.scrollable-list {
  max-height: 300px; /* Set the height of the list */
  overflow-y: auto; /* Enable vertical scrolling if content exceeds max height */
}

.v-btn {
  margin: 10px;
}
</style>
