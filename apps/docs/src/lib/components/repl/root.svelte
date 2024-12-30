<script lang="ts">
	import type { Snippet } from "svelte";

	import * as Resizable from "$lib/components/ui/resizable/index.ts";

	interface Props {
		input: Snippet;
		output: Snippet;
	}
	let {
		input,
		output
	}: Props = $props();
</script>

<Resizable.PaneGroup
	class="h-full"
	direction="horizontal"
>
	<Resizable.Pane>
		{@render input()}
	</Resizable.Pane>

	<Resizable.Handle />

	<Resizable.Pane>
		{@render output()}
	</Resizable.Pane>
</Resizable.PaneGroup>
