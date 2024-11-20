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
              <v-row>
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
              <v-row>
                <v-col>
                  <v-btn
                    rounded
                    width="250"
                    size="small"
                    variant="outlined"
                    class="primary"
                    @click="addToScenarios"
                    >Add to Shock Settings</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <h4 class="mt-4">Available Scenarios</h4>
              <v-row v-if="shockScenarios.length > 0">
                <v-col>
                  <data-grid
                    ref="table"
                    :pagination="true"
                    :rowSelection="rowSelection"
                    :columnDefs="columnDefs"
                    :showExport="showExport"
                    :rowData="shockScenarios"
                    @update:row-deleted="deleteShockSetting"
                  />
                </v-col>
              </v-row>
            </v-container>
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
import DataGrid from '@/renderer/components/tables/DataGrid.vue'

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
const rowSelection = ref(null)
const showExport = ref(false)
const columnDefs = ref([])

onMounted(() => {
  ModifiedGMMService.getShockBases().then((res) => {
    shockBases.value = res.data
  })
  ModifiedGMMService.getShockSettings().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      shockScenarios.value = response.data
      columnDefs.value = createColumnDefs(shockScenarios.value, 'shockScenarios')
    }
  })
})

const deleteShockSetting = async (scenario: any) => {
  console.log('delete', scenario)
  try {
    const result = await confirmDialog.value.open(
      `Deleting ${scenario.name} `,
      'Are you sure you want to delete this shock scenario? This action is not undoable.'
    )

    if (result) {
      const response = ModifiedGMMService.deleteShockSetting(scenario.id)
      if (response.status === 204) {
        shockScenarios.value = shockScenarios.value.filter((item) => {
          return item.id !== scenario.id
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const createColumnDefs = (data: any, tableName: string) => {
  const cDefs: any = []
  if (typeof data !== 'undefined') {
    Object.keys(data[0]).forEach((element) => {
      if (element !== 'id' && element !== 'year') {
        const header: any = {}
        header.headerName = element
        header.field = element
        header.minWidth = 200
        header.sortable = true
        header.filter = true
        header.resizable = true

        if (element === 'name') {
          header.checkboxSelection = true
          header.pinned = 'left'
          header.minWidth = 250
        }
        cDefs.push(header)
      }
    })
  }
  return cDefs
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
