<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	interface Props extends DropdownMenu.ItemProps {
		inset?: boolean;
	}
	let {
		// Custom
		inset,
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<DropdownMenu.Item
	bind:ref
	class={[
		"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
		inset && "pl-8",
		class_
	]}
	{...rest_props}
/>
