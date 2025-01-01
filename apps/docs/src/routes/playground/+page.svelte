<script lang="ts">
	import { onMount } from "svelte";
	import { encode } from "svelte-docgen";
	import { queryParameters, ssp } from "sveltekit-search-params";

	import * as Repl from "$lib/components/blocks/repl/index.ts";

	import { generate_docgen } from "./util.ts";

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
	let source = $derived(manager?.source.current ?? "");
	let docgen = $derived(generate_docgen(manager));

	onMount(() => {
		if (!editor) throw new Error("Unreachable");
		manager = new Repl.Manager({ editor, initial: params.input ?? "" });
		return () => {
			manager?.destroy();
		};
	});

	$effect(() => {
		params.input = source;
	});
</script>

<Repl.Root>
	{#snippet input()}
		<Repl.Editor bind:ref={editor} />
	{/snippet}

	{#snippet output()}
		<!-- TODO: Add error output -->
		<!-- {#if error} -->
		<!-- 	<pre style="color: red;">{error}</pre> -->
		<!-- {/if} -->
		{#await docgen}
			<p>Loading...</p>
		{:then data}
			{encode(data, { indent: "\t" })}
		{/await}
	{/snippet}
</Repl.Root>
