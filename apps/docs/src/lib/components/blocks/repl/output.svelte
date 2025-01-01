<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";
	import IconDatabase from "lucide-svelte/icons/database";
	import IconNotepad from "lucide-svelte/icons/notepad-text";
	import IconNotepadDashed from "lucide-svelte/icons/notepad-text-dashed";
	import IconPresentation from "lucide-svelte/icons/presentation";
	import { mode } from "mode-watcher";
	import { encode, type parse } from "svelte-docgen";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.ts";
	import * as Tabs from "$lib/components/ui/tabs/index.ts";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.ts";
	import { highlighter } from "$lib/md/highlighter";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	let current_tab = $state<"overview" | "docgen">("docgen");
	let output_type = $state<"raw" | "json">("json");
</script>

<ScrollArea class="h-full">
	<Tabs.Root bind:value={current_tab} class="h-full">
		<Tabs.List class="sticky top-0 z-10 grid grid-cols-2 rounded-none px-2">
			<Tabs.Trigger value="overview" class="rounded-b-none">
				<IconPresentation class="me-2" /> Overview
			</Tabs.Trigger>
			<Tabs.Trigger value="docgen" class="rounded-b-none">
				<IconDatabase class="me-2" /> Docgen
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="overview" class="px-4">
			<Accordion.Root type="multiple">
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
						{data.description}
					</Accordion.Content>
				</Accordion.Item>

				{@const has_props = data.props.size > 0}
				<Accordion.Item value="props" disabled={!has_props}>
					<Accordion.Trigger class="trigger">
						<span class="inline-flex items-center gap-2">
							{#if has_props}
								<IconNotepad class="notepad" />
							{:else}
								<IconNotepadDashed class="notepad" />
							{/if}
							Props
						</span>
					</Accordion.Trigger>
					<Accordion.Content>
						{data.props}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Tabs.Content>

		<Tabs.Content value="docgen" class="h-full">
			<ToggleGroup.Root
				bind:value={output_type}
				type="single"
				class={"absolute right-4 top-12 z-40"}
				variant="outline"
			>
				<ToggleGroup.Item value="raw" aria-label="Switch to raw output">
					{"Raw"}
				</ToggleGroup.Item>

				<ToggleGroup.Item value="json" aria-label="Switch to JSON-encoded output">
					{"JSON"}
				</ToggleGroup.Item>
			</ToggleGroup.Root>

			<ScrollArea class="h-full">
				{#if output_type === "raw"}
					<pre>Tree explorer</pre>
				{:else}
					{@const code = encode(data, { indent: "\t" })}
					<!-- eslint-disable-next-line svelte/no-at-html-tags - Is ok, is sanitized. -->
					{@html DOMPurify.sanitize(highlighter.codeToHtml(code, { lang: "json", theme: `github-${$mode}` }))}
				{/if}
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>
</ScrollArea>

<style>
	:global(.trigger[aria-disabled="true"]) {
		@apply text-muted-foreground;
		@apply no-underline;
	}
	:global(.trigger[data-state="open"] > svg.notepad) {
		@apply rotate-0;
	}
</style>
