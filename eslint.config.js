import url from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
	includeIgnoreFile(url.fileURLToPath(new URL(".gitignore", import.meta.url))),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	...svelte.configs["flat/prettier"],
	{
		name: "Ignore list",
		ignores: ["examples/**/input.svelte"],
	},
	{
		name: "Globals",
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		name: "Rules",
		rules: {
			// Allows variable names prefixed with _ to remain unused
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		name: "Svelte",
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		name: "@svelte-docgen/server",
		files: ["packages/server/src/**/*"],
		languageOptions: {
			globals: {
				...globals.node,
				Bun: "readonly",
				Deno: "readonly",
			},
		},
	},
);
