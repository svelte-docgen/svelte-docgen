import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";
import { analyzeComponent } from "./component.js";

describe(analyzeComponent.name, () => {
	describe("getter .category", () => {
		it("extracts defined `@category` from component description", ({ expect }) => {
			const parsed = parse(
				`
			<!--
				@component
				@category Atom
			-->
			`,
				create_options("analyze-component-category.svelte"),
			);
			const { category } = analyzeComponent(parsed);
			expect(category).toBeDefined();
			expect(category).toBe("Atom");
		});
	});

	describe("getter .subcategory", () => {
		it("extracts defined `@subcategory` from component description", ({ expect }) => {
			const parsed = parse(
				`
				<!--
					@component
					@subcategory Native
				-->
				`,
				create_options("analyze-component-subcategory.svelte"),
			);
			const { subcategory } = analyzeComponent(parsed);
			expect(subcategory).toBeDefined();
			expect(subcategory).toBe("Native");
		});
	});
});
