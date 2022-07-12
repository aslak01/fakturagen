import type { Constraints } from '$lib/interfaces/pdf'
import type { PDFPage, RGB, PDFFont } from 'pdf-lib'
import { drawInline } from './generalisedDrawRoutines'
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
  let widths: number[] = []
  quadrants.forEach((q) => widths.push(Math.round(width * (q / 100))))
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

  let adapted = evaluatedArr
  while (evaluateQuadArrays(adapted, comparisonArr) === false) {
    adapted.forEach((n, i) => {
      console.log(adapted)
      const target = comparisonArr[i]
      if (n > target) {
        const prevTarget = comparisonArr[i - 1]
        const nextTarget = comparisonArr[i + 1]
        if (typeof adapted[i - 1] !== 'undefined') {
          if (adapted[i - 1] < prevTarget) {
            adapted[i - 1] += 1
            adapted[i] -= 1
          }
        }
        if (typeof adapted[i + 1] !== 'undefined') {
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
  width: number,
  quadrants: number[],
  lineLengths: number[],
  padding: number,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
): number => {
  //console.log(quadrants)
  const absQuads = calculateQuadrants(lineLengths, width, quadrants)
  const absQuadsAsXCoords = [
    constraints.x,
    constraints.x + absQuads[0],
    constraints.x + absQuads[0] + absQuads[1]
  ]
  console.log(absQuads, absQuadsAsXCoords)
  // const longest = longestLine(input, font, size)
  const noMarginWidth = width - defaults.xMargin * 2
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
