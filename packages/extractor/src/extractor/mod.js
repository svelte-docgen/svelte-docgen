import ts from "typescript";

import { ComponentDocExtractor } from "./component-doc.js";
import { Compiler } from "../compiler.js";
import { Options } from "../options.js";
import { Parser } from "../parser.js";

/**
 * @import { Tag, DisplayPart } from "./component-doc.js";
 * @import { Source } from "../util.js";
 * @import { createCacheStorage } from "../cache.js";
 */

class Extractor {
	/** @type {Source} */
	source;
	/** @type {Options} */
	#options;
	/** @type {Parser} */
	parser;
	/** @type {Compiler} */
	compiler;
	/** @type {ts.System} */
	sys;

	/**
	 * @param {Source} source
	 * @param {Options} options
	 */
	constructor(source, options) {
		this.source = source;
		this.sys = options.sys;
		this.#options = new Options(options);
		this.parser = new Parser(this.source);
		this.compiler = new Compiler(this.source, this.parser, this.#options);
	}

	/** @returns {DisplayPart[] | undefined} */
	get description() {
		return this.#component_doc_extractor?.description;
	}

	/** @returns {Tag[] | undefined} */
	get tags() {
		return this.#component_doc_extractor?.tags;
	}

	/** @returns {ComponentDocExtractor | undefined} */
	get documentation() {
		if (this.parser.componentComment) return new ComponentDocExtractor(this.parser.componentComment);
		return undefined;
	}

	/** @returns {Map<string, ts.Symbol>} */
	get props() {
		this.#was_props_called = true;
		const { props } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!props) throw new Error("props not found");
		return new Map(
			Iterator.from(props.getProperties()).map((p) => {
				// Handle the `bind:` prefix, used in type declarations to indicate that props are bindable
				const prefix = "bind:";
				if (p.name.startsWith(prefix)) {
					const name = p.name.slice(prefix.length);
					this.#cached_bindings.add(name);
					return [name, p];
				}
				return [p.name, p];
			}),
		);
	}

	/** @returns {Map<string, ts.BindingElement>} */
	get defaults() {
		let results = new Map();
		if (this.#props_obj) {
			for (const binding of this.#props_obj?.elements ?? []) {
				if (!binding.initializer) continue;
				const name = binding.propertyName?.getText() || binding.name.getText();
				results.set(name, binding.initializer);
			}
		} else {
			// TODO: Remove when Svelte drops support for legacy export let (v4)
			for (const statement of this.#fn_render.body?.statements ?? []) {
				if (ts.isVariableStatement(statement) && (statement.flags & ts.NodeFlags.Let) === 0) {
					const first_item = statement.declarationList.declarations[0];
					if (!first_item) continue;
					if (!first_item.initializer) continue;
					const name = first_item.name.getText();
					results.set(name, first_item.initializer);
				}
			}
		}
		return results;
	}

	/**
	 * `svelte2tsx` doesn't check whether props are bindable if the name contains prefix `bind:`.
	 * Another reason why we need own parser...
	 */
	#was_props_called = false;
	/** @type {Set<string>} */
	#cached_bindings = new Set();
	/** @returns {Set<string>} */
	get bindings() {
		if (!this.#was_props_called) {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			this.props;
			this.#was_props_called = true;
		}
		const { bindings } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!bindings) throw new Error("bindings not found");
		// If in legacy mode, 'bindings' is a string type
		if (bindings.flags & ts.TypeFlags.String) return this.#cached_bindings;
		// If there is a single binding
		if (bindings.isStringLiteral()) {
			// NOTE: No bindings, is empty
			if (bindings.value === "") return this.#cached_bindings;
			this.#cached_bindings.add(bindings.value);
			return this.#cached_bindings;
		}
		// If there are multiple bindings
		// TODO: Document error
		if (!bindings?.isUnion()) throw new Error("bindings is not an union");
		for (const type of bindings.types) {
			// TODO: Document error
			if (!type.isStringLiteral()) throw new Error("Expected bindings to be a union of string literal types");
			this.#cached_bindings.add(type.value);
		}
		return this.#cached_bindings;
	}

	/**
	 * @returns {Map<string, Map<string, ts.Symbol>>}
	 * TODO: Remove when Svelte stops support for legacy slots (v4)
	 */
	get slots() {
		const { slots } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!slots) throw new Error("slots not found");
		return new Map(
			Iterator.from(
				slots.getProperties().map((s) => {
					const type = this.checker.getTypeOfSymbolAtLocation(s, this.#source_file);
					const props = new Map(Iterator.from(type.getProperties().map((p) => [p.name, p])));
					return [s.name, props];
				}),
			),
		);
	}

	/**
	 * @returns {Map<string, ts.Symbol>}
	 * TODO: Remove when Svelte stops support for legacy exports from instance script (v4)
	 */
	get exports() {
		const { exports } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!exports) throw new Error("exports not found");
		return new Map(Iterator.from(exports.getProperties()).map((e) => [e.name, e]));
	}

	/**
	 * @returns {Map<string, ts.Symbol>}
	 * TODO: Remove when Svelte stops support for legacy custom events (v4)
	 */
	get events() {
		const { events } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!events) throw new Error("events not found");
		return new Map(Iterator.from(events.getProperties()).map((e) => [e.name, e]));
	}

	/** @returns {ReturnType<typeof createCacheStorage>} */
	get #cache() {
		return this.#options.cache;
	}

	/** @type {ComponentDocExtractor | undefined} */
	#cached_component_doc_extractor;
	/** @type {ComponentDocExtractor | undefined} */
	get #component_doc_extractor() {
		if (this.#cached_component_doc_extractor) return this.#cached_component_doc_extractor;
		if (!this.parser.componentComment) return undefined;
		this.#cached_component_doc_extractor = new ComponentDocExtractor(this.parser.componentComment);
		return this.#cached_component_doc_extractor;
	}

	/** @type {ts.Program | undefined} */
	#cached_program;
	/** @returns {ts.Program} */
	get #program() {
		if (this.#cached_program) return this.#cached_program;
		this.#cached_program = this.#create_program();
		return this.#cached_program;
	}

	/**
	 * @returns {ts.Program}
	 */
	#create_program() {
		const program = ts.createProgram({
			rootNames: [this.#options.shims_path, this.#options.tsx_filepath],
			options: this.#options.ts_options,
			host: this.#create_host(),
			oldProgram: this.#cache.program,
		});
		return program;
	}

	/**
	 * @returns {ts.CompilerHost}
	 */
	#create_host() {
		/** @type {Partial<ts.CompilerHost>} */
		const overridden_methods = {
			fileExists: (filepath) => {
				if (this.#cache.has(filepath)) return true;
				if (filepath === this.#options.tsx_filepath) return true;
				return this.#options.host.fileExists(filepath);
			},
			getSourceFile: (filepath, language_version_or_options, on_error) => {
				const cached = this.#cache.get(filepath);
				if (cached?.source) return cached.source;
				/** @type {ts.SourceFile | undefined} */
				let source;
				if (filepath === this.#options.tsx_filepath) {
					const content = this.compiler.tsx.code;
					source = ts.createSourceFile(
						this.#options.tsx_filepath,
						content,
						language_version_or_options,
						true,
						// Set to 'JS' to enable TypeScript to parse JSDoc.
						this.parser.isLangTypeScript ? ts.ScriptKind.TS : ts.ScriptKind.JS,
					);
				} else {
					source = this.#options.host.getSourceFile(filepath, language_version_or_options, on_error);
				}
				if (!source) throw new Error(`Source file was not found by program: ${filepath}`);
				this.#cache.set(filepath, { source });
				return source;
			},
			readFile: (filepath) => {
				const cached = this.#cache.get(filepath);
				if (cached?.content) return cached.content;
				/** @type {string | undefined} */
				let content;
				if (filepath === this.#options.tsx_filepath) content = this.compiler.tsx.code;
				else content = this.#options.host.readFile(filepath);
				if (content) this.#cache.set(filepath, { content });
				return content;
			},
			writeFile: () => {
				/* WARN: Do absolutely nothing! */
			},
		};
		return {
			...this.#options.host,
			...overridden_methods,
		};
	}

	/** @type {ts.TypeChecker | undefined} */
	#cached_checker;
	/** @returns {ts.TypeChecker} */
	get checker() {
		if (this.#cached_checker) return this.#cached_checker;
		this.#cached_checker = this.#program.getTypeChecker();
		return this.#cached_checker;
	}

	/** @type {ts.SourceFile | undefined} */
	#cached_source_file;
	/** @returns {ts.SourceFile} */
	get #source_file() {
		if (this.#cached_source_file) return this.#cached_source_file;
		const from_cache = this.#cache.get(this.#options.tsx_filepath)?.source;
		if (from_cache) return from_cache;
		const from_program = this.#program.getSourceFile(this.#options.tsx_filepath);
		//O TODO: Document it
		if (!from_program)
			throw new Error(`Source file could not be found by TypeScript program: ${this.#options.tsx_filepath}`);
		this.#cached_source_file = this.#cache.set(this.#options.tsx_filepath, {
			source: from_program,
		}).source;
		return from_program;
	}

	/** @type {ts.FunctionDeclaration | undefined} */
	#cached_fn_render;
	/** @rDeturns {ts.FunctionDeclaration} */
	get #fn_render() {
		if (this.#cached_fn_render) return this.#cached_fn_render;
		this.#cached_fn_render = this.#find_render_fn_declaration();
		return this.#cached_fn_render;
	}
	/** @returns {ts.FunctionDeclaration} */
	#find_render_fn_declaration() {
		for (const statement of this.#source_file.statements) {
			if (ts.isFunctionDeclaration(statement) && statement.name?.text === "render") {
				return statement;
			}
		}
		// TODO: Document error
		throw new Error("render fn not found");
	}

	/**
	 * The whole line statement, like:
	 * ```ts`
	 * let { ...props } = $props();
	 * ```
	 *
	 * @type {ts.VariableStatement | undefined}
	 */
	#cached_stamenent_with_props_rune;
	/** @returns {ts.VariableStatement | undefined} */
	get #statement_with_props_rune() {
		if (this.#cached_stamenent_with_props_rune) return this.#cached_stamenent_with_props_rune;
		this.#cached_stamenent_with_props_rune = this.#find_statement_with_props_rune();
		return this.#cached_stamenent_with_props_rune;
	}

	/** @returns {ts.VariableStatement | undefined} */
	#find_statement_with_props_rune() {
		for (const statement of this.#fn_render.body?.statements || []) {
			if (ts.isVariableStatement(statement)) {
				const initializer = statement.declarationList.declarations[0]?.initializer;
				if (
					initializer &&
					ts.isCallExpression(initializer) &&
					ts.isIdentifier(initializer.expression) &&
					initializer.expression.text === "$props"
				) {
					return statement;
				}
			}
		}
	}

	/** @returns {ts.ObjectBindingPattern | undefined} */
	get #props_obj() {
		const declaration = this.#statement_with_props_rune?.declarationList.declarations?.[0];
		if (declaration && ts.isObjectBindingPattern(declaration.name)) return declaration.name;
		return undefined;
	}

	/** @typedef {"props" | "bindings" | "slots" | "exports" | "events"} RenderFnKey */
	/** @type {{ [key in RenderFnKey]?: ts.Type } | undefined} */
	#cached_extracted_from_render_fn;
	/** @returns {{ [key in RenderFnKey]?: ts.Type }} */
	get #extracted_from_render_fn() {
		if (this.#cached_extracted_from_render_fn) return this.#cached_extracted_from_render_fn;
		const signature = this.checker.getSignatureFromDeclaration(this.#fn_render);
		// TODO: Document error
		if (!signature) throw new Error("signature not found");
		const return_type = this.checker.getReturnTypeOfSignature(signature);
		const properties = return_type.getProperties();
		this.#cached_extracted_from_render_fn = {};
		for (const prop of properties) {
			const name = prop.getName();
			// TODO: Add support for Svelte v4 - exports, slots, and events
			switch (name) {
				case "props":
				case "bindings":
				case "slots":
				case "exports":
				case "events": {
					this.#cached_extracted_from_render_fn[name] = this.checker.getTypeOfSymbolAtLocation(
						prop,
						this.#fn_render,
					);
					continue;
				}
				default:
					continue;
			}
		}
		return this.#cached_extracted_from_render_fn;
	}
}

/**
 * @param {string} source
 * @param {ConstructorParameters<typeof Options>[0]} user_options
 * @returns {Extractor}
 */
export function extract(source, user_options) {
	return new Extractor(source, new Options(user_options));
}
