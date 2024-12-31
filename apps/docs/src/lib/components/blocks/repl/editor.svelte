<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	// import type { Manager } from "./manager.svelte.ts";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		ref?: HTMLDivElement;
		// manager: Manager,
	}
	let {
		ref = $bindable(),
	}: Props = $props();
</script>

<div
	bind:this={ref}
	class="size-full"
></div>
