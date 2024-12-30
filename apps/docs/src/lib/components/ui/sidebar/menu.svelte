<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<ul
	bind:this={ref}
	class={["flex w-full min-w-0 flex-col gap-1", class_]}
	data-sidebar="menu"
	{...rest_props}
>
	{@render children?.()}
</ul>
