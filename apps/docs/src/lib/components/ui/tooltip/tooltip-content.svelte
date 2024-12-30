<script lang="ts">
	import { Tooltip } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		sideOffset = 4,
		// Native
		class: class_,
		...rest_props
	}: Tooltip.ContentProps = $props();
</script>

<Tooltip.Content
	bind:ref
	class={[
		"bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs",
		class_
	]}
	{sideOffset}
	{...rest_props}
/>
