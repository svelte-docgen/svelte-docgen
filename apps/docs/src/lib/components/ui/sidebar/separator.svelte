<script lang="ts">
	import type { ComponentProps } from "svelte";

	import { Separator } from "$lib/components/ui/separator/index.ts";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	bind:ref
	class={["bg-sidebar-border mx-2 w-auto", class_]}
	data-sidebar="separator"
	{...rest_props}
/>
