<script lang="ts">
	import type { Snippet } from "svelte";

	import * as Resizable from "$lib/components/ui/resizable/index.ts";

	interface Props {
		input: Snippet;
		output: Snippet;
	}
	let { input, output }: Props = $props();
</script>

<div class="panes-container">
	<Resizable.PaneGroup
		direction="horizontal"
		class="panes"
	>
		<Resizable.Pane defaultSize={100}>
			{@render input()}
		</Resizable.Pane>

		<Resizable.Handle />

		<Resizable.Pane defaultSize={100}>
			<div class="overflow-auto h-full">
				{@render output()}
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

<style>
	.panes-container {
		height: calc(100lvh - theme('height.16'));
	}
</style>
