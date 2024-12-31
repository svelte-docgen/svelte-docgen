<script lang="ts">
	import { onMount } from "svelte";
	import { queryParameters, ssp } from "sveltekit-search-params";
	import ts from "typescript";
	import * as tsvfs from "@typescript/vfs";

	import * as Repl from "$lib/components/blocks/repl/index.ts";

	import { prepareDocgen, COMPILER_OPTIONS } from "./demo";

	const params = queryParameters({
		input: {
			decode(v) {
				if (v) return ssp.lz().decode(v);
			},
			encode(v) {
				return ssp.lz().encode(v);
			},
		},
	});

	let editor = $state<HTMLDivElement>();
	let manager = $state<Repl.Manager>();
	let docgen = $derived.by(async () => {
		if (!manager) throw new Error("Unreachable");
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
		return prepareDocgen(fsmap)(manager.source.current);
	});

	onMount(() => {
		if (!editor) throw new Error("Unreachable");
		manager = new Repl.Manager({ editor, initial: params.input });
		return () => {
			manager?.destroy();
		};
	});

	$effect(() => {
		params.input = manager?.source.current ?? null;
	});
</script>

<Repl.Root>
	{#snippet input()}
		<Repl.Editor bind:ref={editor} />
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
