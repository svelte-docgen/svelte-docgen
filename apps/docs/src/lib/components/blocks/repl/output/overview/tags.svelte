<script lang="ts">
	import IconTags from "lucide-svelte/icons/tags";
	import { analyze } from "svelte-docgen";
	import type { ComponentProps } from "svelte";
	import type * as Doc from "svelte-docgen/doc";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import { Badge, badgeVariants } from "$lib/components/ui/badge/index.ts";
	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	interface Props extends ComponentProps<typeof Accordion.Item> {
		tags: ReturnType<typeof analyze>["tags"];
	}
	let { tags, ...rest_props }: Props = $props();

	const is_empty = $derived(tags.length === 0);
	let tags_map = $derived.by(() => {
		let results = new Map<string, NonNullable<Doc.Tag["content"]>[]>();
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

<Accordion.Item
	{...rest_props}
	disabled={is_empty}
	value="tags"
>
	<Accordion.Trigger>
		<span class="inline-flex items-center gap-2">
			<IconTags /> Tags
		</span>
	</Accordion.Trigger>

	<Accordion.Content>
		<div class="flex w-fit flex-row gap-1 p-2">
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
									{#each content as parts}
										<li>{#each parts as part}
												{part.text}
										{/each}</li>
									{/each}
								</ul>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}
			{/each}
		</div>
	</Accordion.Content>
</Accordion.Item>
