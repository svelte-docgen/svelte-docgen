<script lang="ts">
	import { Separator } from "bits-ui";

	let {
		// Custom
		orientation = "horizontal",
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Separator.RootProps = $props();
</script>

<Separator.Root
	bind:ref
	class={[
		"bg-border shrink-0",
		orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]",
		class_
	]}
	{orientation}
	{...rest_props}
/>
