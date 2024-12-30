<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	import * as Sheet from "$lib/components/ui/sheet/index.ts";

	import { WIDTH_MOBILE } from "./constants.ts";
	import { use } from "./context.svelte.ts";

	interface Props extends WithElementRef<HTMLAttributes<HTMLDivElement>> {
		collapsible?: "offcanvas" | "icon" | "none";
		side?: "left" | "right";
		variant?: "sidebar" | "floating" | "inset";
	}
	let {
		// Custom
		collapsible = "offcanvas",
		ref = $bindable(null),
		side = "left",
		variant = "sidebar",
		// Native
		class: class_,
		children,
		...rest_props
	}: Props = $props();

	const sidebar = use();
</script>

{#if collapsible === "none"}
	<div
		bind:this={ref}
		class={[
			"bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col",
			class_
		]}
		{...rest_props}
	>
		{@render children?.()}
	</div>
{:else if sidebar.is_mobile}
	<Sheet.Root
		controlledOpen
		open={sidebar.open_mobile}
		onOpenChange={sidebar.set_open_mobile}
		{...rest_props}
	>
		<Sheet.Content
			data-sidebar="sidebar"
			data-mobile="true"
			class="bg-sidebar text-sidebar-foreground w-[--sidebar-width] p-0 [&>button]:hidden"
			style="--sidebar-width: {WIDTH_MOBILE};"
			{side}
		>
			<div class="flex h-full w-full flex-col">
				{@render children?.()}
			</div>
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<div
		bind:this={ref}
		class="text-sidebar-foreground group peer hidden md:block"
		data-state={sidebar.state}
		data-collapsible={sidebar.state === "collapsed" ? collapsible : ""}
		data-variant={variant}
		data-side={side}
	>
		<!-- This is what handles the sidebar gap on desktop -->
		<div
			class={[
				"relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
				"group-data-[collapsible=offcanvas]:w-0",
				"group-data-[side=right]:rotate-180",
				variant === "floating" || variant === "inset"
					? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
					: "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
			]}
		></div>
		<div
			class={[
				"fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
				side === "left"
					? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
					: "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
				// Adjust the padding for floating and inset variants.
				variant === "floating" || variant === "inset"
					? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
					: "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
				class_
			]}
			{...rest_props}
		>
			<div
				data-sidebar="sidebar"
				class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
