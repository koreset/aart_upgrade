<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            Shock Settings
          </template>
          <template #default>
            <v-container>
              <h4 class="mb-2">Create Shock Setting</h4>
              <v-row>
                <v-col cols="3">
                  <v-text-field v-model="settingName" variant="outlined" density="compact"
                    placeholder="Enter a name for this scenario"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea v-model="settingDescription" variant="outlined" rows="3"
                    label="Provide a description for this scenario"></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>Select the desired combination for this setting from the
                    options below</p>
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
                  <v-checkbox v-model="nominalYieldCurve" :label="`Nominal Yield Curve`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="expense" :label="`Expense`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="inflation" :label="`Inflation`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="mortalityCatastrophe" :label="`Mortality Catastrophe`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="morbidityCatastrophe" :label="`Morbidity Catastrophe`"></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-select v-model="selectedShockBasis" variant="outlined" density="compact"
                    placeholder="Select a Shock Basis" label="Shock Basis" :items="shockBases" item-title="Basis"
                    item-value="Basis">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn rounded width="250" size="small" color="primary" @click="addToScenarios">Add to Shock
                    Settings</v-btn>
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
                  <data-grid ref="table" :pagination="true" :rowSelection="rowSelection" :columnDefs="columnDefs"
                    :showExport="showExport" :rowData="shockScenarios" @update:row-deleted="deleteShockSetting" />
                </v-col>
              </v-row>
            </v-container>
            <confirmation-dialog ref="confirmAction" />
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-title class="header-title accent white--text">Shocks</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>Shock Settings</v-col>
              </v-row>
            </v-container>

            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="name" outlined dense :error-messages="nameErrors"
                    label="Enter a name/number for this scenario" @blur="$v.name.$touch()"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea v-model="description" rows="3" :error-messages="descriptionErrors" outlined
                    label="Scenario Description" @blur="$v.description.$touch()"></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Select the desired combination for this setting from the
                  options below
                </v-col>
              </v-row>
              <v-row class="px-5">
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
                  <v-checkbox v-model="nominalYieldCurve" :label="`Nominal Yield Curve`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="expense" :label="`Expense`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="inflation" :label="`Inflation`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="mortalityCatastrophe" :label="`Mortality Catastrophe`"></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox v-model="morbidityCatastrophe" :label="`Morbidity Catastrophe`"></v-checkbox>
                </v-col>
              </v-row>
              <v-row class="px-5">
                <v-col cols="3">
                  <v-select v-model="selectedShockBasis" outlined dense placeholder="Select a Shock Basis"
                    label="Shock Basis" :items="shockBases" item-text="Basis" item-value="Basis">
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col>
                <v-btn rounded width="250" small class="primary" @click="addToScenarios">Add to Shock Settings</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="shockScenarios.length > 0">
              <v-col>
                <tables-data-grid-table ref="table" :pagination="true" :rowSelection="rowSelection"
                  :columnDefs="columnDefs" :rowData="shockScenarios" @delete-row="deleteShockSetting" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  <!-- <confirmation-dialog ref="confirm" />
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title>
        <v-card-text>Are you sure you want to delete this configuration?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="primary darken-1" text @click="removeFromScenarios()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container> -->
</template>

<script setup lang="ts">
import ValuationService from "../../../api/ValuationService";
// import { useVuelidate } from "vuelidate";
import { onMounted, ref } from "vue";
import BaseCard from "@/renderer/components/BaseCard.vue";
import DataGrid from "@/renderer/components/tables/DataGrid.vue";
import ConfirmationDialog from "@/renderer/components/ConfirmDialog.vue";
// const mustNotBeNull = (value) => value !== null;

// const $v = useVuelidate();


const confirmAction = ref();
const columnDefs = ref([]);
// const selectedYear = ref(null);
const selectedShockBasis = ref(null);
const shockBases: any = ref([]);
const settingName = ref("");
const settingDescription = ref("");
const mortality = ref(false);
const disability = ref(false);
const lapse = ref(false);
const criticalIllness = ref(false);
// const yieldCurve = ref(false);
const nominalYieldCurve = ref(false);
const realYieldCurve = ref(false);
const expense = ref(false);
const inflation = ref(false);
const mortalityCatastrophe = ref(false);
const morbidityCatastrophe = ref(false);
const retrenchment = ref(false);
// const selectedItem = ref(null);
const rowSelection = ref(null);
const shockScenarios: any = ref([]);
const showExport = ref(false);

onMounted(() => {
  ValuationService.getShockSettings().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      console.log(response.data);
      shockScenarios.value = [];
      shockScenarios.value = response.data;
      columnDefs.value = createColumnDefs(shockScenarios.value, "shockScenarios");

      // response.data.forEach((item) => {
      //   this.$store.commit("addToShockScenarios", item);
      // });
    }
  });
  getAvailableShockBases();
});

const getAvailableShockBases = () => {
  ValuationService.getAvailableShockBases().then((response) => {
    if (response.data !== null && response.data.length > 0) {
      response.data.forEach((item: any) => {
        shockBases.value.push(item);
      });
    }
  });
};

const deleteShockSetting = async (scenario: any) => {
  console.log("delete", scenario);
  try {
    const res = await confirmAction.value.open(`Deleting ${scenario.name} `,
      "Are you sure you want to delete this shock scenario? This action is not undoable.");

    if (res) {
      console.log("confirming delete", scenario);
      ValuationService.deleteShockSetting(scenario.id).then((res) => {
        console.log(res);
        if (res.status === 204) {
          console.log("deleted");
          shockScenarios.value = shockScenarios.value.filter((item) => {
            return item.id !== scenario.id;
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }

  // const res = await $refs.confirm.open(`Deleting ${scenario.name} `,
  //   "Are you sure you want to delete this shock scenario? This action is not undoable.");

  // if (!res) return;

  // console.log("parent", scenario);
  // ValuationService.deleteShockSetting(scenario.id).then((res) => {
  //   console.log(res);
  //   if (res.status === 204) {
  //     console.log("deleted");
  //     shockScenarios.value = shockScenarios.value.filter((item) => {
  //       return item.id !== scenario.id;
  //     });
  //     $refs.table.updateRowData(shockScenarios.value);
  //   }
  // });
};

// const removeFromScenarios = () => {
//   $store.commit("removeShockScenario", selectedItem.value.name);
//   ValuationService.deleteShockSetting(selectedItem.value.id).then((res) => {
//     if (res.status === 204) {
//       shockScenarios.value = shockScenarios.value.filter((item) => {
//         return item.id !== selectedItem.value.id;
//       });
//     }
//   });
//   dialog.value = false;
// };

const addToScenarios = () => {
  // $v.$touch();
  // if ($v.$invalid) {
  //   console.log("invalid");
  //   return;
  // }
  console.log("valid");

  const setting: any = {};
  setting.name = settingName.value;
  setting.description = settingDescription.value;
  setting.mortality = mortality.value;
  setting.disability = disability.value;
  setting.lapse = lapse.value;
  setting.critical_illness = criticalIllness.value;
  setting.nominal_yield_curve = nominalYieldCurve.value;
  setting.real_yield_curve = realYieldCurve.value;
  setting.expense = expense.value;
  setting.retrenchment = retrenchment.value;
  setting.shock_basis = selectedShockBasis.value;
  setting.inflation = inflation.value;
  setting.morbidity_catastrophe = morbidityCatastrophe.value;
  setting.mortality_catastrophe = mortalityCatastrophe.value;

  //   this.shockScenarios.push(setting);
  ValuationService.saveShockSetting(setting).then((res) => {
    if (res.status === 201) {
      shockScenarios.value.push(res.data);
      settingName.value = "";
      settingDescription.value = "";
      mortality.value = false;
      disability.value = false;
      lapse.value = false;
      criticalIllness.value = false;
      nominalYieldCurve.value = false;
      realYieldCurve.value = false;
      expense.value = false;
      inflation.value = false;
      morbidityCatastrophe.value = false;
      mortalityCatastrophe.value = false;
      retrenchment.value = false;
      selectedShockBasis.value = null;
    }
  });


};



const createColumnDefs = (data: any, tableName: string) => {
  console.log(tableName);
  const cDefs: any = [];
  if (typeof data !== "undefined") {
    Object.keys(data[0]).forEach((element) => {
      if (element !== "id" && element !== "year") {
        const column: any = {};
        column.headerName = element;
        column.field = element;
        column.minWidth = 200;
        cDefs.push(column);
        if (element === "name") {
          column.checkboxSelection = true;
          column.pinned = "left";
          column.minWidth = 250;
        }
      }
    });
  }
  return cDefs;
};

// const deleteButtonRenderer = (params: any) => {
//   console.log(params);
//   const eDiv = document.createElement("div");
//   eDiv.innerHTML =
//     '<span><button class="btn btn-danger btn-sm" style="margin: 5px" data-action-type="delete">Delete</button></span>';
//   const eButton = eDiv.querySelectorAll(".btn")[0];
//   eButton.addEventListener("click", deleteRow);
//   return eDiv;
// };

// const deleteRow = (event: any) => {
//   const data = event.rowData;
//   console.log(data);
// };

// const nameErrors = () => {
//   const errors = [];
//   if (!$v.name.$dirty) return errors;
//   !$v.name.required && errors.push("A name for this setting is required.");
//   return errors;
// };

// const descriptionErrors = () => {
//   const errors = [];
//   if (!$v.description.$dirty) return errors;
//   !$v.description.required && errors.push("A description for this setting is required.");
//   return errors;
// };

// const availableYears = () => {
//   const years = [];
//   const currentYear = new Date().getFullYear();

//   for (let i = 0; i < 21; i++) {
//     years.push({ year: currentYear - i });
//   }
//   return years;
// };

// export default {
//   validations: {
//     name: {
//       required,
//     },
//     description: {
//       required,
//     },
//   },
//   data() {
//     return {
//       dialog: false,
//       columnDefs: [],
//       selectedYear: null,
//       selectedShockBasis: null,
//       shockBases: [],
//       name: "",
//       description: "",
//       mortality: false,
//       disability: false,
//       lapse: false,
//       criticalIllness: false,
//       yieldCurve: false,
//       nominalYieldCurve: false,
//       realYieldCurve: false,
//       expense: false,
//       inflation: false,
//       mortalityCatastrophe: false,
//       morbidityCatastrophe: false,
//       retrenchment: false,
//       selectedItem: null,
//       rowSelection: null,
//       shockScenarios: [],
//     };
//   },
//   mounted() {
//     ValuationService.getShockSettings().then((response) => {
//       if (response.data !== null && response.data.length > 0) {
//         console.log(response.data);
//         this.shockScenarios = [];
//         this.shockScenarios = response.data;
//         this.columnDefs = this.createColumnDefs(this.shockScenarios, "shockScenarios");

//         // response.data.forEach((item) => {
//         //   this.$store.commit("addToShockScenarios", item);
//         // });
//       }
//     });
//     this.getAvailableShockBases();
//   },
//   methods: {
//     confirmDelete(item) {
//       this.selectedItem = item;
//       // removeFromScenarios(item)
//       this.dialog = true;
//     },
//     getAvailableShockBases() {
//       ValuationService.getAvailableShockBases().then((response) => {
//         if (response.data !== null && response.data.length > 0) {
//           response.data.forEach((item) => {
//             this.shockBases.push(item);
//           });
//         }
//       });
//     },
//     async deleteShockSetting(scenario) {
//       console.log("delete", scenario)
//       const res = await this.$refs.confirm.open(`Deleting ${scenario.name} `,
//         "Are you sure you want to delete this shock scenario? This action is not undoable.")

//       if (!res) return

//       console.log("parent", scenario)
//       ValuationService.deleteShockSetting(scenario.id).then((res) => {
//         console.log(res)
//         if (res.status === 204) {
//           console.log("deleted")
//           this.shockScenarios = this.shockScenarios.filter((item) => {
//             return item.id !== scenario.id;
//           });
//           this.$refs.table.updateRowData(this.shockScenarios)
//         }

//       });
//     },
//     removeFromScenarios() {
//       this.$store.commit("removeShockScenario", this.selectedItem.name);
//       ValuationService.deleteShockSetting(this.selectedItem.id).then((res) => {
//         if (res.status === 204) {
//           this.shockScenarios = this.shockScenarios.filter((item) => {
//             return item.id !== this.selectedItem.id;
//           });
//         }

//       });
//       this.dialog = false;
//     },
//     addToScenarios() {
//       this.$v.$touch();
//       if (this.$v.$invalid) {
//         console.log("invalid")
//         return;
//       }
//       console.log("valid")
//       if (!this.$v.$invalid) {
//         const setting = {};
//         setting.name = this.name;
//         setting.description = this.description;
//         setting.mortality = this.mortality;
//         setting.disability = this.disability;
//         setting.lapse = this.lapse;
//         setting.critical_illness = this.criticalIllness;
//         setting.nominal_yield_curve = this.nominalYieldCurve;
//         setting.real_yield_curve = this.realYieldCurve;
//         setting.expense = this.expense;
//         setting.retrenchment = this.retrenchment;
//         setting.year = this.selectedYear;
//         setting.shock_basis = this.selectedShockBasis;
//         setting.inflation = this.inflation;
//         setting.morbidity_catastrophe = this.morbidityCatastrophe;
//         setting.mortality_catastrophe = this.mortalityCatastrophe;


//         //   this.shockScenarios.push(setting);
//         ValuationService.saveShockSetting(setting).then((res) => {
//           if (res.status === 201) {
//             this.shockScenarios.push(res.data);
//             this.$store.commit("addToShockScenarios", res.data);
//             this.name = "";
//             this.description = "";
//             this.mortality = false;
//             this.disability = false;
//             this.lapse = false;
//             this.criticalIllness = false;
//             this.nominalYieldCurve = false;
//             this.realYieldCurve = false;
//             this.expense = false;
//             this.inflation = false;
//             this.morbidityCatastrophe = false;
//             this.mortalityCatastrophe = false;
//             this.retrenchment = false;
//             this.selectedYear = null;
//             this.selectedShockBasis = null;
//           }
//         });
//         this.$v.$reset();
//       }
//     },
//     createColumnDefs(data, tableName) {
//       console.log(tableName)
//       const cDefs = [];
//       if (typeof data !== "undefined") {
//         Object.keys(data[0]).forEach((element) => {
//           if (element !== "id" && element !== "year") {
//             const column = {};
//             column.headerName = element;
//             column.field = element;
//             column.minWidth = 200;
//             cDefs.push(column);
//             if (element === "name") {
//               column.checkboxSelection = true;
//               column.pinned = 'left';
//               column.minWidth = 250;
//             }
//           }
//         });
//       }
//       return cDefs;
//     },
//     deleteButtonRenderer(params) {
//       console.log(params)
//       const eDiv = document.createElement("div");
//       eDiv.innerHTML =
//         '<span><button class="btn btn-danger btn-sm" style="margin: 5px" data-action-type="delete">Delete</button></span>';
//       const eButton = eDiv.querySelectorAll(".btn")[0];
//       eButton.addEventListener("click", this.deleteRow);
//       return eDiv;
//     },
//     deleteRow(event) {
//       const data = event.rowData;
//       console.log(data);
//     },

//   },
//   computed: {
//     nameErrors() {
//       const errors = [];
//       if (!this.$v.name.$dirty) return errors;
//       !this.$v.name.required &&
//         errors.push("A name for this setting is required.");
//       return errors;
//     },
//     descriptionErrors() {
//       const errors = [];
//       if (!this.$v.description.$dirty) return errors;
//       !this.$v.description.required &&
//         errors.push("A description for this setting is required.");
//       return errors;
//     },
//     availableYears() {
//       const years = [];
//       const currentYear = new Date().getFullYear();

//       for (let i = 0; i < 21; i++) {
//         years.push({ year: currentYear - i });
//       }
//       return years;
//     },
//     // shockScenarios: {
//     //   get: function () {
//     //     return this.$store.state.shockScenarios;
//     //   },
//     //   set: function (setting) {
//     //     this.$store.commit("addToShockScenarios", setting);
//     //   },
//     // },
//   },
// };
</script>

<!-- <style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style> -->
