<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import Plus from "lucide-svelte/icons/plus";
	import type { Component } from "svelte";

	import { goto } from "$app/navigation";
	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	interface Item {
			name: string;
			url: string;
			icon: Component;
	}
	interface Props {
		items: Item[];
	}
	let { items }: Props = $props();

	function handle_plus_click() {
		goto("/playground");
	}
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>{'Playground'}</Sidebar.GroupLabel>
	<Sidebar.GroupAction onclick={handle_plus_click}>
		<Plus />
		<span class="sr-only">{'Start a new one'}</span>
	</Sidebar.GroupAction>

	<Sidebar.Menu>
		{#each items as item (item.name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} {...props}>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}

		<Sidebar.MenuItem>
			<Sidebar.MenuButton>
				<Ellipsis />
				<span>More</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Group>
