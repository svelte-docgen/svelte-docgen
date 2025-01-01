<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { encode } from "svelte-docgen";
	import { queryParameters, ssp } from "sveltekit-search-params";

	import * as Repl from "$lib/components/blocks/repl/index.ts";

	import { Docgen } from "./docgen.svelte.ts";

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

	const docgen = new Docgen();

	let editor = $state<HTMLDivElement>();
	let manager = $state<Repl.Manager>();
	let parsed_component = $derived.by(() => {
		if (!manager) return;
		return docgen.generate(manager.source.current);
	});

	onMount(async () => {
		if (!editor) throw new Error("Unreachable");
		manager = new Repl.Manager({ editor, initial: params.input ?? "" });
		await docgen.init();
	});
	onDestroy(() => {
		manager?.destroy();
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
			{#if parsed_component}
				{#await parsed_component}
					<p>{"Generating..."}</p>
				{:then data}
					<pre>{encode(data, { indent: "\t"})}</pre>
				{:catch error}
					<pre class="text-red-700">{error}</pre>
				{/await}
			{/if}
	{/snippet}
</Repl.Root>
