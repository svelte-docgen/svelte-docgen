<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends WithElementRef<HTMLButtonAttributes> {
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
			"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-none transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
			// Increases the hit area of the button on mobile.
			"after:absolute after:-inset-2 after:md:hidden",
			"group-data-[collapsible=icon]:hidden",
			class_
		],
		"data-sidebar": "group-action",
		...rest_props,
	}) satisfies Props;
</script>

{#if child}
	{@render child({ props })}
{:else}
	<button
		bind:this={ref}
		{...props}
	>
		{@render children?.()}
	</button>
{/if}
