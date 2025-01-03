/**
 * @import { Fn, Prop, Tuple, Type, Types } from "../doc/type.ts";
 */

import path from "pathe";
import { isTypeRef } from "../doc/utils.js";

class PropAnalyzer {
	/** @type {Prop} */
	#prop;

	/** @type {Types} */
	#types;

	/**
	 * @param {Prop} prop
	 * @param {Types} types
	 * */
	constructor(prop, types) {
		this.#prop = prop;
		this.#types = types;
	}

	/**
	 * Checks if the prop is an event handler, under following conditions:
	 * 1. Type is a function kind
	 * 2. It uses types from svelte
	 * 3. Alias contains the pattern `EventHandler`
	 *
	 * @param {Type} type
	 * @returns {boolean}
	 */
	#is_event_handler(type) {
		if (type.kind !== "function") return false;
		if (!type.sources) return false;
		const is_type_from_svelte = Iterator.from(type.sources).some((f) => this.#is_source_from_svelte(f));
		if (!is_type_from_svelte) return false;
		return Boolean(type.alias?.includes("EventHandler"));
	}

	/**
	 * Checks if the prop is an event handler, including a case where it can be a _nullable_ union.
	 * @returns {boolean}
	 */
	get isEventHandler() {
		if (this.#type.kind === "union") {
			const type_or_ref = this.#type.nonNullable;
			if (!type_or_ref) return false;
			if (isTypeRef(type_or_ref)) {
				const type = this.#types.get(type_or_ref);
				if (!type) throw Error("Unreachable");
				return this.#is_event_handler(type);
			}
			return this.#is_event_handler(type_or_ref);
		}
		return this.#is_event_handler(this.#type);
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

	/** @returns {ReturnType<typeof this.isSnippet> extends true ? Tuple : never} */
	getSnippetParameters() {
		const fn = this.#snippet_fn;
		// WARN: We don't expect that it can be overloaded
		const call = fn.calls[0];
		// TODO: Document error
		if (!call) throw new Error("");
		const params = call.parameters[0];
		// NOTE: Parameters is always a single item and tuple
		const params_type = isTypeRef(params.type) ? this.#types.get(params.type) : params.type;
		if (params_type?.kind !== "tuple") throw new Error("Not a tuple");
		return params_type;
	}

	/** @returns {Fn} */
	get #snippet_fn() {
		// TODO: Document error
		if (!this.isSnippet) throw new Error("Not a snippet");
		if (this.#type.kind === "union") {
			let non_nullable = this.#type.nonNullable;
			if (typeof non_nullable === "string") {
				non_nullable = this.#types.get(non_nullable);
			}
			return /** @type {Fn} */ (non_nullable);
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
			dir.endsWith(path.join("node_modules", "svelte", "types")) ||
			dir.endsWith(path.join("node_modules", "svelte"))
		);
	}

	/**
	 * @param {Type} type
	 * @returns {boolean}
	 */
	#is_snippet(type) {
		if (type.kind !== "function" || !type.alias?.startsWith('"svelte".Snippet')) return false;
		if (!type.sources) return false;
		return Iterator.from(type.sources).some((f) => this.#is_source_from_svelte(f));
	}

	/** @returns {Type} */
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
 * @prop {() => Tuple} getSnippetParameters
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
 * @param {Prop} prop
 * @param {Types} types
 * @returns {PropAnalysis}
 */
export function analyzeProperty(prop, types) {
	// @ts-expect-error: WARN: Hard to type (cast), but should be fine from usage perspective
	return new PropAnalyzer(prop, types);
}
