<script lang="ts">
	import "../app.css";

	import SiGitHub from "@icons-pack/svelte-simple-icons/icons/SiGithub";
	import Package from "lucide-svelte/icons/package";
	import SquareTerminal from "lucide-svelte/icons/square-terminal";
	import { ModeWatcher } from "mode-watcher";
	import type { Component, ComponentProps } from "svelte";

	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";
	import { AppHeader, type RouteMeta } from "$lib/components/blocks/app-header/index.ts";
	import { AppSidebar } from "$lib/components/blocks/app-sidebar/index.ts";

	let { children, data } = $props();

	let routes = $derived.by<RouteMeta[]>(() => {
		let results = [];
		for (const route of page.url.pathname.slice(1).split("/")) {
			if (route) results.push(get_route_meta(route));
		}
		return results;
	});

	function get_route_meta(route: string): RouteMeta {
		switch (route) {
			case "package":
				return {
					title: "Packages",
					icon: Package as unknown as Component,
				};
			case "playground":
				return {
					title: "Playground",
					icon: SquareTerminal as unknown as Component,
				};
			default:
				return {
					title: route,
				};
		}
	}

	const sidebar = {
		versions: ["beta"],
		top: {
			items: [
				{
					title: "Packages",
					href: "/package",
					icon: Package as unknown as Component,
					items: [
						{
							title: "@svelte-docgen/extractor",
							href: "/package/@svelte-docgen/extractor",
						},
						{
							title: "@svelte-docgen/server",
							href: "/package/@svelte-docgen/server",
						},
						{
							title: "svelte-docgen",
							href: "/package/svelte-docgen",
						},
						{
							title: "vite-plugin-svelte-docgen",
							href: "/package/vite-plugin-svelte-docgen",
						},
					],
				},
			],
		},
		playground: {
			onmoreclick: () => goto("/examples"),
			onplusclick: () => goto("/playground"),
			items: Iterator.from(data.examples)
				.take(5)
				.map(([id, example]) => {
					const search_params = new URLSearchParams([["input", example.input.encoded]]);
					return {
						name: id,
						href: `/playground?${search_params}`,
					};
				})
				.toArray(),
		},
		bottom: {
			items: [
				{
					title: "GitHub organization",
					href: "https://github.com/svelte-docgen",
					icon: SiGitHub as unknown as Component,
				},
			],
		},
	} satisfies ComponentProps<typeof AppSidebar>;
</script>

<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar {...sidebar} />

	<main class="min-h-screen w-screen">
		<AppHeader {routes} />
		{@render children?.()}
	</main>
</Sidebar.Provider>
