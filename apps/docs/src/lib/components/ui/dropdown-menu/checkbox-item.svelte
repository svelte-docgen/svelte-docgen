<script lang="ts">
	import { DropdownMenu, type WithoutChildrenOrChild } from "bits-ui";
	import Check from "lucide-svelte/icons/check";
	import Minus from "lucide-svelte/icons/minus";
	import type { Snippet } from "svelte";

	interface Props extends WithoutChildrenOrChild<DropdownMenu.CheckboxItemProps> {
		children?: Snippet;
	}
	let {
		// Custom
		indeterminate = $bindable(false),
		ref = $bindable(null),
		// Native
		children: children_prop,
		checked = $bindable(false),
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<DropdownMenu.CheckboxItem
	bind:checked
	bind:indeterminate
	bind:ref
	class={[
		"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		class_
	]}
	{...rest_props}
>
	{#snippet children({ checked, indeterminate })}
		<span class="absolute left-2 flex size-3.5 items-center justify-center">
			{#if indeterminate}
				<Minus class="size-4" />
			{:else}
				 <!-- WARN: Lucide icons `class` prop doesn't accept `clsx` -->
				<Check class={`size-4${!checked ? " text-transparent" : ""}`} />
			{/if}
		</span>
		{@render children_prop?.()}
	{/snippet}
</DropdownMenu.CheckboxItem>
