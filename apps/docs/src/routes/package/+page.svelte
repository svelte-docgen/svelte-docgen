<script lang="ts">
	let { data } = $props();
  const { packages } = data;
</script>

<h1>Packages</h1>

{#each packages as [_name, pkg]}
	<div class="package-card">
	<a href={`/package/${globalThis.encodeURIComponent(pkg.name)}`}><h2>{pkg.name}</h2></a>
	<p class="description">{pkg.description}</p>
	<div class="version">Version: {pkg.version}</div>
	</div>
{/each}
