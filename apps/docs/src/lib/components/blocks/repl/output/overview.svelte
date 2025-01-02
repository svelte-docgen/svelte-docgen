<script lang="ts">
	import IconNotepad from "lucide-svelte/icons/notepad-text";
	import IconNotepadDashed from "lucide-svelte/icons/notepad-text-dashed";
	import IconTags from "lucide-svelte/icons/tags";
	import { type parse } from "svelte-docgen";
	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import * as Tabs from "$lib/components/ui/tabs/index.ts";

	import OverviewProps from "./overview-props.svelte";
	import OverviewTags from "./overview-tags.svelte";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	type Items = "description" | "tags" | "props";
	let accordion_state = $state<Items[]>(["props"]);
</script>

<Tabs.Content value="overview" class="px-4">
	<Accordion.Root type="multiple" bind:value={accordion_state}>
		{@const has_description = Boolean(data.description)}
		<Accordion.Item value="description" disabled={!has_description}>
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
				<pre>{data.description}</pre>
			</Accordion.Content>
		</Accordion.Item>

		{@const has_tags = Boolean(data.tags)}
		<Accordion.Item value="tags" disabled={!has_tags}>
			<Accordion.Trigger class="trigger">
				<span class="inline-flex items-center gap-2">
					<IconTags /> Tags
				</span>
			</Accordion.Trigger>

			<Accordion.Content>
				<OverviewTags {...data} />
			</Accordion.Content>
		</Accordion.Item>

		{@const has_props = data.props.size > 0}
		<Accordion.Item value="props" disabled={!has_props}>
			<Accordion.Trigger class="trigger">
				<span class="inline-flex items-center gap-2">
					<IconTags /> Props
				</span>
			</Accordion.Trigger>

			<Accordion.Content>
				<OverviewProps {...data} />
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</Tabs.Content>

<style>
	:global(.trigger[aria-disabled="true"]) {
		@apply text-muted-foreground;
		@apply no-underline;
	}
	:global(.trigger[data-state="open"] > svg.notepad) {
		@apply rotate-0;
	}
</style>
