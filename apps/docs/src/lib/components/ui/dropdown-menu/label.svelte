<script lang="ts">
	import { type WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends WithElementRef<HTMLAttributes<HTMLDivElement>> {
		inset?: boolean;
	}
	let {
		// Custom
		inset,
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<div
	bind:this={ref}
	class={["px-2 py-1.5 text-sm font-semibold", inset && "pl-8", class_]}
	{...rest_props}
>
	{@render children?.()}
</div>
