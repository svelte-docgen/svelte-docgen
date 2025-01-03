import { describe, it } from "vitest";
import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Symbol", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
			  const sym: unique symbol = Symbol();
				interface Props {
					s: symbol;
					us: typeof sym;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
		create_options("symbol.svelte"),
	);

	it("recognizes symbol", ({ expect }) => {
		const sym = props.get("s");
		expect(sym).toBeDefined();
		expect(sym?.type).toMatchInlineSnapshot(`
				{
				  "kind": "symbol",
				}
			`);
	});

	it("recognizes unique symbol", ({ expect }) => {
		const sym = props.get("us");
		expect(sym).toBeDefined();
		expect(sym?.type).toBe("sym");
		const type = types.get("sym");
		expect((type as Doc.Literal).kind).toBe("literal");
		expect((type as Doc.Literal).subkind).toBe("symbol");
		expect(type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "name": "sym",
			  "subkind": "symbol",
			}
		`);
	});
});
