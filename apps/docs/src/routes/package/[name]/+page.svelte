<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";

	let { data } = $props();
	const { pkg: _, readme } = data;
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags - Is ok, is sanitized. -->
{@html DOMPurify.sanitize(readme.code)}
