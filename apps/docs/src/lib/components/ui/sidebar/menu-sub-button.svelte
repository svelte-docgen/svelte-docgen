<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	interface Props extends WithElementRef<HTMLAnchorAttributes> {
		active?: boolean;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		size?: "sm" | "md";
	}
	let {
		// Custom
		active,
		child,
		ref = $bindable(null),
		size = "md",
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();

	const props = $derived({
		class: [
			"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
			"data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
			size === "sm" && "text-xs",
			size === "md" && "text-sm",
			"group-data-[collapsible=icon]:hidden",
			class_
		],
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": active,
		...rest_props,
	}) satisfies Props;
</script>

{#if child}
	{@render child({ props: props })}
{:else}
	<a
		bind:this={ref}
		{...props}
	>
		{@render children?.()}
	</a>
{/if}
