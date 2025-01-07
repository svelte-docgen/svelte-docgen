/**
 * @import { Type, TypeOrRef, Types } from "../doc/type.ts";
 * @import { parse } from "../parser/mod.js";
 */

import { isTypeRef } from "../doc/utils.js";
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

/**
 * Get the type of provided type or reference with batteries included.
 *
 * @param {TypeOrRef} type_or_ref
 * @param {Types} types map of all types
 * @returns {Type}
 */
export function getType(type_or_ref, types) {
	if (isTypeRef(type_or_ref)) {
		const type = types.get(type_or_ref);
		// TODO: Document error
		if (!type) throw new Error("Unreachable");
		return type;
	}
	return type_or_ref;
}
