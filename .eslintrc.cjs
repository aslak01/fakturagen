module.exports = {
	root: true,
	plugins: ["@typescript-eslint"],
	extends: ["plugin:svelte/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		project: "./tsconfig.json",
		extraFileExtensions: [".svelte"], // This is a required setting in `@typescript-eslint/parser` v4.24.0.
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",

			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
	settings: {
		svelte: {
			ignoreWarnings: ["svelte/no-at-html-tags"],
			compileOptions: {
				postcss: {
					configFilePath: "./postcss.config.js",
				},
			},
		},
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
};
