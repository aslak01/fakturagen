import type { PDFFont, PDFPage, RGB } from 'pdf-lib'

export interface Settings {
 titleSize: number
  lineSize: number
  xMargin: number
  yMargin: number
  marginTop: number
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
