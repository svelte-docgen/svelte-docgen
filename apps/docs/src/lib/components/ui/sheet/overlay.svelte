<script lang="ts">
	import { Dialog } from "bits-ui";

	let {
		// Custom
		ref = $bindable(null),
		// Native
		class: class_,
		...rest_props
	}: Dialog.OverlayProps = $props();
</script>

<Dialog.Overlay
	bind:ref
	class={[
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  fixed inset-0 z-50 bg-black/80",
		class_
	]}
	{...rest_props}
/>
