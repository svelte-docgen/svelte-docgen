<script lang="ts">
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import type { Component } from "svelte";

	import * as Collapsible from "$lib/components/ui/collapsible/index.ts";
	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	interface NavSubItem {
		href: string;
		title: string;
	}
	interface NavItem {
			active?: boolean;
			href: string;
			icon: Component;
			items?: NavSubItem[];
			title: string;
	}
	interface Props {
		items: NavItem[];
	}
	let {
		items,
	}: Props = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>

	<Sidebar.Menu>
		{#each items as main_item (main_item.title)}
			<Collapsible.Root open={main_item.active}>
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Sidebar.MenuButton>
							{#snippet tooltip()}
								{main_item.title}
							{/snippet}
							{#snippet child({ props })}
								<a
									href={main_item.href}
									{...props}
								>
									<main_item.icon />
									<span>{main_item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>

						{#if main_item.items?.length}
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuAction
										{...props}
										class="data-[state=open]:rotate-90"
									>
										<ChevronRight />
										<span class="sr-only">Toggle</span>
									</Sidebar.MenuAction>
								{/snippet}
							</Collapsible.Trigger>

							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each main_item.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton href={subItem.href}>
												<span>{subItem.title}</span>
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						{/if}
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
