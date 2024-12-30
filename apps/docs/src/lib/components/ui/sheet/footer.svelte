<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>>;
	let {
		ref = $bindable(null),
		class: class_,
		children,
		...rest_props
	}: Props = $props();
</script>

<div
	bind:this={ref}
	class={["flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", class_]}
	{...rest_props}
>
	{@render children?.()}
</div>
