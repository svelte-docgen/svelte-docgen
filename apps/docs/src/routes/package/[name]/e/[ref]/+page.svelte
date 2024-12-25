<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";

	let { data } = $props();
	const { section } = data;
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags - Is ok, is sanitized. -->
{@html DOMPurify.sanitize(section)}
