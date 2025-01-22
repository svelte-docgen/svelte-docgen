<script lang="ts">
	interface Props {
		array: unknown[];
		constructible: Date;
		function: () => void;
		interface: { name: string; age: number };
		intersection: string & number;
		literal: "svelte-docgen";
		tuple: [string, boolean];
		union: 1 | 2 | 3;
	}

	let { ..._ }: Props = $props();
</script>
