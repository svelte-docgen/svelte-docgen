<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}:Props = $props();
</script>

<li
	bind:this={ref}
	class={["group/menu-item relative", class_]}
	data-sidebar="menu-item"
	{...rest_props}
>
	{@render children?.()}
</li>
