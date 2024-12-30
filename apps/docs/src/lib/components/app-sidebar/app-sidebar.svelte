<script lang="ts">
	import type { ComponentProps } from "svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	import NavBottom from "./nav-bottom.svelte";
	import NavPlayground from "./nav-playground.svelte";
	import NavTop from "./nav-top.svelte";
	import SearchForm from "./search-form.svelte";
	import VersionSwitcher from "./version-switcher.svelte";

	interface Props extends ComponentProps<typeof Sidebar.Root> {
		versions: string[];
	}
	let {
		ref = $bindable(null),
		versions,
		...rest_props
	}: Props = $props();
</script>

<Sidebar.Root {...rest_props} bind:ref>
	<Sidebar.Header>
		<VersionSwitcher
			{versions}
			default={versions[0]}
		/>
		<SearchForm />
	</Sidebar.Header>

	<Sidebar.Content>
		<NavTop items={[]} />

		<NavPlayground items={[]} />

		<NavBottom items={[]} />
	</Sidebar.Content>

	<Sidebar.Rail />
</Sidebar.Root>
