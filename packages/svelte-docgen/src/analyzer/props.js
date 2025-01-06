/**
 * @import { Prop, Props, Types } from "../doc/type.ts";
 * @import { PropAnalysis } from "./prop.js";
 */

import { analyzeProperty } from "./prop.js";

class PropsAnalyzer {
	/**
	 * Parsed props, without filtering.
	 * @type {Props}
	 */
	#props;
	/**
	 * Map of type references.
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

	/** @type {Props | undefined} */
	#cached_all;
	/**
	 * Filters out legacy event handler props if the component is modern.
	 * Or filters out modern event handler props if the component is legacy.
	 * @returns {Props}
	 */
	get all() {
		if (this.#cached_all) return this.#cached_all;
		this.#cached_all = new Map(
			Iterator.from(this.#props).filter(([name, _prop]) => {
				if (this.#is_legacy) {
					return (
						name.startsWith("on:") ||
						(!name.startsWith("on") && name.at(2) !== ":")
					);
				}
				return !name.startsWith("on:");
			}),
		);
		return this.#cached_all;
	}

	/** @type {Map<string, { prop: Prop, analysis: PropAnalysis }> | undefined} */
	#cached_analyzed;
	/**
	 * Cached map of analyzed props, for usage optimization purposes.
	 *
	 * @type {Map<string, { prop: Prop, analysis: PropAnalysis }>}
	 */
	get #analyzed() {
		if (this.#cached_analyzed) return this.#cached_analyzed;
		this.#cached_analyzed = new Map(
			Iterator.from(this.all).map(([name, prop]) => [
				name,
				{
					prop,
					analysis: analyzeProperty(prop, this.#types),
				},
			]),
		);
		return this.#cached_analyzed;
	}

	/**
	 * Map of properties related to ARIA attributes - `aria-*`.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes}
	 *
	 * @returns {Props}
	 */
	get aria() {
		return new Map(
			Iterator.from(this.#analyzed)
				.filter(([name, _data]) => name.startsWith("aria-"))
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of properties related to global `data-*` attributes.
	 *
	 * @ee {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*}
	 *
	 * @returns {Props}
	 */
	get data() {
		return new Map(
			Iterator.from(this.#analyzed)
				.filter(([name, _data]) => name.startsWith("data-"))
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of properties related to events handling.
	 *
	 * @ee {@link https://developer.mozilla.org/en-US/docs/Web/Events}
	 *
	 * @returns {Props}
	 */
	get events() {
		return new Map(
			Iterator.from(this.#analyzed)
				.filter(([_name, data]) => data.analysis.isEventHandler)
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of properties which are Svelte snippets.
	 *
	 * @see {@link https://svelte.dev/docs/svelte/snippet}
	 *
	 * @returns {Props}
	 */
	get snippets() {
		return new Map(
			Iterator.from(this.#analyzed)
				.filter(([_name, data]) => data.analysis.isSnippet)
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of other/uncategorized properties.
	 *
	 * @returns {Props}
	 */
	get uncategorized() {
		return new Map(
			Iterator.from(this.#analyzed)
				.filter(
					([name, _data]) =>
						// NOTE: Negation
						!(
							this.snippets.has(name) ||
							this.events.has(name) ||
							this.aria.has(name) ||
							this.data.has(name)
						),
				)
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}
}

/**
 * @param {ConstructorParameters<typeof PropsAnalyzer>[0]} params
 * @returns {PropsAnalyzer}
 */
export function analyzeProps(params) {
	return new PropsAnalyzer(params);
}
