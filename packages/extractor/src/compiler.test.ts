import { describe, it } from "vitest";

import { Compiler } from "../src/compiler.js";
import { Parser } from "../src/parser.js";
import { create_options } from "../tests/shared.js";

const EXAMPLE = `
	<!--
	@component Native button component
	@category Atom
	@subcategory Semantic
	-->

	<script lang="ts">
		import type { Snippet } from "svelte";
		import type { HTMLButtonAttributes } from "svelte/elements";

		interface Props extends HTMLButtonAttributes { }
		let { ..._ }: Props = $props();
	</script>
`;

describe(Compiler.name, () => {
	describe("tsx.code", () => {
		it("returns compiled code with `svelte2tsx`", ({ expect }) => {
			const { tsx } = new Compiler(EXAMPLE, new Parser(EXAMPLE), create_options("tsx-code.svelte"));
			expect(tsx.code).toMatchInlineSnapshot(`
				"import { SvelteComponentTyped } from "svelte"

				;
				import type { Snippet } from "svelte";
				import type { HTMLButtonAttributes } from "svelte/elements";
				;

						interface Props extends HTMLButtonAttributes { };function render() {

						
						

						let { ..._ }: Props = $props();
					;
				async () => {
					

					
				};
				return { props: {} as any as Props, exports: {}, bindings: __sveltets_$$bindings(''), slots: {}, events: {} }}
				/**
				 * Native button component
				 * @category Atom
				 * @subcategory Semantic
				 */
				const TsxCode = __sveltets_2_fn_component(render());
				type TsxCode = ReturnType<typeof TsxCode>;
				export default TsxCode;"
			`);
		});
	});
});
