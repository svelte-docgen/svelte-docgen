<script lang="ts">
	import PanelLeft from "lucide-svelte/icons/panel-left";
	import type { ComponentProps } from "svelte";
	import type { MouseEventHandler } from "svelte/elements";

	import { Button } from "$lib/components/ui/button/index.ts";

	import { use_sidebar } from "./context.svelte.ts";

	type Props = ComponentProps<typeof Button> & {
		onclick?: MouseEventHandler<HTMLButtonElement>;
	}
	let {
		ref = $bindable(null),
		class: class_,
		onclick,
		...rest_props
	}: Props = $props();

	const sidebar = use_sidebar();

	function handle_click(e: MouseEvent) {
		// @ts-expect-error: WARN: It errors because Button can be `<a>` too
		onclick?.(e);
		sidebar.toggle();
	}
</script>

<Button
	type="button"
	class={["h-7 w-7", class_]}
	onclick={handle_click}
	size="icon"
	variant="ghost"
	data-sidebar="trigger"
	{...rest_props}
>
	<PanelLeft />
	<span class="sr-only">Toggle Sidebar</span>
</Button>
