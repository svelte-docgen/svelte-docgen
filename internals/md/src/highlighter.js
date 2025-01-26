// WARN: File must be JavaScript extension!
// because `svelte.config.js` uses it - and it doesn't read `*.ts` files.

/**
 * @import { MdsvexCompileOptions } from "mdsvex";
 * @import { BuiltinTheme } from "shiki";
 */

import DOMPurify from "isomorphic-dompurify";
import { escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";

/** @type {BuiltinTheme} */
export const DEFAULT_THEME = "github-dark";

export const highlighter = await createHighlighter({
	themes: [DEFAULT_THEME, "github-light"],
	langs: ["bash", "javascript", "json", "jsonc", "svelte", "text", "typescript"],
});

/**
 * Cached hightlighter
 * @see {@link https://shiki.style/guide/best-performance}
 * @satisfies {NonNullable<MdsvexCompileOptions['highlight']>}
 */
export const HIGHLIGHT = {
	async highlighter(code, lang) {
		const html = escapeSvelte(
			highlighter.codeToHtml(code, {
				lang: lang ?? "text",
				theme: DEFAULT_THEME,
			}),
		);
		return `{@html ${DOMPurify.sanitize(html)}}`;
	},
};
