<template>
  <v-container>
    <v-row>
      <v-col>
        <base-card :show-actions="false">
          <template #header>
            <span class="headline">Quote Output</span>
          </template>
          <template #default>
            <v-row>
              <v-col>
                <v-btn rounded size="small" color="primary" @click="createQuotePdf"
                  >Generate PDF</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col> <canvas ref="canvasRef" style="border: 1px solid #ddd"></canvas> </v-col>
            </v-row>
          </template>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BaseCard from '@/renderer/components/BaseCard.vue'
import { onMounted, ref } from 'vue'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
// import { saveAs } from 'file-saver'
import GroupPricingService from '@/renderer/api/GroupPricingService'

const props = defineProps({
  quoteId: {
    type: String,
    default: ''
  }
})

const quote: any = ref(null)
const resultSummary: any = ref(null)

const insurer: any = ref(null)
// const addressLines = [
//   '534, Amberley Crescent',
//   'Cedar Creek Estate',
//   'Needwood, 2021',
//   'Tel: +27719166815',
//   'Email: jome.akpoduado@gmail.com'
// ]

const pdfSrc: any = ref(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  console.log('quoteId', props.quoteId)
  GroupPricingService.getQuote(props.quoteId).then((res) => {
    console.log('Quote:', res.data)
    quote.value = res.data
  })
  GroupPricingService.getResultSummary(props.quoteId).then((res) => {
    console.log('Result Summary:', res.data)
    resultSummary.value = res.data
  })
  GroupPricingService.getInsurer().then((res) => {
    console.log('Insurer:', res.data)
    insurer.value = res.data
  })
})

const loadPdf = async () => {
  if (!pdfSrc.value || !canvasRef.value) return

  console.log('Loading PDF', pdfSrc.value)

  pdfjsLib.GlobalWorkerOptions.workerSrc = `/js/pdf.worker.min.mjs`

  const pdf = await pdfjsLib.getDocument(pdfSrc.value).promise
  const page = await pdf.getPage(1) // Load the first page

  const viewport = page.getViewport({ scale: 1.8 })
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  if (!context) return

  canvas.width = viewport.width
  canvas.height = viewport.height

  const renderContext = {
    canvasContext: context,
    viewport
  }

  await page.render(renderContext).promise
}

const roundUpToTwoDecimals = (num) => {
  const roundedNum = Math.ceil(num * 100) / 100 // Round up to two decimal places
  return roundedNum
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    .replace(/,/g, ' ') // Replace commas with spaces for accounting format }
}

const dashIfEmpty = (value: any) => {
  return value || '-'
}

const wrapText = (text, font, fontSize, maxWidth) => {
  const words = text.split(' ')
  const lines: any = []
  let currentLine = ''

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testLineWidth = font.widthOfTextAtSize(testLine, fontSize)

    if (testLineWidth <= maxWidth) {
      currentLine = testLine
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

const createQuotePdf = async () => {
  const pdfDoc = await PDFDocument.create()
  const page1 = pdfDoc.addPage([595.28, 841.89])
  const page2 = pdfDoc.addPage([595.28, 841.89])
  let currentPage = page1
  const { width, height } = page1.getSize()
  const topMargin = 50
  const margin = 50 // Right margin
  const maxWidth = width - 2 * margin

  // const bottomMargin = 30

  console.log('width', width)
  console.log('height', height)

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  console.log('font', font)
  const fontSize = 10

  // Start Y position
  let y = height - topMargin // Adjust based on the desired starting point

  // Draw each line right-justified

  // addressLines.forEach((line) => {
  //   const x = margin // Calculate X position for right alignment
  //   currentPage.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) })
  //   y -= fontSize * 1.5 // Move down for the next line
  // })

  if (insurer.value) {
    const insurerName = insurer.value.name
    const insurerAddress = `${insurer.value.address_line_1}, ${insurer.value.address_line_2}`
    const insurerAddress1 = `${insurer.value.city}, ${insurer.value.province}, ${insurer.value.post_code}`
    const insurerCountry = `${insurer.value.country}`
    const insurerContact = `Tel: ${insurer.value.telephone}, Email: ${insurer.value.email}`

    const insurerText = [
      insurerName,
      insurerAddress,
      insurerAddress1,
      insurerCountry,
      insurerContact
    ]

    y = height - topMargin

    insurerText.forEach((line) => {
      const textWidth = font.widthOfTextAtSize(line, fontSize)
      const x = width - margin - textWidth // Calculate X position for right alignment
      currentPage.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) })
      y -= fontSize * 1.5 // Move down for the next line
    })
  }

  const quoteHeader = 'Group Life Assurance Quotation Document'
  const textWidth = font.widthOfTextAtSize(quoteHeader, fontSize)
  const x = (width - textWidth) / 2 // Center each line horizontally

  y -= fontSize * 1.5 * 2

  currentPage.drawText(quoteHeader, {
    x,
    y,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= 2
  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: margin + maxWidth, y },
    thickness: 0.5,
    color: rgb(0, 0, 0)
  })

  y -= fontSize * 1.5

  const quoteDetails = [
    { label: 'Type of Policy:', value: 'Group Life Assurance' },
    {
      label: 'Quote Date:',
      value: quote.value.creation_date ? quote.value.creation_date : '2021-09-01'
    },
    { label: 'Prepared For:', value: quote.value.scheme_name },
    { label: 'Scheme Name:', value: quote.value.scheme_name },
    { label: 'Commencement Date:', value: quote.value.commencement_date },
    { label: 'Period of Assurance:', value: '1 year' },
    { label: 'Number of Lives Covered', value: `${resultSummary.value.member_count}` },
    {
      label: 'Total Sum Assured:',
      value: `${roundUpToTwoDecimals(resultSummary.value.total_sum_assured)}`
    },
    {
      label: 'Total Annual Salary:',
      value: `${roundUpToTwoDecimals(resultSummary.value.total_annual_salary)}`
    },
    {
      label: 'Total Annual Premium:',
      value: `${roundUpToTwoDecimals(resultSummary.value.total_annual_premium)}`
    }
  ]

  quoteDetails.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(detail.value, {
      x: margin + 200,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize * 2
  })

  const quoteRemarks =
    'We are pleased to submit for your consideration the quotation you requested for the above scheme. Thank you for the opportunity to provide this quote.'

  y -= fontSize * 2

  currentPage.drawText(quoteRemarks, {
    x: margin,
    y,
    size: fontSize - 2,
    font,
    color: rgb(0, 0, 0)
  })

  y -= fontSize * 3

  // Benefits Table
  const benefitsHeaders: any = ['Benefit', 'Total Sum Assured', 'Annual Premium', '% of Salary']

  const benefitsStructure: any = [
    {
      benefit: 'Group Life Assurance',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_gla_capped_sum_assured))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_gla_annual_office_premium))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_proportion_gla_office_premium_salary* 100) +"%")}`
    },
    {
      benefit: 'Permanent Total Disability',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_ptd_capped_sum_assured))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_ptd_annual_office_premium))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_proportion_ptd_office_premium_salary * 100) + "%")}`
    },
    {
      benefit: 'Critical Illness',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_ci_capped_sum_assured))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_ci_annual_office_premium))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_proportion_ci_office_premium_salary * 100) + "%")}`
    },
    {
      benefit: 'Spouses Group Life Assurance',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_sgla_capped_sum_assured))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_sgla_annual_office_premium))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_proportion_sgla_office_premium_salary * 100) + "%")}`
    },
    {
      benefit: 'Permanent Health Insurance',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_phi_capped_income))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_phi_annual_office_premium))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_proportion_phi_office_premium_salary * 100) + "%")}`
    },
    {
      benefit: 'Total and Temporary Disability',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_ttd_capped_income))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_ttd_annual_office_premium))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_proportion_ttd_office_premium_salary * 100) + "%")}`
    },
    {
      benefit: 'Sub Total/Total Premiums',
      sumAssured: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.total_gla_capped_sum_assured))}`,
      annualPremium: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_annual_premium_excl_funeral))}`,
      percentage: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.proportion_exp_total_premium_excl_funeral_salary*100) + "%")}`
    }
  ]

  // table configuration
  const table = {
    x: margin,
    y,
    tableColWidths: [200, 100, 100, 100],
    tableHeaders: benefitsHeaders,
    tableRows: benefitsStructure
  }

  const drawTable = (table) => {
    // need a variable to keep track of the total height of the table

    let tableTopY = table.y
    // const tableBottomY = table.y - table.tableRows.length * fontSize * 2
    const tableLeftX = table.x
    const tableRightX = table.x + table.tableColWidths.reduce((a, b) => a + b, 0)

    // Draw top border line
    currentPage.drawLine({
      start: { x: tableLeftX, y: tableTopY },
      end: { x: tableRightX, y: tableTopY },
      thickness: 0.5,
      color: rgb(0, 0, 0)
    })
    tableTopY -= fontSize + 5
    // Draw the table headers
    table.tableHeaders.forEach((header, i) => {
      currentPage.drawText(header, {
        x: tableLeftX + table.tableColWidths.slice(0, i).reduce((a, b) => a + b, 0) + 3,
        y: tableTopY,
        size: fontSize - 1,
        font: boldFont,
        color: rgb(0, 0, 0)
      })
    })
    tableTopY -= 5

    console.log('tableTopY', tableTopY)
    console.log('y', y)

    // Draw the horizontal lines
    for (let i = 0; i <= table.tableRows.length; i++) {
      currentPage.drawLine({
        start: { x: tableLeftX, y: tableTopY - i * fontSize * 2 },
        end: { x: tableRightX, y: tableTopY - i * fontSize * 2 },
        thickness: 0.5,
        color: rgb(0, 0, 0)
      })
    }

    console.log('tableTopY', tableTopY)
    console.log('y', y)

    // Draw the table rows
    table.tableRows.forEach((row, i) => {
      Object.entries(row).forEach(([key, value], j) => {
        currentPage.drawText(value as string, {
          x: tableLeftX + table.tableColWidths.slice(0, j).reduce((a, b) => a + b, 0) + 5,
          y: tableTopY - (i + 1) * fontSize * 2 + 3,
          size: fontSize - 2,
          font,
          color: rgb(0, 0, 0)
        })
      })
    })

    console.log('tableTopY', tableTopY)
    console.log('y', y)

    // add the table height to y
    y -= table.tableRows.length * (fontSize - 2) * 2 + table.tableHeaders.length * fontSize * 2

    console.log('tableTopY', tableTopY)
    console.log('y', y)
  }
  drawTable(table)

  // Group Funeral

  currentPage.drawText('Group Funeral', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= (fontSize - 4) / 2

  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: margin + maxWidth, y },
    thickness: 0.5,
    color: rgb(0, 0, 0)
  })

  y -= fontSize * 2

  const groupFuneral = [
    {
      label: 'Monthly Premium per Member',
      value: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_fun_monthly_premium_per_member))}`
    },
    {
      label: 'Annual Premium per Member',
      value: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_fun_annual_premium_per_member))}`
    },
    {
      label: 'Total Annual Premium',
      value: `${dashIfEmpty(roundUpToTwoDecimals(resultSummary.value.exp_total_fun_annual_office_premium))}`
    }
  ]

  groupFuneral.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize * 2
  })

  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: margin + maxWidth, y },
    thickness: 0.5,
    color: rgb(0, 0, 0)
  })

  y -= fontSize * 2

  currentPage.drawText('The benefits and definitions of the cover are as follows:', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize * 2

  currentPage.drawText('Group Life Assurance', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize

  const groupLifeAssurance = [
    {
      label: 'Sum Assured',
      value: quote.value.gla.salary_multiple + ' times annual salary'
    },
    {
      label: 'GLA Free Cover Limit (FCL)',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.free_cover_limit))}`
    },
    {
      label: 'Terminal Illness Benefit',
      value: quote.value.gla.terminal_illness_benefit
    },
    {
      label: 'Number of members above FCL',
      value: resultSummary.value.exceeds_free_cover_limit_indicator
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.gla.cover_termination_age
    }
  ]

  groupLifeAssurance.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })

  y -= fontSize * 2

  if (y < 70) {
    currentPage = page2
    y = height - topMargin
  }

  currentPage.drawText('Permanent Total Disability', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  const permanentTotalDisability = [
    {
      label: 'Sum Assured',
      value: quote.value.ptd.salary_multiple + ' times annual salary'
    },
    {
      label: 'PTD Free Cover Limit (FCL)',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.free_cover_limit))}`
    },
    {
      label: 'Benefit Structure',
      value: quote.value.ptd.benefit_type
    },
    {
      label: 'Waiting Period',
      value: quote.value.ptd.deferred_period + ' month(s)'
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.ptd.cover_termination_age
    }
  ]

  y -= fontSize

  permanentTotalDisability.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })

  y -= fontSize * 2

  console.log('y', y)

  if (y < 70) {
    currentPage = page2
    y = height - topMargin
  }

  currentPage.drawText("Spouse's Group Life Assurance", {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize

  const spouseGroupLifeAssurance = [
    {
      label: 'Sum Assured',
      value: resultSummary.value.total_spouse_gla_sum_assured
    },
    {
      label: 'Maximum Sum Assured',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.sgla.maxBenefit))}`
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.sgla.coverTerminationAge
    }
  ]

  spouseGroupLifeAssurance.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })
  y -= fontSize * 2

  const phiTitle = () => {
    if (quote.value.phi_ttd.benefit === 'PHI') {
      return 'Permanent Health Insurance'
    }
    if (quote.value.phi_ttd.benefit === 'TTD') {
      return 'Total and Temporary Disability'
    }
    return 'Permanent Health Insurance and Total and Temporary Disability'
  }
  currentPage.drawText(phiTitle(), {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize

  const totalAndTemporaryDisability = [
    {
      label: 'Product Type',
      value: quote.value.phi_ttd.benefit
    },
    {
      label: 'Monthly benefit as a percentage of monthly salary',
      value: quote.value.phi_ttd.monthly_benefit_percentage + '%'
    },
    {
      label: 'Maximum number of monthly payments to be made',
      value: quote.value.phi_ttd.number_monthly_payments * 12
    },
    {
      label: 'Waiting Period',
      value: quote.value.phi_ttd.waiting_period + ' month(s)'
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.phi_ttd.cover_termination_age
    }
  ]

  totalAndTemporaryDisability.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })

  y -= fontSize * 2

  currentPage.drawText('Critical Illness', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize

  const criticalIllness = [
    {
      label: 'Benefit Structure',
      value: quote.value.ci.benefit_structure
    },
    {
      label: 'Critical Illness Percentage',
      value: quote.value.ci.critical_illness_percentage + '%'
    },
    {
      label: 'Maximum Benefit',
      value: quote.value.ci.max_benefit
    }
  ]

  criticalIllness.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })

  y -= fontSize * 2

  currentPage.drawText('Group Funeral', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize

  const groupFuneralDetails = [
    {
      label: 'Main Member Sum Assured',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.group_family_funeral.main_member_funeral_sum_assured))}`
    },
    {
      label: 'Spouse Sum Assured',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.group_family_funeral.spouse_funeral_sum_assured))}`
    },
    {
      label: 'Adult Dependant Sum Assured',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.group_family_funeral.adult_dependant_sum_assured))}`
    },
    {
      label: 'Child Sum Assured',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.group_family_funeral.children_funeral_sum_assured))}`
    },
    {
      label: 'Parent Sum Assured',
      value: `${dashIfEmpty(roundUpToTwoDecimals(quote.value.group_family_funeral.parent_funeral_sum_assured))}`
    },

    {
      label: 'Maximum number of children covered',
      value: quote.value.group_family_funeral.max_children_covered
    },
    {
      label: 'Maximum number of dependants covered',
      value: quote.value.group_family_funeral.number_adult_dependants
    }
  ]

  groupFuneralDetails.forEach((detail) => {
    currentPage.drawText(detail.label, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    currentPage.drawText(' :         ' + detail.value, {
      x: margin + 200,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })

  y -= fontSize * 2

  currentPage.drawText('Underwriting:', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })
  y -= fontSize

  const underWritingText =
    '1. The quoted premium rates are based on the risk profile, data provided by the client, benefit features, and assumptions. The scheme is subject to the insurer' +
    "'" +
    's underwriting rules, and there is no guarantee of acceptance.'

  let lines = wrapText(underWritingText, font, fontSize - 2, maxWidth)

  lines.forEach((line) => {
    currentPage.drawText(line, {
      x: margin,
      y,
      size: fontSize - 2,
      font,
      color: rgb(0, 0, 0)
    })

    y -= fontSize
  })

  y -= fontSize * 2

  currentPage.drawText('General Provision:', {
    x: margin,
    y,
    size: fontSize - 2,
    font: boldFont,
    color: rgb(0, 0, 0)
  })

  y -= fontSize

  const gpNote1 =
    '1. This quote is valid for' +
    resultSummary.value.quote_validity_period_months +
    ' month(s) from the date of issuance.'

  const gpNote2 =
    '2. All rates provided are guaranteed for a period of ' +
    resultSummary.value.premium_rates_guaranteed_period_months +
    ' month(s) from the inception date.'

  const gpNote3 =
    '3. Please note that members exceeding the FCL are required to undergo medical underwriting; otherwise, their coverage will be limited to the FCL.'

  const gpNote4 =
    'Please feel free to contact us if you require any further information or clarification.'

  const endNote = 'We look forward to your favourable response.'

  const gpNotes = [gpNote1, gpNote2, gpNote3, gpNote4, endNote]

  gpNotes.forEach((note) => {
    lines = wrapText(note, font, fontSize - 2, maxWidth)

    lines.forEach((line) => {
      currentPage.drawText(line, {
        x: margin,
        y,
        size: fontSize - 2,
        font,
        color: rgb(0, 0, 0)
      })

      y -= fontSize
    })

    y -= fontSize
  })

  // currentPage.drawText(underWritingText, {
  //   x: margin,
  //   y,
  //   size: fontSize - 2,
  //   font,
  //   color: rgb(0, 0, 0)
  // })

  // Save the PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })

  const url = URL.createObjectURL(blob)

  pdfSrc.value = url
  loadPdf()
  // saveAs(blob, 'quotation.pdf')
}
</script>
<style lang="css" scoped></style>
