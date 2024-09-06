<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card :showActions="false">
          <template #header>
            <span class="headline">PAA Shock Settings</span>
          </template>
          <template #default>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="name"
                    variant="outlined"
                    density="compact"
                    label="Enter a name/number for this scenario"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="description"
                    rows="3"
                    variant="outlined"
                    label="Scenario Description"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Select the desired combination for this setting from the options below
                </v-col>
              </v-row>
              <v-row class="pa-5">
                <v-col class="mt-3" cols="3">
                  <v-select
                    v-model="selectedShockBasis"
                    placeholder="Select a Shock Basis"
                    label="Shock Basis"
                    :items="shockBases"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="discountCurve" :label="`Discount Curve`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="claims" :label="`Claims`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="expenses" :label="`Expenses`"></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col>
                <v-btn rounded width="250" small class="primary" @click="addToScenarios"
                  >Add to Shock Settings</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="shockScenarios.length > 0">
              <v-col>
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Description</th>
                      <th class="text-left">Discount Curve</th>
                      <th class="text-left">Claims</th>
                      <th class="text-left">Expenses</th>
                      <th class="text-left">Shock Basis</th>
                      <th class="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in shockScenarios" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.description }}</td>
                      <td>{{ item.discount_curve }}</td>
                      <td>{{ item.claims }}</td>
                      <td>{{ item.expenses }}</td>
                      <td>{{ item.shock_basis }}</td>
                      <td>
                        <v-btn variant="plain" icon @click="removeFromScenarios(item)">
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
    <confirmation-dialog ref="confirmDialog"></confirmation-dialog>
  </v-container>
</template>

<script setup lang="ts">
import ModifiedGMMService from '../../../api/ModifiedGMMService'
import ConfirmationDialog from '../../../components/ConfirmDialog.vue'
import BaseCard from '../../../components/BaseCard.vue'

import { ref, onMounted } from 'vue'
const name = ref('')
const shockBases = ref([])
const selectedShockBasis = ref(null)
const description = ref('')
const discountCurve = ref(false)
const claims = ref(false)
const expenses = ref(false)
const year = ref(null)
const shockScenarios: any = ref([])
const confirmDialog: any = ref(null)

onMounted(() => {
  ModifiedGMMService.getShockBases().then((res) => {
    shockBases.value = res.data
  })
  ModifiedGMMService.getShockSettings().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      shockScenarios.value = response.data
    }
  })
})

const removeFromScenarios = (selectedItem) => {
  const result = confirmDialog.value.open(
    'Delete Confirmation',
    'Are you sure you want to delete this configuration?'
  )
  if (!result) {
    return
  }
  shockScenarios.value = shockScenarios.value.filter((item: any) => item.name !== selectedItem.name)
  ModifiedGMMService.deleteShockSetting(selectedItem.id)
}

const addToScenarios = () => {
  if (!name.value) {
    return
  }
  const setting = {
    name: name.value,
    description: description.value,
    claims: claims.value,
    discount_curve: discountCurve.value,
    expenses: expenses.value,
    shock_basis: selectedShockBasis.value
  }
  ModifiedGMMService.saveShockSetting(setting).then((res) => {
    shockScenarios.value.push(res.data)
    name.value = ''
    description.value = ''
    discountCurve.value = false
    claims.value = false
    expenses.value = false
    year.value = null
  })
}
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
