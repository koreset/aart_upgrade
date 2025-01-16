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
    { label: 'Total Sum Assured:', value: 'R 100,000.00' },
    { label: 'Total Annual Salary:', value: `${resultSummary.value.total_annual_salary}` },
    { label: 'Total Annual Premium:', value: `${resultSummary.value.total_annual_premium}` }
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
    'We submit for your consideration the quotation you requested for the above scheme. Thank you for the opportunity to quote.'

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
      sumAssured: 'R 100,000.00',
      annualPremium: 'R 100,000.00',
      percentage: '100%'
    },
    {
      benefit: 'Permanent Total Disability',
      sumAssured: 'R 100,000.00',
      annualPremium: 'R 100,000.00',
      percentage: '100%'
    },
    {
      benefit: 'Spouses Group Life Assurance',
      sumAssured: 'R 100,000.00',
      annualPremium: 'R 100,000.00',
      percentage: '100%'
    },
    {
      benefit: 'Total and Temporary Disability',
      sumAssured: 'R 100,000.00',
      annualPremium: 'R 100,000.00',
      percentage: '100%'
    },
    {
      benefit: 'Sub Total/Total Premiums',
      sumAssured: 'R 100,000.00',
      annualPremium: 'R 100,000.00',
      percentage: '100%'
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
    { label: 'Monthly Premium per Member', value: '17.60' },
    { label: 'Annual Premium per Member', value: '211.00' },
    { label: 'Total Annual Premium', value: '21,100.00' }
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
      value: quote.value.currentFcl
    },
    {
      label: 'Terminal Illness Benefit',
      value: quote.value.terminalIllnessBenefit
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
      value: quote.value.currentFcl
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
      value: quote.value.sgla.maxBenefit
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
      value: quote.value.groupFamilyFuneral.main_member_group_funeral_sum_assured
    },
    {
      label: 'Spouse Sum Assured',
      value: quote.value.groupFamilyFuneral.spouse_group_funeral_sum_assured
    },
    {
      label: 'Adult Dependant Sum Assured',
      value: quote.value.groupFamilyFuneral.adultDependantSumAssured
    },
    {
      label: 'Child Sum Assured',
      value: quote.value.groupFamilyFuneral.child_group_funeral_sum_assured
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
    '1. The underwriting of the scheme is based on the information provided by the client. The scheme is subject to the underwriting rules of the insurer. There is no guarantee that the scheme will be accepted by the insurer.'

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
    '1. The premium rates are based on the information provided by the client. The rates are subject to change based on the underwriting rules of the insurer.'

  const gpNote2 =
    '2. The premium rates are based on the information provided by the client. The rates are subject to change based on the underwriting rules of the insurer.'

  const gpNote3 =
    '3. Note that members who are above the FCL are required to undergo medical underwriting otherwise their cover will be limited to the FCL.'

  const gpNote4 = 'Please contact us for any further information or clarification.'

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
