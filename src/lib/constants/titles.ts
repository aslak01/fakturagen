import { vat } from '$lib/constants/strings';

interface InvoiceMeta {
	lineHeadings: {
		[key: string]: {
			date: string;
			description: string;
			price: string;
			vat: string;
			sum: string;
		};
	};
	payInfo: {
		[key: string]: {
			invoiceDate: string;
			dueDate: string;
			invoiceNumber: string;
		};
	};
	title: {
		[key: string]: string;
	};
	payableTo: {
		[key: string]: string;
	};
}

export const meta: InvoiceMeta = {
	lineHeadings: {
		'nb-NO': {
			date: 'Dato',
			description: 'Beskrivelse',
			price: 'Pris',
			vat: 'MVA ' + vat.rate + ' %',
			sum: 'Sum'
		}
	},
	payInfo: {
		'nb-NO': {
			invoiceDate: 'Fakturadato',
			dueDate: 'Betalingsfrist',
			invoiceNumber: 'Fakturanummer'
		}
	},
	title: {
		'nb-NO': 'Faktura'
	},
	payableTo: {
		'nb-NO': 'betales til'
	}
};
