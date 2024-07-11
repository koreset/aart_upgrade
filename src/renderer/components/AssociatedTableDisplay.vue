<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-table>
          <tbody>
            <tr v-for="item in associatedTables" :key="item.table">
              <td style="width: 80%">{{ item.table }}</td>
              <td style="text-align: center">
                <v-btn depressed rounded size="small" @click.stop="viewTable(item)">
                  <v-icon left color="primary">mdi-information</v-icon>
                  <span>Info</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <v-btn v-if="checkItemTable(item)" depressed rounded size="small" @click.stop="openDialog(item)">
                  <v-icon left color="primary">mdi-file-upload</v-icon>
                  <span>Upload</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <v-btn v-if="checkItemTable(item)" depressed rounded size="small" @click.stop="confirmDelete(item)">
                  <v-icon color="error">mdi-delete</v-icon>
                  <span>Delete</span>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <file-upload-dialog :yearLabel="yearLabel" :isDialogOpen="isDialogOpen" :showModelPoint="showModelPoint"
      :mpLabel="mpLabel" :uploadTitle="uploadTitle" :years="years" @upload="handleUpload"
      @update:isDialogOpen="updateDialog" />
    <file-info :tableTitle="tableTitle" :rowData="rowData" :columnDefs="columnDefs"
      :onUpdate:isInfoDialogOpen="closeInfoBox" :isDialogOpen="infoDialog" />
    <confirmation-dialog ref="confirmAction" />
  </v-container>
</template>

<script setup lang="ts">
// import ProductService from "../api/ProductService";
import { ref, defineProps, watch } from 'vue'
import FileUploadDialog from '../components/FileUploadDialog.vue'
import ProductService from '../api/ProductService'
import FileInfo from '../components/FileInfo.vue'
import formatValues from '../utils/format_values.js'
import ConfirmationDialog from './ConfirmDialog.vue'


const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const confirmAction: any = ref()
const infoDialog = ref(false)
const rowData: any = ref([])
const columnDefs: any = ref([])
const tableTitle = ref('Table Info')

const selectedTableId: any = ref(0)
// file upload dialog props
const showModelPoint = ref(false)
const yearLabel = ref('') // 'Select a year'
const uploadTitle = ref('')
const mpLabel = ref('')
const isDialogOpen = ref(false);
const years = ref<number[]>(Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k));
const updateDialog = (value: boolean) => {
  isDialogOpen.value = value;
};

const openDialog = (item: any) => {
  console.log('Open Dialog')
  console.log(item)
  selectedTableId.value = item.id
  yearLabel.value = 'Select a year'
  uploadTitle.value = 'Upload File Data for ' + item.table + ' Table (csv)'
  isDialogOpen.value = true;
};
// end file upload dialog props


const createColumnDefs = (data) => {
  columnDefs.value = [];
  Object.keys(data[0]).forEach((element) => {
    const header: any = {};
    header.headerName = element;
    header.field = element;
    header.valueFormatter = formatValues;
    header.minWidth = 220;
    header.filter = true;
    header.resizable = true;
    header.sortable = true;
    columnDefs.value.push(header);
  });
}


const checkItemTable = (item) => {
  if (
    item.table === "Margins" ||
    item.table === "Yield_Curve" ||
    item.table === "Parameters" ||
    item.table === "Shocks"
  ) {
    return false;
  }
  return true;
}

const closeInfoBox = (value: boolean) => {
  infoDialog.value = value;
};

const handleUpload = (data: { file: File | null; fileName: string; productCode: string; year: number | null }) => {
  const formdata = new FormData();
  formdata.append("file", data?.file as File);
  formdata.append("year", data.year?.toString() as string);
  formdata.append("table_id", selectedTableId.value);
  formdata.append("product_code", props.product.product_code);

  console.log("Form Data", formdata);

  ProductService.uploadProductTable({
    formdata,
    productId: props.product.id,
  })
    .then(() => {
      console.log("File uploaded successfully");
    });
}

const associatedTables: any = ref({})

// watch for changes in the props.product.product_tables
watch(() => props.product.product_tables, (newValue) => {
  associatedTables.value = newValue
    .map((table) => ({
      ...table,
      readonly:
        !!(table.table === "Margins" ||
          table.table === "Yield_Curve" ||
          table.table === "Parameters" ||
          table.table === "Shocks"),
    })).filter((table) => table.table !== "Shocks" && table.table !== "Yield_Curve")
    .sort((a, b) => a.readonly - b.readonly);
});

associatedTables.value = props.product.product_tables
console.log('Associated Tables', associatedTables.value)

associatedTables.value = associatedTables.value
  .map((table) => ({
    ...table,
    readonly:
      !!(table.table === "Margins" ||
        table.table === "Yield_Curve" ||
        table.table === "Parameters" ||
        table.table === "Shocks"),
  })).filter((table) => table.table !== "Shocks" && table.table !== "Yield_Curve")
  .sort((a, b) => a.readonly - b.readonly);


const confirmDelete = async (item: any) => {
  const result = await confirmAction.value.open('Deleting Data for ' + item.table + ' table', 'Are you sure you want to delete this data?');
  if (result) {
    console.log('Delete', result)
    deleteTable(item)
  }
}

const deleteTable = (item: any) => {
  ProductService.deleteProductTable(
    props.product.id,
    item.id
  ).then((response) => {
    console.log('Table Deleted', response)
  })
}

const viewTable = (item: any) => {
  tableTitle.value = item.table
  loadData(item)
}

const loadData = (item) => {
  ProductService.getProductTable({
    product_code: props.product.product_code,
    table_id: item.id
  }).then((response) => {
    rowData.value = response.data
    createColumnDefs(response.data)
    console.log('Row Data', rowData.value)
    console.log('Column Defs', columnDefs.value)
    infoDialog.value = true
  })
}
</script>

<style scoped>
.table-row {
  border-bottom: 1px solid;
  border-color: #eee;
}
</style>
