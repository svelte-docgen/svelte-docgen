<script lang="ts">
	let { data } = $props();
	const { pkg, sections } = data;
</script>

<h1>List of <code>{pkg.name}</code> errors</h1>

<ol>
	{#each sections.keys() as ref}
		<li>
			<a href={`/package/${globalThis.encodeURIComponent(pkg.name)}/e/${ref}`}>{ref}</a>
		</li>
	{/each}
</ol>
