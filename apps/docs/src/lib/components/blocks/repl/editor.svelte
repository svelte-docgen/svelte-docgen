<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		ref?: HTMLDivElement;
	}
	let { ref = $bindable() }: Props = $props();
</script>

<div bind:this={ref} class="h-full overflow-auto"></div>

<style>
	div {
		:global(.cm-editor) {
			height: inherit;
		}
		:global(.cm-lineNumbers) {
			width: 5ch;
		}
		:global(.cm-lineNumbers > .cm-gutterElement) {
			padding-inline: 0;
		}
	}
</style>
