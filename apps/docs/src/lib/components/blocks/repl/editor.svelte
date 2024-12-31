<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		ref?: HTMLDivElement;
	}
	let { ref = $bindable() }: Props = $props();
</script>

<div bind:this={ref} class="size-full">
	<!-- TODO:-->
</div>
