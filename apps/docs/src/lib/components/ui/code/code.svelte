<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		children: Snippet;
	}
	let { children, class: class_, ...rest_props }: Props = $props();
</script>

<code class={["text-foreground w-fit rounded-sm bg-stone-200 px-1 dark:bg-stone-500", class_]} {...rest_props}>
	{@render children()}
</code>
