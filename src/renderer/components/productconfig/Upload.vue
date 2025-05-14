<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="tableClass"
            variant="outlined"
            density="compact"
            :items="classifications"
            item-title="name"
            item-value="value"
            label="File Classification"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="table"
            variant="outlined"
            density="compact"
            :items="allTables"
            label="Choose table"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-file-input
            v-model="file"
            variant="outlined"
            density="compact"
            show-size
            accept=".csv"
            placeholder="Add Associated file"
            prepend-icon="mdi-paperclip"
          >
          </v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center" cols="12">
          <v-btn rounded size="small" variant="outlined" color="accent" @click="addToFileList"
            >Add to List</v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="fileDescriptors.length > 0">
        <v-col>
          <v-table class="trans-tables">
            <thead>
              <tr class="table-row">
                <th class="table-col text-left">Table Class</th>
                <th class="table-col text-left">Table Name</th>
                <th class="table-col text-left">File</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in fileDescriptors" :key="item.table">
                <td>{{ item.class }}</td>
                <td>{{ item.table }}</td>
                <td>{{ item.filename }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-row v-if="fileDescriptors.length > 0">
        <v-col>
          <v-select
            key="user"
            v-model="selectedReviewer"
            label="Choose a reviewer in your organisation"
            variant="outlined"
            density="compact"
            :items="orgUsers"
            item-title="user"
            item-value="user"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn
            rounded
            size="small"
            variant="outlined"
            :loading="uploadInProgress"
            :disabled="uploadDisabled"
            color="accent"
            @click="uploadToServer"
            >Upload for review <v-icon right dark> mdi-upload </v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-4"></v-divider>

      <!-- <v-row>
        <v-col cols="9">
          <v-btn rounded small class="mr-9 accent" @click="tryContinue">Previous</v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn text @click="configReset">Reset Configuration</v-btn>
        </v-col>
      </v-row> -->
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import ProductService from '@/renderer/api/ProductService'
// import Papa from 'papaparse'
import { computed, inject, onMounted, Ref, ref, watch } from 'vue'
import { useAppStore } from '@/renderer/store/app'
import { useProductStore } from '@/renderer/store/product_config'
import { useRouter } from 'vue-router'
const resetFields = inject<Ref<boolean>>('resetFields', ref(false))
const appStore = useAppStore()
const productStore = useProductStore()

const props = defineProps<{
  editMode: any
}>()

// data
const $router = useRouter()
const uploadDisabled = ref(false)
const uploadInProgress = ref(false)
const selectedReviewer: any = ref(null)
const file: any = ref(null)
const orgUsers = ref([])
const files: any = ref([])
const fileDescriptors: any = ref([])
const tableClass = ref('')
const table = ref('')
const commonFilesAdded = ref(false)
const classifications = ref([{ name: 'Transition Rates', value: 'TransitionRates' }])

// lifecycle
onMounted(() => {
  try {
    ProductService.getOrgUsers({ name: organization.value }).then((res) => {
      orgUsers.value = res.data
    })
  } catch (error) {
    console.log('Error:', error)
  }
})

const validateForm = async () => {
  return true
}

defineExpose({
  validateForm
})

watch(resetFields, (value) => {
  if (value) {
    selectedReviewer.value = null
    file.value = null
    files.value = []
    fileDescriptors.value = []
    tableClass.value = ''
    table.value = ''
    commonFilesAdded.value = false
  }
})

// computed
const selectedFeatures: any = computed(() => productStore.getSelectedFeatures)
// const ratingFactors = computed(() => productStore.getProductRatingFactors)
const organization = computed(() => appStore.getLicenseData.data.attributes.metadata.organization)
const allTables = computed(() => {
  let tables: any = []
  productStore.getProductTransitions.forEach((element) => {
    tables = [...tables, element.associatedTable]
  })
  productStore.getProductGlobalTables.forEach((element) => {
    tables = [...tables, element.name]
  })
  return tables
})

// methods
const snakifyKeys = (fields) => {
  const jsonFields = JSON.parse(JSON.stringify(fields))

  for (const key in jsonFields) {
    if (jsonFields[key] instanceof Object) {
      jsonFields[key] = snakifyKeys(jsonFields[key])
    }

    const snakeKey = key
      .replace(/\.?([A-Z]+)/g, function (x, y) {
        return '_' + y.toLowerCase()
      })
      .replace(/^_/, '')
    jsonFields[snakeKey] = jsonFields[key]
    // remove the unwanted camelCase key
    if (snakeKey !== key) {
      delete jsonFields[key]
    }
  }
  return jsonFields
}

// const checkFileName = (value) => {
//   if (!tableClass.value) {
//     return true // We can't be validating against an empty table name
//   }
//   if (
//     value !== null &&
//     value !== undefined &&
//     value.name.toLowerCase() === table.value.toLowerCase() + '.csv'
//   ) {
//     return true
//   } else {
//     return false
//   }
// }

// const checkColumns = async (value) => {
//   if (value) {
//     const data: any = await processCSVFile(value)
//     const rt = ratingFactors.value.filter((item) => item.table === table.value)
//     const fds = rt[0].fds
//     const headerRow = data[0]
//     let valid = false
//     if (fds.length === headerRow.length - 1) {
//       valid = true
//     } else {
//       valid = false
//     }
//     return valid
//   } else {
//     return true
//   }
// }

// const checkRowSize = async (value) => {
//   if (value) {
//     const data: any = await processCSVFile(value)
//     const rt = ratingFactors.value.filter((item) => item.table === table.value)
//     const fds = rt[0].fds
//     let dim = 1
//     let valid = false

//     fds.forEach((item) => (dim = dim * item.dimension))
//     if (dim === data.length - 1) {
//       valid = true
//     } else {
//       valid = false
//     }
//     return valid
//   }
// }

const uploadToServer = async () => {
  // Verify that all parts of the product config is complete

  // this.$v.$reset()
  // Add product tables
  try {
    fileDescriptors.value.forEach((item) => {
      const pt = { table: item.table, tableClass: item.class }
      productStore.addToProductTables(pt)
    })
    const formData = new FormData()
    // Add files to be uploaded
    // for (let i = 0; i < files.value.length; i++) {
    //   const file = files[i].value
    //   formData.append('files[]', file)
    // }

    files.value.forEach((file) => {
      formData.append('files[]', file)
    })
    // formData.append('files[]', files.value)

    formData.append('product', JSON.stringify(snakifyKeys(productStore.getProduct)))
    formData.append(
      'product_features',
      JSON.stringify(snakifyKeys(productStore.getSelectedFeatures))
    )
    formData.append('editMode', props.editMode.value)
    const user = await window.mainApi?.sendSync('msgGetAuthenticatedUser')
    formData.append('user', user.email)
    formData.append('reviewer', selectedReviewer.value)
    uploadInProgress.value = true
    ProductService.postConfiguredProduct(formData)
      .then((res) => {
        uploadDisabled.value = false
        // $emit('productComplete', res.data)
        uploadInProgress.value = false
        const prodId = res.data.id
        const familyId = res.data.product_family_id
        $router.push({ name: 'product-detail', params: { id: prodId, familyId } })
      })
      .catch((err) => {
        console.log('Error:', err)
        uploadInProgress.value = false
        // $emit('productError', err)
      })
  } catch (error) {
    console.log('Error:', error)
  }
}

const addToFileList = () => {
  const fd = {
    table: table.value,
    class: tableClass.value,
    filename: file.value.name
  }
  if (!fileDescriptors.value.some((f) => f.table === table.value)) {
    fileDescriptors.value.unshift(fd)
    files.value.unshift(file.value)
  }
  console.log('Files:', files.value)

  // Add common tables here...
  if (!commonFilesAdded.value) {
    const yieldCurve = {
      table: 'Yield_Curve',
      class: 'Global',
      filename: 'file must be uploaded prior to valuation run'
    }
    const parameters = {
      table: 'Parameters',
      class: 'Parameters',
      filename: 'file must be uploaded prior to valuation run'
    }
    const margins = {
      table: 'Margins',
      class: 'Margins',
      filename: 'file must be uploaded prior to valuation run'
    }
    const lapseMargin = {
      table: 'Lapse_Margins',
      class: 'LapseMargins',
      filename: 'file must be uploaded prior to valuation run'
    }
    const clawback = {
      table: 'Clawback',
      class: 'Distribution',
      filename: 'file must be uploaded prior to valuation run'
    }
    const shocks = {
      table: 'Shocks',
      class: 'Valuations',
      filename: 'file must be uploaded prior to valuation run'
    }
    const profitMargins = {
      table: 'Profit_Margins',
      class: 'Profitabilities',
      filename: 'file must be uploaded prior to pricing run'
    }
    const newBusinessProfile = {
      table: 'New_Business_Profiles',
      class: 'Profitabilities',
      filename: 'file must be uploaded prior to pricing run'
    }

    fileDescriptors.value.push(
      yieldCurve,
      parameters,
      margins,
      lapseMargin,
      clawback,
      shocks,
      profitMargins,
      newBusinessProfile
    )
    commonFilesAdded.value = true
  }

  //
  if (selectedFeatures.value.some((item) => item.name === 'FUNERAL_COVER')) {
    // Add the required tables to the list

    if (!fileDescriptors.value.some((f) => f.table === 'Child_Sum_Assured')) {
      const childSA = {
        table: 'Child_Sum_Assured',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(childSA)
    }

    if (selectedFeatures.value.some((item) => item.name === 'RIDER_BENEFIT')) {
      if (!fileDescriptors.value.some((item) => item.table === 'Funeral_Service')) {
        if (!fileDescriptors.value.some((f) => f.table === 'Child_Additional_Sum_Assured')) {
          const childAdditionalSumAssured = {
            table: 'Child_Additional_Sum_Assured',
            class: 'BenefitStructure',
            filename: 'file must be uploaded prior to valuation run'
          }
          fileDescriptors.value.push(childAdditionalSumAssured)
        }
        if (!fileDescriptors.value.some((f) => f.table === 'Riders')) {
          const riders = {
            table: 'Riders',
            class: 'BenefitStructure',
            filename: 'file must be uploaded prior to valuation run'
          }

          fileDescriptors.value.push(riders)
        }
      }
    }

    if (selectedFeatures.value.some((item) => item.name === 'ACCIDENTAL_DEATH_BENEFIT')) {
      if (!fileDescriptors.value.some((item) => item.table === 'Accident_Benefit_Multiplier')) {
        const accidentBenefitMultiplier = {
          table: 'Accident_Benefit_Multiplier',
          class: 'BenefitStructure',
          filename: 'file must be uploaded prior to valuation run'
        }
        fileDescriptors.value.push(accidentBenefitMultiplier)
      }
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'PROPORTIONAL_REINSURANCE')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Reinsurance')) {
      const reinsurance = {
        table: 'Reinsurance',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(reinsurance)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'BENEFIT_MULTIPLIER')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Benefit_Multiplier')) {
      const benefitMultiplier = {
        table: 'Benefit_Multiplier',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(benefitMultiplier)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'NON_LIFE')) {
    if (!fileDescriptors.value.some((f) => f.table === 'NonLifeRatings')) {
      const nonlifeRatings = {
        table: 'NonLifeRatings',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(nonlifeRatings)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'SPECIAL_DECREMENT_MARGIN')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Special_Decrement_Margins')) {
      const specialDecrementMargin = {
        table: 'Special_Decrement_Margins',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(specialDecrementMargin)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'RENEWABLE_PROFIT_ADJUSTMENT')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Renewable_Profit_Adjustments')) {
      const renewableProfitAdjustment = {
        table: 'Renewable_Profit_Adjustments',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(renewableProfitAdjustment)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'UNIT_FUND')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Unit_Fund_Charges')) {
      const unitFunds = {
        table: 'Unit_Fund_Charges',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(unitFunds)
    }
    if (!fileDescriptors.value.some((f) => f.table === 'Investment_Returns')) {
      const investmentReturns = {
        table: 'Investment_Returns',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(investmentReturns)
    }

    if (!fileDescriptors.value.some((f) => f.table === 'Fund_Asset_Distributions')) {
      const fad = {
        table: 'Fund_Asset_Distributions',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(fad)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'WITH_PROFIT')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Investment_Returns')) {
      const InvestmentReturns = {
        table: 'Investment_Returns',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(InvestmentReturns)
    }

    if (!fileDescriptors.value.some((f) => f.table === 'Unit_Fund_Charges')) {
      const unitFunds = {
        table: 'Unit_Fund_Charges',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(unitFunds)
    }

    if (!fileDescriptors.value.some((f) => f.table === 'Fund_Asset_Distributions')) {
      const fad = {
        table: 'Fund_Asset_Distributions',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(fad)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'MATURITY_BENEFIT_PATTERN')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Maturity_Patterns')) {
      const maturityPatterns = {
        table: 'Maturity_Patterns',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(maturityPatterns)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'SURRENDER_VALUE_QUADRATIC_FORMULA')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Surrender_Value_Coefficients')) {
      const maturityPatterns = {
        table: 'Surrender_Value_Coefficients',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(maturityPatterns)
    }
  }

  if (selectedFeatures.value.some((item) => item.name === 'PRODUCT_LEVEL_ESCALATIONS')) {
    if (!fileDescriptors.value.some((f) => f.table === 'Product_Level_Escalations')) {
      const productEscalations = {
        table: 'Product_Level_Escalations',
        class: 'BenefitStructure',
        filename: 'file must be uploaded prior to valuation run'
      }
      fileDescriptors.value.push(productEscalations)
    }
  }

  table.value = ''
  tableClass.value = ''
  file.value = null
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
