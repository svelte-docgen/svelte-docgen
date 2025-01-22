/**
 * @import { Props, Types } from "../doc/type.ts";
 * @import { PropAnalysis } from "./prop.js";
 */

import { PropAnalyzer } from "./prop.js";

/**
 * @typedef {Map<string, PropAnalysis>} AnalyzedProps
 */

export class PropsAnalyzer {
	/**
	 * Parsed raw props data, without modifications.
	 * @type {Props}
	 */
	#props;
	/**
	 * Map of type references and their respective types.
	 * @type {Types}
	 */
	#types;
	/**
	 * Is the component legacy or not?
	 * @type {boolean}
	 */
	#is_legacy;

	/**
	 * @typedef Params
	 * @prop {Props} props
	 * @prop {Types} types
	 * @prop {boolean} isLegacy
	 */

	/**
	 * @param {Params} params
	 */
	constructor(params) {
		this.#props = params.props;
		this.#types = params.types;
		this.#is_legacy = params.isLegacy;
	}

	/** @type {AnalyzedProps | undefined} */
	#cached_all;
	/**
	 * Filters out legacy event handler props if the component is modern.
	 * Or filters out modern event handler props if the component is legacy.
	 *
	 * @returns {AnalyzedProps} map of analyzed props
	 */
	get all() {
		if (this.#cached_all) return this.#cached_all;
		this.#cached_all = new Map(
			Iterator.from(this.#props)
				.filter(([name, _raw_data]) => {
					if (this.#is_legacy) {
						return name.startsWith("on:") || (!name.startsWith("on") && name.at(2) !== ":");
					}
					return !name.startsWith("on:");
				})
				.map(([name, raw_data]) => [
					name,
					/** @type {PropAnalysis} */ (
						new PropAnalyzer({
							data: raw_data,
							types: this.#types,
							isLegacy: this.#is_legacy,
						})
					),
				]),
		);
		return this.#cached_all;
	}

	/** @type {AnalyzedProps | undefined} */
	#cached_aria;
	/**
	 * Map of properties related to ARIA attributes - `aria-*`.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes}
	 *
	 * @returns {AnalyzedProps} map of filtered and analayzed props
	 */
	get aria() {
		if (this.#cached_aria) return this.#cached_aria;
		this.#cached_aria = new Map(Iterator.from(this.all).filter(([name, _data]) => name.startsWith("aria-")));
		return this.#cached_aria;
	}

	/** @type {AnalyzedProps | undefined} */
	#cached_data;
	/**
	 * Map of properties related to global `data-*` attributes.
	 *
	 * @ee {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*}
	 *
	 * @returns {AnalyzedProps} map of filtered and analayzed props
	 */
	get data() {
		if (this.#cached_data) return this.#cached_data;
		this.#cached_data = new Map(Iterator.from(this.all).filter(([name, _data]) => name.startsWith("data-")));
		return this.#cached_data;
	}

	/** @type {AnalyzedProps | undefined} */
	#cached_events;
	/**
	 * Map of properties related to events handling.
	 *
	 * @ee {@link https://developer.mozilla.org/en-US/docs/Web/Events}
	 *
	 * @returns {AnalyzedProps} map of filtered and analayzed props
	 */
	get events() {
		if (this.#cached_events) return this.#cached_events;
		this.#cached_events = new Map(Iterator.from(this.all).filter(([_name, data]) => data.isEventHandler));
		return this.#cached_events;
	}

	/** @type {AnalyzedProps | undefined} */
	#cached_snippets;
	/**
	 * Map of properties which are Svelte snippets.
	 *
	 * @see {@link https://svelte.dev/docs/svelte/snippet}
	 *
	 * @returns {AnalyzedProps} map of filtered and analayzed props
	 */
	get snippets() {
		if (this.#cached_snippets) return this.#cached_snippets;
		this.#cached_snippets = new Map(Iterator.from(this.all).filter(([_name, data]) => data.isSnippet));
		return this.#cached_snippets;
	}

	/** @type {AnalyzedProps | undefined} */
	#cached_uncategorized;
	/**
	 * Map of other/uncategorized properties.
	 *
	 * @returns {AnalyzedProps} map of filtered and analayzed props
	 */
	get uncategorized() {
		if (this.#cached_uncategorized) return this.#cached_uncategorized;
		this.#cached_uncategorized = new Map(
			Iterator.from(this.all).filter(
				([name, _data]) =>
					// NOTE: Negation
					!(this.aria.has(name) || this.data.has(name) || this.events.has(name) || this.snippets.has(name)),
			),
		);
		return this.#cached_uncategorized;
	}
}
