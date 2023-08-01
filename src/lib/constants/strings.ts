import {
	aMonthInTheFuture,
	parseDate,
	randomDate,
	splitStrInBacc,
	splitStringInNs,
	splitStrInIBAN,
} from "$lib/utils";

import { formatNumberToCurrency, sumNrArr } from "$lib/utils";

import type { Currencies } from "$lib/interfaces/invoiceStrings";

import { parseJson } from "$lib/json/parseJson.js";

import json from "$lib/json/jobs.json";

export const locale = import.meta.env.VITE_CURRENT_LOCALE || "nb-NO";

const curr = import.meta.env.VITE_CURRENCY_ABBREV || "EUR";

export const currencies: Currencies = {
	NOK: {
		name: "Norske kroner",
		short: "NOK",
		symbol: "kr",
	},
	EUR: {
		name: "Euro",
		short: "EUR",
		symbol: "€",
	},
};

export const currency = currencies[curr];
export const vat = {
	enabled:
		typeof import.meta.env.VITE_VAT_ENABLED === "string"
			? !!+import.meta.env.VITE_VAT_ENABLED
			: true,
	rate: import.meta.env.VITE_VAT_RATE || 25,
};

export const yourCompany = {
	name: import.meta.env.VITE_YOUR_FIRM_NAME || "Mitt firma",
	orgno: splitStringInNs(import.meta.env.VITE_YOUR_FIRM_ORGNO || "312321123"),
	str: import.meta.env.VITE_YOUR_FIRM_STR || "Adressegassa 123",
	poCty: import.meta.env.VITE_YOUR_FIRM_PO_CTY || "1234 Sted",
};

export const invoiceMeta = {
	invoiceDate: parseDate(new Date()),
	dueDate: parseDate(new Date(aMonthInTheFuture(2))),
	invoiceNumber: import.meta.env.VITE_YOUR_INVOICE_NUMBER || "1",
};

export const yourBank = {
	accno: splitStrInBacc(import.meta.env.VITE_YOUR_BANK_ACC || "12341212345"),
	iban: splitStrInIBAN(import.meta.env.VITE_YOUR_IBAN || "NO1212341212345"),
	bic: import.meta.env.VITE_YOUR_BIC || "BANKN12XXX",
	bank: import.meta.env.VITE_YOUR_BANK || "Min bankeste bank",
};

export const customer = {
	name: import.meta.env.VITE_MY_CUSTOMER_NAME || "Kunde kundesen",
	orgno: splitStringInNs(import.meta.env.VITE_MY_CUSTOMER_ORGNO || "123123123"),
	str: import.meta.env.VITE_MY_CUSTOMER_STR || "Eksempelvei 21",
	poCty: import.meta.env.VITE_MY_CUSTOMER_PO_CTY || "1234 Eksempelby",
};

export const author =
	typeof import.meta.env.VITE_MY_NAME === "string"
		? import.meta.env.VITE_MY_NAME
		: "Herr Fakturaskriver";

export const service =
	typeof import.meta.env.VITE_MY_SERVICE === "string"
		? import.meta.env.VITE_MY_SERVICE
		: "Tjeneste";

export const pdfTitle =
	"Faktura fra " + yourCompany.name + " nr. " + invoiceMeta.invoiceNumber;

export const title = "Faktura";

const jsonData = parseJson(json);

export const lines = jsonData || [
	{
		date: parseDate(randomDate()),
		description: "En tjeneste som er utført",
		price: "111",
	},
	{
		date: parseDate(randomDate()),
		description: "Noe som koster penger",
		price: "123.3",
	},
	{
		date: parseDate(randomDate()),
		description: "Noe annet som koster penger",
		price: "4.20",
	},
	{
		date: parseDate(randomDate()),
		description: "Enda en ting",
		price: "69",
	},
	{
		date: parseDate(randomDate()),
		description: "En annen ting",
		price: "42",
	},
];

const prices = lines.map((i) => Number(i.price));

export const sum = vat.enabled
	? formatNumberToCurrency(sumNrArr(prices) * (vat.rate / 100 + 1), curr)
	: formatNumberToCurrency(sumNrArr(prices), curr);
