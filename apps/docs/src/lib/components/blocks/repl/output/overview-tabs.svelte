<script lang="ts">
	import { type parse } from "svelte-docgen";
	import { Badge, badgeVariants } from "$lib/components/ui/badge/index.ts";
	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	interface Props {
		data: ReturnType<typeof parse>["tags"];
	}
	let { data }: Props = $props();

	let tags_map = $derived.by(() => {
		let results = new Map<string, string[]>();
		if (!data) return results;
		for (const tag of data) {
			const current = results.get(tag.name);
			if (!current) {
				results.set(tag.name, [tag.content]);
			} else {
				current.push(tag.content);
			}
		}
		return results;
	});

	$inspect({ tags_map });
</script>

<div class="flex w-fit flex-row gap-1 p-2">
	{#each tags_map as [name, content]}
		{@const is_repetive = content.length > 1}
		{@const is_empty = content.length === 1 && content[0] === ""}
		{#if is_empty}
			<Badge class="hover:bg-unset" variant="outline">
				{name}
			</Badge>
		{:else}
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger class={badgeVariants({ variant: is_repetive ? "default" : "secondary" })}>
						{name}
						{#if is_repetive}
							({content.length}x)
						{/if}
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
