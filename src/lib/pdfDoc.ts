import { PDFDocument, StandardFonts, rgb, cmyk } from 'pdf-lib'

import {
  locale,
  currency,
  yourCompany,
  yourBank,
  invoiceMeta,
  customer,
  author,
  service,
  lines,
  pdfTitle,
  vat,
  sum
} from '$lib/constants/strings'

import { meta } from '$lib/constants/titles'
import { defaults } from './constants/pdfSettings'
import {
  drawInline,
  drawLinesLeft,
  drawLinesRightAligned
} from '$lib/generalisedDrawRoutines'

import { lineDrawer } from './lineDrawer'

export async function drawPdf() {
  if (typeof lines === 'undefined') return

  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  )
  const page = pdfDoc.addPage()

  page.setFontColor(cmyk(0, 0, 0, 1))
  page.setFont(helvetica)
  page.setFontSize(defaults.size.small)

  const { width, height } = page.getSize()

  pdfDoc.setTitle(pdfTitle)
  pdfDoc.setAuthor(author)
  pdfDoc.setSubject(service)
  pdfDoc.setCreationDate(new Date())
  pdfDoc.setModificationDate(new Date())

  const bounds = {
    upper: {
      x: defaults.xMargin,
      y: height - defaults.yMargin
    },
    lower: {
      x: width - defaults.xMargin,
      y: defaults.yMargin
    }
  }

  const borders = {
    xmin: defaults.xMargin,
    xmax: width - defaults.xMargin,
    ymin: height - defaults.yMargin,
    ymax: defaults.yMargin
  }

  const topRightBox = {
    xmin: borders.xmax / 1.3,
    xmax: borders.xmax
  }

  const padding = {
    normal:
      helvetica.heightAtSize(defaults.size.small) +
      defaults.leading.small
  }
  const heightOfALine = {
    normal:
      helvetica.heightAtSize(defaults.size.small) +
      defaults.leading.small
  }

  const titleDim = drawInline(
    meta.title[locale],
    { x: bounds.upper.x, y: bounds.upper.y },
    helveticaBold,
    page
  )

  const customerDimensions = drawLinesLeft(
    Object.values(customer),
    { x: borders.xmin, y: titleDim.ymax - padding.normal },
    helvetica,
    page
  )

  const companyInfo = drawLinesRightAligned(
    Object.values(yourCompany),
    { x: topRightBox.xmax, y: borders.ymin },
    helvetica,
    page
  )

  const invoiceDetails = drawLinesRightAligned(
    Object.values(invoiceMeta),
    { x: topRightBox.xmax, y: companyInfo.ymax - padding.normal },
    helvetica,
    page
  )

  const invoiceDetailHeadings = drawLinesLeft(
    Object.values(meta.payInfo[locale]),
    { x: topRightBox.xmin, y: companyInfo.ymax - padding.normal },
    helveticaBold,
    page
  )
  const constraints = {
    x: borders.xmin,
    y: invoiceDetailHeadings.ymax - padding.normal
  }
  // const quadrants = [20, 79.5, 0.5]
  const quadrants = vat.enabled ? [10, 52, 11, 12, 16] : [10, 74, 16]
  const headings = meta.lineHeadings[locale]
  const linesEnd = lineDrawer(
    headings,
    lines,
    constraints,
    currency,
    vat,
    quadrants,
    helvetica,
    helveticaBold,
    page
  )

  const widthOfSum = helveticaBold.widthOfTextAtSize(
    sum,
    defaults.size.medium
  )
  page.drawText(sum, {
    x: borders.xmax - widthOfSum,
    y: linesEnd - heightOfALine.normal,
    font: helveticaBold,
    size: defaults.size.medium
  })

  const payHeading = meta.payableTo[locale]
  const widthOfPayHeading = helveticaBold.widthOfTextAtSize(
    payHeading,
    defaults.size.small
  )
  const payHeadingPos = page.drawText(payHeading, {
    x: borders.xmax - widthOfPayHeading,
    y: linesEnd - heightOfALine.normal * 3,
    font: helveticaBold
  })

  const payDetails = drawLinesRightAligned(
    Object.values(yourBank),
    { x: borders.xmax, y: linesEnd - heightOfALine.normal * 4 },
    helvetica,
    page
  )
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })

  return pdfDataUri
}
