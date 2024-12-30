<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLLIElement>>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children,
		...rest_props
	}: Props = $props();
</script>

<li
	bind:this={ref}
	data-sidebar="menu-sub-item"
	{...rest_props}
>
	{@render children?.()}
</li>
