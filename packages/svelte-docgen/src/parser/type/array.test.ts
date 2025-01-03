import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Array", () => {
	const { props, types } = parse(
		`
		<script lang="ts">
			type Letter = "a" | "b" | "c";
			type Num = 0 | 1 | 2;
			type Aliased = number[];
			interface Props {
				letters: Letter[];
				numbers: readonly Num[];
				aliased: Aliased;
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("array.svelte"),
	);

	it("documents `array`", ({ expect }) => {
		const letters = props.get("letters");
		expect(letters).toBeDefined();
		expect(letters?.type).toBe("Array<Letter>");
		const type = types.get("Array<Letter>");
		expect(type?.kind).toBe("array");
		expect((type as Doc.ArrayType).isReadonly).toBe(false);
	});

	it("recognizes 'readonly'", ({ expect }) => {
		const numbers = props.get("numbers");
		expect(numbers).toBeDefined();
		expect(numbers?.type).toBe("ReadonlyArray<Num>");
		const type = types.get("ReadonlyArray<Num>");
		expect(type?.kind).toBe("array");
		expect((type as Doc.ArrayType).isReadonly).toBe(true);
	});

	it("types", ({ expect }) => {
		expect(types.get("Letter")).toMatchInlineSnapshot(`
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
		expect(types.get("Num")).toMatchInlineSnapshot(`
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
		expect(types.get("Aliased")).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "element": {
			    "kind": "number",
			  },
			  "isReadonly": false,
			  "kind": "array",
			}
		`);
	});
});
