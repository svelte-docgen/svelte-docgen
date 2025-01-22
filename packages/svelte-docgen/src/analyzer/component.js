/**
 * @import { DisplayPart, Events, Exports, Slots, Tag, Type, TypeRef, Types } from "../doc/type.ts";
 * @import { parse } from "../parser/mod.ts";
 */

import { PropsAnalyzer } from "./props.js";

/**
 * @template {boolean} [T=boolean]
 */
export class ComponentAnalyzer {
	/** @type {ReturnType<typeof parse>} */
	#component;
	/**
	 * Determines if the component is a legacy component.
	 * By _legacy_ it means it uses deprecated syntax - from `v4` to `v5`.
	 *
	 * @see {@link https://svelte.dev/docs/svelte/legacy-overview}
	 *
	 * @type {T}
	 */
	isLegacy;

	/** @param {ReturnType<typeof parse>} component */
	constructor(component) {
		this.#component = component;
		this.isLegacy = /** @type {T} */ (Boolean(this.#component.isLegacy));
	}

	/**
	 * Component description from the _first HTML comment_ at the fragment root of the Svelte component file.
	 * Any content after the `@component` tag is treated as description.
	 * It can be multi-line.
	 * Until the next line starting with different tag.
	 *
	 * @example
	 *
	 * ```svelte
	 * <!--
	 * @component Example component description
	 * -->
	 * ```
	 *
	 * @returns {DisplayPart[] | undefined}
	 */
	get description() {
		return this.#component.description;
	}

	/** @type {Tag[] | undefined} */
	#cached_tags;
	/**
	 * Collected component tags - JSDoc style.
	 * From the _first HTML comment_ at the fragment root of the Svelte component file - which contains `@component` tag.
	 *
	 * NOTE:
	 * 1. There is no official specification for tags, hence they can be custom defined.
	 * 2. They can be repetitive _(tag with specific name can occur more than once)_.
	 *
	 * @example
	 *
	 * ```svelte
	 * <!--
	 * @component Example component description
	 *
	 * @category Atom
	 * @subcategory Native
	 * -->
	 * ```
	 *
	 * @returns {Tag[]}
	 */
	get tags() {
		if (this.#cached_tags) return this.#cached_tags;
		this.#cached_tags = this.#component.tags ?? [];
		return this.#cached_tags;
	}

	/** @type {Events | undefined} */
	#cached_events;
	/**
	 * Legacy component Custom Events.
	 *
	 * @returns {T extends true ? Events : never} map of component custom events
	 * @throws {Error} when attempting to access in non-legacy component
	 * @deprecated See migration guide {@link https://svelte.dev/docs/svelte/v5-migration-guide#Event-changes-Component-events}
	 */
	get events() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error("This component is not a legacy component!");
		if (this.#cached_events) return /** @type {T extends true ? Events : never} */ (this.#cached_events);
		this.#cached_events = this.#component.events ?? new Map();
		return /** @type {T extends true ? Events : never} */ (this.#cached_events);
	}

	/** @type {Exports | undefined} */
	#cached_exports;
	/**
	 * Defined exports inside the _module_ `<script module>` tag.
	 * @see {@link https://svelte.dev/docs/svelte/svelte-files#script-module}
	 *
	 * @returns {Exports} map of defined exports in the Svelte component file
	 */
	get exports() {
		if (this.#cached_exports) return this.#cached_exports;
		this.#cached_exports = this.#component.exports ?? new Map();
		return this.#cached_exports;
	}

	/** @type {PropsAnalyzer | undefined} */
	#cached_props;
	/**
	 * Component props.
	 *
	 * @see {@link https://svelte.dev/docs/svelte/$props}
	 *
	 * @returns {PropsAnalyzer} instance with more detailed props analysis
	 */
	get props() {
		if (this.#cached_props) return this.#cached_props;
		this.#cached_props = new PropsAnalyzer({
			props: this.#component.props,
			isLegacy: this.isLegacy,
			types: this.types,
		});
		return this.#cached_props;
	}

	/** @type {Slots | undefined} */
	#cached_slots;
	/**
	 * Legacy component slots.
	 *
	 * @returns {T extends true ? Slots : never}
	 * @throws {Error} when attempting to access in non-legacy component
	 * @deprecated See migration guide {@link https://svelte.dev/docs/svelte/legacy-slots}
	 */
	get slots() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error("This component is not a legacy component!");
		if (this.#cached_slots) return /** @type {T extends true ? Slots : never} */ (this.#cached_slots);
		this.#cached_slots = this.#component.slots ?? new Map();
		return /** @type {T extends true ? Slots : never} */ (this.#cached_slots);
	}

	/** @type {Types | undefined} */
	#cached_types;
	/**
	 * Use if when you need to access type data with {@link TypeRef}.
	 *
	 * @returns {Types} map of types with {@link TypeRef} as key and {@link Type} as value.
	 */
	get types() {
		if (this.#cached_types) return this.#cached_types;
		this.#cached_types = this.#component.types ?? new Map();
		return this.#cached_types;
	}
}
