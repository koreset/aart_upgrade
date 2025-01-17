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
import { saveAs } from 'file-saver'
import GroupPricingService from '@/renderer/api/GroupPricingService'

const props = defineProps({
  quoteId: {
    type: String,
    default: ''
  }
})

const quote: any = ref(null)
const resultSummary: any = ref(null)

const addressLines = [
  '534, Amberley Crescent',
  'Cedar Creek Estate',
  'Needwood, 2021',
  'Tel: +27719166815',
  'Email: jome.akpoduado@gmail.com'
]

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
})

const roundUpToTwoDecimals = (num) => {
  const roundedNum = Math.ceil(num * 100) / 100 // Round up to two decimal places
  return roundedNum
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    .replace(/,/g, ' ') // Replace commas with spaces for accounting format }
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

  addressLines.forEach((line) => {
    const x = margin // Calculate X position for right alignment
    currentPage.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) })
    y -= fontSize * 1.5 // Move down for the next line
  })

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
      value: quote.value.creationDate ? quote.value.creationDate : '2021-09-01'
    },
    { label: 'Prepared For:', value: quote.value.schemeName },
    { label: 'Scheme Name:', value: quote.value.schemeName },
    { label: 'Commencement Date:', value: quote.value.commencementDate },
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
      sumAssured: `${roundUpToTwoDecimals(resultSummary.value.total_gla_capped_sum_assured)}`,
      annualPremium: `${roundUpToTwoDecimals(resultSummary.value.total_gla_premium)}`,
      percentage: `${roundUpToTwoDecimals(resultSummary.value.proportion_gla_premium_salary)}`
    },
    {
      benefit: 'Permanent Total Disability',
      sumAssured: `${roundUpToTwoDecimals(resultSummary.value.total_ptd_capped_sum_assured)}`,
      annualPremium: `${roundUpToTwoDecimals(resultSummary.value.total_ptd_premium)}`,
      percentage: `${roundUpToTwoDecimals(resultSummary.value.proportion_ptd_premium_salary)}`
    },
    {
      benefit: 'Spouses Group Life Assurance',
      sumAssured: `${roundUpToTwoDecimals(resultSummary.value.total_spouse_gla_capped_sum_assured)}`,
      annualPremium: `${roundUpToTwoDecimals(resultSummary.value.total_spouse_gla_premium)}`,
      percentage: `${roundUpToTwoDecimals(resultSummary.value.proportion_spouse_gla_premium_salary)}`
    },
    {
      benefit: 'Total and Temporary Disability',
      sumAssured: `${roundUpToTwoDecimals(resultSummary.value.total_ttd_capped_income)}`,
      annualPremium: `${roundUpToTwoDecimals(resultSummary.value.total_ttd_premium)}`,
      percentage: `${roundUpToTwoDecimals(resultSummary.value.proportion_ttd_premium_salary)}`
    },
    {
      benefit: 'Sub Total/Total Premiums',
      sumAssured: `${roundUpToTwoDecimals(resultSummary.value.total_gla_capped_sum_assured)}`,
      annualPremium: `${roundUpToTwoDecimals(resultSummary.value.total_annual_premium_excluding_funeral)}`,
      percentage: `${roundUpToTwoDecimals(resultSummary.value.proportion_gla_premium_salary)}`
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

    // Draw the vertical lines
    // table.tableColWidths.slice(0, -1).reduce((x, width) => {
    //   page.drawLine({
    //     start: { x, y: tableTopY },
    //     end: { x, y: tableBottomY },
    //     thickness: 0.5,
    //     color: rgb(0, 0, 0)
    //   })
    //   return x + width
    // }, tableLeftX)

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
    { label: 'Monthly Premium per Member', value: `${roundUpToTwoDecimals(resultSummary.value.total_funeral_monthly_premium_per_member)}` },
    { label: 'Annual Premium per Member', value: `${roundUpToTwoDecimals(resultSummary.value.total_funeral_annual_premium_per_member)}` },
    { label: 'Total Annual Premium', value: `${roundUpToTwoDecimals(resultSummary.value.total_funeral_cost)}` }
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
      value: quote.value.salaryMultiple + ' times annual salary'
    },
    {
      label: 'GLA Free Cover Limit (FCL)',
      value: `${roundUpToTwoDecimals(quote.value.currentFcl)}`
    },
    {
      label: 'Terminal Illness Benefit',
      value:  quote.value.terminalIllnessBenefit
    },
    {
      label: 'Number of members above FCL',
      value: 'data from rating result'
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.coverTerminationAge
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
      value: quote.value.ptd.salaryMultiple + ' times annual salary'
    },
    {
      label: 'PTD Free Cover Limit (FCL)',
      value: `${roundUpToTwoDecimals(quote.value.currentFcl)}`
    },
    {
      label: 'Benefit Structure',
      value: quote.value.ptd.benefitType
    },
    {
      label: 'Waiting Period',
      value: quote.value.ptd.deferredPeriod + ' month(s)'
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.ptd.coverTerminationAge
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
      value: 'data from rating result'
    },
    {
      label: 'Maximum Sum Assured',
      value: `${roundUpToTwoDecimals(quote.value.sgla.maxBenefit)}`
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
    if (quote.value.phi.productType === 'PHI') {
      return 'Permanent Health Insurance'
    }
    if (quote.value.phi.productType === 'TTD') {
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
      value: quote.value.phi.productType
    },
    {
      label: 'Monthly benefit as a percentage of monthly salary',
      value: quote.value.phi.monthlyBenefitProportion + '%'
    },
    {
      label: 'Maximum number of monthly payments to be made',
      value: quote.value.phi.numberAnnualPayments * 12
    },
    {
      label: 'Waiting Period',
      value: quote.value.phi.waitingPeriodMonths + ' month(s)'
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.phi.coverTerminationAge
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
      value: quote.value.ci.benefitStructure
    },
    {
      label: 'Critical Illness Percentage',
      value: quote.value.ci.criticalIllnessPercentage + '%'
    },
    {
      label: 'Cover Termination Age',
      value: quote.value.ci.coverTerminationAge
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
      value: `${roundUpToTwoDecimals(quote.value.groupFamilyFuneral.main_member_group_funeral_sum_assured)}`
    },
    {
      label: 'Spouse Sum Assured',
      value: `${roundUpToTwoDecimals(quote.value.groupFamilyFuneral.spouse_group_funeral_sum_assured)}`
    },
    {
      label: 'Adult Dependant Sum Assured',
      value: `${roundUpToTwoDecimals(quote.value.groupFamilyFuneral.adultDependantSumAssured)}`
    },
    {
      label: 'Child Sum Assured',
      value:  `${roundUpToTwoDecimals(quote.value.groupFamilyFuneral.child_group_funeral_sum_assured)}`
    },
    {
      label: 'Maximum number of children covered',
      value: quote.value.groupFamilyFuneral.maxChildrenCovered
    },
    {
      label: 'Maximum number of dependants covered',
      value: quote.value.groupFamilyFuneral.numberAdultDependants
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
    '1. The quoted premium rates are based on the risk profile, data provided by the client, benefit features, and assumptions. The scheme is subject to the insurer'+"'"+'s underwriting rules, and there is no guarantee of acceptance.'

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
    '1. This quote is valid for'+ resultSummary.value.quote_validity_period_months +' month(s) from the date of issuance.'

  const gpNote2 =
    '2. All rates provided are guaranteed for a period of '+ resultSummary.value.premium_rates_guaranteed_period_months +' month(s) from the inception date.'

  const gpNote3 =
    '3. Please note that members exceeding the FCL are required to undergo medical underwriting; otherwise, their coverage will be limited to the FCL.'

  const gpNote4 = 'Please feel free to contact us if you require any further information or clarification.'

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
  saveAs(blob, 'quotation.pdf')
}
</script>
<style lang="css" scoped></style>
