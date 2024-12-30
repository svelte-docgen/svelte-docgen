<script lang="ts">
	import type { ComponentProps } from "svelte";

	import { Input } from "$lib/components/ui/input/index.ts";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		value = $bindable(""),
		...rest_props
	}: ComponentProps<typeof Input> = $props();
</script>

<Input
	bind:ref
	bind:value
	class={[
		"bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2",
		class_
	]}
	data-sidebar="input"
	{...rest_props}
/>
