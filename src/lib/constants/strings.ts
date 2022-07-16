import {
  parseDate,
  splitStringInNs,
  randomDate,
  aMonthInTheFuture,
  splitStrInBacc,
  splitStrInIBAN
} from '$lib/utils'

import { parseJson } from '$lib/parseJson.js'
import json from '$lib/jobs.json'

export const locale = 'nb-NO'

export const currency = {
  name: 'Euro',
  short: 'EUR',
  symbol: '€'
}

export const vat = {
  enabled: true,
  rate: 25
}

export const yourCompany = {
  name: import.meta.env.VITE_YOUR_FIRM_NAME || 'Mitt firma',
  orgno: splitStringInNs(
    import.meta.env.VITE_YOUR_FIRM_ORGNO || '312321123'
  ),
  str: import.meta.env.VITE_YOUR_FIRM_STR || 'Adressegassa 12',
  poCty: import.meta.env.VITE_YOUR_FIRM_PO_CTY || '1234 Sted'
}

export const invoiceMeta = {
  invoiceDate: parseDate(new Date()),
  dueDate: parseDate(new Date(aMonthInTheFuture())),
  invoiceNumber: '19'
}

export const yourBank = {
  accno: splitStrInBacc(
    import.meta.env.VITE_YOUR_BANK_ACC || '12341212345'
  ),
  iban: splitStrInIBAN(
    import.meta.env.VITE_YOUR_IBAN || 'NO1212341212345'
  ),
  bic: import.meta.env.VITE_YOUR_BIC || 'BANKN12XXX',
  bank: import.meta.env.VITE_YOUR_BANK || 'My Bank'
}

export const customer = {
  name: import.meta.env.VITE_MY_CUSTOMER_NAME || 'Kunde kundesen',
  orgno: splitStringInNs(
    import.meta.env.VITE_MY_CUSTOMER_ORGNO || '123123123'
  ),
  str: import.meta.env.VITE_MY_CUSTOMER_STR || 'Eksempelvei 21',
  poCty: import.meta.env.VITE_MY_CUSTOMER_PO_CTY || '1234 Eksempelby'
}

export const lineHeadings = {
  date: 'Dato',
  description: 'Beskrivelse',
  price: 'Pris',
  vat: 'MVA',
  sum: 'Sum'
}

export const author =
  typeof import.meta.env.VITE_MY_NAME === 'string'
    ? import.meta.env.VITE_MY_NAME
    : 'Herr Fakturaskriver'

export const service =
  typeof import.meta.env.VITE_MY_SERVICE === 'string'
    ? import.meta.env.VITE_MY_SERVICE
    : 'Tjeneste'

export const pdfTitle =
  'Faktura fra ' +
  yourCompany.name +
  ' nr. ' +
  invoiceMeta.invoiceNumber

export const title = 'Faktura'

const jsonData = parseJson(json)

export const lines =
  jsonData?.length < 1
    ? jsonData
    : [
        {
          date: parseDate(randomDate()),
          description: 'DE > NO DAI-2022/14354/#1/1',
          price: '111'
        },
        {
          date: parseDate(randomDate()),
          description: 'Noe som koster penger',
          price: '123.3'
        },
        {
          date: parseDate(randomDate()),
          description: 'Noe annet som koster penger',
          price: '4.20'
        },
        {
          date: parseDate(randomDate()),
          description: 'En tredje ting',
          price: '69'
        },
        {
          date: parseDate(randomDate()),
          description: 'En fjerde ting',
          price: '42'
        }
      ]
