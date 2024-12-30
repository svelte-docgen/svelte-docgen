<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	import {
		COOKIE_MAX_AGE,
		COOKIE_NAME,
		WIDTH,
		WIDTH_ICON,
	} from "./constants.ts";
	import { set } from "./context.svelte.ts";

	interface Props extends WithElementRef<HTMLAttributes<HTMLDivElement>> {
		open?: boolean;
		onopenchange?: (open: boolean) => void;
		controlledopen?: boolean;
	}
	let {
		// Custom
		controlledopen = false,
		open = $bindable(true),
		onopenchange = () => {},
		ref = $bindable(null),
		// Native
		children,
		class: class_,
		style,
		...rest_props
	}: Props = $props();

	const sidebar = set({
		open: () => open,
		set_open: (value: boolean) => {
			if (controlledopen) {
				onopenchange(value);
			} else {
				open = value;
				onopenchange(value);
			}
			// This sets the cookie to keep the sidebar state.
			document.cookie = `${COOKIE_NAME}=${open}; path=/; max-age=${COOKIE_MAX_AGE}`;
		}
	});
</script>

<svelte:window onkeydown={sidebar.handle_shortcut_keydown} />

<Tooltip.Provider delayDuration={0}>
	<div
		bind:this={ref}
		class={[
			"group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar flex min-h-svh w-full",
			class_
		]}
		style={`--sidebar-width: ${WIDTH}; --sidebar-width-icon: ${WIDTH_ICON}; ${style}`}
		{...rest_props}
	>
		{@render children?.()}
	</div>
</Tooltip.Provider>
