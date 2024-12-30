<script lang="ts">
	import { Transaction } from "@codemirror/state";
	import { Debounced } from "runed";
	import ts from "typescript";
	import * as tsvfs from "@typescript/vfs";

	import * as Repl from "$lib/components/repl/index.ts";

	import { browser } from "$app/environment";

	import { prepareDocgen, COMPILER_OPTIONS } from "./demo";
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

<Repl.Root>
	{#snippet input()}
		<Repl.Editor bind:transaction initial={source?.current ?? initial} />
	{/snippet}

	{#snippet output()}
		{#await docgen}
			<p>Loading...</p>
		{:then data}
			{#if data}
				{JSON.stringify(data, undefined, 2)}
			{/if}
		{/await}
	{/snippet}
</Repl.Root>


<!-- {#if error} -->
<!-- 	<pre style="color: red;">{error}</pre> -->
<!-- {/if} -->
