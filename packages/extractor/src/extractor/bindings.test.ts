import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { extract } from "./mod.js";

describe("bindings", () => {
	it("returns empty set when no bindable props are found", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
				}
				let { id }: Props = $props();
			</script>
			<input {id} type="text" />
		`;
		const { bindings } = extract(source, create_options("no-bindings.svelte"));
		expect(bindings).toHaveLength(0);
	});

	it("returns set with name of a single bindable prop", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
					value?: string;
				}
				let {
					id,
					value = $bindable(),
				}: Props = $props();
			</script>
			<input {id} bind:value />
		`;
		const { bindings } = extract(source, create_options("single-bindings.svelte"));
		expect(bindings).toHaveLength(1);
		expect(bindings).toContain("value");
	});

	it("returns set with names of multiple bindable props", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
					value?: string;
					borderBoxSize?: ResizeObserverSize[];
				}
				let {
					id,
					borderBoxSize = $bindable(),
					value = $bindable(),
				}: Props = $props();
			</script>
			<input {id} bind:value bind:borderBoxSize />
		`;
		const { bindings } = extract(source, create_options("multiple-bindings.svelte"));
		expect(bindings).toHaveLength(2);
		expect(bindings).toContain("value");
		expect(bindings).toContain("borderBoxSize");
	});

	it("bindable props from extended one with prefix 'bind:*' are included, and the prefix is removed", ({
		expect,
	}) => {
		const source = `
			<script lang="ts">
				import type { HTMLInputAttributes } from "svelte/elements";
				interface Props extends HTMLInputAttributes {}
				let props: Props = $props();
			</script>
		`;
		const { bindings } = extract(source, create_options("extended-bindings.svelte"));
		expect(bindings.size).toBeGreaterThan(0);
		expect(bindings).toMatchInlineSnapshot(`
			Set {
			  "checked",
			  "value",
			  "group",
			  "files",
			  "indeterminate",
			  "innerHTML",
			  "textContent",
			  "innerText",
			  "contentRect",
			  "contentBoxSize",
			  "borderBoxSize",
			  "devicePixelContentBoxSize",
			}
		`);
		expect(bindings).toContain("innerHTML");
		expect(bindings).not.toContain("bind:innerHTML");
	});
});
