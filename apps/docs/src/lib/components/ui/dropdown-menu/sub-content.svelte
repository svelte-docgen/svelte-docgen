<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: DropdownMenu.SubContentProps = $props();
</script>

<DropdownMenu.SubContent
	bind:ref
	class={[
		"bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-lg focus:outline-none",
		class_
	]}
	{...rest_props}
/>
