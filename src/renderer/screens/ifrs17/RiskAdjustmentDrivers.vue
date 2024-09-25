<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Risk Adjustment Configuration - Risk Drivers</span>
          </template>
          <template #default>
            <v-container>
              <v-row v-if="riskDrivers.length > 0">
                <v-col>
                  <v-table>
                    <thead>
                      <tr class="table-row">
                        <th class="table-col">Product</th>
                        <th class="table-col">Mortality Risk</th>
                        <th class="table-col">Morbidity Risk</th>
                        <th class="table-col">Longevity Risk</th>
                        <th class="table-col">Expense Risk</th>
                        <th class="table-col">Lapse Risk</th>
                        <th class="table-col">Catastrophe</th>
                        <th class="table-col">Operational</th>
                        <th class="table-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in riskDrivers" :key="item.product_code">
                        <td>{{ item.product_code }}</td>
                        <td>{{ item.mortality_risk }}</td>
                        <td>{{ item.morbidity_risk }}</td>
                        <td>{{ item.longevity_risk }}</td>
                        <td>{{ item.expense_risk }}</td>
                        <td>{{ item.lapse_risk }}</td>
                        <td>{{ item.catastrophe_risk }}</td>
                        <td>{{ item.operational_risk }}</td>
                        <td>
                          <v-btn variant="text" size="small" @click="deleteRiskDriver(item)"
                            ><v-icon color="red">mdi-delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-divider v-if="riskDrivers.length > 0" class="mb-4 mt-4"></v-divider>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="selectedProduct"
                    variant="outlined"
                    density="compact"
                    label="Select a Product"
                    :items="productList"
                    item-title="product_name"
                    item-value="product_code"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row v-if="selectedProduct">
                <v-col cols="6"
                  ><v-select
                    v-model="mortalityRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Mortality Risk"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
                <v-col cols="6"
                  ><v-select
                    v-model="morbidityRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Morbidity Risk"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
                <v-col cols="6"
                  ><v-select
                    v-model="longevityRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Longevity Risk"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
                <v-col cols="6"
                  ><v-select
                    v-model="expenseRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Expense Risk"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
                <v-col cols="6"
                  ><v-select
                    v-model="lapseRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Lapse Risk"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
                <v-col cols="6"
                  ><v-select
                    v-model="catastropheRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Catastophe"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
              </v-row>
              <v-row v-if="selectedProduct">
                <v-col cols="6"
                  ><v-select
                    v-model="operationalRisk"
                    clearable
                    variant="outlined"
                    density="compact"
                    label="Operational"
                    :items="driverList"
                    item-title="risk_type"
                    item-value="risk_type"
                  ></v-select
                ></v-col>
              </v-row>
              <v-row v-if="selectedProduct">
                <v-col cols="4" offset="4">
                  <v-btn rounded variant="outlined" size="small" class="primary" @click="addToList"
                    >Add to Drivers List
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    rounded
                    class="primary"
                    variant="outlined"
                    size="small"
                    @click="saveDrivers"
                    >Save Risk Drivers</v-btn
                  >
                </v-col>
              </v-row>
              <v-snackbar v-model="snackbar" :timeout="timeout" :multi-line="true">
                {{ text }}
                <v-btn rounded color="red" text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
            </v-container>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import CsmService from '@/renderer/api/CsmEngine'
import BaseCard from '@/renderer/components/BaseCard.vue'
import { ref, onMounted } from 'vue'

// data
const riskDrivers: any = ref([])
const driverList: any = ref([
  { risk_type: 'NOT APPLICABLE' },
  { risk_type: 'DISCOUNTED_ANNUITY_INCOME' },
  { risk_type: 'DISCOUNTED_DEATH_OUTGO' },
  { risk_type: 'DISCOUNTED_RENEWAL_EXPENSES' },
  { risk_type: 'DISCOUNTED_MORBIDITY_OUTGO' },
  { risk_type: 'DISCOUNTED_OUTGO' },
  { risk_type: 'DISCOUNTED_SURRENDER_OUTGO' },
  { risk_type: 'SUM_AT_RISK' }
])
const productList: any = ref([])
const selectedProduct: any = ref(null)
const mortalityRisk: any = ref(null)
const morbidityRisk: any = ref(null)
const expenseRisk: any = ref(null)
const longevityRisk: any = ref(null)
const lapseRisk: any = ref(null)
const catastropheRisk: any = ref(null)
const operationalRisk: any = ref(null)
const snackbar: any = ref(false)
const text: any = ref(null)
const timeout: any = ref(3000)

// methods
const deleteRiskDriver = (item: any) => {
  const index = riskDrivers.value.indexOf(item)
  riskDrivers.value.splice(index, 1)
  CsmService.deleteRiskDrivers(item.product_code).then((res) => {
    if (res.status === 200) {
      text.value = 'Risk driver deleted'
      snackbar.value = true
    }
  })
}

const saveDrivers = () => {
  CsmService.postRiskDrivers(riskDrivers.value).then((res) => {
    if (res.status === 201) {
      text.value = 'Risk drivers saved successfully'
      snackbar.value = true
    }
  })
}

const addToList = () => {
  const config: any = {}
  config.product_code = selectedProduct.value
  config.mortality_risk = mortalityRisk.value
  config.morbidity_risk = morbidityRisk.value
  config.expense_risk = expenseRisk.value
  config.lapse_risk = lapseRisk.value
  config.longevity_risk = longevityRisk.value
  config.operational = operationalRisk.value
  config.catastrophe = catastropheRisk.value

  if (riskDrivers.value.some((e) => e.product_code === selectedProduct.value)) {
    text.value = 'Product already added to risk drivers'
    snackbar.value = true
    return
  }

  riskDrivers.value.push(config)
  selectedProduct.value = null
  mortalityRisk.value = null
  morbidityRisk.value = null
  expenseRisk.value = null
  lapseRisk.value = null
  longevityRisk.value = null
  operationalRisk.value = null
  catastropheRisk.value = null
}

// lifecycle
onMounted(() => {
  CsmService.getAllProducts().then((res) => {
    productList.value = res.data
  })
  CsmService.getRiskDrivers().then((res) => {
    riskDrivers.value = res.data
  })
})

// export default {
//   data: () => {
//     return {
//       mortalityRisk: null,
//       morbidityRisk: null,
//       expenseRisk: null,
//       longevityRisk: null,
//       lapseRisk: null,
//       catastropheRisk: null,
//       operationalRisk: null,
//       selectedProduct: null,
//       snackbar: false,
//       text: null,
//       timeout: 3000,
//       productList: [],
//       riskDrivers: [],
//       driverList: [
//         { risk_type: 'NOT APPLICABLE' },
//         { risk_type: 'DISCOUNTED_ANNUITY_INCOME' },
//         { risk_type: 'DISCOUNTED_DEATH_OUTGO' },
//         { risk_type: 'DISCOUNTED_RENEWAL_EXPENSES' },
//         { risk_type: 'DISCOUNTED_MORBIDITY_OUTGO' },
//         { risk_type: 'DISCOUNTED_OUTGO' },
//         { risk_type: 'DISCOUNTED_SURRENDER_OUTGO' },
//         { risk_type: 'SUM_AT_RISK' }
//       ]
//     }
//   },
//   mounted() {
//     CsmService.getAllProducts().then((res) => {
//       this.productList = res.data
//     })
//     CsmService.getRiskDrivers().then((res) => {
//       this.riskDrivers = res.data
//     })
//   },
//   methods: {
//     deleteRiskDriver(item) {
//       const index = this.riskDrivers.indexOf(item)
//       this.riskDrivers.splice(index, 1)
//       CsmService.deleteRiskDrivers(item.product_code).then((res) => {
//         if (res.status === 200) {
//           this.text = 'Risk driver deleted'
//           this.snackbar = true
//         }
//       })
//     },
//     saveDrivers() {
//       CsmService.postRiskDrivers(this.riskDrivers).then((res) => {
//         if (res.status === 201) {
//           this.text = 'Risk drivers saved successfully'
//           this.snackbar = true
//         }
//       })
//     },
//     addToList() {
//       const config = {}
//       config.product_code = this.selectedProduct
//       config.mortality_risk = this.mortalityRisk
//       config.morbidity_risk = this.morbidityRisk
//       config.expense_risk = this.expenseRisk
//       config.lapse_risk = this.lapseRisk
//       config.longevity_risk = this.longevityRisk
//       config.operational = this.operationalRisk
//       config.catastrophe = this.catastropheRisk

//       if (this.riskDrivers.some((e) => e.product_code === this.selectedProduct)) {
//         this.text = 'Product already added to risk drivers'
//         this.snackbar = true
//         return
//       }

//       this.riskDrivers.push(config)
//       this.selectedProduct = null
//       this.mortalityRisk = null
//       this.morbidityRisk = null
//       this.expenseRisk = null
//       this.lapseRisk = null
//       this.longevityRisk = null
//       this.operationalRisk = null
//       this.catastropheRisk = null
//     }
//   }
// }
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
