import { rgb } from "pdf-lib";

export const defaults = {
	margins: {
		xMargin: 40,
		yMargin: 40,
	},
	xMargin: 40,
	yMargin: 40,
	color: {
		black: rgb(0, 0, 0),
	},
	size: {
		tiny: 8,
		small: 10,
		medium: 12,
	},
	leading: {
		tight: 2,
		small: 5,
	},
	gap: {
		small: 20,
	},
};
