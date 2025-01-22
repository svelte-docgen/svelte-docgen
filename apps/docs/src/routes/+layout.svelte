<script lang="ts">
	import "../app.css";

	import SiGitHub from "@icons-pack/svelte-simple-icons/icons/SiGithub";
	import Package from "lucide-svelte/icons/package";
	import SquareTerminal from "lucide-svelte/icons/square-terminal";
	import type { Component, ComponentProps } from "svelte";

	import { page } from "$app/state";

	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";
	import { AppHeader, type RouteMeta } from "$lib/components/blocks/app-header/index.ts";
	import { AppSidebar } from "$lib/components/blocks/app-sidebar/index.ts";

	let { children } = $props();

	let routes = $derived.by<RouteMeta[]>(() => {
		let results = [];
		for (const route of page.url.pathname.slice(1).split("/")) {
			if (route) {
				results.push(get_route_meta(route));
			}
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
			items: [],
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

<!-- This script prevents FOUC -->
<svelte:head>
	<script>
		let color_scheme = window.localStorage.getItem("color-scheme");
		if (!color_scheme || color_scheme === "system") {
			let prefers = window.matchMedia("(prefers-color-scheme: dark)");
			color_scheme = prefers.matches ? "dark" : "light";
		}
		window.document.documentElement.setAttribute("data-color-scheme", color_scheme);
	</script>
</svelte:head>

<Sidebar.Provider>
	<AppSidebar {...sidebar} />

	<main class="min-h-screen w-screen">
		<AppHeader {routes} />
		{@render children?.()}
	</main>
</Sidebar.Provider>
