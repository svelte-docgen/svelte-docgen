import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";

describe("Union", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				type Aliased = "red" | "green" | "blue";
				interface Props {
					color: "primary" | "secondary" | "tertiary";
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("union.svelte"),
	);

	it("documents anonymous `union`", ({ expect }) => {
		const anonymous = props.get("color");
		expect(anonymous).toBeDefined();
		expect(anonymous?.type).toMatchInlineSnapshot(`
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
		if (typeof anonymous?.type !== "string") {
			expect(anonymous?.type.kind).toBe("union");
		}
	});

	it("recognizes aliased union", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toBe("Aliased");
		if (typeof aliased?.type === "string") {
			const type = types.get(aliased.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "Aliased",
				  "kind": "union",
				  "sources": Set {
				    "union.svelte",
				  },
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
			if (type) {
				expect(type.kind).toBe("union");
				if (type.kind === "union") {
					expect(type.alias).toBe(aliased.type);
					expect(type.sources).toBeDefined();
				}
			}
		}
	});
});
