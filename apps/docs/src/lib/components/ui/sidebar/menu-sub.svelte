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
	class={[
		"border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
		"group-data-[collapsible=icon]:hidden",
		class_
	]}
	data-sidebar="menu-sub"
	{...rest_props}
>
	{@render children?.()}
</ul>
