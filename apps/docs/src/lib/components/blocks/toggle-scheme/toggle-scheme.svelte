<script lang="ts">
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";
	import type { ComponentProps } from "svelte";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as color_scheme from "$lib/hooks/color-scheme.svelte";

	let { class: class_ }: ComponentProps<typeof DropdownMenu.Trigger> = $props();

	const watcher = color_scheme.get_watcher();

	$effect(() => {
		window.document.documentElement.setAttribute(color_scheme.DATA_ATTR, watcher.used);
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={[buttonVariants({ variant: "outline", size: "icon" }), class_]}>
		<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		{#each color_scheme.VALUES as value}
			<DropdownMenu.Item
				onclick={() => {
					watcher.current = value;
				}}>{value}</DropdownMenu.Item
			>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
