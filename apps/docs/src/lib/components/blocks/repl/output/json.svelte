<script lang="ts">
	import { encode, type parse } from "svelte-docgen";

	import { type Context as EditorContext, Editor } from "$lib/components/blocks/editor/index.ts";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	let editor = $state<EditorContext>();
	let encoded = $derived(encode(data, { indent: "\t" }));

	$effect(() => {
		editor?.view.dispatch({
			changes: {
				from: 0,
				to: editor.view.state.doc.length,
				insert: encoded,
			},
		});
	});
</script>

<Editor bind:context={editor} lang="json" readonly />
