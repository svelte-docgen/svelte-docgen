<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const VARIANTS = tv({
		base: "peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline:
					"bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
			size: {
				default: "h-8 text-sm",
				sm: "h-7 text-xs",
				lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type Variant = VariantProps<typeof VARIANTS>["variant"];
	export type Size = VariantProps<typeof VARIANTS>["size"];
</script>

<script lang="ts">
	import { mergeProps, type WithElementRef, type WithoutChildrenOrChild } from "bits-ui";
	import type { ComponentProps, Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	import { use } from "./context.svelte.ts";

	interface Props extends WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
		active?: boolean;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		size?: Size;
		tooltip?: Snippet;
		tooltip_props?: WithoutChildrenOrChild<ComponentProps<typeof Tooltip.Content>>;
		variant?: Variant;
	}
	let {
		// Custom
		active = false,
		child,
		ref = $bindable(null),
		variant = "default",
		size = "default",
		tooltip,
		tooltip_props,
		// Native
		children,
		class: class_,
		...restProps
	}: Props = $props();

	const sidebar = use();

	const default_props = $derived({
		class: [VARIANTS({ variant, size }), class_],
		"data-active": active,
		"data-sidebar": "menu-button",
		"data-size": size,
		...restProps,
	}) satisfies Props;
</script>

{#snippet Button({ props }: { props?: Record<string, unknown> })}
	{@const merged_props = mergeProps(default_props, props)}
	{#if child}
		{@render child({ props: merged_props })}
	{:else}
		<button
			bind:this={ref}
			{...merged_props}
		>
			{@render children?.()}
		</button>
	{/if}
{/snippet}

{#if !tooltip}
	{@render Button({})}
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{@render Button({ props })}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content
			align="center"
			children={tooltip}
			hidden={sidebar.state !== "collapsed" || sidebar.is_mobile}
			side="right"
			{...tooltip_props}
		/>
	</Tooltip.Root>
{/if}
