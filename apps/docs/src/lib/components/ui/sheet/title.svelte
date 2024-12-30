<script lang="ts">
	import { Dialog } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Dialog.TitleProps = $props();
</script>

<Dialog.Title
	bind:ref
	class={["text-foreground text-lg font-semibold", class_]}
	{...rest_props}
/>
