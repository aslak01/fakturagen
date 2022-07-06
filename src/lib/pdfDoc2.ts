import { PDFDocument, StandardFonts, rgb, cmyk } from 'pdf-lib'

import {
  yourCompany,
  yourBank,
  invoiceMeta,
  customer,
  lineHeadings,
  author,
  service,
  title,
  lines,
  pdfTitle
} from '$lib/constants/strings'
import { headings, meta } from '$lib/constants/titles'
import { defaults } from './constants/pdfSettings'
import {
  drawInline,
  drawLinesRight,
  drawLinesLeft,
  drawLinesRightAligned
} from '$lib/generalisedDrawRoutines'

export async function drawPdf() {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  )
  const page = pdfDoc.addPage()
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
    xmin: borders.xmax / 2,
    xmax: borders.xmax
  }
  let titleDim = drawInline(
    title,
    { x: bounds.upper.x, y: bounds.upper.y },
    helveticaBold,
    page
  )
  console.log(borders.ymin, titleDim.ymax)
  const customerDimensions = drawLinesLeft(
    Object.values(customer),
    { x: borders.xmin, y: titleDim.ymax },
    helvetica,
    page
  )
  let endcoords = drawLinesRightAligned(
    Object.values(yourCompany),
    { x: topRightBox.xmax, y: borders.ymin },
    helvetica,
    page
  )
  drawLinesLeft(
    Object.values(yourBank),
    { x: topRightBox.xmin, y: borders.ymin },
    helvetica,
    page
  )

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  return pdfDataUri
}
