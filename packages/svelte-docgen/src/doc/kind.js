/**
 * @import { GetTypeParams, Extractor } from "../shared.js";
 */

import ts from "typescript";

import { get_construct_signatures, is_object_type } from "../shared.js";

export const BASE_TYPE_KIND = /** @type {const} */ ([
	"any",
	"bigint",
	"boolean",
	"never",
	"null",
	"number",
	"object",
	"string",
	"symbol",
	"undefined",
	"unknown",
	"void",
]);
export const ADVANCED_TYPE_KIND = /** @type {const} */ ([
	"array",
	"constructible",
	"function",
	"interface",
	"intersection",
	"literal",
	"tuple",
	"union",
]);
export const INSTANTIABLE_TYPE_KIND = /** @type {const} */ ([
	"type-parameter",
	"index",
	"indexed-access",
	"conditional",
	"substitution",
	"template-literal",
	"string-mapping",
]);
export const TYPE_KIND = /** @type {const} */ ([
	//
	...BASE_TYPE_KIND,
	...ADVANCED_TYPE_KIND,
	...INSTANTIABLE_TYPE_KIND,
]);

/** @typedef {typeof TYPE_KIND[number]} TypeKind */
/** @typedef {typeof BASE_TYPE_KIND[number]} BaseTypeKind */

/**
 * @param {GetTypeParams} params
 * @returns {TypeKind}
 */
export function get_type_kind(params) {
	const { type, extractor } = params;
	const { flags } = params.type;
	// WARN: Order is important for performance - do NOT sort
	if (flags & ts.TypeFlags.Any) return "any";
	if (flags & ts.TypeFlags.Never) return "never";
	if (flags & ts.TypeFlags.Null) return "null";
	if (flags & ts.TypeFlags.Undefined) return "undefined";
	if (flags & ts.TypeFlags.Unknown) return "unknown";
	if (flags & ts.TypeFlags.Void) return "void";
	if (flags & ts.TypeFlags.Literal) return "literal"; // StringLiteral | NumberLiteral | BigIntLiteral | BooleanLiteral
	if (flags & ts.TypeFlags.UniqueESSymbol) return "literal";
	if (flags & ts.TypeFlags.BigInt) return "bigint";
	if (flags & ts.TypeFlags.Boolean) return "boolean";
	if (flags & ts.TypeFlags.Number) return "number";
	if (flags & ts.TypeFlags.String) return "string";
	if (flags & ts.TypeFlags.ESSymbol) return "symbol";
	if (extractor.checker.isTupleType(type)) return "tuple";
	if (type.isIntersection()) return "intersection";
	if (type.isUnion()) return "union";
	if (extractor.checker.isArrayType(type)) return "array";
	if (type.isClass()) return "constructible";
	if (type.isClassOrInterface()) return is_constructible(type, extractor) ? "constructible" : "interface";
	if (type.getCallSignatures().length > 0) return "function";
	if (type.isTypeParameter()) return "type-parameter";
	if (flags & ts.TypeFlags.Index) return "index";
	if (flags & ts.TypeFlags.IndexedAccess) return "indexed-access";
	if (flags & ts.TypeFlags.Conditional) return "conditional";
	if (flags & ts.TypeFlags.Substitution) return "substitution";
	if (flags & ts.TypeFlags.TemplateLiteral) return "template-literal";
	if (flags & ts.TypeFlags.StringMapping) return "string-mapping";
	// WARN: Must be last
	if (is_object_type(type)) {
		// FIXME: Sometimes the constructible type is not recognized with `ts.Type.isClassOrInterface()` - e.g. `Map` - don't know why.
		if ("symbol" in type && is_constructible(type, extractor)) return "constructible";
		if (is_type_interface_only(type)) return "interface";
		return "object";
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
	return get_construct_signatures(type, extractor).length > 0;
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
