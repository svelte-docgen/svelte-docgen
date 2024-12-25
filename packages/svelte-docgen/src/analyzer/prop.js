/**
 * @import * as Doc from "../doc/type.ts";
 */

import path from "pathe";
import { isTypeRef } from "../doc/type.ts";

/** @typedef { Omit<Doc.Prop, 'type'> & { type: Doc.Type } } Prop */

class PropAnalyzer {
	/** @type {Prop} */
	#prop;

	/** @type {Doc.Types} */
	#types;

	/**
	 * @param {Prop} prop
	 * @param {Doc.Types} types
	 * */
	constructor(prop, types) {
		this.#prop = prop;
		this.#types = types;
	}

	/** @returns {boolean} */
	get isEventHandler() {
		if (this.#type.kind !== "function") return false;
		if (!this.#type.sources) return false;
		const is_type_from_svelte = Iterator.from(this.#type.sources).some((f) => this.#is_source_from_svelte(f));
		if (!is_type_from_svelte) return false;
		return Boolean(this.#type.alias?.endsWith("EventHandler"));
	}

	/** @returns {boolean} */
	get isExtendedBySvelte() {
		if (!this.#prop.isExtended || !this.#prop.sources) return false;
		return Iterator.from(this.#prop.sources).some((f) => this.#is_source_from_svelte(f));
	}

	/** @returns {boolean} */
	get isSnippet() {
		if (this.#type.kind === "union" && this.#type.nonNullable) {
			let non_nullable = isTypeRef(this.#type.nonNullable)
				? this.#types.get(this.#type.nonNullable)
				: this.#type.nonNullable;
			if (!non_nullable) throw new Error("Unreachable");
			return this.#is_snippet(non_nullable);
		}
		return this.#is_snippet(this.#type);
	}

	/** @returns {ReturnType<typeof this.isSnippet> extends true ? Doc.Tuple : never} */
	getSnippetParameters() {
		const fn = this.#snippet_fn;
		// WARN: We don't expect that it can be overloaded
		const call = fn.calls[0];
		// TODO: Document error
		if (!call) throw new Error("");
		const params = call.parameters[0];
		if (params === "self") throw new Error("Self-referencing snippet is not supported");
		// NOTE: Parameters is always a single item and tuple
		const params_type = isTypeRef(params.type) ? this.#types.get(params.type) : params.type;
		if (params_type?.kind !== "tuple") throw new Error("Not a tuple");
		return params_type;
	}

	/** @returns {Doc.Fn} */
	get #snippet_fn() {
		// TODO: Document error
		if (!this.isSnippet) throw new Error("Not a snippet");
		if (this.#type.kind === "union") {
			let non_nullable = this.#type.nonNullable;
			if (typeof non_nullable === "string") {
				non_nullable = this.#types.get(non_nullable);
			}
			return /** @type {Doc.Fn} */ (non_nullable);
		}
		if (this.#type.kind === "function") return this.#type;
		// TODO:: Document error
		throw new Error("Unreachable");
	}

	/**
	 * @param {string} source
	 * @returns {boolean}
	 */
	#is_source_from_svelte(source) {
		const { dir } = path.parse(source);
		return (
			dir.endsWith(path.join(path.sep, "node_modules", "svelte", "types")) ||
			dir.endsWith(path.join(path.sep, "node_modules", "svelte"))
		);
	}

	/**
	 * @param {Doc.Type} type
	 * @returns {boolean}
	 */
	#is_snippet(type) {
		if (type.kind !== "function" || type.alias !== '"svelte".Snippet') return false;
		if (!type.sources) return false;
		return Iterator.from(type.sources).some((f) => this.#is_source_from_svelte(f));
	}

	/** @returns {Doc.Type} */
	get #type() {
		const type = isTypeRef(this.#prop.type) ? this.#types.get(this.#prop.type) : this.#prop.type;
		if (!type) throw new Error("Unreachable");
		return type;
	}
}

/**
 * @typedef EventHandlerPropAnalysis
 * @prop {boolean} isExtendedBySvelte
 * @prop {false} isSnippet
 * @prop {true} isEventHandler
 */

/**
 * @typedef SnippetPropAnalysis
 * @prop {true} isExtendedBySvelte
 * @prop {true} isSnippet
 * @prop {() => Doc.Tuple} getSnippetParameters
 * @prop {false} isEventHandler
 */

/**
 * @typedef OtherPropAnalysis
 * @prop {boolean} isExtendedBySvelte
 * @prop {false} isSnippet
 * @prop {false} isEventHandler
 */

/**
 * @typedef {(EventHandlerPropAnalysis | SnippetPropAnalysis | OtherPropAnalysis)} PropAnalysis
 */

/**
 * @param {Doc.Prop} prop
 * @param {Doc.Types} types
 * @returns {PropAnalysis}
 */
export function analyzeProperty(prop, types) {
	// @ts-expect-error: WARN: Hard to type (cast), but should be fine from usage perspective
	return new PropAnalyzer(prop, types);
}
