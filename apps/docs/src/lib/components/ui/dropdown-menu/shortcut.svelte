<script lang="ts">
	import { type WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLSpanElement>>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<span
	bind:this={ref}
	class={["ml-auto text-xs tracking-widest opacity-60", class_]}
	{...rest_props}
>
	{@render children?.()}
</span>
