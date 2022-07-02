import {
  parseDate,
  formatNumberToCurrency,
  isValidDate
} from '$lib/utils'

import type {
  Customer,
  Company,
  Bank,
  LineHeadings,
  Line,
  InvoiceMeta
} from '$lib/interfaces/invoiceStrings'

import type { Settings, PdfFunctions } from '$lib/interfaces/pdf'

export const drawTitle = (title: string, settings: Settings, pdfFunctions: PdfFunctions) => {
  const page = pdfFunctions.page
  const size = settings.titleSize
  const font = pdfFunctions.boldFont
  const y = pdfFunctions.height - settings.yMargin
  const x = settings.xMargin
  const color = pdfFunctions.textColor

  page.drawText(title, {
    x,
    y,
    size,
    font,
    color
  })
}

export const drawCustomerInfo = (
  customer: Customer,
  settings: Settings, pdfFunctions: PdfFunctions
) => {
  const page = pdfFunctions.page
  const size = settings.lineSize
  const font = pdfFunctions.boldFont
  const y = pdfFunctions.height - settings.yMargin - settings.marginTop
  const x = settings.xMargin
  const color = pdfFunctions.textColor
  const lineHeight = font.heightAtSize(size) + 5
  for (const [i, value] of Object.entries(customer).entries()) {
    let string = value[1]
    if (value[0] === 'orgno') {
      string = 'Org.nr. ' + value[1]
    }

    page.drawText(string, {
      x,
      y: y - lineHeight * i,
      size,
      font,
      color
    })
  }
}

export const drawInvoiceLines = (
  lineHeadings: LineHeadings,
  lines: Line[],
  settings: Settings,
  pdfFunctions: PdfFunctions,
  currency = 'EUR', 
) => {
  const page = pdfFunctions.page
  const size = settings.lineSize
  const font = pdfFunctions.font
  const boldFont = pdfFunctions.boldFont
  const width = pdfFunctions.width - settings.xMargin
  const y =
    pdfFunctions.height - settings.yMargin - settings.marginTop * 3
  const x = settings.xMargin
  const color = pdfFunctions.textColor
  const lineHeight = font.heightAtSize(size) + 5
  const lineHeightBold = boldFont.heightAtSize(size)

  const xPos = [x, x + 80, width]

  page.drawLine({
    start: { x, y: y - lineHeightBold / 2 },
    end: { x: width, y: y - lineHeightBold / 2 },
    thickness: 1,
    color
  })

  for (const [i, value] of Object.values(lineHeadings).entries()) {
    page.drawText(value, {
      x:
        xPos[i] -
        (i === 2 ? boldFont.widthOfTextAtSize(value, size) : 0),
      y,
      size,
      color,
      font: boldFont
    })
  }
  for (const [l, obj] of lines.entries()) {
    for (const [i, value] of Object.values(obj).entries()) {
      let string
      if (typeof value.getMonth === 'function') {
        string = parseDate(value)
      } else if (typeof value === 'number') {
        string = formatNumberToCurrency(value, currency)
      } else {
        string = String(value)
      }
      page.drawText(string, {
        x:
          xPos[i] -
          (i === 2 ? boldFont.widthOfTextAtSize(string, size) : 0),
        y: y - lineHeight * (l + 1),
        size,
        color,
        font
      })
    }
  }
  return {
    start: y,
    end: y - lineHeight * (lines.length + 0.3)
  }
}

export const drawInvoiceInfo = (
  company: Company,
  invoiceMeta: InvoiceMeta,
  settings: Settings, pdfFunctions: PdfFunctions
) => {
  const page = pdfFunctions.page
  const size = settings.lineSize
  const font = pdfFunctions.font
  const boldFont = pdfFunctions.boldFont
  const width = pdfFunctions.width - settings.xMargin
  const y = pdfFunctions.height - settings.yMargin + 3
  // const x = settings.xMargin
  const color = pdfFunctions.textColor
  const lineHeight = font.heightAtSize(size) + 5

  for (const [i, value] of Object.entries(company).entries()) {
    let string = value[1]
    if (value[0] === 'orgno') {
      string = 'Org.nr. ' + value[1]
    }
    page.drawText(string, {
      x: width - font.widthOfTextAtSize(string, size),
      y: y - lineHeight * i,
      size,
      font,
      color
    })
  }
  for (const [i, value] of Object.values(invoiceMeta).entries()) {
    let string
    if (isValidDate(value.value)) {
      string = parseDate(value.value)
    } else {
      string = String(value.value)
    }

    page.drawText(string, {
      x: width - font.widthOfTextAtSize(string, size),
      y: y - lineHeight * (i + 4),
      size,
      font,
      color
    })
    page.drawText(value.title, {
      x: width - 140,
      y: y - lineHeight * (i + 4),
      size,
      font: boldFont,
      color
    })
  }
}

export const drawSums = (
  lines: Line[],
  settings: Settings,
  linesEnd: number,
  pdfFunctions: PdfFunctions,
  currency = 'EUR', 
) => {
  const page = pdfFunctions.page
  const size = settings.lineSize
  const font = pdfFunctions.font
  const boldFont = pdfFunctions.boldFont
  const width = pdfFunctions.width - settings.xMargin
  // const y = settings.height - settings.yMargin - settings.marginTop
  // const x = settings.xMargin
  const color = pdfFunctions.textColor
  // const lineHeight = font.heightAtSize(size) + 5
  // const lineHeightBold = boldFont.heightAtSize(size)

  const sum = formatNumberToCurrency(
    lines.reduce((a, b) => +a + +b.price, 0),
    currency
  )
  page.drawText(sum, {
    x: width - font.widthOfTextAtSize(sum, size),
    y: linesEnd - 30,
    size,
    font: boldFont,
    color
  })
  page.drawText('Sum', {
    x: width - font.widthOfTextAtSize(sum, size) - 40,
    y: linesEnd - 30,
    size,
    font,
    color
  })
  const noMva = 'MVA: 0%'
  page.drawText(noMva, {
    x: width - font.widthOfTextAtSize(noMva, size),
    y: linesEnd - 45,
    size,
    font,
    color
  })
}

export const drawPayTo = (
  bank: Bank,
  settings: Settings,
  linesEnd: number, pdfFunctions: PdfFunctions
) => {
  const page = pdfFunctions.page
  const size = settings.lineSize
  const font = pdfFunctions.font
  const boldFont = pdfFunctions.boldFont
  // const width = settings.width - settings.xMargin
  // const y = settings.height - settings.yMargin - settings.marginTop
  const x = settings.xMargin
  const color = pdfFunctions.textColor
  const lineHeight = font.heightAtSize(size) + 5
  // const lineHeightBold = boldFont.heightAtSize(size)

  const start = linesEnd - 80

  page.drawText('Betales til:', {
    x,
    y: start,
    size,
    font: boldFont,
    color
  })
  for (const [i, value] of Object.entries(bank).entries()) {
    let key = value[0]
    const string = value[1] as string
    if (key === 'accno') {
      key = 'Kontonummer'
    } else if (key === 'bic') {
      key = 'BIC'
    } else if (key === 'iban') {
      key = 'IBAN'
    } else if (key === 'bank') {
      key = 'Bank'
    }
    page.drawText(key, {
      x,
      y: start - lineHeight * (i + 1),
      size,
      font,
      color
    })
    page.drawText(string, {
      x: x + 80,
      y: start - lineHeight * (i + 1),
      size,
      font,
      color
    })
  }
}
