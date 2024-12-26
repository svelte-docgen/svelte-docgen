import { defaultTheme } from "@sveltepress/theme-default";
import { sveltepress } from "@sveltepress/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			// Because `svelte2tsx` relies on "node:path", we need to polyfill `node:path` with `pathe`.
			//
			// TODO: Remove this alias when we transition away from `svelte2tsx`.
			// Discussion: https://github.com/svelte-docgen/svelte-docgen/pull/45/files#r1894924147
			path: "pathe",
			"node:path": "pathe",
		},
	},

	plugins: [
		sveltepress({
			siteConfig: {
				title: "svelte-docgen",
				description: "Lorem ipsum dolor sit amet",
			},
			theme: defaultTheme({
				logo: "/sveltepress.svg",
				github: "https://github.com/svelte-docgen/svelte-docgen",
				navbar: [
					// Add your navbar configs here
					{
						title: "Docs",
						to: "/docs/",
					},
					{
						title: "Playground",
						to: "/playground/",
					},
				],
				sidebar: {
					// Add your sidebar configs here
				},
			}),
		}),
	],

	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
});
