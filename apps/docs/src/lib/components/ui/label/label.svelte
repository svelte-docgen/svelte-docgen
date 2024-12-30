<script lang="ts">
	import { Label } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Label.RootProps = $props();
</script>

<Label.Root
	bind:ref
	class={[
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		class_
	]}
	{...rest_props}
/>
