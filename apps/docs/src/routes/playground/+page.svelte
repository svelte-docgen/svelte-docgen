<script lang="ts">
	import { onMount } from "svelte";
	import { encode } from "svelte-docgen";
	import { queryParameters, ssp } from "sveltekit-search-params";

	import * as Repl from "$lib/components/blocks/repl/index.ts";

	import { generate_docgen } from "./docgen.ts";

	const params = queryParameters({
		input: {
			decode(v) {
				return ssp.lz().decode(v) as string;
			},
			encode(v) {
				return ssp.lz().encode(v);
			},
		},
	});

	let editor = $state<HTMLDivElement>();
	let manager = $state<Repl.Manager>();
	let docgen = $derived.by(() => {
		if (!manager) return;
		return generate_docgen(manager.source.current);
	});

	onMount(() => {
		if (!editor) throw new Error("Unreachable");
		manager = new Repl.Manager({ editor, initial: params.input ?? "" });
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
		{#if docgen}
			{#await docgen}
				<p>Loading...</p>
			{:then data}
				{encode(data, { indent: "\t" })}
			{:catch error}
				<pre class="text-red-700">{error}</pre>
			{/await}
		{/if}
	{/snippet}
</Repl.Root>
