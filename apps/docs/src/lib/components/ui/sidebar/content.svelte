<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLElement>>;
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
	class={[
		"flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
		class_
	]}
	data-sidebar="content"
	{...rest_props}
>
	{@render children?.()}
</div>
