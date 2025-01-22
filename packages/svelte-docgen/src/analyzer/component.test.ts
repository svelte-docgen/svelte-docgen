import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";
import { ComponentAnalyzer } from "./component.js";
import { PropsAnalyzer } from "./props.js";

describe(ComponentAnalyzer.name, () => {
	describe("getter .description", () => {
		it("works", ({ expect }) => {
			const parsed = parse(
				`
			<!--
				@component Example component description
			-->
			`,
				create_options("analyze-component-description.svelte"),
			);
			const { description } = new ComponentAnalyzer(parsed);
			expect(description).toBeDefined();
			if (description) {
				expect(description[0]?.text).toBe("Example component description");
			}
		});
	});

	describe("getter .tags", () => {
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
			const { tags } = new ComponentAnalyzer(parsed);
			const category = tags.find((tag) => tag.name === "category");
			expect(category).toBeDefined();
			expect(category?.content).toBeDefined();
			if (category && category.content) {
				expect(category.content[0]?.text).toBe("Atom");
			}
		});

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
			const { tags } = new ComponentAnalyzer(parsed);
			const subcategory = tags.find((tag) => tag.name === "subcategory");
			expect(subcategory).toBeDefined();
			expect(subcategory?.content).toBeDefined();
			if (subcategory && subcategory.content) {
				expect(subcategory.content[0]?.text).toBe("Native");
			}
		});
	});

	describe("getter .exports", () => {
		// FIXME: Reference: https://github.com/svelte-docgen/svelte-docgen/issues/4
		it.fails("works", ({ expect }) => {
			const parsed = parse(
				`
			<script module>
				export const ID = "svelte-docgen";
			</script>
			`,
				create_options("analyze-component-exports.svelte"),
			);
			const { exports } = new ComponentAnalyzer(parsed);
			expect(exports).toBeDefined();
			expect(exports.size).toBe(1);
		});
	});

	describe("getter .events", () => {
		it("works for legacy component", ({ expect }) => {
			const parsed = parse(
				`
			<script lang="ts">
				import { createEventDispatcher } from "svelte";
				const dispatch = createEventDispatcher<{
					decrement: number;
					increment: number;
				}>();
				export let disabled = false;
			</script>
			`,
				create_options("analyze-component-events-legacy.svelte"),
			);
			const analyzed = new ComponentAnalyzer(parsed);
			expect(analyzed.isLegacy).toBe(true);
			expect(() => analyzed.events).not.toThrowError();
			expect(analyzed.events).toBeDefined();
			expect(analyzed.events.size).toBe(2);
		});

		it("throws error in modern component", ({ expect }) => {
			const parsed = parse(
				`
			<script lang="ts">
				interface Props {
					onclick: () => void;
				}
				let props: Props = $props();
			</script>
			`,
				create_options("analyze-component-events-modern.svelte"),
			);
			const analyzed = new ComponentAnalyzer(parsed);
			expect(analyzed.isLegacy).toBe(false);
			expect(() => analyzed.events).toThrowErrorMatchingInlineSnapshot(
				`[Error: This component is not a legacy component!]`,
			);
		});
	});

	describe("getter .props", () => {
		it("works for legacy component", ({ expect }) => {
			const parsed = parse(
				`
			<script lang="ts">
				export let value: number;
			</script>
			`,
				create_options("analyze-component-props-legacy.svelte"),
			);
			const analyzed = new ComponentAnalyzer(parsed);
			expect(analyzed.isLegacy).toBe(true);
			expect(analyzed.props).toBeInstanceOf(PropsAnalyzer);
			expect(analyzed.props.all.size).toBe(1);
		});

		it("works for modern component", ({ expect }) => {
			const parsed = parse(
				`
			<script lang="ts">
				interface Props {
					value?: number;
				}
				let props: Props = $props();
			</script>
			`,
				create_options("analyze-component-props-modern.svelte"),
			);
			const analyzed = new ComponentAnalyzer(parsed);
			expect(analyzed.isLegacy).toBe(false);
			expect(analyzed.props).toBeInstanceOf(PropsAnalyzer);
			expect(analyzed.props.all.size).toBe(1);
		});
	});

	describe("getter .slots", () => {
		it("works for legacy component", ({ expect }) => {
			const parsed = parse(
				`
			<slot />
			`,
				create_options("analyze-component-slots-legacy.svelte"),
			);
			const analyzed = new ComponentAnalyzer(parsed);
			expect(analyzed.isLegacy).toBe(true);
			expect(() => analyzed.slots).not.toThrowError();
			expect(analyzed.slots).toBeDefined();
			expect(analyzed.slots.size).toBe(1);
		});

		it("throws error in modern component", ({ expect }) => {
			const parsed = parse(
				`
			<script lang="ts">
				import type { Snippet } from "svelte";
				interface Props {
					children: Snippet;
				}
				let props: Props = $props();
			</script>
			`,
				create_options("analyze-component-slots-modern.svelte"),
			);
			const analyzed = new ComponentAnalyzer(parsed);
			expect(analyzed.isLegacy).toBe(false);
			expect(() => analyzed.slots).toThrowErrorMatchingInlineSnapshot(
				`[Error: This component is not a legacy component!]`,
			);
		});
	});
});
