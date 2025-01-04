<script lang="ts" module>
	export const TABS = new Set(["overview", "docgen"] as const);
	export const TYPES = new Set(["raw", "json"] as const);

	export type Tab = typeof TABS extends Set<infer T> ? T : never;
	export type Type = typeof TYPES extends Set<infer T> ? T : never;
</script>

<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";
	import IconDatabase from "lucide-svelte/icons/database";
	import IconPresentation from "lucide-svelte/icons/presentation";
	import { mode } from "mode-watcher";
	import { encode, type parse } from "svelte-docgen";

	import { ScrollArea } from "$lib/components/ui/scroll-area/index.ts";
	import * as Tabs from "$lib/components/ui/tabs/index.ts";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.ts";
	import { highlighter } from "$lib/md/highlighter.js";

	import OutputOverview from "./overview/root.svelte";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	// Session storage keys
	const ss_tab = "output-tab";
	const ss_type = "output-type";

	let current_tab = $state<Tab>((window.sessionStorage.getItem(ss_tab) as Tab) ?? "docgen");
	let current_output_type = $state<Type>((window.sessionStorage.getItem(ss_type) as Type) ?? "raw");

	/**
	 * Store in session storage the current tab, because it loses output on editor update
	 */
	$effect(() => {
		window.sessionStorage.setItem(ss_tab, current_tab);
	});
	/**
	 * Store in session storage the output type, because it loses output on editor update
	 */
	$effect(() => {
		window.sessionStorage.setItem(ss_type, current_output_type);
	});
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
			<OutputOverview {data} />
		</Tabs.Content>

		<Tabs.Content value="docgen" class="h-full">
			<ToggleGroup.Root
				bind:value={current_output_type}
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
				{#if current_output_type === "raw"}
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
