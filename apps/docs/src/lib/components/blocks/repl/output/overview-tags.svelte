<script lang="ts">
	import type * as Doc from "svelte-docgen/doc";
	import { Badge, badgeVariants } from "$lib/components/ui/badge/index.ts";
	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tags: Doc.Tag[];
	}
	let {
		// Custom
		tags,
		// Native
		class: class_,
		...rest_props
	}: Props = $props();

	let tags_map = $derived.by(() => {
		let results = new Map<string, NonNullable<Doc.Tag['content']>[]>();
		if (!tags) return results;
		for (const tag of tags) {
			const current = results.get(tag.name);
			if (!current) {
				// FIXME: This will need a change
				results.set(tag.name, [tag.content ?? []]);
			} else {
				// current.push(tag.content);
			}
		}
		return results;
	});
</script>

<div class={["flex w-fit flex-row gap-1 p-2", class_]} {...rest_props}>
	{#each tags_map as [name, content]}
		{@const is_repetive = content.length > 1}
		{@const is_empty = content.length === 1 && content[0][0].text === ""}
		{#if is_empty}
			<Badge class="hover:bg-unset" variant="outline">
				{name}
			</Badge>
		{:else}
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger class={badgeVariants({ variant: is_repetive ? "default" : "secondary" })}>
						{name}{is_repetive ? ` (${content.length}x)` : ""}
					</Tooltip.Trigger>

					<Tooltip.Content>
						<ul class={[content.length > 1 && "list-disc pl-2"]}>
							{#each content as line}
								<li>{line}</li>
							{/each}
						</ul>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		{/if}
	{/each}
</div>
