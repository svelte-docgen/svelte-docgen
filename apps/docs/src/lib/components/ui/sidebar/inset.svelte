<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAttributes<HTMLElement>>;
	let {
		ref = $bindable(null),
		class: class_,
		children,
		...rest_props
	}: Props = $props();
</script>

<main
	bind:this={ref}
	class={[
		"bg-background relative flex min-h-svh flex-1 flex-col",
		"peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
		class_
	]}
	{...rest_props}
>
	{@render children?.()}
</main>
