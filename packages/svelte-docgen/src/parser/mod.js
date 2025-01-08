/**
 * TODO: dts-buddy does not yet support `import * as Doc from "../doc/type.ts";`
 * @import {
 *	 Conditional,
 *   DisplayPart,
 *	 Fn,
 *	 Index,
 *	 IndexedAccess,
 *	 Interface,
 *	 StringMapping,
 *	 Substitution,
 *	 TemplateLiteral,
 *	 Tuple,
 *	 Type,
 *	 TypeOrRef,
 *	 TypeParam,
 * 	 Array,
 * 	 Constructible,
 * 	 Intersection,
 * 	 Literal,
 *   Docable,
 *   Events,
 *   Exports,
 *   FnParam,
 *   Member,
 *   Prop,
 *   Props,
 *   Slots,
 *   Tag,
 *   Types,
 *   Union,
 *   WithAlias,
 *   WithName,
 WithTypeArgs,
 * } from "../doc/type.ts";
 * @import { UserOptions } from "../options.js";
 */

import { extract } from "@svelte-docgen/extractor";
import ts from "typescript";

import { get_type_kind } from "../kind/core.js";
import { Options } from "../options.js";
import {
	get_construct_signatures,
	get_root_path_url,
	get_sources,
	get_type_symbol,
	is_const_type_param,
	is_symbol_optional,
	is_symbol_readonly,
	is_tuple_type_reference,
	is_type_reference,
} from "../shared.js";
import { isTypeRef } from "../kind/guard.js";

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
	 * @type {Types}
	 */
	/** @type {Types} */
	types = new Map();

	/** @type {Map<ts.Type, string>} */
	#reference_name_cache = new Map();

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

	/** @returns {Docable['description']} */
	get description() {
		return this.#extractor.description;
	}

	/** @returns {boolean} */
	get isLegacy() {
		return this.#extractor.parser.hasLegacySyntax;
	}

	/** @returns {Events} */
	get events() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		return new Map(
			Iterator.from(this.#extractor.events).map(([name, symbol]) => {
				return [`on:${name}`, this.#get_type_doc(this.#checker.getTypeOfSymbol(symbol))];
			}),
		);
	}

	/** @returns {Exports} */
	get exports() {
		return new Map(
			Iterator.from(this.#extractor.exports).map(([name, symbol]) => {
				return [name, this.#get_type_doc(this.#checker.getTypeOfSymbol(symbol))];
			}),
		);
	}

	/** @returns {Props} */
	get props() {
		return new Map(
			Iterator.from(this.#extractor.props).map(([name, symbol]) => {
				return [name, this.#get_prop_doc(symbol)];
			}),
		);
	}

	/** @returns {Slots} */
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

	/** @returns {Docable['tags']} */
	get tags() {
		return this.#extractor.tags;
	}

	/** @type {ts.TypeChecker} */
	get #checker() {
		return this.#extractor.checker;
	}
	/**
	 * @param {ts.Type} type
	 * @returns {Array}
	 */
	#get_array_doc(type) {
		const index_info = this.#checker.getIndexInfoOfType(type, ts.IndexKind.Number);
		// TODO: Document error
		if (!index_info) throw new Error(`Could not get index info of type ${this.#checker.typeToString(type)}`);
		const { isReadonly } = index_info;
		/** @type {Array} */
		let results = {
			kind: "array",
			isReadonly,
			element: this.#get_type_doc(index_info.type),
		};
		this.#extract_names_and_arguments(type, results, { skip_sources: true, skip_type_args: true });
		return results;
	}

	/**
	 * Generates {@link Doc.Constructible}
	 *
	 * @param {ts.Type} type
	 * @returns {Constructible}
	 */
	#get_constructible_doc(type) {
		const symbol = get_type_symbol(type);
		const name = this.#get_fully_qualified_name(symbol);
		const sources = this.#get_type_sources(type);
		// TODO: Document error
		if (!sources) throw new Error();
		/** @type {Constructible['constructors']} */
		const constructors = get_construct_signatures(type, this.#extractor).map((s) =>
			s.getParameters().map((p) => this.#get_fn_param_doc(p)),
		);
		/** @type {Constructible} */
		const results = {
			kind: "constructible",
			name,
			constructors,
			sources,
		};
		this.#extract_names_and_arguments(type, results);
		return results;
	}

	/**
	 * Extract common properties
	 *
	 * @param {ts.Type} type
	 * @param {Type} results
	 * @param {{ skip_sources?: boolean, skip_type_args?: boolean }} [options]
	 */
	#extract_names_and_arguments(type, results, options = {}) {
		if (!options.skip_type_args && is_type_reference(type) && type.typeArguments)
			/** @type {WithTypeArgs} */ (results).typeArgs = type.typeArguments.map((t) => this.#get_type_doc(t));
		if (type.symbol && type.symbol.name !== AnonTypeLiteralSymbolName) {
			/** @type {WithName} */ (results).name = this.#get_fully_qualified_name(type.symbol);
			if (!options.skip_sources) {
				const sources = this.#get_type_sources(type);
				if (sources) /** @type {WithName} */ (results).sources = sources;
			}
		}
		if (type.aliasSymbol) {
			/** @type {WithAlias} */ (results).alias = this.#get_fully_qualified_name(type.aliasSymbol);
			if (!options.skip_type_args && type.aliasTypeArguments)
				/** @type {WithAlias} */ (results).aliasTypeArgs = type.aliasTypeArguments.map((t) =>
					this.#get_type_doc(t),
				);
			if (!options.skip_sources) {
				const aliasSource = this.#get_type_alias_source(type);
				if (aliasSource) /** @type {WithAlias} */ (results).aliasSource = aliasSource;
			}
		}
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {FnParam}
	 */
	#get_fn_param_doc(symbol) {
		if (!symbol.valueDeclaration || !ts.isParameter(symbol.valueDeclaration)) {
			// TODO: Document error
			throw new Error("Not a parameter");
		}
		const type = this.#checker.getTypeOfSymbol(symbol);
		const isOptional = symbol.valueDeclaration.questionToken !== undefined;
		/** @type {FnParam} */
		let results = {
			name: symbol.name,
			isOptional,
			type: this.#get_type_doc(type),
		};
		if (symbol.valueDeclaration.initializer) {
			const default_ = this.#checker.getTypeAtLocation(symbol.valueDeclaration.initializer);
			results.default = this.#get_type_doc(default_);
		}
		return results;
	}

	/**
	 * Generates {@link Doc.Fn}
	 *
	 * @param {ts.Type} type
	 * @returns {Fn}
	 */
	#get_fn_doc(type) {
		const calls = type.getCallSignatures().map((s) => {
			return {
				parameters: s.getParameters().map((p) => this.#get_fn_param_doc(p)),
				returns: this.#get_type_doc(s.getReturnType()),
			};
		});
		/** @type {Fn} */
		let results = {
			kind: "function",
			calls,
		};
		this.#extract_names_and_arguments(type, results);
		return results;
	}

	/**
	 * Generates {@link Doc.Interface}
	 *
	 * @param {ts.Type} type
	 * @returns {Interface}
	 */
	#get_interface_doc(type) {
		/** @type {Interface['members']} */
		const members = new Map(Iterator.from(type.getProperties()).map((p) => [p.name, this.#get_member_doc(p)]));
		/** @type {Interface} */
		let results = {
			kind: "interface",
			members,
		};
		if (is_type_reference(type) && type.typeArguments)
			results.typeArgs = type.typeArguments.map((t) => this.#get_type_doc(t));
		this.#extract_names_and_arguments(type, results);
		return results;
	}

	/**
	 * Generates {@link Doc.Intersection}
	 *
	 * @param {ts.Type} type
	 * @returns {Intersection}
	 */
	#get_intersection_doc(type) {
		// TODO: Document error
		if (!type.isIntersection())
			throw new Error(`Expected intersection type, got ${this.#checker.typeToString(type)}`);
		const types = type.types.map((t) => this.#get_type_doc(t));
		/** @type {Intersection} */
		let results = { kind: "intersection", types };
		this.#extract_names_and_arguments(type, results);
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Literal}
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
				name: this.#get_fully_qualified_name(/** @type {ts.UniqueESSymbolType} */ (type).symbol),
			};
		}
		// TODO: Document error
		throw new Error(`Unknown literal type: ${this.#checker.typeToString(type)}`);
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Member}
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
	 * @returns {DisplayPart[] | undefined}
	 */
	#get_prop_description(symbol) {
		const description = symbol.getDocumentationComment(this.#checker);
		if (description && description.length) return description.map((d) => ({ text: d.text, kind: d.kind }));
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Prop}
	 */
	#get_prop_doc(symbol) {
		const type = this.#checker.getTypeOfSymbol(symbol);
		const sources = get_sources(symbol.getDeclarations() ?? [], this.#root_path_url);
		/** @type {Prop} */
		let results = {
			tags: this.#get_prop_tags(symbol),
			isBindable: this.#extractor.bindings.has(symbol.name.replace(/^bind:/, "")),
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
	 * @returns {Tag[]}
	 */
	#get_prop_tags(symbol) {
		return symbol.getJsDocTags(this.#checker).map((t) => {
			/** @type {Tag} */
			let results = { name: t.name };
			const content = t.text?.map((c) => ({ kind: c.kind, text: c.text }));
			if (content && content.length) results.content = content;
			return results;
		});
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Tuple}
	 */
	#get_tuple_doc(type) {
		// TODO: Document error
		if (!is_tuple_type_reference(type))
			throw new Error(`Expected tuple type, got ${this.#checker.typeToString(type)}`);
		const isReadonly = type.target.readonly;
		const elements = this.#checker.getTypeArguments(type).map((t) => this.#get_type_doc(t));
		/** @type {Tuple} */
		let results = {
			kind: "tuple",
			isReadonly,
			elements,
		};
		this.#extract_names_and_arguments(type, results, { skip_type_args: true });
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {TypeParam}
	 */
	#get_type_param_doc(type) {
		// TODO: Document error
		if (!type.isTypeParameter())
			throw new Error(`Expected type parameter, got ${this.#checker.typeToString(type)}`);
		const constraint = type.getConstraint();
		/** @type {TypeParam} */
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
	 * @returns {Index}
	 */
	#get_index_doc(type) {
		// TODO: Document error
		if (!type.isIndexType()) throw new Error(`Expected Index type, got ${this.#checker.typeToString(type)}`);
		/** @type {Index} */
		let results = {
			kind: "index",
			type: this.#get_type_doc(type.type),
		};
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {IndexedAccess}
	 */
	#get_indexed_access_doc(type) {
		// TODO: Document error
		if (!(type.flags & ts.TypeFlags.IndexedAccess))
			throw new Error(`Expected indexed access type, got ${this.#checker.typeToString(type)}`);
		let ia_type = /** @type {ts.IndexedAccessType} */ (type);
		/** @type {IndexedAccess} */
		let results = {
			kind: "indexed-access",
			object: this.#get_type_doc(ia_type.objectType),
			index: this.#get_type_doc(ia_type.indexType),
		};
		if (ia_type.constraint) results.constraint = this.#get_type_doc(ia_type.constraint);

		// TODO: Commenting these out for now as it's unclear if they are useful for users
		//
		// if (ia_type.simplifiedForReading && ia_type.simplifiedForReading !== type)
		// 	results.simplifiedForReading = this.#get_type_doc(ia_type.simplifiedForReading);
		// if (ia_type.simplifiedForWriting && ia_type.simplifiedForWriting !== type)
		// 	results.simplifiedForReading = this.#get_type_doc(ia_type.simplifiedForWriting);

		this.#extract_names_and_arguments(type, results);
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Conditional}
	 */
	#get_conditional_doc(type) {
		// TODO: Document error
		if (!(type.flags & ts.TypeFlags.Conditional))
			throw new Error(`Expected conditional type, got ${this.#checker.typeToString(type)}`);
		let conditional = /** @type {ts.ConditionalType} */ (type);
		type.getCallSignatures(); // Note: this is required to get resolved types
		/** @type {Conditional} */
		let results = {
			kind: "conditional",
			check: this.#get_type_doc(conditional.checkType),
			extends: this.#get_type_doc(conditional.extendsType),
		};
		if (conditional.resolvedTrueType) results.truthy = this.#get_type_doc(conditional.resolvedTrueType);
		if (conditional.resolvedFalseType) results.falsy = this.#get_type_doc(conditional.resolvedFalseType);

		this.#extract_names_and_arguments(type, results);
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Substitution}
	 */
	#get_substitution_doc(type) {
		// TODO: Document error
		if (!(type.flags & ts.TypeFlags.Substitution))
			throw new Error(`Expected substitution type, got ${this.#checker.typeToString(type)}`);
		let substitution = /** @type {ts.SubstitutionType} */ (type);
		return {
			kind: "substitution",
			base: this.#get_type_doc(substitution.baseType),
			constraint: this.#get_type_doc(substitution.constraint),
		};
	}

	/**
	 * @param {ts.Type} type
	 * @returns {StringMapping}
	 */
	#get_string_mapping_doc(type) {
		// TODO: Document error
		if (!(type.flags & ts.TypeFlags.StringMapping))
			throw new Error(`Expected string mapping type, got ${this.#checker.typeToString(type)}`);
		let string_mapping = /** @type {ts.StringMappingType} */ (type);
		/** @type {StringMapping} */
		let results = {
			kind: "string-mapping",
			type: this.#get_type_doc(string_mapping.type),
			name: string_mapping.symbol.name,
		};
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {TemplateLiteral}
	 */
	#get_template_literal_doc(type) {
		// TODO: Document error
		if (!(type.flags & ts.TypeFlags.TemplateLiteral))
			throw new Error(`Expected template literal type, got ${this.#checker.typeToString(type)}`);
		let template_literal = /** @type {ts.TemplateLiteralType} */ (type);
		/** @type {TemplateLiteral} */
		let results = {
			kind: "template-literal",
			texts: template_literal.texts,
			types: template_literal.types.map((t) => this.#get_type_doc(t)),
		};
		if (type.aliasSymbol || type.aliasTypeArguments) {
			throw new Error("Template literals should not have alias symbols");
		}
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {WithName["sources"]}
	 */
	#get_type_sources(type) {
		/** @type {ts.Symbol | undefined} */
		let symbol = type.getSymbol();
		if (!symbol || symbol.name === AnonTypeLiteralSymbolName) return;
		const declared_type = this.#checker.getDeclaredTypeOfSymbol(symbol);
		const declared_type_symbol = declared_type.getSymbol() || declared_type.aliasSymbol;
		if (declared_type_symbol) return get_sources(declared_type_symbol.getDeclarations() ?? [], this.#root_path_url);
	}

	/**
	 * @param {ts.Type} type
	 * @returns {WithAlias['aliasSource']}
	 */
	#get_type_alias_source(type) {
		/** @type {ts.Symbol | undefined} */
		if (type.aliasSymbol) {
			const declared_type = this.#checker.getDeclaredTypeOfSymbol(type.aliasSymbol);
			const declared_type_symbol = declared_type.getSymbol() || declared_type.aliasSymbol;
			if (declared_type_symbol) {
				const sources = get_sources(declared_type_symbol.getDeclarations() ?? [], this.#root_path_url);
				// TODO: Document error
				if (sources.size > 1) throw new Error("An alias must have at most one source.");
				for (const source of sources) {
					return source;
				}
			}
		}
	}

	/**
	 * Generates {@link Doc.Union}
	 * @param {ts.Type} type
	 * @returns {Union}
	 */
	#get_union_doc(type) {
		// TODO: Document error
		if (!type.isUnion()) throw new Error(`Expected union type, got ${this.#checker.typeToString(type)}`);

		/** @type {TypeOrRef[]} */
		let types = [];
		const non_nullable = type.getNonNullableType();

		if (type.aliasSymbol || type === non_nullable) {
			types = type.types.map((t) => this.#get_type_doc(t));
		} else {
			// The TypeScript compiler expands unions eagerly:
			//     type U = a | b;
			//     x?: U; // expands to `a | b | undefined` instead of `U | undefined`
			// To minimize such expansions, we explicitly combine the nullable and non-nullable elements of a union.
			const non_nullable_doc = this.#get_type_doc(non_nullable);
			if (isTypeRef(non_nullable_doc)) types.push(non_nullable_doc);
			else if (non_nullable_doc.kind === "union") {
				types.push(...non_nullable_doc.types);
			} else {
				types.push(non_nullable_doc);
			}
			types.push(
				...type.types
					.filter((t) => t.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void))
					.map((t) => this.#get_type_doc(t)),
			);
		}

		// Merge `true | false` back into boolean as TypeScript eagerly expands it in unions
		let idx_false = -1;
		let idx_true = -1;
		for (let i = 0; i < types.length; i++) {
			const t = types[i];
			if (isTypeRef(t)) continue;
			if (t.kind === "literal" && t.subkind === "boolean" && t.value === false) idx_false = i;
			if (t.kind === "literal" && t.subkind === "boolean" && t.value === true) idx_true = i;
		}
		if (idx_true !== -1 && idx_false !== -1) {
			types.splice(Math.max(idx_true, idx_false), 1);
			types.splice(Math.min(idx_true, idx_false), 1, { kind: "boolean" });
		}

		/** @type {Union} */
		let results = {
			kind: "union",
			types,
		};
		if (non_nullable !== type) results.nonNullable = this.#get_type_doc(non_nullable);
		this.#extract_names_and_arguments(type, results);

		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {TypeOrRef}
	 */
	#get_type_doc(type) {
		if (
			!type.aliasSymbol &&
			!is_type_reference(type) &&
			(!type.symbol || type.symbol.name === AnonTypeLiteralSymbolName)
		) {
			// immediate type
			return this.#get_type_doc_internal(type);
		}

		// type reference
		const name = this.#get_reference_name(type);
		if (!this.types.has(name)) {
			this.types.set(name, { kind: "unknown" }); // reserve to prevent infinite recursion
			const doc = this.#get_type_doc_internal(type);
			this.types.set(name, doc);
		}
		return name;
	}

	/**
	 * Get fully qualified name of a symbol with hiding private file path.
	 * @param {ts.Symbol} symbol
	 * @returns {string}
	 */
	#get_fully_qualified_name(symbol) {
		const name = this.#checker.getFullyQualifiedName(symbol);
		return name.replace(this.#root_path_url.pathname, "");
	}

	/**
	 * Get a unique name for a given type, used as a reference identifier.
	 * @param {ts.Type} type
	 * @returns {string}
	 */
	#get_reference_name(type) {
		const cached = this.#reference_name_cache.get(type);
		if (cached) return cached;

		// type reference (tuple, array, type reference)
		if (!type.aliasSymbol && is_type_reference(type)) {
			// tuples
			if (this.#checker.isTupleType(type)) {
				const readonly_prefix = /** @type {ts.TupleType} */ (type.target).readonly ? "readonly " : "";
				const name =
					readonly_prefix +
					"[" +
					(type.typeArguments ?? []).map((type) => this.#get_reference_name(type)).join(", ") +
					"]";
				this.#reference_name_cache.set(type, name);
				return name;
			}
			// others
			const name =
				this.#get_fully_qualified_name(type.symbol) +
				(type.typeArguments && type.typeArguments.length
					? "<" + type.typeArguments.map((type) => this.#get_reference_name(type)).join(", ") + ">"
					: "");
			this.#reference_name_cache.set(type, name);
			return name;
		}

		// aliased or named type
		if (type.aliasSymbol || (type.symbol && type.symbol.name !== AnonTypeLiteralSymbolName)) {
			const name =
				this.#get_fully_qualified_name(type.aliasSymbol || type.symbol) +
				(type.aliasTypeArguments && type.aliasTypeArguments.length
					? "<" + type.aliasTypeArguments.map((type) => this.#get_reference_name(type)).join(", ") + ">"
					: "");
			this.#reference_name_cache.set(type, name);
			return name;
		}

		// names of these types are safe to be used as-is
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
		const name = `<anon:${this.#reference_name_cache.size}>`;
		this.#reference_name_cache.set(type, name);
		this.types.set(name, this.#get_type_doc_internal(type));
		this.#reference_name_cache.set(type, name);
		return name;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Type}
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
			case "union":
				return this.#get_union_doc(type);
			case "type-parameter":
				return this.#get_type_param_doc(type);
			case "index":
				return this.#get_index_doc(type);
			case "indexed-access":
				return this.#get_indexed_access_doc(type);
			case "conditional":
				return this.#get_conditional_doc(type);
			case "substitution":
				return this.#get_substitution_doc(type);
			case "template-literal":
				return this.#get_template_literal_doc(type);
			case "string-mapping":
				return this.#get_string_mapping_doc(type);
			default:
				return { kind };
		}
	}
}

/**
 * @typedef LegacyComponent
 * @prop {true} isLegacy
 * @prop {Docable['description']} description
 * @prop {Docable['tags']} tags
 * @prop {Props} props
 * @prop {Exports} exports
 * @prop {Events} events
 * @prop {Slots} slots
 * @prop {Types} types
 */

/**
 * @typedef ModernComponent
 * @prop {false} isLegacy
 * @prop {Docable['description']} description
 * @prop {Docable['tags']} tags
 * @prop {Props} props
 * @prop {Exports} exports
 * @prop {never} events
 * @prop {never} slots
 * @prop {Types} types
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
