<script lang="ts" generics="T extends string">
	type Conditional<TT> = TT extends string ? TT : false;
	type Index<TT> = keyof TT;
	type IndexedAccess<TT> = Record<PropertyKey, unknown>[keyof TT];
	type StringMapping<TT extends string> = Uppercase<TT>;
	type TemplateLiteral<G extends string, TT extends string> = `${G}, ${TT}!`;

	interface Props {
		conditional: Conditional<T>;
		index: Index<T>;
		indexed_access: IndexedAccess<T>;
		string_mapping: StringMapping<T>;
		template_literal: TemplateLiteral<"Hello", T>;
		type_parameter: T;
	}

	let { ..._ }: Props = $props();
</script>
