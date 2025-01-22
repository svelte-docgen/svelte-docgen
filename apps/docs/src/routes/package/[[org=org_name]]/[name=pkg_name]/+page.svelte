<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";

	let { data } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags - Is ok, is sanitized. -->
{@html DOMPurify.sanitize(data.html.code)}
