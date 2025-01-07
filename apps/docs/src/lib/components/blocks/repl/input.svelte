<script lang="ts">
	import type { ComponentProps } from "svelte";

	import { Context, Editor } from "$lib/components/blocks/editor/index.ts";

	interface Props extends Omit<ComponentProps<typeof Editor>, "lang"> {
		context?: Context;
	}
	let {
		context = $bindable(),
	}: Props = $props();
</script>

<Editor bind:context lang="svelte" />
