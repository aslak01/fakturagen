export const parseDate = (d: number | Date): string => {
	const date = new Date(d);
	const options: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit'
	};
	return new Intl.DateTimeFormat('nb-NO', options).format(date);
};

export const parseISOdate = (d: number): string => {
	const date = new Date(d);
	return new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'Asia/Jakarta',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date);
};

export const formatNumberToCurrency = (
	n: number,
	currency = 'EUR',
	locale = 'nb-NO'
) =>
	new Intl.NumberFormat(locale, {
		style: 'currency',
		currency
	}).format(n);

export const formatNumberToPercent = (n: number, locale = 'nb-NO') =>
	new Intl.NumberFormat(locale, { style: 'percent' }).format(n);

export const splitStringInNs = (string: string, n = 3) => {
	let str = string;
	if (typeof str !== 'string') {
		str = String(str);
	}
	return [...str]
		.map((d, i) => (i % n === 0 ? ' ' + d : d))
		.join('')
		.trim();
};

export const splitStrInBacc = (string: string) => {
	let str = string;
	if (typeof str !== 'string') {
		str = String(str);
	}
	return [...str]
		.map((d, i) => (i === 4 || i === 6 ? ' ' + d : d))
		.join('')
		.trim();
};
export const splitStrInIBAN = (string: string) => {
	let str = string;
	if (typeof str !== 'string') {
		str = String(str);
	}
	return [...str]
		.map((d, i) => (i === 2 || i === 4 || i === 8 || i === 14 ? ' ' + d : d))
		.join('')
		.trim();
};

export const randomDate = () =>
	new Date().getTime() - 1000 * 3600 * 24 * Math.floor(Math.random() * 31);

export const aMonthInTheFuture = (
	lessThanAMonthFactor = 0,
	moreThanAMonthFactor = 0
) =>
	new Date().getTime() +
	1000 * 3600 * 24 * (30.5 - lessThanAMonthFactor + moreThanAMonthFactor);

export function isValidDate(date: Date) {
	return (
		date &&
		Object.prototype.toString.call(date) === '[object Date]' &&
		!isNaN(date as unknown as number)
	);
}

export const sumNrArr = (array: number[]): number =>
	array.reduce((a, b) => a + b, 0);
