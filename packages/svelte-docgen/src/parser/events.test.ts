import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { parse } from "../mod.js";

describe("events", () => {
	it("returns empty map is component doesn't create custom events (legacy)", ({ expect }) => {
		const { events, isLegacy } = parse(
			`
			<script lang="ts">
				export let onclick = () => {};
			</script>

			<button on:click={onclick}>Click me</button>
			`,
			create_options("no-events.svelte"),
		);
		expect(isLegacy).toBe(true);
		expect(events).toMatchInlineSnapshot("Map {}");
		expect(events.size).toBe(0);
	});

	it("returns map with available custom events (legacy) prefixed with `on:`", ({ expect }) => {
		const { events, types, isLegacy } = parse(
			`
			<script lang="ts">
				import { createEventDispatcher } from "svelte";
				const dispatch = createEventDispatcher<{
					decrement: number;
					increment: number;
				}>();
				export let disabled = false;
			</script>

			<button {disabled} on:click={() => dispatch('decrement', 1)}>decrement</button>
			<button {disabled} on:click={() => dispatch('increment', 1)}>increment</button>
			`,
			create_options("legacy-events.svelte"),
		);
		expect(isLegacy).toBe(true);
		expect(events).toMatchInlineSnapshot(`
			Map {
			  "on:decrement" => "CustomEvent<number>",
			  "on:increment" => "CustomEvent<number>",
			}
		`);
		for (const key of events.keys()) {
			expect(key.startsWith("on:")).toBe(true);
			const event = events.get(key);
			expect(event).toBe("CustomEvent<number>");
		}
		expect(types.get("CustomEvent<number>")?.kind).toBe("constructible");
	});
});
