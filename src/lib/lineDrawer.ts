import type {
  Constraints,
  Quadrants,
  Margins,
  TitlesAndDimensions,
  Vat
} from '$lib/interfaces/pdf'
import type { Line, Currency } from './interfaces/invoiceStrings'
import type { PDFPage, PDFFont } from 'pdf-lib'
import { drawInline } from './generalisedDrawRoutines'
import { defaults } from '$lib/constants/pdfSettings'
import { sumNrArr, formatNumberToCurrency } from './utils'

export const longestLine = (
  lines: string[],
  font: PDFFont,
  size: number = defaults.size.small
): number => {
  let length = 0
  for (const line of lines) {
    const len = font.widthOfTextAtSize(line, size)
    if (len > length) length = len
  }
  return length
}

export const relQuadToAbsQuad = (
  width: number,
  quadrants: number[]
) => {
  const widths: number[] = []
  quadrants.forEach((q) => {
    const w = width * (q / 100)
    widths.push(w)
  })
  return widths
}

export const evaluateQuadArrays = (
  evaluatedArr: number[],
  comparisonArr: number[]
): boolean => {
  let withinParams = true
  evaluatedArr.forEach((n, i) => {
    if (n > comparisonArr[i]) withinParams = false
  })
  return withinParams
}

export const adaptArrays = (
  evaluatedArr: number[],
  comparisonArr: number[]
): number[] => {
  if (evaluateQuadArrays(evaluatedArr, comparisonArr))
    return evaluatedArr

  const sumEvalArr = sumNrArr(evaluatedArr)
  const sumCompArr = sumNrArr(comparisonArr)

  if (sumEvalArr > sumCompArr)
    throw new Error('Lines too long to fit')

  const adapted = evaluatedArr
  while (evaluateQuadArrays(adapted, comparisonArr) === false) {
    adapted.forEach((n, i) => {
      console.log(adapted)
      const target = comparisonArr[i]
      if (n > target) {
        const prevTarget = comparisonArr[i - 1]
        const nextTarget = comparisonArr[i + 1]
        if (
          typeof adapted[i - 1] !== 'undefined' &&
          typeof adapted[i + 1] !== undefined
        ) {
          if (adapted[i - 1] < prevTarget) {
            adapted[i - 1] += 1
            adapted[i] -= 1
          }
          if (adapted[i + 1] < nextTarget) {
            adapted[i + 1] + 1
            adapted[i] -= 1
          }
        } else if (typeof adapted[i - 1] !== 'undefined') {
          if (adapted[i - 1] < prevTarget) {
            adapted[i - 1] += 1
            adapted[i] -= 1
          }
        } else if (typeof adapted[i + 1] !== 'undefined') {
          if (adapted[i + 1] < nextTarget) {
            adapted[i + 1] += 1
            adapted[i] -= 1
          }
        }
      }
    })
  }
  return adapted
}

export const calculateQuadrants = (
  longestLines: number[],
  width: number,
  quadrants: number[] = [20, 60, 20],
  margin: number = defaults.xMargin
): number[] => {
  const usableWidth = width - margin * 2
  const absQuads = relQuadToAbsQuad(usableWidth, quadrants)
  if (evaluateQuadArrays(longestLines, absQuads)) {
    return absQuads
  }
  return adaptArrays(longestLines, absQuads)
}

export const lineLengthFigurerOuter = (
  headingObject: Line,
  lineArray: Line[],
  font: PDFFont,
  size: number
) => {
  const categories: string[] = []
  const categoryMaxLengths: number[] = []
  Object.values(headingObject).forEach((cat) => {
    const catStr = String(cat)
    categories.push(catStr)
    categoryMaxLengths.push(font.widthOfTextAtSize(catStr, size))
  })
  lineArray.forEach((l) => {
    Object.values(l).forEach((c, i) => {
      const cStr = String(c)
      const length = font.widthOfTextAtSize(cStr, size)
      if (categoryMaxLengths[i] < length)
        categoryMaxLengths[i] = length
    })
  })
  return {
    titles: categories,
    lineLengths: categoryMaxLengths
  }
}

export const getXminsAndMaxs = (
  titlesAndDimensions: TitlesAndDimensions,
  translatedQuadrants: Quadrants,
  usableWidth: number,
  gap: number = defaults.gap.small,
  margins: Margins = defaults.margins
) => {
  const xMins: number[] = []
  const xMaxs: number[] = []
  titlesAndDimensions.lineLengths.forEach((_l, i) => {
    const firstXpos = margins.xMargin
    const sumSoFar = translatedQuadrants
      .slice(0, i)
      .reduce((a, b) => a + b, 0)
    const xMin = i > 0 ? firstXpos + sumSoFar : firstXpos
    xMins.push(xMin)
  })
  xMins.forEach((_m, i) => {
    const length = xMins.length
    const xMax = i < length - 1 ? xMins[i + 1] - gap : usableWidth
    xMaxs.push(xMax)
  })

  console.log('usableWidth', usableWidth, xMins, xMaxs)
  return { xMins, xMaxs }
}

export const lineDrawer = (
  headingObject: Line,
  lineArray: Line[],
  constraints: Constraints,
  currency: Currency,
  vat: Vat,
  quadrants: Quadrants,
  font: PDFFont,
  boldFont: PDFFont,
  page: PDFPage,
  size: number = defaults.size.small,
  margins: Margins = defaults.margins,
  gap: number = defaults.gap.small
) => {
  let headings
  if (vat.enabled === false) {
    const { date, description, price } = headingObject
    headings = { date, description, price }
  } else {
    headings = headingObject
  }
  const titlesAndDimensions = lineLengthFigurerOuter(
    headings,
    lineArray,
    font,
    size
  )
  // todo: implement the auto sizing algorithm

  const width = page.getWidth()
  const usableWidth = width - margins.xMargin
  const translatedQuadrants = relQuadToAbsQuad(usableWidth, quadrants)

  const { xMins, xMaxs } = getXminsAndMaxs(
    titlesAndDimensions,
    translatedQuadrants,
    usableWidth,
    gap
  )

  let titlesY = { ymax: 0 }

  titlesAndDimensions.titles.forEach((title, i) => {
    titlesY = drawInline(
      title,
      { x: xMins[i], y: constraints.y },
      boldFont,
      page
    )
  })

  let linePos = titlesY.ymax
  const lineHeight = font.heightAtSize(size) + defaults.leading.small
  lineArray.forEach((line) => {
    page.drawText(line.date, {
      x: xMins[0],
      y: linePos
    })
    page.drawText(line.description, {
      x: xMins[1],
      y: linePos
    })
    const price = formatNumberToCurrency(Number(line.price))
    const lengthOfPrice = font.widthOfTextAtSize(price, size)
    page.drawText(price, {
      x: xMaxs[2] - lengthOfPrice,
      y: linePos
    })

    if (vat.enabled) {
      const vatString = vat.rate + ' %'
      const width = font.widthOfTextAtSize(vatString, size)
      page.drawText(vatString, {
        x: xMaxs[3] - width,
        y: linePos
      })
      const priceWithVat = formatNumberToCurrency(
        Number(line.price) * (vat.rate / 100 + 1)
      )
      const lengthOfVat = font.widthOfTextAtSize(priceWithVat, size)
      page.drawText(priceWithVat, {
        x: xMaxs[4] - lengthOfVat,
        y: linePos
      })
    }
    linePos -= lineHeight
  })
}
