/**
 * @import { Prop, Props } from "../doc/type.ts";
 * @import { ParsedComponent } from "../parser/mod.ts";
 * @import { PropAnalysis } from "./prop.js";
 */

import { analyzeProperty } from "./prop.js";

class ComponentAnalyzer {
	/** @type {ParsedComponent} */
	#component;

	/** @param {ParsedComponent} component */
	constructor(component) {
		this.#component = component;
	}

	/** @returns {string | undefined} */
	get category() {
		return this.#component.tags?.find((t) => t.name === "category")?.content?.[0]?.text;
	}

	/** @returns {string | undefined} */
	get subcategory() {
		return this.#component.tags?.find((t) => t.name === "subcategory")?.content?.[0]?.text;
	}

	/** @type {Props | undefined} */
	#cached_props;
	/**
	 * Filters out legacy event handler props if the component is modern.
	 * Or filters out modern event handler props if the component is legacy.
	 * @returns {Props}
	 */
	get props() {
		if (this.#cached_props) return this.#cached_props;
		this.#cached_props = new Map(
			Iterator.from(this.#component.props).filter(([name, _prop]) => {
				if (this.#component.isLegacy) {
					return name.startsWith("on:") || (!name.startsWith("on") && name.at(2) !== ":");
				}
				return !name.startsWith("on:");
			}),
		);
		return this.#cached_props;
	}

	/** @type {Map<string, { prop: Prop, analysis: PropAnalysis }> | undefined} */
	#cached_analyzed_props;
	/**
	 * Cached map of analyzed props, for usage optimization purposes.
	 *
	 * @type {Map<string, { prop: Prop, analysis: PropAnalysis }>}
	 */
	get #analyzed_props() {
		if (this.#cached_analyzed_props) return this.#cached_analyzed_props;
		this.#cached_analyzed_props = new Map(
			Iterator.from(this.props).map(([name, prop]) => [
				name,
				{
					prop,
					analysis: analyzeProperty(prop, this.#component.types),
				},
			]),
		);
		return this.#cached_analyzed_props;
	}

	/**
	 * Map of properties which are Svelte snippets.
	 *
	 * @returns {Props}
	 */
	get snippets() {
		return new Map(
			Iterator.from(this.#analyzed_props)
				.filter(([_name, data]) => data.analysis.isSnippet)
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of properties related to events handling.
	 *
	 * @returns {Props}
	 */
	get eventHandlers() {
		return new Map(
			Iterator.from(this.#analyzed_props)
				.filter(([_name, data]) => data.analysis.isEventHandler)
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of properties related to accessibility.
	 *
	 * @returns {Props}
	 */
	get a11y() {
		return new Map(
			Iterator.from(this.#analyzed_props)
				.filter(([name, _data]) => name.startsWith("aria-"))
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}

	/**
	 * Map of properties related to data attributes.
	 *
	 * @returns {Props}
	 */
	get dataAttrs() {
		return new Map(
			Iterator.from(this.#analyzed_props)
				.filter(([name, _data]) => name.startsWith("data-"))
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
			Iterator.from(this.#analyzed_props)
				.filter(
					([name, _data]) =>
						// NOTE: Negation
						!(
							this.snippets.has(name) ||
							this.eventHandlers.has(name) ||
							this.a11y.has(name) ||
							this.dataAttrs.has(name)
						),
				)
				// TODO: Perhaps lets make `PropAnalysis` return also keys of `Prop`?
				.map(([name, data]) => [name, data.prop]),
		);
	}
}

/**
 * @param {ParsedComponent} component
 * @returns {ComponentAnalyzer}
 */
export function analyzeComponent(component) {
	return new ComponentAnalyzer(component);
}
