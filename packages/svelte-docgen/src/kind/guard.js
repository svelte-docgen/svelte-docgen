/**
 * Available type guards for this library.
 * @module
 */

/**
 * @import { AdvancedType, BaseType, InstantiableType, Type, TypeRef, TypeOrRef, Types } from "../doc/type.ts";
 */

import { ADVANCED_TYPE_KIND, BASE_TYPE_KIND, INSTANTIABLE_TYPE_KIND } from "./core.js";

/**
 * A type-guard to check if the type is a _reference_ to an aliased {@link WithAlias} or named {@link WithName} type stored in {@link Types}.
 * The reason we have it isolated in separate storage _(`types`)_ is to avoid circularity.
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

/**
 * Type guard: Is the type reference a {@link BaseType}?
 * **You must provide an map of types if you prodive a type reference!**
 *
 * @overload
 * @param {TypeRef} type_or_ref
 * @param {Types} types
 * @returns {type_or_ref is BaseType}
 */
/**
 * Type guard: Is the type a {@link BaseType}?
 *
 * @overload
 * @param {Type} type_or_ref
 * @param {never} [types]
 * @returns {type_or_ref is BaseType}
 */
/**
 * Type guard: Is the type or its reference a {@link BaseType}?
 *
 * @param {TypeOrRef} type_or_ref
 * @param {Types} [types]
 * @returns {type_or_ref is BaseType}
 */
export function isBaseType(type_or_ref, types) {
	const type = isTypeRef(type_or_ref) ? types?.get(type_or_ref) : type_or_ref;
	// TODO: Document error
	if (!type) throw new Error("Unreachable");
	// @ts-expect-error `includes()` typing is too strict
	return BASE_TYPE_KIND.includes(type.kind);
}

/**
 * Type guard: Is the type reference a {@link AdvancedType}?
 * **You must provide an map of types if you prodive a type reference!**
 *
 * @overload
 * @param {TypeRef} type_or_ref
 * @param {Types} types
 * @returns {type_or_ref is AdvancedType}
 */
/**
 * Type guard: Is the type a {@link AdvancedType}?
 *
 * @overload
 * @param {Type} type_or_ref
 * @param {never} [types]
 * @returns {type_or_ref is AdvancedType}
 */
/**
 * Type guard: Is the type or its reference a {@link AdvancedType}?
 *
 * @param {TypeOrRef} type_or_ref
 * @param {Types} [types]
 * @returns {type_or_ref is AdvancedType}
 */
export function isAdvancedType(type_or_ref, types) {
	const type = isTypeRef(type_or_ref) ? types?.get(type_or_ref) : type_or_ref;
	// TODO: Document error
	if (!type) throw new Error("Unreachable");
	// @ts-expect-error `includes()` typing is too strict
	return ADVANCED_TYPE_KIND.includes(type.kind);
}

/**
 * Type guard: Is the type reference a {@link InstantiableType}?
 * **You must provide an map of types if you prodive a type reference!**
 *
 * @overload
 * @param {TypeRef} type_or_ref
 * @param {Types} types
 * @returns {type_or_ref is InstantiableType}
 */
/**
 * Type guard: Is the type a {@link InstantiableType}?
 *
 * @overload
 * @param {Type} type_or_ref
 * @param {never} [types]
 * @returns {type_or_ref is InstantiableType}
 */
/**
 * Type guard: Is the type or its reference a {@link InstantiableType}?
 *
 * @param {TypeOrRef} type_or_ref
 * @param {Types} [types]
 * @returns {type_or_ref is InstantiableType}
 */
export function isInstantiableType(type_or_ref, types) {
	const type = isTypeRef(type_or_ref) ? types?.get(type_or_ref) : type_or_ref;
	// TODO: Document error
	if (!type) throw new Error("Unreachable");
	// @ts-expect-error `includes()` typing is too strict
	return INSTANTIABLE_TYPE_KIND.includes(type.kind);
}
