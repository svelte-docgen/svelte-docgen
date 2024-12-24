import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";
import { isAlias } from "../../doc/type.js";

describe("Array", () => {
	const { props, types } = parse(
		`
		<script lang="ts">
			type Letter = "a" | "b" | "c";
			type Num = 0 | 1 | 2;
			interface Props {
				letters: Letter[];
				numbers: readonly Num[];
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("array.svelte"),
	);

	it("documents `array`", ({ expect }) => {
		const letters = props.get("letters");
		expect(letters).toBeDefined();
		expect(letters?.type).toMatchInlineSnapshot(`
			{
			  "element": "Letter",
			  "isReadonly": false,
			  "kind": "array",
			}
		`);
		if (!letters || isAlias(letters?.type)) throw new Error("expected a type");
		expect(letters.type.kind).toBe("array");
		expect((letters.type as Doc.ArrayType).isReadonly).toBe(false);
	});

	it("recognizes 'readonly'", ({ expect }) => {
		const numbers = props.get("numbers");
		expect(numbers).toBeDefined();
		expect(numbers?.type).toMatchInlineSnapshot(`
			{
			  "element": "Num",
			  "isReadonly": true,
			  "kind": "array",
			}
		`);
		if (!numbers || isAlias(numbers?.type)) throw new Error("expected a type");
		expect(numbers.type.kind).toBe("array");
		expect((numbers.type as Doc.ArrayType).isReadonly).toBe(true);
	});

	it("types", ({ expect }) => {
		expect(types["Letter"]).toMatchInlineSnapshot(`
			{
			  "alias": "Letter",
			  "kind": "union",
			  "sources": Set {
			    "array.svelte",
			  },
			  "types": [
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "a",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "b",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "c",
			    },
			  ],
			}
		`);
		expect(types["Num"]).toMatchInlineSnapshot(`
			{
			  "alias": "Num",
			  "kind": "union",
			  "sources": Set {
			    "array.svelte",
			  },
			  "types": [
			    {
			      "kind": "literal",
			      "subkind": "number",
			      "value": 0,
			    },
			    {
			      "kind": "literal",
			      "subkind": "number",
			      "value": 1,
			    },
			    {
			      "kind": "literal",
			      "subkind": "number",
			      "value": 2,
			    },
			  ],
			}
		`);
	});
});
