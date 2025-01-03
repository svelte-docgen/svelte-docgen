import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { extract } from "./mod.js";

describe("defaults", () => {
	it("returns empty map when no defaults for props are found", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
				}
				let { id }: Props = $props();
			</script>
			<button {id}>Click me</button>
		`;
		const { defaults } = extract(source, create_options("empty-defaults.svelte"));
		expect(defaults).toHaveLength(0);
	});

	it("returns a map with [name, type] from destructuring `$props()` rune call", ({ expect }) => {
		const source = `
			<script lang="ts">
				import type { MouseEventHandler } from "svelte/elements";
				interface Props {
					id?: string;
					class?: string;
					onclick?: MouseEventHandler<HTMLButtonElement>;
					disabled?: boolean;
				}
				let {
					id = "button-123",
					class: className = "primary",
					onclick = () => {},
					disabled,
				}: Props = $props();
			</script>
			<button {id} {onclick} {disabled}>Click me</button>
		`;
		const { defaults } = extract(source, create_options("modern-defaults.svelte"));
		expect(defaults).toHaveLength(3);
		expect(defaults.get("id")?.getText()).toMatchInlineSnapshot(`""button-123""`);
		expect(defaults.get("class")?.getText()).toMatchInlineSnapshot(`""primary""`);
		expect(defaults.get("onclick")?.getText()).toMatchInlineSnapshot(`"() => {}"`);
		expect(defaults.has("disabled")).toBe(false);
	});

	it("returns a map with [name, type] from gathering legacy `export let` syntax", ({ expect }) => {
		const source = `
			<script lang="ts">
				export let name = "Chuck";
				export let id = 42;
				export let age: number;
			</script>
			<h1>Hello {name}!</h1>
			<p>Your badge ID is: \${id}</p>
			<p>And your age is: \${age}</p>
		`;
		const { defaults } = extract(source, create_options("legacy-defaults.svelte"));
		expect(defaults).toHaveLength(2);
		expect(defaults.get("id")?.getText()).toMatchInlineSnapshot(`"42"`);
		expect(defaults.get("name")?.getText()).toMatchInlineSnapshot(`""Chuck""`);
		expect(defaults.has("age")).toBe(false);
	});
});
