<script lang="ts">
	import type { WithElementRef, WithoutChildren } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<div
	bind:this={ref}
	class={["bg-primary/10 animate-pulse rounded-md", class_]}
	{...rest_props}
></div>
