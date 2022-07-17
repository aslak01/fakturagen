import { parseDate } from '$lib/utils'

import type { XTRFjsonDefinition } from '$lib/interfaces/xtrf'
import type { Line } from '$lib/interfaces/invoiceStrings'
const testInvoicability = (json: XTRFjsonDefinition[]) => {
  const res = json.filter(
    (x) =>
      x.jobsInvoice.invoicingState === 'CAN_CREATE_NEW_INVOICE' &&
      x.overview.status === 'NOT_INVOICED'
  )
  return res
}
const returnRelevantRows = (json: XTRFjsonDefinition[]): Line[] => {
  const res = json.map((x) => {
    return {
      date: parseDate(x.overview.deliveryDate),
      description:
        x.overview.sourceLanguage.symbol +
        ' > ' +
        x.overview.targetLanguages[0].symbol +
        '    ' +
        x.overview.idNumber,
      price: String(x.overview.jobValue.value)
    }
  })
  return res
}

export const parseJson = (XTRFjson: XTRFjsonDefinition[]) => {
  if (
    !XTRFjson ||
    XTRFjson.length === 0 ||
    typeof XTRFjson === 'undefined' ||
    typeof XTRFjson[0] === 'undefined'
  )
    return undefined
  const json = XTRFjson
  const invoicable = testInvoicability(json)
  const relevantInfo = returnRelevantRows(invoicable)
  return relevantInfo
}
