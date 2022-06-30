export interface JobsInvoice {
  invoiceDueDate: string | null
  invoicingState: string
}

export interface Assignee {
  firstName: string
  lastName: string
  email: string
}

export interface JobValue {
  currency: number
  currencyISOCode: string
  value: number
}

export interface Language {
  name: string
  symbol: string
}

export interface Overview {
  assignee: Assignee
  deadline: number
  deliveryDate: number
  startDate: number
  idNumber: string
  jobValue: JobValue
  sourceLanguage: Language
  targetLanguages: Language[]
  type: string
  status: string
}

export interface XTRFjsonDefinition {
  id: number
  jobsInvoice: JobsInvoice
  overview: Overview
  smartJobId: string
}
