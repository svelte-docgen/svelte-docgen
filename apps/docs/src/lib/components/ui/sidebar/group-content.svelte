<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<div
	bind:this={ref}
	class={["w-full text-sm", class_]}
	data-sidebar="group-content"
	{...rest_props}
>
	{@render children?.()}
</div>
