<script lang="ts">
	import type { Component, ComponentProps } from "svelte";

	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	interface Props extends ComponentProps<typeof Sidebar.Group> {
		items: {
			icon: Component;
			href: string;
			title: string;
		}[];
	}
	let {
		ref = $bindable(null),
		items,
		...rest_props
	}: Props = $props();
</script>

<Sidebar.Group
	bind:ref
	{...rest_props}
>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="sm">
						{#snippet child({ props })}
							<a
								href={item.href}
								{...props}
							>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
