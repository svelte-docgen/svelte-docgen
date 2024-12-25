import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../doc/type.js";

describe("Fn", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				type Baz = string | number;
				type Aliased = () => void;
				interface Props {
					void: () => void;
					returning: () => string;
					parametized: (foo: string, bar?: Baz) => boolean;
					spread: (...spread: any) => null;
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("function.svelte"),
	);

	it("documents 'function' - retuning void", ({ expect }) => {
		const void_ = props.get("void");
		if (!void_ || isTypeRef(void_?.type)) throw new Error("expected a type");
		expect(void_.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [],
			      "returns": {
			        "kind": "void",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(void_.type.kind).toBe("function");
	});

	it("recognizes return type other than 'void'", ({ expect }) => {
		const returning = props.get("returning");
		if (!returning || isTypeRef(returning?.type)) throw new Error("expected a type");
		expect(returning.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [],
			      "returns": {
			        "kind": "string",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(returning.type.kind).toBe("function");
	});

	it("documents parameter(s) type if specified", ({ expect }) => {
		const parametized = props.get("parametized");
		expect(parametized).toBeDefined();
		expect(parametized?.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [
			        {
			          "isOptional": false,
			          "name": "foo",
			          "type": {
			            "kind": "string",
			          },
			        },
			        {
			          "isOptional": true,
			          "name": "bar",
			          "type": {
			            "kind": "union",
			            "nonNullable": "Baz",
			            "types": [
			              {
			                "kind": "undefined",
			              },
			              {
			                "kind": "string",
			              },
			              {
			                "kind": "number",
			              },
			            ],
			          },
			        },
			      ],
			      "returns": {
			        "kind": "boolean",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		if (!parametized || isTypeRef(parametized?.type)) throw new Error("expected a type");
		expect(parametized?.type.kind).toBe("function");

		const spread = props.get("spread");
		if (!spread || isTypeRef(spread?.type)) throw new Error("expected a type");
		expect(spread.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [
			        {
			          "isOptional": false,
			          "name": "spread",
			          "type": {
			            "kind": "any",
			          },
			        },
			      ],
			      "returns": {
			        "kind": "null",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(spread?.type.kind).toBe("function");
	});

	it("recognizes aliased type", ({ expect }) => {
		expect(props.get("aliased")?.type).toBe("Aliased");
		const aliased = types["Aliased"];
		if (!aliased || isTypeRef(aliased)) throw new Error("expected a type");
		expect((aliased as Doc.Fn).alias).toBe("Aliased");
		expect((aliased as Doc.Fn).sources).toBeDefined();
	});

	it("collects aliased types", ({ expect }) => {
		expect(types).toMatchInlineSnapshot(`
			{
			  "Aliased": {
			    "alias": "Aliased",
			    "calls": [
			      {
			        "parameters": [],
			        "returns": {
			          "kind": "void",
			        },
			      },
			    ],
			    "kind": "function",
			    "sources": Set {
			      "function.svelte",
			    },
			  },
			  "Baz": {
			    "alias": "Baz",
			    "kind": "union",
			    "sources": Set {
			      "function.svelte",
			    },
			    "types": [
			      {
			        "kind": "string",
			      },
			      {
			        "kind": "number",
			      },
			    ],
			  },
			}
		`);
	});
});
