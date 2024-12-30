<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import Search from "lucide-svelte/icons/search";
	import type { HTMLFormAttributes } from "svelte/elements";

	import { Label } from "$lib/components/ui/label/index.ts";
	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	type Props = WithElementRef<HTMLFormAttributes>;
	let {
		// Custom
		ref = $bindable(null),
		// Native
		...rest_props
	}: Props = $props();
</script>

<form bind:this={ref} {...rest_props}>
	<Sidebar.Group class="py-0">
		<Sidebar.GroupContent class="relative">
			<Label for="search" class="sr-only">Search</Label>
			<Sidebar.Input id="search" placeholder="Search the docs..." class="pl-8" />
			<Search
				class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
			/>
		</Sidebar.GroupContent>
	</Sidebar.Group>
</form>
