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
      size
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
      size
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
      size
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
