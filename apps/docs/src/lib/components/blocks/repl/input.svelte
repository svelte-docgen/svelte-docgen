<script lang="ts">
	import type { ComponentProps } from "svelte";

	import { Context, Editor } from "$lib/components/blocks/editor/index.ts";

	interface Props extends Omit<ComponentProps<typeof Editor>, "lang"> {
		context?: Context;
	}
	let { context = $bindable(), ...rest_props }: Props = $props();
</script>

<Editor bind:context lang="svelte" {...rest_props} />
