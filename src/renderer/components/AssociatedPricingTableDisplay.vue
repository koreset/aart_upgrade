<template>
  <v-container>
    <v-row
      v-for="item in product.product_pricing_tables"
      :key="item.id"
      class="borderline blue-grey lighten-5 mt-1 mb-1 accent-4--text"
    >
      <v-col cols="3">
        <p :class="{ unpopulated: !item.populated }">{{ item.table }}</p>
      </v-col>
      <v-col cols="5">
        <p>Classification: {{ item.table_class }}</p>
      </v-col>
      <v-col class="mr-1" cols="1">
        <v-btn
          depressed
          rounded
          small
          @click.stop="showTableData(item.id, item.table, product.product_code)"
        >
          <v-icon left color="primary">mdi-information</v-icon>
          <span>INFO</span>
        </v-btn>
      </v-col>

      <v-col class="mr-4" cols="1">
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <pricing-file-updater
                :tableId="item.id"
                :productId="product.id"
                :productCode="product.product_code"
                :fileName="item.table"
                @successUpload="updatePopulatedTables"
              />
            </div>
          </template>
          <span>Upload data for {{ item.table }} table</span>
        </v-tooltip>
      </v-col>

      <v-col class="mr-1 ml-3" cols="1">
        <v-btn
          :disabled="!item.populated"
          depressed
          rounded
          small
          @click.stop="deleteTableData(product.id, item)"
        >
          <v-icon color="error">mdi-delete</v-icon>
          <span>DELETE</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <file-info
          :tableDialog="tableDialog"
          :tableId="selectedTableId"
          :tableName="selectedTableName"
          :productCode="selectedProductCode"
          :selectedRowData="rowData"
          :selectedColumnDefs="columnDefs"
          :loadingComplete="loadingComplete"
          @resetTableDialog="dismissTableDialog"
        />
      </v-col>
    </v-row>
    <confirmation-dialog ref="confirm" />
  </v-container>
</template>

<script>
import ProductService from '../services/ProductService'
import formatValues from '../utils/format_values'
export default {
  props: ['product'],
  data() {
    return {
      tableDialog: false,
      selectedTableId: null,
      selectedTableName: null,
      selectedProductCode: null,
      tableData: [],
      columnDefs: [],
      rowData: [],
      loadingComplete: false
    }
  },
  methods: {
    updatePopulatedTables(itemId) {
      this.product.product_pricing_tables.forEach((item) => {
        if (item.id === itemId) {
          item.populated = true
        }
      })
    },
    dismissTableDialog(value) {
      this.tableDialog = value
    },

    createColumnDefs(data) {
      this.columnDefs = []
      Object.keys(data[0]).forEach((element) => {
        const header = {}
        header.headerName = element
        header.field = element
        header.valueFormatter = formatValues
        header.minWidth = 220
        header.filter = true
        header.resizable = true
        header.sortable = true
        this.columnDefs.push(header)
      })
    },

    loadData() {
      this.rowData = []
      this.columnDefs = []
      this.loadingComplete = false
      ProductService.getProductPricingTable({
        table_id: this.selectedTableId,
        product_code: this.selectedProductCode
      }).then((res) => {
        this.tableData = res.data
        if (this.tableData !== null) {
          this.items = []
          this.columnDefs = []
          this.rowData = []
          this.createColumnDefs(this.tableData)
          this.tableData.forEach((item) => {
            const transformed = {}
            const keys = Object.keys(item)
            keys.forEach((i) => {
              if (isNaN(item[i])) {
                transformed[i] = item[i]
              } else {
                const value = Number(item[i])
                transformed[i] = value
              }
            })
            this.rowData.push(transformed)
          })
        }
        this.loadingComplete = true
      })
    },
    async deleteTableData(productId, item) {
      const res = await this.$refs.confirm.open(
        `Deleting ${item.table} Table`,
        'Are you sure you want to delete this table data? This action is not undoable.'
      )

      if (!res) return
      ProductService.deletePricingProductTable(productId, item.id).then(() => {
        this.updatePopulatedTables()
      })
    },

    showTableData(itemId, itemTable, prodCode) {
      this.selectedTableId = itemId
      this.selectedTableName = itemTable
      this.selectedProductCode = prodCode
      this.loadData()
      this.tableDialog = true
    }
  }
}
</script>

<style>
.unpopulated {
  color: red;
}

.borderline {
  border-bottom: 1px solid#2E566E;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* .table-container {
    background-color: #96abbc;
    margin: 20px;
    border-radius: 24px;
    padding: 0;
  } */

.table-container {
  background: #ffffff 35%;
  /* background-color: #96ABBC; */
  margin: 20px;
  border-radius: 24px;
  padding: 0;
}

div.row.table-container > div > div > div {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
