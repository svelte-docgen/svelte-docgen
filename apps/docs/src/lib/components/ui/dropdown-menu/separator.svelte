<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: DropdownMenu.SeparatorProps = $props();
</script>

<DropdownMenu.Separator
	bind:ref
	class={["bg-muted -mx-1 my-1 h-px", class_]}
	{...rest_props}
/>
