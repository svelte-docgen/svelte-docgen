<script lang="ts">
	import Check from "lucide-svelte/icons/check";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import GalleryVerticalEnd from "lucide-svelte/icons/gallery-vertical-end";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.ts";
	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	interface Props {
		versions: string[];
		default: string;
	}
	let {
		default: default_,
		versions,
	}: Props = $props();

	let selected = $state(default_);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						size="lg"
						{...props}
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<GalleryVerticalEnd class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">{'svelte-docgen'}</span>
							<span class="">{selected}</span>
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>

			<DropdownMenu.Content
				align="start"
				class="w-[--bits-dropdown-menu-anchor-width]"
			>
				{#each versions as version (version)}
					<DropdownMenu.Item onSelect={() => (selected = version)}>
						{version}
						{#if version === selected}
							<Check class="ml-auto" />
						{/if}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
