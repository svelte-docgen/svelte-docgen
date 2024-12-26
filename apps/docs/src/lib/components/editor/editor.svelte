<script lang="ts">
	import { EditorView } from "@codemirror/view";
	import { svelte } from "@replit/codemirror-lang-svelte";
	import { basicSetup } from "codemirror";
	import { onMount } from "svelte";

	interface Props {
		initial?: string;
	}
	let {
		//
		initial = "",
	}: Props = $props();

	let container: HTMLDivElement;
	let view: EditorView;

	onMount(() => {
		view = new EditorView({
			parent: container,
			doc: initial,
			extensions: [basicSetup,svelte()],
		});
		return () => {
			view.destroy();
		};
	});
</script>

<div
	bind:this={container}
	id="editor"
	class="container"
>
<!-- TODO: -->
</div>
