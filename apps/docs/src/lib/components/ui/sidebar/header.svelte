<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLElement>>;
	let {
		// Custom
		class: class_,
		// Native
		children,
		ref = $bindable(null),
		...rest_props
	}: Props = $props();
</script>

<div
	bind:this={ref}
	class={["flex flex-col gap-2 p-2", class_]}
	{...rest_props}
	data-sidebar="header"
>
	{@render children?.()}
</div>
