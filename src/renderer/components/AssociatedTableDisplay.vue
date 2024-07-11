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
  </v-container>
</template>

<script setup lang="ts">
// import ProductService from "../api/ProductService";
import { ref, defineProps, watch } from 'vue'
import FileUploadDialog from '../components/FileUploadDialog.vue'
import ProductService from '../api/ProductService'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

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


// const handleUpload = (data: { file: File | null; fileName: string; productCode: string; year: number | null }) => {
//   // Handle the uploaded data here
//   console.log(data);
//   console.log("File Name: ", data.file?.name)
//   isDialogOpen.value = false;
// };


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


const confirmDelete = (item: any) => {
  console.log('Delete', item)
}

const viewTable = (item: any) => {
  console.log('View', item)
}
</script>

<style scoped>
.table-row {
  border-bottom: 1px solid;
  border-color: #eee;
}
</style>
