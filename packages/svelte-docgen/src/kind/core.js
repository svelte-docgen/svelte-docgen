/**
 * @import { GetTypeParams, Extractor } from "../shared.js";
 */

import ts, { TypeFlags } from "typescript";

import { get_construct_signatures, is_tuple_type_reference, is_type_reference } from "../shared.js";

const PRIMITIVE_TYPE_KINDS = /** @type {const} */ ([
	"bigint",
	"boolean",
	"literal",
	"null",
	"number",
	"object",
	"string",
	"symbol",
	"undefined",
	"void",
]);
export const BASE_TYPE_KINDS = /** @type {const} */ ([
	//
	...PRIMITIVE_TYPE_KINDS,
	"any",
	"unknown",
	"never",
]);
export const STRUCTURED_TYPE_KINDS = /** @type {const} */ ([
	"intersection",
	"union",
	"array",
	"constructible",
	"function",
	"interface",
	"tuple",
]);
export const INSTANTIABLE_TYPE_KINDS = /** @type {const} */ ([
	"conditional",
	"index",
	"indexed-access",
	"string-mapping",
	"substitution",
	"template-literal",
	"type-parameter",
]);
export const TYPE_KINDS = /** @type {const} */ ([
	//
	...BASE_TYPE_KINDS,
	...STRUCTURED_TYPE_KINDS,
	...INSTANTIABLE_TYPE_KINDS,
]);

/** @typedef {typeof TYPE_KINDS[number]} TypeKind */
/** @typedef {typeof BASE_TYPE_KINDS[number]} BaseTypeKind */

/**
 * @param {GetTypeParams} params
 * @returns {TypeKind}
 */
export function get_type_kind(params) {
	const { type, extractor } = params;
	const { flags } = type;
	// WARN: Order is important - do NOT sort
	if (flags & TypeFlags.Boolean) return "boolean"; // true | false
	if (flags & TypeFlags.StructuredOrInstantiable) {
		if (flags & TypeFlags.StructuredType) {
			// Union, Intersection or Object
			if (flags & TypeFlags.Union) return "union";
			if (flags & TypeFlags.Intersection) return "intersection";
			// Object
			if (is_type_reference(type)) {
				if (is_tuple_type_reference(type)) return "tuple";
				if (extractor.checker.isArrayType(type)) return "array";
				if (type.target.getCallSignatures().length) return "function";
				if (type.target.isClass()) return "constructible";
				return is_constructible(type.target, extractor) ? "constructible" : "interface";
			}
			if (type.getCallSignatures().length) return "function";
			if (type.isClassOrInterface()) return is_constructible(type, extractor) ? "constructible" : "interface";
			if (is_type_interface_only(type)) return "interface";
			return "object";
		} else {
			// Instantiable types
			if (flags & TypeFlags.TypeParameter) return "type-parameter";
			if (flags & TypeFlags.Index) return "index";
			if (flags & TypeFlags.IndexedAccess) return "indexed-access";
			if (flags & TypeFlags.Conditional) return "conditional";
			if (flags & TypeFlags.Substitution) return "substitution";
			if (flags & TypeFlags.TemplateLiteral) return "template-literal";
			if (flags & TypeFlags.StringMapping) return "string-mapping";
		}
	} else {
		// Intrinsic types and literals
		if (flags & TypeFlags.Any) return "any";
		if (flags & TypeFlags.Never) return "never";
		if (flags & TypeFlags.Null) return "null";
		if (flags & TypeFlags.Undefined) return "undefined";
		if (flags & TypeFlags.Unknown) return "unknown";
		if (flags & TypeFlags.Void) return "void";
		if (flags & TypeFlags.Literal) return "literal"; // StringLiteral | NumberLiteral | BigIntLiteral | BooleanLiteral
		if (flags & TypeFlags.Number) return "number";
		if (flags & TypeFlags.String) return "string";
		if (flags & TypeFlags.BigInt) return "bigint";
		if (flags & TypeFlags.ESSymbol) return "symbol";
		if (flags & TypeFlags.NonPrimitive) return "object"; // intrinsic `object` type
		if (flags & TypeFlags.UniqueESSymbol) return "literal";
	}
	// TODO: Document error
	throw new Error(`Unknown type kind: ${extractor.checker.typeToString(type)}`);
}

/**
 * @param {ts.Type} type
 * @param {Extractor} extractor
 * @returns {boolean}
 */
export function is_constructible(type, extractor) {
	const signatures = get_construct_signatures(type, extractor);
	// Check if the type returned by the constructor is assignable to the original `type`.
	return signatures.some((signature) => {
		let return_type = signature.getReturnType();
		if (is_type_reference(return_type)) return_type = return_type.target;
		return extractor.checker.isTypeAssignableTo(return_type, type);
	});
}

/**
 * @param {ts.Type} type
 * @returns {boolean}
 */
function is_type_interface_only(type) {
	if (!type.symbol) return false;
	const declarations = type.symbol.getDeclarations() ?? [];
	if (!declarations[0]) return false;
	const declaration_kind = declarations[0].kind;
	return (declaration_kind & ts.SyntaxKind.TypeLiteral) !== 0;
}
