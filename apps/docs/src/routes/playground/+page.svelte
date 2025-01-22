<script lang="ts">
	import { Debounced } from "runed";
	import { onDestroy, onMount, tick } from "svelte";
	import { encode } from "svelte-docgen";
	import { queryParameters, ssp } from "sveltekit-search-params";

	import { afterNavigate } from "$app/navigation";
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

	let source = $state(params.input ?? "");
	let debounced_source = new Debounced(() => source, 400);
	let docgen = $state<Docgen>();
	let editor = $state<HTMLDivElement>();
	let ctx = $state<Repl.Context>();
	let parsed_component = $derived.by(() => {
		if (!ctx || !docgen) return;
		return docgen.generate(debounced_source.current);
	});

	function handle_editor_update(view_update: Parameters<Repl.EditorUpdateHandler>[0]) {
		if (view_update?.docChanged) {
			const stringified = view_update.state.doc.toString();
			source = stringified;
			params.input = stringified;
		}
	}

	onMount(async () => {
		if (!editor) throw new Error("Unreachable");
		ctx = new Repl.Context({
			editor,
			initial: source,
			on_update: handle_editor_update,
		});
		docgen = await Docgen.init();
		await tick();
	});
	onDestroy(() => {
		ctx?.destroy();
	});

	afterNavigate(() => {
		if (!ctx || source === params.input) return;
		ctx.view.dispatch({
			changes: {
				from: 0,
				to: source.length,
				insert: params.input ?? undefined,
			},
		});
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
				<pre>{encode(data, { indent: "\t" })}</pre>
			{:catch error}
				<pre class="text-red-700">{error}</pre>
			{/await}
		{/if}
	{/snippet}
</Repl.Root>
