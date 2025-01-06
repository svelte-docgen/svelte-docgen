import { describe, expectTypeOf, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { analyze, parse } from "../mod.js";
import type { Events, Slots } from "../doc/type.ts";

describe("analyze", () => {
	it("typing works for legacy component", ({ expect }) => {
		const docgen = parse(
			`
			<script lang="ts">
				export let value: number;
			</script>
				`,
			create_options("analyze-legacy.svelte"),
		);
		const analyzed = analyze(docgen);
		expect(analyzed.isLegacy).toBe(true);
		if (analyzed.isLegacy) {
			expectTypeOf(analyzed.events).toMatchTypeOf<Events>();
			expectTypeOf(analyzed.slots).toMatchTypeOf<Slots>();
		} else {
			expectTypeOf<typeof analyzed.events>().toBeNever();
			expectTypeOf<typeof analyzed.slots>().toBeNever();
		}
	});

	it("typing works for modern component", ({ expect }) => {
		const docgen = parse(
			`
			<script lang="ts">
				interface Props {
					value?: number;
				}
				let props: Props = $props();
			</script>
				`,
			create_options("analyze-modern.svelte"),
		);
		const analyzed = analyze(docgen);
		expect(analyzed.isLegacy).toBe(false);
		if (analyzed.isLegacy) {
			expectTypeOf(analyzed.events).toMatchTypeOf<Events>();
			expectTypeOf(analyzed.slots).toMatchTypeOf<Slots>();
		} else {
			expectTypeOf<typeof analyzed.events>().toBeNever();
			expectTypeOf<typeof analyzed.slots>().toBeNever();
		}
	});
});
