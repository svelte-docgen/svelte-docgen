<script lang="ts">
	import { onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	import { Context } from "./context.svelte.ts";

	type ContextParams = Omit<ConstructorParameters<typeof Context>[0], "container">;
	type Props = ContextParams &
		HTMLAttributes<HTMLDivElement> & {
			context?: Context;
		};
	let {
		// Custom
		context = $bindable(),
		initial,
		lang,
		readonly = false,
		// Native
		class: class_,
		...rest_props
	}: Props = $props();

	let container = $state<HTMLDivElement>();

	onMount(() => {
		if (!container) throw new Error("Unreachable");
		context = new Context({
			container,
			initial,
			readonly,
			lang,
		});
		// On destroy...
		return () => {
			context?.destroy();
		};
	});
</script>

<div bind:this={container} class={["h-full overflow-auto", class_]} {...rest_props}></div>

<style>
	div {
		:global(.cm-editor) {
			height: inherit;
		}
		:global(.cm-lineNumbers) {
			width: 5ch;
		}
		:global(.cm-lineNumbers > .cm-gutterElement) {
			padding-inline: 0;
		}
	}
</style>
