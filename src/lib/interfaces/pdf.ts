import type { PDFFont, PDFPage, RGB } from 'pdf-lib'

export interface Settings {
  page: PDFPage
  width: number
  height: number
  font: PDFFont
  boldFont: PDFFont
  rgb: Function
  color: RGB
  titleSize: number
  lineSize: number
  xMargin: number
  yMargin: number
  marginTop: number
}
