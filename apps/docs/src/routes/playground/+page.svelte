<script lang="ts">
	import { onMount, tick } from "svelte";
	import { queryParameters, ssp } from "sveltekit-search-params";

	import type { Context as EditorContext } from "$lib/components/blocks/editor/index.ts";
	import * as Repl from "$lib/components/blocks/repl/index.ts";

	import { Context } from "./context.svelte.ts";

	const default_input = `<script lang="ts">
	interface Props {
		/** Example description. */
		value?: number;
		group?: string[];
		presence: boolean | undefined;
		disabled?: boolean;
	}
	let {
		value = $bindable(0),
		group = $bindable<string[]>([]),
		presence = $bindable(false),
	}: Props = $props();
</` + `script>`;

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

	let ctx = $state<Context>();
	let ctx_editor = $state<EditorContext>();
	let docgen = $derived.by(() => {
		if (!ctx_editor || !ctx) return;
		return ctx.generate(ctx_editor.source.current);
	});

	onMount(async () => {
		ctx = await Context.init();
		await tick();
	});

	$effect(() => {
		params.input = ctx_editor?.source.current ?? null;
	});
</script>

<Repl.Root>
	{#snippet input()}
		<Repl.Input bind:context={ctx_editor} />
	{/snippet}

	{#snippet output()}
		{#if docgen}
			{#await docgen}
				<p>{"Generating..."}</p>
			{:then data}
				<Repl.Output {data} />
			{:catch error}
				<pre class="text-red-700">{error}</pre>
			{/await}
		{/if}
	{/snippet}
</Repl.Root>
