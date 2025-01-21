// WARN: File must be JavaScript extension!
// because `svelte.config.js` uses it - and it doesn't read `*.ts` files.

/**
 * @import { MdsvexCompileOptions } from "mdsvex";
 * @import { BuiltinTheme } from "shiki";
 */

import DOMPurify from "isomorphic-dompurify";
import { createHighlighter } from "shiki";

/** @type {BuiltinTheme} */
export const DEFAULT_THEME = "github-dark";

export const highlighter = await createHighlighter({
	themes: [DEFAULT_THEME, "github-light"],
	langs: ["bash", "javascript", "json", "jsonc", "svelte", "text", "typescript"],
});

/** @satisfies {NonNullable<MdsvexCompileOptions['highlight']>} */
export const HIGHLIGHT = {
	async highlighter(code, lang) {
		const { escapeSvelte } = await import("mdsvex");
		const html = escapeSvelte(
			highlighter.codeToHtml(code, {
				lang: lang ?? "text",
				theme: DEFAULT_THEME,
			}),
		);
		return `{@html ${DOMPurify.sanitize(html)}}`;
	},
};

/**
 *
 * @param {string} content
 * @param {Partial<Parameters<typeof compile>[1]>} options
 * @returns {Promise<ReturnType<typeof compile>>}
 */
export async function compile_svelte_md(content, options = {}) {
	const { compile } = await import("mdsvex");
	return compile(content, {
		highlight: HIGHLIGHT,
		...options,
	});
}
