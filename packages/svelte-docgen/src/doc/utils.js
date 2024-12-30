/**
 * @import { TypeOrRef, TypeRef } from "./type.ts";
 */

/**
 * A type-guard to check if the type is a _reference_ to an aliased {@link WithAlias} or named {@link WithName} type stored in {@link Types}. The reason we have it isolated in separate storage _(`types`)_ is to avoid circularity.
 *
 * @example Basic usage in real-word scenario
 *
 * ```js
 * import { isTypeRef } from "svelte-docgen";
 *
 * const { props, types } = parse("... <Svelte code> ...");
 * //             👆 stored aliased/named types
 * const exampleProp = prop.get("example");
 *
 * if (isTypeRef(exampleProp.type)) {
 *   const examplePropType = types.get(exampleProp.type); // 👈 This is how you can access the type when it's a `TypeRef`.
 * }
 * ```
 *
 * @param {TypeOrRef} type
 * @returns {type is TypeRef}
 */
export function isTypeRef(type) {
	return typeof type === "string";
}
