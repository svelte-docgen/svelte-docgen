<script lang="ts">
	let { data } = $props();
</script>

<h1>Packages</h1>

{#each data.packages as [name, pkg]}
	<div>
		<a href={`/package/${name}`}><h2>{name}</h2></a>
		<p class="description">{pkg.data.description}</p>
		<small>Version: {pkg.data.version}</small>
	</div>
{/each}
