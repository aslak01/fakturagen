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

import {
  drawTitle,
  drawCustomerInfo,
  drawInvoiceLines,
  drawInvoiceInfo,
  drawSums,
  drawPayTo
} from '$lib/drawRoutines'

export async function drawPdf() {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  )
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()

  const settings = {
    titleSize: 15,
    lineSize: 10,
    xMargin: 100,
    yMargin: 100,
    marginTop: 80,
    width,
    height,
//    textColor: cmyk(0,0,0,1),
    textColor: rgb(0,0,0),
    font: helvetica,
    boldFont: helveticaBold
  }

  pdfDoc.setTitle(pdfTitle)
  pdfDoc.setAuthor(author)
  pdfDoc.setSubject(service)
  pdfDoc.setCreationDate(new Date())
  pdfDoc.setModificationDate(new Date())

  drawTitle(
    title, 
    settings, 
    page
  )
  drawCustomerInfo(
    customer, 
    settings, 
    page
  )
  drawInvoiceLines(
    lineHeadings, 
    lines, 
    settings, 
    page
  )

  drawInvoiceInfo(
    yourCompany, 
    invoiceMeta, 
    settings, 
    page
  )

  const test = drawInvoiceLines(
    lineHeadings, 
    lines, 
    settings, 
    page
  )

  page.drawLine({
    start: { x: settings.xMargin, y: test.end },
    end: { x: settings.width - settings.xMargin, y: test.end },
    thickness: 1,
    color: settings.textColor
  })

  drawSums(
    lines, 
    settings, 
    test.end, 
    page
  )

  drawPayTo(
    yourBank, 
    settings, 
    test.end, 
    page
  )

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  return pdfDataUri
}
