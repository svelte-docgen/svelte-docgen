<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import Plus from "lucide-svelte/icons/plus";
	import SquareTerminal from "lucide-svelte/icons/square-terminal";
	import type { Component, ComponentProps } from "svelte";

	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	interface Item {
		name: string;
		url: string;
		icon?: Component;
	}
	interface Props extends ComponentProps<typeof Sidebar.Group> {
		items: Map<string, Item>;
		onplusclick: ComponentProps<typeof Sidebar.GroupAction>['onclick'];
	}
	let {
		// Custom
		items,
		onplusclick,
		// Extended
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<Sidebar.Group
	class={["group-data-[collapsible=icon]:hidden", class_]}
	{...rest_props}
>
	<Sidebar.GroupLabel><SquareTerminal class="me-1" />{"Playground"}</Sidebar.GroupLabel>
	<Sidebar.GroupAction onclick={onplusclick}>
		<Plus />
		<span class="sr-only">{"Start a new one"}</span>
	</Sidebar.GroupAction>

	<Sidebar.Menu>
		{#each items as [name, item] (name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} {...props}>
							{#if item.icon}
								<item.icon />
							{/if}
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
