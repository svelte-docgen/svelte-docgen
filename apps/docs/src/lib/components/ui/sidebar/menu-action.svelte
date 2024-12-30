<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends WithElementRef<HTMLButtonAttributes> {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		showonhover?: boolean;
	}
	let {
		// Custom
		child,
		ref = $bindable(null),
		showonhover = false,
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();

	const props = $derived({
		class: [
			"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-none transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
			// Increases the hit area of the button on mobile.
			"after:absolute after:-inset-2 after:md:hidden",
			"peer-data-[size=sm]/menu-button:top-1",
			"peer-data-[size=default]/menu-button:top-1.5",
			"peer-data-[size=lg]/menu-button:top-2.5",
			"group-data-[collapsible=icon]:hidden",
			showonhover &&
				"peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
			class_
		],
		"data-sidebar": "menu-action",
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
