<script module lang="ts">
	export const frontmatter = {
		title: "Playground",
		description: "Play and test svelte-docgen in the browser.",
	};
</script>

<script lang="ts">
	import { Transaction } from "@codemirror/state";
	import { Tabs, TabPanel } from "@sveltepress/theme-default/components";
	import JSONTree from "@sveltejs/svelte-json-tree";
	import * as tsvfs from "@typescript/vfs";
	import { Debounced } from "runed";
	import ts from "typescript";

	import { browser } from "$app/environment";
	import Editor from "$lib/components/editor/editor.svelte";

	import { prepareDocgen, COMPILER_OPTIONS } from "./demo.ts";
	import initial from "./initial.svelte?raw";

	let transaction = $state<Transaction>();
	let source = new Debounced(() => transaction?.newDoc.toString() ?? initial, 500);
	let docgen = $derived.by(async () => {
		if (browser && source.current) { // FIXME:: is this check necessary? derived AFAIK always runs in browser
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
			return prepareDocgen(fsmap)(source.current);
		}
	});
</script>

<Tabs activeName="Source code">
	<TabPanel name="Source code">
		<Editor bind:transaction initial={source.current ?? initial} />
		<!-- {#if error} -->
		<!-- 	<pre style="color: red;">{error}</pre> -->
		<!-- {/if} -->
	</TabPanel>

	<TabPanel name="Documentation">
		{#await docgen}
			<p>Loading...</p>
		{:then doc}
			{#if doc?.description && doc?.isLegacy}
				{doc.description}
			{/if}
			<p><strong>Description</strong></p>
			<p>A pretty documentation output will be here</p>
		{/await}
	</TabPanel>

	<TabPanel name="Raw data">
		{#await docgen}
			<p>Loading...</p>
		{:then doc}
			{#if doc}
				<JSONTree value={{
					props: doc.props,
					types: doc.types,
				}} />
			{/if}
		{/await}
	</TabPanel>
</Tabs>
