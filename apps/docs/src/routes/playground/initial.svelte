<script lang="ts">
	import type { Snippet } from "svelte";

	interface A<T> {
		b: B<T>;
		v: T;
	}
	interface B<T> {
		a: A<T>;
	}
	type C = 1;

	interface Props {
		a: A<number>;
		c: C;
		u: 1 | "foo";
		s: Snippet<[A<number>]>;
	}

	let { ..._ }: Props = $props();
</script>
