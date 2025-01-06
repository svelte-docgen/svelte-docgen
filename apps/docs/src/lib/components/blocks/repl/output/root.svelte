<script lang="ts" module>
	export const TABS = new Set(["overview", "docgen"] as const);
	export const TYPES = new Set(["raw", "json"] as const);

	export type Tab = typeof TABS extends Set<infer T> ? T : never;
	export type Type = typeof TYPES extends Set<infer T> ? T : never;
</script>

<script lang="ts">
	import IconDatabase from "lucide-svelte/icons/database";
	import IconPresentation from "lucide-svelte/icons/presentation";
	import type { parse } from "svelte-docgen";

	import { ScrollArea } from "$lib/components/ui/scroll-area/index.ts";
	import * as Tabs from "$lib/components/ui/tabs/index.ts";

	import OutputOverview from "./overview/root.svelte";
	import OutputJSON from "./json.svelte";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	// Session storage keys
	const ss_tab = "output-tab";

	let current_tab = $state<Tab>((window.sessionStorage.getItem(ss_tab) as Tab) ?? "docgen");

	/**
	 * Store in session storage the current tab, because it loses output on editor update
	 */
	$effect(() => {
		window.sessionStorage.setItem(ss_tab, current_tab);
	});
</script>

<ScrollArea class="h-full">
	<Tabs.Root bind:value={current_tab} class="h-auto">
		<Tabs.List class="sticky top-0 z-10 grid grid-cols-2 rounded-none px-2 !h-auto pb-0">
			<Tabs.Trigger value="overview" class="rounded-b-none !shadow-none">
				<IconPresentation class="me-2" /> Overview
			</Tabs.Trigger>

			<Tabs.Trigger value="docgen" class="rounded-b-none !shadow-none">
				<IconDatabase class="me-2" /> Docgen
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="overview" class="px-4">
			<div class="container">
				<OutputOverview {data} />
			</div>
		</Tabs.Content>

		<Tabs.Content value="docgen" class="h-full">
			<ScrollArea class="h-full">
				<OutputJSON {data} />
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>
</ScrollArea>
