<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	import { Skeleton } from "$lib/components/ui/skeleton/index.ts";

	interface Props extends WithElementRef<HTMLAttributes<HTMLDivElement>> {
		showicon?: boolean;
	}
	let {
		// Custom
		ref = $bindable(null),
		showicon = false,
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();

	// Random width between 50% and 90%
	const width = `${Math.floor(Math.random() * 40) + 50}%`;
</script>

<div
	bind:this={ref}
	class={["flex h-8 items-center gap-2 rounded-md px-2", class_]}
	data-sidebar="menu-skeleton"
	{...rest_props}
>
	{#if showicon}
		<Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
	{/if}
	<Skeleton
		class="h-4 max-w-[--skeleton-width] flex-1"
		style="--skeleton-width: {width};"
		data-sidebar="menu-skeleton-text"
	/>
	{@render children?.()}
</div>
