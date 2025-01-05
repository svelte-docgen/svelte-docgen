<script lang="ts">
import type * as Doc from "svelte-docgen/doc";
	import { Code } from "$lib/components/ui/code/index.ts";

	interface Props {
		type: Doc.TypeOrRef;
		types: Doc.Types;
	}
	let { type: type_, types }: Props = $props();

	let type = $derived(get_type(type_));

	function get_type(t: Doc.TypeOrRef): Doc.Type {
			if (is_type_ref(t)) {
				const type = types.get(t);
				if (!type) throw new Error("Unreachable");
				return type;
			}
			return t;
	}

	function is_type_ref(type: Doc.TypeOrRef): type is Doc.TypeRef {
		return typeof type === "string";
	}

	interface TypeRefData {
		module: string;
		alias: string;
		generics?: string;
	}
	function parse_type_ref(ref: Doc.TypeRef): TypeRefData {
		const regex = /"(?<module>[^"]+)"\.(?<alias>\w+)(?:<(?<generics>[^>]*)>)?/;
		const match = regex.exec(ref);
		if (!match || !match.groups || !("module" in match.groups || "alias" in match.groups)) throw new Error("Unreachable");
		return match.groups as unknown as TypeRefData;
	}
</script>

<span class="inline-flex flex-col">
	<span>{type.kind}</span>

	{#if type.kind === "union"}
		<span class="inline-flex flex-row whitespace-nowrap">
			{#each type.types as t, idx}
				{#if idx > 0}
					<span class="px-2">{"|"}</span>
				{/if}
				{#if is_type_ref(t)}
					{@const ref = parse_type_ref(t)}
					<Code>
					{ref.alias}{#if ref.generics}
						{`<${ref.generics}>`}
					{/if}
					</Code>
				{:else}
					<Code>{t.kind}</Code>
				{/if}
			{/each}
		</span>
	{/if}
</span>
