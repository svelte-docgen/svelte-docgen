<script lang="ts">
	import { onMount } from "svelte";
	import { encode, type parse } from "svelte-docgen";

	import Editor from "../editor.svelte";
	import { Manager as EditorManager } from "../manager.svelte";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	let editor = $state<HTMLDivElement>();
	let encoded = $derived(encode(data, { indent: "\t" }));
	let manager: EditorManager;

	onMount(() => {
		if (!editor) throw new Error("Unreachable");
		manager = new EditorManager({ editor, initial: encoded, readonly: true, lang: "json" });
	});

	$effect(() => {
		manager?.view.dispatch({
			changes: {
				from: 0,
				to: manager.view.state.doc.length,
				insert: encoded,
			},
		});
	});
</script>

<Editor bind:ref={editor} />
