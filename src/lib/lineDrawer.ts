import type {
  Constraints,
  Quadrants,
  Margins,
  TitlesAndDimensions
} from '$lib/interfaces/pdf'
import type { Line, Currency } from './interfaces/invoiceStrings'
import type { PDFPage, RGB, PDFFont } from 'pdf-lib'
import { drawInline, drawLinesLeft } from './generalisedDrawRoutines'
import { defaults } from '$lib/constants/pdfSettings'
import { sumNrArr } from './utils'

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
    console.log(w)
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

export const drawInlineEvenlySpaced = (
  input: string[],
  constraints: Constraints,
  font: PDFFont,
  page: PDFPage,
  quadrants: number[],
  lineLengths: number[],
  padding: number,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
): number => {
  const width = page.getWidth()
  const usableWidth = width - defaults.xMargin
  const absQuads = relQuadToAbsQuad(usableWidth, quadrants)
  //console.log(quadrants)

  const absQuadsAsXCoords = [
    constraints.x,
    constraints.x + absQuads[0],
    constraints.x + absQuads[0] + absQuads[1]
  ]
  // console.log(absQuads, absQuadsAsXCoords)
  // console.log(input, absQuadsAsXCoords)
  // const longest = longestLine(input, font, size)
  // const adaptedQuads = relQuadToAbsQuad(noMarginWidth, quadrants)
  //console.log(
  //  console.log(evaluateQuadArrays([100, 300, 100], adaptedQuads))
  //)
  // let pos = constraints.x
  // let len = input.length
  // const evenSpace = (len: number, i: number, w: number) =>
  // w * ((i + 1) / len)
  input.forEach((l, i) => {
    const string = String(l)
    // const lineLen = font.widthOfTextAtSize(string, size)
    const drawn = drawInline(
      string,
      { x: absQuadsAsXCoords[i], y: constraints.y },
      font,
      page,
      size,
      color,
      leading
    )
  })
  return constraints.y - font.heightAtSize(size) - leading
}

export const lineLengthFigurerOuter = (
  headingObject: Line,
  lineObject: Line[],
  font: PDFFont,
  size: number
) => {
  const categories: string[] = []
  const categoryMaxLengths: number[] = []
  Object.values(headingObject).forEach((cat) => {
    categories.push(cat)
    categoryMaxLengths.push(font.widthOfTextAtSize(cat, size))
  })
  lineObject.forEach((l) => {
    Object.values(l).forEach((c, i) => {
      const length = font.widthOfTextAtSize(c, size)
      // console.log(length, categoryMaxLengths[i])
      if (categoryMaxLengths[i] < length)
        categoryMaxLengths[i] = length
    })
  })
  // console.log(categories, categoryMaxLengths)
  return {
    titles: categories,
    lineLengths: categoryMaxLengths
  }
}

export const getXminsAndMaxs = (
  titlesAndDimensions: TitlesAndDimensions,
  translatedQuadrants: Quadrants,
  usableWidth: number,
  margins: Margins = defaults.margins
) => {
  const xMins: number[] = []
  const xMaxs: number[] = []

  titlesAndDimensions.lineLengths.forEach((_l, i) => {
    const firstXpos = margins.xMargin
    xMins.push(
      i > 0 ? firstXpos + translatedQuadrants[i - 1] : firstXpos
    )
  })
  xMins.forEach((_m, i) => {
    const length = xMins.length
    xMaxs.push(i < length - 1 ? xMins[i + 1] : usableWidth)
  })

  return { xMins, xMaxs }
}

export const drawPrices = (
  priceArray: string[],
  currency: Currency,
  constraints: { xMin: number; xMax: number; y: number },
  page: PDFPage,
  font: PDFFont,
  size: number = defaults.size.small
) => {
  const heightOfLine =
    font.heightAtSize(size) + defaults.leading.small
  let yPos = constraints.y
  priceArray.forEach((price) => {
    const curr = currency.symbol || currency.short
    page.drawText(curr, {
      x: constraints.xMin,
      y: yPos
    })
    const lengthOfPrice = font.widthOfTextAtSize(price, size)
    page.drawText(price, {
      x: constraints.xMax - lengthOfPrice,
      y: yPos
    })
    yPos -= heightOfLine
  })
}

export const lineDrawer = (
  headingObject: Line,
  lineObject: Line[],
  constraints: Constraints,
  currency: Currency,
  quadrants: Quadrants,
  font: PDFFont,
  boldFont: PDFFont,
  page: PDFPage,
  size: number = defaults.size.small,
  margins: Margins = defaults.margins
) => {
  const titlesAndDimensions = lineLengthFigurerOuter(
    headingObject,
    lineObject,
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
    usableWidth
  )
  console.log(titlesAndDimensions)

  let titlesY = { ymax: 0 }
  titlesAndDimensions.titles.forEach((title, i) => {
    titlesY = drawInline(
      title,
      { x: xMins[i], y: constraints.y },
      boldFont,
      page
    )
  })

  const descriptionArray = lineObject.map((l) => l.description)
  const priceArray = lineObject.map((l) => l.price)
  const dateArray = lineObject.map((l) => l.date)

  drawPrices(
    priceArray,
    currency,
    { xMin: xMins[2], xMax: xMaxs[2], y: titlesY.ymax },
    page,
    font
  )

  drawLinesLeft(
    descriptionArray,
    { x: xMins[1], y: titlesY.ymax },
    font,
    page
  )
  drawLinesLeft(
    dateArray,
    { x: xMins[0], y: titlesY.ymax },
    font,
    page
  )
  console.log(priceArray)
  console.log(
    'xMins',
    xMins,
    'xMaxs',
    xMaxs,
    'usableWidth',
    usableWidth,
    'width',
    width
  )
}