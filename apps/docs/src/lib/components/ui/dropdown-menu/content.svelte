<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	interface Props extends DropdownMenu.ContentProps {
		portal?: DropdownMenu.PortalProps;
	}
	let {
		// Custom
		portal,
		ref = $bindable(null),
		sideOffset = 4,
		// Native
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<DropdownMenu.Portal {...portal}>
	<DropdownMenu.Content
		bind:ref
		{sideOffset}
		class={[
			"bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
			"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-none",
			class_
		]}
		{...rest_props}
	/>
</DropdownMenu.Portal>
