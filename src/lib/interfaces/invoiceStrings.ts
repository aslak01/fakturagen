export type Locale = string

export interface Currency {
  name: string
  short: string
  symbol?: string
}

export interface Customer {
  name: string
  orgno: string
  adr: string
}

export interface Company {
  name: string
  orgno: string
  adr: string
}

export interface Bank {
  accno: string
  iban: string
  bic: string
  bank: string
}

export interface LineHeadings {
  date: string
  description: string
  price: string
}

export interface Line {
  date: string
  description: string
  price: string
  vat?: string
  sum?: string
}

export interface InvoiceMeta {
  invoiceDate: {
    title: string
    value: Date
  }
  dueDate: {
    title: string
    value: Date
  }
  invoiceNumber: {
    title: string
    value: string
  }
}

export interface Vat {
  enabled: boolean
  rate: number
}
