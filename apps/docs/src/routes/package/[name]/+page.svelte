<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	let { data } = $props();
  const { pkg, readme } = data;
	console.log({ DOMPurify, code: readme.code });
</script>

{@html DOMPurify.sanitize(readme.code)}
