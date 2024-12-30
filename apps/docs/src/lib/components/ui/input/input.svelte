<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLInputAttributes>;
	let {
		ref = $bindable(null),
		value = $bindable(),
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<input
	bind:this={ref}
	bind:value
	class={[
		"border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
		class_
	]}
	{...rest_props}
/>
