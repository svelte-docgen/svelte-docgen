<script module>
	export const frontmatter = {
		title : "Playground",
		description : "Play and test svelte-docgen in the browser.",
	}
</script>

<script lang="ts">
	import { Debounced } from "runed";
	import ts from "typescript";
	import { Tabs, TabPanel } from "@sveltepress/theme-default/components"
	import * as tsvfs from "@typescript/vfs";

	import { browser } from "$app/environment";
	import Editor from "$lib/components/editor/editor.svelte"

	import { prepareDocgen, COMPILER_OPTIONS } from "./demo.ts";
	import initial from "./initial.svelte?raw";

	let source = $state(initial);
	let docgen: ((source: string) => string) | undefined = $state();
	let debounced_source = new Debounced(() => source, 500);
	let encoded = $state("");
	let error: string = $state("");

	if (browser) {
		(async () => {
			const fsmap = await tsvfs.createDefaultMapFromCDN(
				COMPILER_OPTIONS,
				ts.version,
				false,
				ts,
				// lzstring
			);

			for (const [k, v] of Object.entries(
				import.meta.glob("/node_modules/svelte/**/*.d.ts", { query: "?raw", exhaustive: true, eager: true }),
			)) {
				// @ts-expect-error: v is a string
				fsmap.set(k, v.default);
			}

			docgen = prepareDocgen(fsmap);
		})();
	}

	$effect(() => {
		if (!docgen) return;
		try {
			encoded = docgen(debounced_source.current);
			error = "";
		} catch (e) {
			error = String(e);
			throw e;
		}
	});
</script>

<Tabs activeName="Source code">
	<TabPanel name="Source code">
		<Editor {initial} />
		{#if error}
			<pre style="color: red;">{error}</pre>
		{/if}
	</TabPanel>

	<TabPanel name="Documentation">
		<p>A pretty documentation output will be here</p>
	</TabPanel>

	<TabPanel name="Raw docgen">
		{#if docgen}
			<pre>{encoded}</pre>
		{:else}
			loading docgen...
		{/if}
	</TabPanel>
</Tabs>
