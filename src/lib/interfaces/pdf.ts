import type { PDFFont, PDFPage, RGB, CMYK } from 'pdf-lib'

export interface Settings {
  titleSize: number
  lineSize: number
  xMargin: number
  yMargin: number
  marginTop: number
  width: number
  height: number
  font: PDFFont
  boldFont: PDFFont
  //  textColor: CMYK
  textColor: RGB
}
export interface PdfFunctions {
  page: PDFPage
  width: number
  height: number
  font: PDFFont
  boldFont: PDFFont
  rgb: Function
  textColor: RGB
}
export interface Coords {
  x: number
  y: number
}
export interface Constraints {
  x: number
  y: number
}
export interface Boundaries {
  upper: {
    x: number
    y: number
  }
  lower: {
    x: number
    y: number
  }
}
