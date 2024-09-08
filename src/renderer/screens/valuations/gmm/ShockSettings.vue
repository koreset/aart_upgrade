<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card>
          <template #header> Shock Settings </template>
          <template #default>
            <v-container>
              <h4 class="mb-2">Create Shock Setting</h4>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="settingName"
                    variant="outlined"
                    density="compact"
                    placeholder="Enter a name for this scenario"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="settingDescription"
                    variant="outlined"
                    rows="3"
                    label="Provide a description for this scenario"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>Select the desired combination for this setting from the options below</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-checkbox v-model="mortality" :label="`Mortality`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="lapse" :label="`Lapse`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="disability" :label="`Disability`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="criticalIllness" :label="`Critical Illness`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="retrenchment" :label="`Retrenchment`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="realYieldCurve" :label="`Real Yield Curve`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-model="nominalYieldCurve"
                    :label="`Nominal Yield Curve`"
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="expense" :label="`Expense`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="inflation" :label="`Inflation`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-model="mortalityCatastrophe"
                    :label="`Mortality Catastrophe`"
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-model="morbidityCatastrophe"
                    :label="`Morbidity Catastrophe`"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="selectedShockBasis"
                    variant="outlined"
                    density="compact"
                    placeholder="Select a Shock Basis"
                    label="Shock Basis"
                    :items="shockBases"
                    item-title="Basis"
                    item-value="Basis"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn rounded width="250" size="small" color="primary" @click="addToScenarios"
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
            <confirmation-dialog ref="confirmAction" />
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ValuationService from '../../../api/ValuationService'
import { onMounted, ref } from 'vue'
import BaseCard from '@/renderer/components/BaseCard.vue'
import DataGrid from '@/renderer/components/tables/DataGrid.vue'
import ConfirmationDialog from '@/renderer/components/ConfirmDialog.vue'

const confirmAction = ref()
const columnDefs = ref([])
const selectedShockBasis = ref(null)
const shockBases: any = ref([])
const settingName = ref('')
const settingDescription = ref('')
const mortality = ref(false)
const disability = ref(false)
const lapse = ref(false)
const criticalIllness = ref(false)
const nominalYieldCurve = ref(false)
const realYieldCurve = ref(false)
const expense = ref(false)
const inflation = ref(false)
const mortalityCatastrophe = ref(false)
const morbidityCatastrophe = ref(false)
const retrenchment = ref(false)
const rowSelection = ref(null)
const shockScenarios: any = ref([])
const showExport = ref(false)

onMounted(() => {
  ValuationService.getShockSettings().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      console.log(response.data)
      shockScenarios.value = []
      shockScenarios.value = response.data
      columnDefs.value = createColumnDefs(shockScenarios.value, 'shockScenarios')
    }
  })
  getAvailableShockBases()
})

const getAvailableShockBases = () => {
  ValuationService.getAvailableShockBases().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      response.data.forEach((item: any) => {
        shockBases.value.push(item)
      })
    }
  })
}

const deleteShockSetting = async (scenario: any) => {
  console.log('delete', scenario)
  try {
    const res = await confirmAction.value.open(
      `Deleting ${scenario.name} `,
      'Are you sure you want to delete this shock scenario? This action is not undoable.'
    )

    if (res) {
      console.log('confirming delete', scenario)
      ValuationService.deleteShockSetting(scenario.id).then((res) => {
        console.log(res)
        if (res.status === 204) {
          console.log('deleted')
          shockScenarios.value = shockScenarios.value.filter((item) => {
            return item.id !== scenario.id
          })
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const addToScenarios = () => {
  console.log('valid')

  const setting: any = {}
  setting.name = settingName.value
  setting.description = settingDescription.value
  setting.mortality = mortality.value
  setting.disability = disability.value
  setting.lapse = lapse.value
  setting.critical_illness = criticalIllness.value
  setting.nominal_yield_curve = nominalYieldCurve.value
  setting.real_yield_curve = realYieldCurve.value
  setting.expense = expense.value
  setting.retrenchment = retrenchment.value
  setting.shock_basis = selectedShockBasis.value
  setting.inflation = inflation.value
  setting.morbidity_catastrophe = morbidityCatastrophe.value
  setting.mortality_catastrophe = mortalityCatastrophe.value

  //   this.shockScenarios.push(setting);
  ValuationService.saveShockSetting(setting).then((res) => {
    if (res.status === 201) {
      shockScenarios.value.push(res.data)
      settingName.value = ''
      settingDescription.value = ''
      mortality.value = false
      disability.value = false
      lapse.value = false
      criticalIllness.value = false
      nominalYieldCurve.value = false
      realYieldCurve.value = false
      expense.value = false
      inflation.value = false
      morbidityCatastrophe.value = false
      mortalityCatastrophe.value = false
      retrenchment.value = false
      selectedShockBasis.value = null
    }
  })
}

const createColumnDefs = (data: any, tableName: string) => {
  console.log(tableName)
  const cDefs: any = []
  if (typeof data !== 'undefined') {
    Object.keys(data[0]).forEach((element) => {
      if (element !== 'id' && element !== 'year') {
        const column: any = {}
        column.headerName = element
        column.field = element
        column.minWidth = 200
        cDefs.push(column)
        if (element === 'name') {
          column.checkboxSelection = true
          column.pinned = 'left'
          column.minWidth = 250
        }
      }
    })
  }
  return cDefs
}
</script>

<style scoped></style>
