<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import Folder from "lucide-svelte/icons/folder";
	import Share from "lucide-svelte/icons/share";
	import Trash2 from "lucide-svelte/icons/trash-2";
	import type { Component } from "svelte";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.ts";
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

	const sidebar = Sidebar.use();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
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
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuAction showonhover {...props}>
								<Ellipsis />
								<span class="sr-only">More</span>
							</Sidebar.MenuAction>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-48"
						side={sidebar.is_mobile ? "bottom" : "right"}
						align={sidebar.is_mobile ? "end" : "start"}
					>
						<DropdownMenu.Item>
							<Folder class="text-muted-foreground" />
							<span>View Project</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Share class="text-muted-foreground" />
							<span>Share Project</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<Trash2 class="text-muted-foreground" />
							<span>Delete Project</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
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
