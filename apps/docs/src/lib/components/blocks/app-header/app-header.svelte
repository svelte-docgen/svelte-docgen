<script lang="ts" module>
	import type { Component } from "svelte";

	export interface RouteMeta {
		title: string;
		icon?: Component;
	}
</script>

<script lang="ts">
	import Home from "lucide-svelte/icons/house";

	import { Button } from "$lib/components/ui/button/index.ts";
	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.ts";
	import { Separator } from "$lib/components/ui/separator/index.ts";
	import { ToggleScheme } from "$lib/components/blocks/toggle-scheme/index.ts";

	interface Props {
		routes: RouteMeta[];
	}
	let { routes }: Props = $props();
	let is_playground = $derived(routes.find((r) => r.title === "Playground"));
</script>

<header class="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
	<Sidebar.Trigger class="-ml-1" />

	<Separator orientation="vertical" class="mr-2 h-4" />

	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item class="hidden md:block">
				<Breadcrumb.Link href="/"><Home /></Breadcrumb.Link>
			</Breadcrumb.Item>

			{#each routes as route}
				<!-- NOTE: If at home (root), then the route is `""` -->
				{#if route}
					<Breadcrumb.Separator class="hidden md:block" />

					<Breadcrumb.Item>
						{#if route.icon}
							<route.icon />
						{/if}
						<Breadcrumb.Page>{route.title}</Breadcrumb.Page>
					</Breadcrumb.Item>
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<div class="ml-auto flex flex-row items-center gap-4">
		{#if !is_playground}
			<Button href="/playground">{"Try out playground!"}</Button>
		{/if}
		<ToggleScheme />
	</div>
</header>
