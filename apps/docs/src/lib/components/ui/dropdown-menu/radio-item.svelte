<script lang="ts">
	import { DropdownMenu, type WithoutChild } from "bits-ui";
	import Circle from "lucide-svelte/icons/circle";

	type Props = WithoutChild<DropdownMenu.RadioItemProps>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children: children_prop,
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<DropdownMenu.RadioItem
	bind:ref
	class={[
		"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		class_
	]}
	{...rest_props}
>
	{#snippet children({ checked })}
		<span class="absolute left-2 flex size-3.5 items-center justify-center">
			{#if checked}
				<Circle class="size-2 fill-current" />
			{/if}
		</span>
		{@render children_prop?.({ checked })}
	{/snippet}
</DropdownMenu.RadioItem>
