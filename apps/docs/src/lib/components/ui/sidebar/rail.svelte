<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	import { use } from "./context.svelte.ts";

	type Props = WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();

	const sidebar = use();
</script>

<button
	bind:this={ref}
	class={[
		"hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
		"[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
		"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
		"group-data-[collapsible=offcanvas]:hover:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
		"[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
		"[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
		class_
	]}
	onclick={() => sidebar.toggle()}
	tabindex={-1}
	title="Toggle Sidebar"
	data-sidebar="rail"
	aria-label="Toggle Sidebar"
	{...rest_props}
>
	{@render children?.()}
</button>
