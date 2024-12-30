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
	class={["flex flex-col space-y-2 text-center sm:text-left", class_]}
	{...rest_props}
>
	{@render children?.()}
</div>
