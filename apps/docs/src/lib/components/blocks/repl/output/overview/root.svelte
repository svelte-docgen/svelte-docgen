<script module lang="ts">
	export type Items = "description" | "exports" | "tags" | "props";

	/** Session storage key */
	export const SS_KEY = "output-overview-accordion";
</script>

<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import type { analyze } from "svelte-docgen";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import * as Tabs from "$lib/components/ui/tabs/index.ts";

	import OverviewDescription from "./description.svelte";
	import OverviewExports from "./exports.svelte";
	import OverviewProps from "./props/root.svelte";
	import OverviewTags from "./tags.svelte";

	interface Props {
		data: ReturnType<typeof analyze>;
	}
	let { data }: Props = $props();

	const stored = globalThis.window !== undefined ? window.sessionStorage.getItem(SS_KEY) : null;
	let accordion_state = $state<SvelteSet<Items>>(new SvelteSet(stored ? (JSON.parse(stored) as Items[]) : []));

	/** Store in session storage for better UX */
	$effect(() => {
		window.sessionStorage.setItem(SS_KEY, JSON.stringify(Iterator.from(accordion_state).toArray()));
	});
</script>

<Tabs.Content value="overview" class="px-4">
	<Accordion.Root
		type="multiple"
		bind:value={() => Iterator.from(accordion_state).toArray(), (v) => (accordion_state = new SvelteSet(v))}
	>
		<OverviewDescription description={data.description} />
		<OverviewTags tags={data.tags} />
		<OverviewExports exports={data.exports} types={data.types} />
		<OverviewProps props={data.props} types={data.types} />
	</Accordion.Root>
</Tabs.Content>

<style>
	:global([data-accordion-trigger][aria-disabled="true"]) {
		@apply text-muted-foreground;
		@apply no-underline;
	}
</style>
