<script lang="ts" module>
	export const TABS = new Set(["overview", "docgen"] as const);

	export type Tab = typeof TABS extends Set<infer T> ? T : never;

	// Session storage keys
	const SS_KEY = "output-tab";
</script>

<script lang="ts">
	import IconDatabase from "lucide-svelte/icons/database";
	import IconPresentation from "lucide-svelte/icons/presentation";
	import { type parse, analyze } from "svelte-docgen";

	import { ScrollArea } from "$lib/components/ui/scroll-area/index.ts";
	import * as Tabs from "$lib/components/ui/tabs/index.ts";

	import OutputOverview from "./overview/root.svelte";
	import OutputJSON from "./json.svelte";

	interface Props {
		data: ReturnType<typeof parse>;
	}
	let { data }: Props = $props();

	let current_tab = $state<Tab>((window.sessionStorage.getItem(SS_KEY) as Tab) ?? "docgen");

	let analyzed = $derived(analyze(data));

	/**
	 * Store in session storage the current tab, because it loses output on editor update
	 */
	$effect(() => {
		window.sessionStorage.setItem(SS_KEY, current_tab);
	});
</script>

<ScrollArea class="h-full">
	<Tabs.Root bind:value={current_tab} class="h-auto">
		<Tabs.List class="sticky top-0 z-10 grid !h-auto grid-cols-2 rounded-none px-2 pb-0">
			<Tabs.Trigger value="overview" class="rounded-b-none !shadow-none">
				<IconPresentation class="me-2" /> Overview
			</Tabs.Trigger>

			<Tabs.Trigger value="docgen" class="rounded-b-none !shadow-none">
				<IconDatabase class="me-2" /> Docgen
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="overview" class="px-4">
			<div class="container">
				<OutputOverview data={analyzed} />
			</div>
		</Tabs.Content>

		<Tabs.Content value="docgen" class="h-full">
			<ScrollArea class="h-full">
				<OutputJSON {data} />
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>
</ScrollArea>
