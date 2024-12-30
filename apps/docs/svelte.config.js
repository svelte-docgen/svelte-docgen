/**
 * @import { BuiltinTheme } from "shiki";
 */

import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import DOMPurify from "isomorphic-dompurify";
import { mdsvex, escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";

/** @type {BuiltinTheme} */
const default_theme = "github-dark";
const highlighter = await createHighlighter({
	themes: [default_theme, "github-light"],
	langs: ["bash", "javascript", "svelte", "text", "typescript"],
});

/** @satisfies {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
	},

	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [
				// NOTE: The reason we use `.svelte.md` instead of `svx` is a better integration with IDEs
				".svelte.md",
			],
			highlight: {
				async highlighter(code, lang = "text") {
					const html = escapeSvelte(
						highlighter.codeToHtml(code, {
							lang,
							theme: default_theme,
						}),
					);
					return `{@html ${DOMPurify.sanitize(html)}}`;
				},
			},
		}),
	],
};

export default config;
