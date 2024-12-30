<script lang="ts">
	import "../app.css";

	import SiGitHub from "@icons-pack/svelte-simple-icons/icons/SiGithub";
	import Package from "lucide-svelte/icons/package";
	import type { Component, ComponentProps } from "svelte";

	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";
	import { AppSidebar } from "$lib/components/app-sidebar/index.ts";

	let { children } = $props();

	const sidebar = {
		versions: ["beta"],
		top: {
			items: [{
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
			}],
		},
		playground: {
			items: [],
		},
		bottom: {
			items: [{
				title: "GitHub organization",
				href: "https://github.com/svelte-docgen",
				icon: SiGitHub as unknown as Component,
			}],
		},
	} satisfies ComponentProps<typeof AppSidebar>;

</script>

<Sidebar.Provider>
	<AppSidebar {...sidebar} />

	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
