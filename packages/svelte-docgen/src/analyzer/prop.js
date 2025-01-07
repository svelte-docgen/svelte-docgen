/**
 * @import { DisplayPart, Fn, Prop, Tag, Tuple, Type, Types } from "../doc/type.ts";
 */

import path from "pathe";

import { isTypeRef } from "../doc/utils.js";

export class PropAnalyzer {
	/**
	 * Is the component legacy or not?
	 * @type {boolean}
	 */
	// eslint-disable-next-line no-unused-private-class-members
	#is_legacy;
	/**
	 * Raw prop docgen data.
	 * @type {Prop}
	 */
	#data;
	/** @type {Types} */
	#types;

	/**
	 * @typedef Params
	 * @prop {Prop} data
	 * @prop {Types} types
	 * @prop {boolean} isLegacy
	 */

	/**
	 * @param {Params} params
	 */
	constructor(params) {
		this.#data = params.data;
		this.#types = params.types;
		this.#is_legacy = params.isLegacy;
	}

	/** @returns {DisplayPart[] | undefined} */
	get description() {
		return this.#data.description;
	}

	/** @type {Tag[] | undefined} */
	#cached_tags;
	/**
	 * Collected prop JSDoc tags.
	 *
	 * NOTE:
	 * 1. They can be custom defined.
	 * 2. They can be repetitive _(tag with specific name can occur more than once)_.
	 *
	 * @returns {Tag[]}
	 */
	get tags() {
		if (this.#cached_tags) return this.#cached_tags;
		this.#cached_tags = this.#data.tags ?? [];
		return this.#cached_tags;
	}

	/**
	 * Is this prop `$bindable`?
	 * @see {@link https://svelte.dev/docs/svelte/$bindable}
	 *
	 * @returns {boolean}
	 */
	get isBindable() {
		return Boolean(this.#data.isBindable);
	}

	/**
	 * Is this prop optional - can it be omitted?
	 *
	 * @returns {boolean}
	 */
	get isOptional() {
		return Boolean(this.#data.isOptional);
	}

	/** @type {Type | undefined | null} */
	#cached_default;
	/**
	 * If the prop is optional, it can have a default value.
	 *
	 * @returns {Type | undefined}
	 * @throws {Error} when atttemped to access it, while property isn't optional
	 */
	get default() {
		// NOTE: `null` means it was checked - I will probably have regrets for this pattern
		// TODO: Document error
		if (!this.isOptional) throw new Error("Not optional!");
		if (this.#cached_default || this.#cached_default === null) return this.#cached_default ?? undefined;
		if (!this.#data.default) {
			this.#cached_default = null;
		} else if (isTypeRef(this.#data.default)) {
			const type = this.#types.get(this.#data.default);
			// TODO: Document error
			if (!type) throw new Error("Unreachable");
			this.#cached_default = type;
		} else {
			this.#cached_default = this.#data.default;
		}
		return this.#cached_default ?? undefined;
	}

	/**
	 * Was this prop extended from other interface than the core one for props?
	 * It could be defined in other file.
	 *
	 * @returns {boolean}
	 */
	get isExtended() {
		return Boolean(this.#data.isExtended);
	}

	/**
	 * Was this prop extended from other interface than the core one for props?
	 * It could be defined in other file.
	 *
	 * @returns {Set<string>}
	 * @throws {Error} when attempting to access in non-extended prop
	 */
	get sources() {
		// TODO: Document error
		if (!this.isExtended) throw new Error("Not extended!");
		return this.#data.sources ?? new Set();
	}

	/** @type {Type | undefined} */
	#cached_type;
	/**
	 * Access the prop type data. It will handle the type reference in advance for you.
	 *
	 * @returns {Type}
	 */
	get type() {
		if (this.#cached_type) return this.#cached_type;
		if (isTypeRef(this.#data.type)) {
			const type = this.#types.get(this.#data.type);
			// TODO: Document error
			if (!type) throw new Error("Unreachable");
			this.#cached_type = type;
		} else {
			this.#cached_type = this.#data.type;
		}
		return this.#cached_type;
	}

	/**
	 * Checks if the prop is an event handler, under following conditions:
	 *
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
	 * Checks if the prop is an event handler, including a case where it can be in a _nullable_ union.
	 *
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

	/**
	 * Is this type extended from Svelte types?
	 * For example from `"svelte/elements"` module.
	 *
	 * @returns {boolean}
	 */
	get isExtendedBySvelte() {
		if (!this.#data.isExtended || !this.#data.sources) return false;
		return Iterator.from(this.#data.sources).some((f) => this.#is_source_from_svelte(f));
	}

	/**
	 * Is this prop a snippet?
	 * @see {@link https://svelte.dev/docs/svelte/snippet}
	 *
	 * @returns {boolean}
	 */
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

	/**
	 * @returns {ReturnType<typeof this.isSnippet> extends true ? Tuple : never}
	 */
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
		const type = isTypeRef(this.#data.type) ? this.#types.get(this.#data.type) : this.#data.type;
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
 * @typedef {(EventHandlerPropAnalysis | SnippetPropAnalysis | OtherPropAnalysis) & Prop} PropAnalysis
 */
