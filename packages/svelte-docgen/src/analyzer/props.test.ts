import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";

import { analyzeProps } from "./props.js";

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

describe(analyzeProps.name, () => {
	describe("getter .all", () => {
		it("when component is legacy, modern event handlers are omitted", ({ expect }) => {
			const analyzer = analyzeProps(parsed_legacy);
			const { all } = analyzer;
			expect(all.get("on:click")).toBeDefined();
			expect(all.get("onclick")).not.toBeDefined();
			expect(all.get("disabled")).toBeDefined();
		});

		it("when component is not legacy (modern), legacy event handlers are omitted", ({ expect }) => {
			const analyzer = analyzeProps(parsed_modern);
			const { all } = analyzer;
			expect(all.get("onclick")).toBeDefined();
			expect(all.get("on:click")).not.toBeDefined();
			expect(all.get("disabled")).toBeDefined();
		});
	});

	describe("getter .aria", () => {
		it("returns filtered props map which are ARIA related only", ({ expect }) => {
			const analyzer = analyzeProps(parsed_modern);
			const { aria } = analyzer;
			expect(aria.size).toBe(48);
			expect(aria.get("aria-label")).toBeDefined();
		});
	});

	describe("getter .data", () => {
		it("returns filtered props map which are data attributes only", ({ expect }) => {
			const analyzer = analyzeProps(parsed_modern);
			const { data } = analyzer;
			expect(data.size).toBe(6);
			expect(data.get("data-sveltekit-preload-data")).toBeDefined();
		});
	});

	describe("getter .events", () => {
		it("returns filtered props map which are event handlers only", ({ expect }) => {
			const analyzer = analyzeProps(parsed_modern);
			const { events } = analyzer;
			expect(events.size).toBe(214);
			expect(events.get("onchange")).toBeDefined();
		});
	});

	describe("getter .snippets", () => {
		it("returns filtered props map which are snippets only", ({ expect }) => {
			const analyzer = analyzeProps(parsed_modern);
			const { snippets } = analyzer;
			expect(snippets.size).toBe(1);
			expect(snippets.get("children")).toBeDefined();
		});
	});

	describe("getter .uncategorized", () => {
		it("returns filtered props map which doesn't belong to any common category", ({ expect }) => {
			const analyzer = analyzeProps(parsed_modern);
			const { uncategorized } = analyzer;
			expect(uncategorized.size).toBe(65);
			expect(uncategorized.get("disabled")).toBeDefined();
		});
	});
});
