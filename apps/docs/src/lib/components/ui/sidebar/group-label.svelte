<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends WithElementRef<HTMLAttributes<HTMLDivElement>> {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	}
	let {
		// Custom
		child,
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();

	const props = $derived({
		class: [
			"text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
			"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
			class_
		],
		"data-sidebar": "group-label",
		...rest_props,
	}) satisfies Props;
</script>

{#if child}
	{@render child({ props })}
{:else}
	<div
		bind:this={ref}
		{...props}
	>
		{@render children?.()}
	</div>
{/if}
