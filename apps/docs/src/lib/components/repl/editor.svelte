<script lang="ts">
	import { EditorState, Transaction } from "@codemirror/state";
	import { EditorView } from "@codemirror/view";
	import { svelte } from "@replit/codemirror-lang-svelte";
	import { basicSetup } from "codemirror";
	import { onMount } from "svelte";

	import { Manager } from "./manager.svelte";

	interface Props {
		initial?: string;
		transaction?: Transaction;
	}
	let {
		initial = "",
		transaction = $bindable<Transaction>(),
	}: Props = $props();


	let container: HTMLDivElement;
	let view: EditorView;

	onMount(() => {
		view = new EditorView({
			dispatch(transaction_) {
				transaction = transaction_;
			},
			parent: container,
			state: EditorState.create({
				doc: initial,
				extensions: [basicSetup, svelte()],
			}),
		});
		return () => {
			view?.destroy();
		};
	});

	$effect(() => {
		if (transaction && transaction.docChanged) view.update([transaction]);

	});
</script>

<div bind:this={container} id="editor" class="size-full">
	<!-- TODO: -->
</div>
