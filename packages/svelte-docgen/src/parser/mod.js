/**
 * @import * as Doc from "../doc/type.ts";
 * @import { UserOptions } from "../options.js";
 */

import { extract } from "@svelte-docgen/extractor";
import ts from "typescript";

import { get_type_kind } from "../doc/kind.js";
import { Options } from "../options.js";
import {
	get_construct_signatures,
	get_root_path_url,
	get_sources,
	get_type_symbol,
	is_const_type_param,
	is_symbol_optional,
	is_symbol_readonly,
	is_tuple_type,
	is_type_reference,
} from "../shared.js";
import { isTypeRef } from "../doc/utils.js";

const AnonTypeLiteralSymbolName = ts.InternalSymbolName.Type;

class Parser {
	/** @type {ReturnType<typeof extract>} */
	#extractor;
	/** @type {Options} */
	#options;
	/**
	 * Cached root path url, so we don't need to call it every time.
	 * @type {URL}
	 */
	#root_path_url;

	/**
	 * Some of types which extends `WithAlias` or `WithName` can cause recursion.
	 * We isolate them in this map, so we can prevent this from happening.
	 * @type {Doc.Types}
	 */
	/** @type {Doc.Types} */
	types = new Map();

	/** @type {Map<ts.Type, string>} */
	#anonymous_type_map = new Map();

	/**
	 * @param {string} source
	 * @param {Options} options
	 */
	constructor(source, options) {
		this.#options = options;
		this.#extractor = extract(source, this.#options);
		this.#root_path_url = get_root_path_url(this.#options.sys);
	}

	/** @returns {ParsedComponent} */
	toJSON() {
		const { description, isLegacy, exports, props, tags, types } = this;
		if (isLegacy) {
			return /** @type {LegacyComponent} */ ({
				description,
				events: this.events,
				exports,
				isLegacy,
				props,
				slots: this.slots,
				tags,
				types,
			});
		}
		return /** @type {ModernComponent} */ ({
			description,
			exports,
			isLegacy,
			props,
			tags,
			types,
		});
	}

	/** @returns {Doc.Docable['description']} */
	get description() {
		return this.#extractor.description;
	}

	/** @returns {boolean} */
	get isLegacy() {
		return this.#extractor.parser.hasLegacySyntax;
	}

	/** @returns {Doc.Events} */
	get events() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		return new Map(
			Iterator.from(this.#extractor.events).map(([name, symbol]) => {
				return [`on:${name}`, this.#get_type_doc(this.#checker.getTypeOfSymbol(symbol))];
			}),
		);
	}

	/** @returns {Doc.Exports} */
	get exports() {
		return new Map(
			Iterator.from(this.#extractor.exports).map(([name, symbol]) => {
				return [name, this.#get_type_doc(this.#checker.getTypeOfSymbol(symbol))];
			}),
		);
	}

	/** @returns {Doc.Props} */
	get props() {
		return new Map(
			Iterator.from(this.#extractor.props).map(([name, symbol]) => {
				return [name, this.#get_prop_doc(symbol)];
			}),
		);
	}

	/** @returns {Doc.Slots} */
	get slots() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		return new Map(
			Iterator.from(this.#extractor.slots).map(([name, props]) => {
				const documented_props = new Map(
					Iterator.from(props).map(([name, prop]) => [name, this.#get_prop_doc(prop)]),
				);
				return [name, documented_props];
			}),
		);
	}

	/** @returns {Doc.Docable['tags']} */
	get tags() {
		return this.#extractor.tags;
	}

	/** @type {ts.TypeChecker} */
	get #checker() {
		return this.#extractor.checker;
	}
	/**
	 * @param {ts.Type} type
	 * @returns {Doc.ArrayType}
	 */
	#get_array_doc(type) {
		const index_info = this.#checker.getIndexInfoOfType(type, ts.IndexKind.Number);
		// TODO: Document error
		if (!index_info) throw new Error(`Could not get index info of type ${this.#checker.typeToString(type)}`);
		const { isReadonly } = index_info;
		return {
			kind: "array",
			isReadonly,
			element: this.#get_type_doc(index_info.type),
		};
	}

	/**
	 * Generates {@link Doc.Constructible}
	 *
	 * @param {ts.Type} type
	 * @returns {Doc.Constructible}
	 */
	#get_constructible_doc(type) {
		const symbol = get_type_symbol(type);
		const name = this.#checker.getFullyQualifiedName(symbol);
		const sources = this.#get_type_sources(type);
		// TODO: Document error
		if (!sources) throw new Error();
		/** @type {Doc.Constructible['constructors']} */
		const constructors = get_construct_signatures(type, this.#extractor).map((s) =>
			s.getParameters().map((p) => this.#get_fn_param_doc(p)),
		);
		return {
			kind: "constructible",
			name,
			constructors,
			sources,
		};
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.FnParam}
	 */
	#get_fn_param_doc(symbol) {
		if (!symbol.valueDeclaration || !ts.isParameter(symbol.valueDeclaration)) {
			// TODO: Document error
			throw new Error("Not a parameter");
		}
		const type = this.#checker.getTypeOfSymbol(symbol);
		const isOptional = symbol.valueDeclaration.questionToken !== undefined;
		/** @type {Doc.FnParam} */
		let data = {
			name: symbol.name,
			isOptional,
			type: this.#get_type_doc(type),
		};
		if (symbol.valueDeclaration.initializer) {
			const default_ = this.#checker.getTypeAtLocation(symbol.valueDeclaration.initializer);
			data.default = this.#get_type_doc(default_);
		}
		return data;
	}

	/**
	 * Generates {@link Doc.Fn}
	 *
	 * @param {ts.Type} type
	 * @returns {Doc.Fn}
	 */
	#get_fn_doc(type) {
		const calls = type.getCallSignatures().map((s) => {
			return {
				parameters: s.getParameters().map((p) => this.#get_fn_param_doc(p)),
				returns: this.#get_type_doc(s.getReturnType()),
			};
		});
		/** @type {Doc.Fn} */
		let results = {
			kind: "function",
			calls,
		};
		if (type.aliasSymbol || type.symbol.name !== AnonTypeLiteralSymbolName) {
			results.alias = this.#checker.getFullyQualifiedName(type.aliasSymbol || type.symbol);
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		return results;
	}

	/**
	 * Generates {@link Doc.Interface}
	 *
	 * @param {ts.Type} type
	 * @returns {Doc.Interface}
	 */
	#get_interface_doc(type) {
		/** @type {Doc.Interface['members']} */
		const members = new Map(Iterator.from(type.getProperties()).map((p) => [p.name, this.#get_member_doc(p)]));
		/** @type {Doc.Interface} */
		let results = {
			kind: "interface",
			members,
		};
		if (type.aliasSymbol || type.symbol.name !== AnonTypeLiteralSymbolName) {
			results.alias = this.#checker.getFullyQualifiedName(type.aliasSymbol || type.symbol);
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		return results;
	}

	/**
	 * Generates {@link Doc.Intersection}
	 *
	 * @param {ts.Type} type
	 * @returns {Doc.Intersection}
	 */
	#get_intersection_doc(type) {
		// TODO: Document error
		if (!type.isIntersection())
			throw new Error(`Expected intersection type, got ${this.#checker.typeToString(type)}`);
		const types = type.types.map((t) => this.#get_type_doc(t));
		/** @type {Doc.Intersection} */
		let results = { kind: "intersection", types };
		if (type.aliasSymbol) {
			results.alias = this.#checker.getFullyQualifiedName(type.aliasSymbol);
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Literal}
	 */
	#get_literal_doc(type) {
		const kind = "literal";
		if (type.isLiteral()) {
			if (type.isStringLiteral()) return { kind, subkind: "string", value: type.value };
			if (type.isNumberLiteral()) return { kind, subkind: "number", value: type.value };
			if (
				type.flags & ts.TypeFlags.BigIntLiteral &&
				typeof type.value !== "string" &&
				typeof type.value !== "number"
			) {
				const value = BigInt(type.value.negative ? `-${type.value.base10Value}` : type.value.base10Value);
				return { kind, subkind: "bigint", value };
			}
		}
		if (type.flags & ts.TypeFlags.BooleanLiteral && "intrinsicName" in type) {
			return { kind, subkind: "boolean", value: type.intrinsicName === "true" };
		}
		if (type.flags & ts.TypeFlags.UniqueESSymbol) {
			return {
				kind,
				subkind: "symbol",
			};
		}
		// TODO: Document error
		throw new Error(`Unknown literal type: ${this.#checker.typeToString(type)}`);
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Member}
	 */
	#get_member_doc(symbol) {
		const type = this.#checker.getTypeOfSymbol(symbol);
		return {
			isOptional: is_symbol_optional(symbol),
			isReadonly: is_symbol_readonly(symbol),
			type: this.#get_type_doc(type),
		};
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {string | undefined}
	 */
	#get_prop_description(symbol) {
		const description = symbol.getDocumentationComment(this.#checker);
		// TODO: Why it would be an array? Overloads? How should we handle it?
		return description?.[0]?.text;
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Prop}
	 */
	#get_prop_doc(symbol) {
		const type = this.#checker.getTypeOfSymbol(symbol);
		const sources = get_sources(symbol.getDeclarations() ?? [], this.#root_path_url);
		/** @type {Doc.Prop} */
		let results = {
			tags: this.#get_prop_tags(symbol),
			isBindable: this.#extractor.bindings.has(symbol.name) || symbol.name.startsWith("bind:"),
			isExtended: sources ? Iterator.from(sources).some((f) => f !== this.#options.filepath) : false,
			isOptional: is_symbol_optional(symbol),
			type: this.#get_type_doc(type),
		};
		const description = this.#get_prop_description(symbol);
		if (description) results.description = description;
		const initializer = this.#extractor.defaults.get(symbol.name);
		if (initializer) {
			const default_type = this.#checker.getTypeAtLocation(initializer);
			results.default = this.#get_type_doc(default_type);
		}
		if (results.isExtended && sources) results.sources = sources;
		return results;
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Tag[]}
	 */
	#get_prop_tags(symbol) {
		return symbol.getJsDocTags(this.#checker).map((t) => {
			/** @type {Doc.Tag} */
			let results = { name: t.name, content: "" };
			// TODO: Why it would be an array? Overloads? How should we handle it?
			const content = t.text?.[0]?.text;
			if (content) results.content = content;
			return results;
		});
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Tuple}
	 */
	#get_tuple_doc(type) {
		// TODO: Document error
		if (!is_type_reference(type))
			throw new Error(`Expected type reference, got ${this.#checker.typeToString(type)}`);
		// TODO: Document error
		if (!is_tuple_type(type.target))
			throw new Error(`Expected tuple type, got ${this.#checker.typeToString(type)}`);
		const isReadonly = type.target.readonly;
		const elements = this.#checker.getTypeArguments(type).map((t) => this.#get_type_doc(t));
		/** @type {Doc.Tuple} */
		let results = {
			kind: "tuple",
			isReadonly,
			elements,
		};
		if (type.aliasSymbol) {
			results.alias = this.#checker.getFullyQualifiedName(type.aliasSymbol);
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.TypeParam}
	 */
	#get_type_param_doc(type) {
		// TODO: Document error
		if (!type.isTypeParameter())
			throw new Error(`Expected type parameter, got ${this.#checker.typeToString(type)}`);
		const constraint = type.getConstraint();
		/** @type {Doc.TypeParam} */
		let results = {
			kind: "type-parameter",
			name: type.symbol.name,
			constraint: constraint ? this.#get_type_doc(constraint) : { kind: "unknown" },
			isConst: is_const_type_param(type),
		};
		const default_ = type.getDefault();
		if (default_) results.default = this.#get_type_doc(default_);
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.WithAlias['sources'] | Doc.WithName["sources"]}
	 */
	#get_type_sources(type) {
		/** @type {ts.Symbol | undefined} */
		let symbol = type.getSymbol();
		if (!symbol || symbol.name === AnonTypeLiteralSymbolName) symbol = type.aliasSymbol;
		if (symbol) {
			const declared_type = this.#checker.getDeclaredTypeOfSymbol(symbol);
			const declared_type_symbol = declared_type.getSymbol() || declared_type.aliasSymbol;
			if (declared_type_symbol)
				return get_sources(declared_type_symbol.getDeclarations() ?? [], this.#root_path_url);
		}
	}

	/**
	 * Generates {@link Doc.Union}
	 * @param {ts.Type} type
	 * @returns {Doc.Union}
	 */
	#get_union_doc(type) {
		// TODO: Document error
		if (!type.isUnion()) throw new Error(`Expected union type, got ${this.#checker.typeToString(type)}`);

		/** @type {Doc.TypeOrRef[]} */
		let types = [];
		const non_nullable = type.getNonNullableType();

		if (type.aliasSymbol || type === non_nullable) {
			types = type.types.map((t) => this.#get_type_doc(t));
		} else {
			// nullable types
			types.push(
				...type.types
					.filter((t) => t.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void))
					.map((t) => this.#get_type_doc(t)),
			);
			// non-nullable types
			const non_nullable_doc = this.#get_type_doc(non_nullable);
			if (isTypeRef(non_nullable_doc)) types.push(non_nullable_doc);
			else if (non_nullable_doc.kind === "union") {
				types.push(...non_nullable_doc.types);
			} else {
				types.push(non_nullable_doc);
			}
		}

		/** @type {Doc.Union} */
		let results = {
			kind: "union",
			types,
		};
		if (type.aliasSymbol) {
			results.alias = this.#checker.getFullyQualifiedName(type.aliasSymbol);
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		if (non_nullable !== type) results.nonNullable = this.#get_type_doc(non_nullable);

		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.TypeOrRef}
	 */
	#get_type_doc(type) {
		const anon_id = this.#anonymous_type_map.get(type);
		if (anon_id) return anon_id;

		if (
			!type.aliasSymbol &&
			!is_type_reference(type) &&
			(!type.symbol || type.symbol.name === AnonTypeLiteralSymbolName)
		) {
			// anonymous type
			return this.#get_type_doc_internal(type);
		}

		// type reference
		const name = this.#get_qualified_typeref_name(type);
		if (this.types.get(name) === undefined) {
			this.types.set(name, { kind: "unknown" }); // reserve to prevent infinite recursion
			const doc = this.#get_type_doc_internal(type);
			this.types.set(name, doc);
		}
		return name;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {string}
	 */
	#get_qualified_typeref_name(type) {
		if (!type.aliasSymbol && is_type_reference(type)) {
			// type reference (tuple, array, type reference)
			if (this.#checker.isTupleType(type)) {
				const readonly_prefix = /** @type {ts.TupleType} */ (type.target).readonly ? "readonly " : "";
				return (
					readonly_prefix +
					"[" +
					(type.typeArguments ?? []).map((type) => this.#get_qualified_typeref_name(type)).join(", ") +
					"]"
				);
			}
			return (
				this.#checker.getFullyQualifiedName(type.aliasSymbol || type.symbol) +
				(type.typeArguments && type.typeArguments.length
					? "<" + type.typeArguments.map((type) => this.#get_qualified_typeref_name(type)).join(", ") + ">"
					: "")
			);
		}
		const symbol = type.aliasSymbol || type.symbol;
		// alias or named type
		if (symbol && symbol.name !== AnonTypeLiteralSymbolName) {
			return (
				this.#checker.getFullyQualifiedName(type.aliasSymbol || type.symbol) +
				(type.aliasTypeArguments && type.aliasTypeArguments.length
					? "<" +
						type.aliasTypeArguments.map((type) => this.#get_qualified_typeref_name(type)).join(", ") +
						">"
					: "")
			);
		}

		if (
			type.flags &
			(ts.TypeFlags.Any |
				ts.TypeFlags.Unknown |
				ts.TypeFlags.StringLike |
				ts.TypeFlags.NumberLike |
				ts.TypeFlags.BigIntLike |
				ts.TypeFlags.BooleanLike |
				ts.TypeFlags.EnumLike |
				ts.TypeFlags.VoidLike |
				ts.TypeFlags.Null |
				ts.TypeFlags.ESSymbolLike |
				ts.TypeFlags.TypeParameter |
				ts.TypeFlags.Never)
		) {
			return this.#checker.typeToString(type);
		}

		// anonymous type
		let typeref = this.#anonymous_type_map.get(type);
		if (typeref) {
			return typeref;
		}
		typeref = `<anon:${this.#anonymous_type_map.size}>`;
		this.#anonymous_type_map.set(type, typeref);
		this.types.set(typeref, this.#get_type_doc_internal(type));
		return typeref;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Type}
	 */
	#get_type_doc_internal(type) {
		const kind = get_type_kind({ type, extractor: this.#extractor });
		switch (kind) {
			case "array":
				return this.#get_array_doc(type);
			case "constructible":
				return this.#get_constructible_doc(type);
			case "function":
				return this.#get_fn_doc(type);
			case "interface":
				return this.#get_interface_doc(type);
			case "intersection":
				return this.#get_intersection_doc(type);
			case "literal":
				return this.#get_literal_doc(type);
			case "tuple":
				return this.#get_tuple_doc(type);
			case "type-parameter":
				return this.#get_type_param_doc(type);
			case "union":
				return this.#get_union_doc(type);
			default:
				return { kind };
		}
	}
}

/**
 * @typedef LegacyComponent
 * @prop {true} isLegacy
 * @prop {Doc.Docable['description']} description
 * @prop {Doc.Docable['tags']} tags
 * @prop {Doc.Props} props
 * @prop {Doc.Exports} exports
 * @prop {Doc.Events} events
 * @prop {Doc.Slots} slots
 * @prop {Doc.Types} types
 */

/**
 * @typedef ModernComponent
 * @prop {false} isLegacy
 * @prop {Doc.Docable['description']} description
 * @prop {Doc.Docable['tags']} tags
 * @prop {Doc.Props} props
 * @prop {Doc.Exports} exports
 * @prop {never} events
 * @prop {never} slots
 * @prop {Doc.Types} types
 */

/** @typedef {LegacyComponent | ModernComponent} ParsedComponent */

/**
 * @param {string} source
 * @param {UserOptions} user_options
 * @returns {ParsedComponent}
 */
export function parse(source, user_options = {}) {
	// @ts-expect-error WARN: Didn't want to use type casting here
	return new Parser(source, new Options(user_options));
}
