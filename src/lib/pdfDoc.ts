import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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
    marginTop: 80
  }
  const pdfFunctions = {
    page,
    width,
    height,
    font: helvetica,
    boldFont: helveticaBold,
    rgb,
    textColor: rgb(0,0,0)
  }

  pdfDoc.setTitle(pdfTitle)

  pdfDoc.setAuthor(author)
  pdfDoc.setSubject(service)
  pdfDoc.setCreationDate(new Date())
  pdfDoc.setModificationDate(new Date())

  drawTitle(title, settings, pdfFunctions)
  drawCustomerInfo(customer, settings, pdfFunctions)
  drawInvoiceLines(lineHeadings, lines, settings, pdfFunctions)
  drawInvoiceInfo(yourCompany, invoiceMeta, settings, pdfFunctions)

  const test = drawInvoiceLines(lineHeadings, lines, settings, pdfFunctions)

  page.drawLine({
    start: { x: settings.xMargin, y: test.end },
    end: { x: pdfFunctions.width - settings.xMargin, y: test.end },
    thickness: 1,
    color: pdfFunctions.textColor
  })

  drawSums(lines, settings, test.end, pdfFunctions)

  drawPayTo(yourBank, settings, test.end, pdfFunctions)

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  return pdfDataUri
}
