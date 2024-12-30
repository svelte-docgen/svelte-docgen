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
	class={["flex flex-col gap-2 p-2", class_]}
	data-sidebar="footer"
	{...rest_props}
>
	{@render children?.()}
</div>
