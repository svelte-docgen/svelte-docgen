import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "boolean.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("recognizes prop(s) with loose 'boolean' type", ({ expect }) => {
	const loose = props.get("loose");
	expect(loose).toBeDefined();
	expect(loose?.type).toMatchInlineSnapshot(`
		{
		  "kind": "boolean",
		}
	`);
});

it("recognizes literal 'boolean' type - true", ({ expect }) => {
	const truthy = props.get("truthy");
	expect(truthy).toBeDefined();
	expect(truthy?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "boolean",
		  "value": true,
		}
	`);
});

it("recognizes literal 'boolean' type - false", ({ expect }) => {
	const falsy = props.get("falsy");
	expect(falsy).toBeDefined();
	expect(falsy?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "boolean",
		  "value": false,
		}
	`);
});