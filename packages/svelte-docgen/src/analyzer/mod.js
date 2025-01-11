/**
 * @import { parse } from "../parser/mod.js";
 */

import { ComponentAnalyzer } from "./component.js";

/**
 * Analyze docgen data of a Svelte component.
 * It provides more details with a type-friendly API.
 *
 * @example Basic usage
 *
 * ```js
 * import { analyze, parse } from "svelte-docgen";
 *
 * const parsed = parse("component source");
 * const analyzed = analyze(parsed);
 * ```
 *
 * @param {ReturnType<typeof parse>} docgen Parsed _raw_ data of a Svelte component
 * @returns {ComponentAnalyzer<true> | ComponentAnalyzer<false>}
 */
export function analyze(docgen) {
	return /** @type {ComponentAnalyzer<true> | ComponentAnalyzer<false>} */ (new ComponentAnalyzer(docgen));
}
