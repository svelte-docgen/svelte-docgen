<script lang="ts">
	let { data } = $props();
</script>

<article class="container">
	<section>
		<dl class="mt-4">
			{#each data.examples as [title, example] (title)}
				{@const search_params = new URLSearchParams([["input", example.input.encoded]])}
				<dt class="text-2xl font-semibold underline underline-offset-2">
					<a href={`/playground?${search_params}`} class="hover:text-accent">{example.fm.title}</a>
				</dt>
				<dd class="font-serif">{example.fm.description}</dd>
			{/each}
		</dl>
	</section>
</article>

<style>
	dt {
		&:not(:first-of-type) {
			@apply mt-2;
		}
	}
</style>
