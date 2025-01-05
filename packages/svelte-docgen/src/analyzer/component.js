/**
 * @import { ParsedComponent } from "../parser/mod.ts";
 */

import { analyzeProps } from "./props.js";

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

	/** @type {ReturnType<typeof analyzeProps> | undefined} */
	#cached_props;
	/**
	 * @see {@link analyzeProps}
	 * @returns {ReturnType<typeof analyzeProps>}
	 */
	get props() {
		if (this.#cached_props) return this.#cached_props;
		this.#cached_props = analyzeProps({
			props: this.#component.props,
			isLegacy: this.#component.isLegacy,
			types: this.#component.types,
		});
		return this.#cached_props;
	}
}

/**
 * @param {ParsedComponent} component
 * @returns {ComponentAnalyzer}
 */
export function analyzeComponent(component) {
	return new ComponentAnalyzer(component);
}
