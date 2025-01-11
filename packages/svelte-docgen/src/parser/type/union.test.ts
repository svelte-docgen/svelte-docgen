import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../kind/guard.js";
import type * as Doc from "../../doc/type.js";

describe("Union", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				type Aliased = "red" | "green" | "blue";
				interface Props {
					color: "primary" | "secondary" | "tertiary";
					aliased: Aliased;
					containsBoolean?: boolean | 123;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("union.svelte"),
	);

	it("documents anonymous `union`", ({ expect }) => {
		const anonymous = props.get("color");
		if (!anonymous || isTypeRef(anonymous.type)) throw new Error("Expected a type");
		expect(anonymous.type).toMatchInlineSnapshot(`
			{
			  "kind": "union",
			  "types": [
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "primary",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "secondary",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "tertiary",
			    },
			  ],
			}
		`);
		expect(anonymous.type.kind).toBe("union");
		expect((anonymous.type as Doc.Union)?.alias).not.toBeDefined();
		expect((anonymous.type as Doc.Union)?.aliasSource).not.toBeDefined();
	});

	it("recognizes aliased union", ({ expect }) => {
		expect(props.get("aliased")!.type).toBe("Aliased");
	});

	it("does not expand boolean into `true | false`", ({ expect }) => {
		const containsBoolean = props.get("containsBoolean")!;
		const type = containsBoolean.type;
		if (isTypeRef(type)) throw new Error("Expected a type");
		expect(type.kind).toBe("union");
		expect((type as Doc.Union).types).toContainEqual({
			kind: "boolean",
		});
		expect((type as Doc.Union).types.length).toBe(3);
	});

	it("collect aliased types", ({ expect }) => {
		expect(types.get("Aliased")).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "aliasSource": "union.svelte",
			  "kind": "union",
			  "types": [
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "red",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "green",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "blue",
			    },
			  ],
			}
		`);
		expect(types.get("Aliased")?.kind).toBe("union");
		expect((types.get("Aliased") as Doc.Union)?.aliasSource).toBeDefined();
	});
});
