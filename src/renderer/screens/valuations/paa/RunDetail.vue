<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card>
          <template #header>
            <span class="headline">Projection Runs</span>
          </template>
          <template #default>
            <h4 class="mb-1 full-width-underline">Aggregated Projections</h4>
            <v-row>
              <v-col>
                <data-grid :showExport="true" :column-defs="columnDefs" :row-data="rowData" />
              </v-col>
            </v-row>
            <h4 class="mb-1 mt-7 full-width-underline">Scoped Aggregated Projections</h4>
            <v-row>
              <v-col>
                <data-grid :showExport="true" :column-defs="scopedColumnDefs" :row-data="scopedRowData" />
              </v-col>
            </v-row>

          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
import BaseCard from "../../../components/BaseCard.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import ModifiedGMMService from "../../../api/ModifiedGMMService";
import formatValues from '../../../utils/format_values.js'
import DataGrid from "../../../components/tables/DataGrid.vue";


const runId: any = ref(null);
const loadingComplete = ref(false);
const rowData: any = ref([]);
const scopedRowData: any = ref([]);
const groupList: any = ref([]);
const runSettings: any = ref([]);
const columnDefs: any = ref([]);
const scopedColumnDefs: any = ref([]);

onMounted(() => {
  console.log("mounted");
  const route = useRoute();
  console.log(route);
  runId.value = route.params.id;
  loadingComplete.value = false;
  ModifiedGMMService.getProjections(runId.value).then((res) => {
    console.log(res.data);
    rowData.value = res.data.results;
    scopedRowData.value = res.data.scoped_results;
    groupList.value = res.data.groups;
    runSettings.value.push(res.data.run_settings);
    if (rowData.value.length > 0) {
      createColumnDefs(rowData.value[0]);
    }

    if (scopedRowData.value.length > 0) {
      createScopedColumnDefs(scopedRowData.value[0]);
    }
    loadingComplete.value = true;
  });
});


const createColumnDefs = (data) => {
  columnDefs.value = [];
  Object.keys(data).forEach((element) => {
    const column: any = {};
    column.headerName = element;
    column.field = element;
    column.valueFormatter = formatValues;
    column.minWidth = 200;
    columnDefs.value.push(column);
  });
}
const createScopedColumnDefs = (data) => {
  scopedColumnDefs.value = [];
  Object.keys(data).forEach((element) => {
    const column: any = {};
    column.headerName = element;
    column.field = element;
    column.minWidth = 150;
    column.width = 200;
    column.valueFormatter = formatValues;
    scopedColumnDefs.value.push(column);
  });
}

</script>

<style scoped>
.full-width-underline {
  position: relative;
  display: block;
}

.full-width-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  /* Adjust as needed */
  width: 100%;
  height: 2px;
  /* Adjust as needed */
  background-color: grey;
  /* Uses the color of the text */
}
</style>
