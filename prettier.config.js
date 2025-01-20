/**
 * @import { Options } from "prettier";
 */

/** @satisfies {Options} */
const config = {
	useTabs: true,
	singleQuote: false,
	trailingComma: "all",
	tabWidth: 4,
	printWidth: 120,
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: ["*.svelte"],
			options: {
				bracketSameLine: false,
				parser: "svelte",
			},
		},
		{
			files: ["*.yml", "*.yaml"],
			options: {
				tabWidth: 2,
			},
		},
		{
			files: ["*.md"],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};

export default config;
