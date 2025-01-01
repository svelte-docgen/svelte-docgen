<script lang="ts">
	import IconNotepad from "lucide-svelte/icons/notepad-text";
	import IconNotepadDashed from "lucide-svelte/icons/notepad-text-dashed";
	import { encode, type parse } from "svelte-docgen";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.ts";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	let type = $state<"pretty" | "raw">("pretty");
</script>


<header class="sticky top-0 flex flex-row px-4 py-2 border-b border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
	<h2 class="text-xl font-semibold">Output</h2>

	<ToggleGroup.Root
		bind:value={type}
		type="single"
		class="ml-auto"
		size="sm"
	>
		<ToggleGroup.Item value="pretty" aria-label="Toggle pretty output">
			{"Pretty"}
		</ToggleGroup.Item>

		<ToggleGroup.Item value="raw" aria-label="Toggle raw output">
			{"Raw"}
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</header>

<div class="container">
	{#if type === "pretty"}
		<Accordion.Root
			type="multiple"
		>
			{@const has_description = Boolean(data.description)}
			<Accordion.Item
				value="description"
				disabled={!has_description}
			>
				<Accordion.Trigger class="trigger">
					<span class="inline-flex items-center gap-2">
						{#if has_description}
							<IconNotepad class="notepad" />
						{:else}
							<IconNotepadDashed class="notepad" />
						{/if}
						Description
					</span>
				</Accordion.Trigger>
				<Accordion.Content>
					{data.description}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	{:else}
		<pre>{encode(data, { indent: "\t" })}</pre>
	{/if}
</div>

<style>
	:global(.trigger[aria-disabled="true"]) {
		@apply text-muted-foreground;
		@apply no-underline;
	}
	:global(.trigger[data-state="open"] > svg.notepad) {
		@apply rotate-0;
	}
</style>
