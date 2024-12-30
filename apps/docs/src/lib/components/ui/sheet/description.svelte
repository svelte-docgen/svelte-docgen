<script lang="ts">
	import { Dialog } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Dialog.DescriptionProps = $props();
</script>

<Dialog.Description
	bind:ref
	class={["text-muted-foreground text-sm", class_]}
	{...rest_props}
/>
