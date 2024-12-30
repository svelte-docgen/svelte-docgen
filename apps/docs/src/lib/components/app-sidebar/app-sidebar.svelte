<script lang="ts">
	import type { ComponentProps } from "svelte";

	import * as Sidebar from "$lib/components/ui/sidebar/index.ts";

	import NavBottom from "./nav-bottom.svelte";
	import NavPlayground from "./nav-playground.svelte";
	import NavTop from "./nav-top.svelte";
	import SearchForm from "./search-form.svelte";
	import VersionSwitcher from "./version-switcher.svelte";

	interface Props extends ComponentProps<typeof Sidebar.Root> {
		bottom: ComponentProps<typeof NavBottom>;
		playground: ComponentProps<typeof NavPlayground>;
		top: ComponentProps<typeof NavTop>;
		versions: string[];
		default_version?: string;
	}
	let {
		ref = $bindable(null),
		top,
		playground,
		bottom,
		versions,
		default_version = versions[0],
		...rest_props
	}: Props = $props();
</script>

<Sidebar.Root {...rest_props} bind:ref>
	<Sidebar.Header>
		<VersionSwitcher
			{versions}
			default={default_version}
		/>
		<SearchForm />
	</Sidebar.Header>

	<Sidebar.Content>
		<NavTop {...top} />
		<NavPlayground {...playground} />
	</Sidebar.Content>

	<Sidebar.Rail />

	<Sidebar.Footer>
		<NavBottom {...bottom} />
	</Sidebar.Footer>
</Sidebar.Root>
