<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	interface Props extends DropdownMenu.GroupHeadingProps {
		inset?: boolean;
	}
	let {
		// Custom
		inset,
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Props = $props();
</script>

<DropdownMenu.GroupHeading
	bind:ref
	class={["px-2 py-1.5 text-sm font-semibold", inset && "pl-8", class_]}
	{...rest_props}
/>
