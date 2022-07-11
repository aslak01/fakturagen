import type { Coords, Constraints } from '$lib/interfaces/pdf'
import type { PDFPage, RGB, PDFFont } from 'pdf-lib'
import { defaults } from '$lib/constants/pdfSettings'

export const drawInline = (
  string: string,
  constraints: Coords,
  font: PDFFont,
  page: PDFPage,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
) => {
  const stringLength = font.widthOfTextAtSize(string, size)
  const stringHeight = font.heightAtSize(size) + leading
  page.drawText(string, {
    x: constraints.x,
    y: constraints.y,
    font,
    size,
    color
  })

  return {
    xmin: constraints.x,
    xmax: constraints.x + stringLength,
    ymin: constraints.y,
    ymax: constraints.y - stringHeight
  }
}

export const drawLinesLeft = (
  input: string[],
  constraints: Constraints,
  font: PDFFont,
  page: PDFPage,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
) => {
  const ogY = constraints.y
  let yPos = ogY
  const xPos = constraints.x
  const lineHeight = font.heightAtSize(size) + leading
  let longestLine = 0
  for (const line of input) {
    const length = font.widthOfTextAtSize(line, size)
    if (length > longestLine) longestLine = length
    page.drawText(line, {
      x: xPos,
      y: yPos,
      font,
      size,
      color
    })
    yPos -= lineHeight
  }
  return {
    xmin: xPos,
    xmax: xPos + longestLine,
    ymin: ogY,
    ymax: yPos
  }
}

export const drawLinesRight = (
  input: string[],
  constraints: Constraints,
  font: PDFFont,
  page: PDFPage,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
) => {
  const longestLine = calculateMaxLineLength(input, font, size)
  let yPos = constraints.y
  const xPos = constraints.x - longestLine
  const lineHeight = font.heightAtSize(size) + leading
  for (const line of input) {
    page.drawText(line, {
      x: xPos,
      y: yPos,
      font,
      size,
      color
    })
    yPos -= lineHeight
    console.log(yPos, xPos)
  }
  return yPos
}

export const drawLinesRightAligned = (
  input: string[],
  constraints: Constraints,
  font: PDFFont,
  page: PDFPage,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
) => {
  const ogY = constraints.y
  let yPos = ogY
  const xPos = constraints.x
  const lineHeight = font.heightAtSize(size) + leading
  let longestLine = 0
  for (const line of input) {
    const length = font.widthOfTextAtSize(line, size)
    if (length > longestLine) longestLine = length
    page.drawText(line, {
      x: xPos - length,
      y: yPos,
      font,
      size,
      color
    })
    yPos -= lineHeight
  }
  return {
    xmin: constraints.x,
    xmax: constraints.x - longestLine,
    ymin: ogY,
    ymax: yPos
  }
}

export const calculateMaxLineLength = (
  input: string[],
  font: PDFFont,
  size: number
) => {
  let length = 0
  for (const line of input) {
    const len = font.widthOfTextAtSize(line, size)
    if (len > length) length = len
  }
  return length
}

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
  quadrants.forEach((q) => widths.push(width * (q / 100)))
  return widths
}

export const evaluateQuadArrays = (
  arr1: number[],
  arr2: number[]
): boolean => {
  let withinParams = true
  arr1.forEach((n, i) => {
    if (n > arr2[i]) withinParams = false
  })
  return withinParams
}

export const adaptArrays = (
  arr1: number[],
  arr2: number[]
): number[] => {
  if (evaluateQuadArrays(arr1, arr2)) return arr1
  let adapted = arr1
  while (evaluateQuadArrays(adapted, arr2) === false) {
    adapted.forEach((n, i) => {
      if (n > arr2[i]) {
        if (typeof adapted[i - 1] !== undefined) {
          adapted[i - 1] - 1
          adapted[i] + 1
        }
        if (typeof adapted[i + 1] !== undefined) {
          adapted[i + 1] - 1
          adapted[i] + 1
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
  if (evaluateQuadArrays(absQuads, longestLines)) {
    return absQuads
  }
  return adaptArrays(absQuads, longestLines)
}

export const drawInlineEvenlySpaced = (
  input: string[],
  constraints: Constraints,
  font: PDFFont,
  page: PDFPage,
  width: number,
  padding: number,
  size: number = defaults.size.small,
  color: RGB = defaults.color.black,
  leading: number = defaults.leading.tight
): void => {
  const longest = longestLine(input, font, size)
  const noMarginWidth = width - defaults.xMargin * 2
  let pos = constraints.x
  let len = input.length
  const evenSpace = (len: number, i: number, w: number) =>
    w * ((i + 1) / len)
  input.forEach((l, i) => {
    const lineLen = font.widthOfTextAtSize(l, size)
    const drawn = drawInline(
      l,
      { x: pos, y: constraints.y },
      font,
      page,
      size,
      color,
      leading
    )
    pos = drawn.xmax + evenSpace(length, i, noMarginWidth)
  })
}
