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

	const parsed_modern = parse(
		`
				<script lang="ts">
					import type { HTMLButtonAttributes } from "svelte/elements";

					interface Props extends HTMLButtonAttributes {}
					let props: Props = $props();
				</script>
				`,
		create_options("analyze-component-props-modern.svelte"),
	);
	const parsed_legacy = parse(
		`
			<script lang="ts">
				import type { HTMLButtonAttributes } from "svelte/elements";

				type $$Props = HTMLButtonAttributes;
				export let disabled: boolean | null | undefined = undefined;
			</script>
			`,
		create_options("analyze-component-props.svelte"),
	);

	describe("getter .props", () => {
		it("when component is legacy, modern event handlers are omitted", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_legacy);
			const { props } = analyzer;
			expect(props.get("on:click")).toBeDefined();
			expect(props.get("onclick")).not.toBeDefined();
			expect(props.get("disabled")).toBeDefined();
		});

		it("when component is not legacy (modern), legacy event handlers are omitted", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_modern);
			const { props } = analyzer;
			expect(props.get("onclick")).toBeDefined();
			expect(props.get("on:click")).not.toBeDefined();
			expect(props.get("disabled")).toBeDefined();
		});
	});

	describe("getter .snippets", () => {
		it("returns filtered props map which are snippets only", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_modern);
			const { snippets } = analyzer;
			expect(snippets.size).toBe(1);
			expect(snippets.get("children")).toBeDefined();
		});
	});

	describe("getter .eventHandlers", () => {
		it("returns filtered props map which are event handlers only", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_modern);
			const { eventHandlers } = analyzer;
			expect(eventHandlers.size).toBe(214);
			expect(eventHandlers.get("onchange")).toBeDefined();
		});
	});

	describe("getter .a11y", () => {
		it("returns filtered props map which are ARIA related only", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_modern);
			const { a11y } = analyzer;
			expect(a11y.size).toBe(48);
			expect(a11y.get("aria-label")).toBeDefined();
		});
	});

	describe("getter .dataAttrs", () => {
		it("returns filtered props map which are data attributes only", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_modern);
			const { dataAttrs } = analyzer;
			expect(dataAttrs.size).toBe(6);
			expect(dataAttrs.get("data-sveltekit-preload-data")).toBeDefined();
		});
	});

	describe("getter .uncategorized", () => {
		it("returns filtered props map which doesn't belong to any common category", ({ expect }) => {
			const analyzer = analyzeComponent(parsed_modern);
			const { uncategorized } = analyzer;
			expect(uncategorized.size).toBe(65);
			expect(uncategorized.get("disabled")).toBeDefined();
		});
	});
});
