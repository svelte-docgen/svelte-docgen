<script lang="ts">
	import { DropdownMenu, type WithoutChild } from "bits-ui";
	import ChevronRight from "lucide-svelte/icons/chevron-right";

	interface Props extends WithoutChild<DropdownMenu.SubTriggerProps> {
		inset?: boolean;
	}
	let {
		// Custom
		inset,
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<DropdownMenu.SubTrigger
	bind:ref
	class={[
		"data-[highlighted]:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		inset && "pl-8",
		class_
	]}
	{...rest_props}
>
	{@render children?.()}
	<ChevronRight class="ml-auto" />
</DropdownMenu.SubTrigger>
