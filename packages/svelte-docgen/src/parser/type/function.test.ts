import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";

describe("Fn", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				type Baz = string | number;
				type Aliased = () => number;
				type AliasedReturn = symbol;
				interface Props {
					void: () => void;
					returning: () => string;
					parametized: (foo: string, bar?: Baz) => boolean;
					spread: (...spread: any) => null;
					aliased: Aliased;
					"aliased-return": () => AliasedReturn;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("function.svelte"),
	);

	it("documents anonymous 'function' - retuning void", ({ expect }) => {
		const void_ = props.get("void");
		expect(void_).toBeDefined();
		expect(void_?.type).toMatchInlineSnapshot(`
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
		if (typeof void_?.type !== "string") {
			expect(void_?.type.kind).toBe("function");
			if (void_?.type.kind === "function") {
				expect(void_?.type.calls.length).toBeGreaterThan(0);
				expect(void_?.type.calls[0].returns).not.toBeTypeOf("string");
				expect(void_?.type.alias).not.toBeDefined();
				expect(void_?.type.sources).not.toBeDefined();
				expect(void_?.type.calls[0].parameters.length).toBe(0);
				if (typeof void_?.type.calls[0].returns !== "string") {
					expect(void_?.type.calls[0].returns.kind).toBe("void");
				}
			}
		}
	});

	it("recognizes return type other than 'void'", ({ expect }) => {
		const returning = props.get("returning");
		expect(returning).toBeDefined();
		expect(returning?.type).toMatchInlineSnapshot(`
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
		if (typeof returning?.type !== "string") {
			expect(returning?.type.kind).toBe("function");
			if (returning?.type.kind === "function") {
				expect(returning?.type.calls.length).toBeGreaterThan(0);
				expect(returning?.type.calls[0].returns).not.toBeTypeOf("string");
				expect(returning?.type.alias).not.toBeDefined();
				expect(returning?.type.sources).not.toBeDefined();
				expect(returning?.type.calls[0].parameters.length).toBe(0);
				if (typeof returning?.type.calls[0].returns !== "string") {
					expect(returning?.type.calls[0].returns.kind).toBe("string");
				}
			}
		}
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
		if (typeof parametized?.type !== "string") {
			expect(parametized?.type.kind).toBe("function");
			if (parametized?.type.kind === "function") {
				expect(parametized?.type.calls.length).toBeGreaterThan(0);
				expect(parametized?.type.calls[0].returns).not.toBeTypeOf("string");
				expect(parametized?.type.alias).not.toBeDefined();
				expect(parametized?.type.sources).not.toBeDefined();
				expect(parametized?.type.calls[0].parameters.length).toBeGreaterThan(0);
				if (typeof parametized?.type.calls[0].returns !== "string") {
					expect(parametized?.type.calls[0].returns.kind).toBe("boolean");
				}
			}
		}
	});

	it("recognizes ...spread in parameters", ({ expect }) => {
		const spread = props.get("spread");
		expect(spread).toBeDefined();
		expect(spread?.type).toMatchInlineSnapshot(`
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
		if (typeof spread?.type !== "string") {
			expect(spread?.type.kind).toBe("function");
			if (spread?.type.kind === "function") {
				expect(spread?.type.calls.length).toBeGreaterThan(0);
				expect(spread?.type.calls[0].returns).not.toBeTypeOf("string");
				expect(spread?.type.alias).not.toBeDefined();
				expect(spread?.type.sources).not.toBeDefined();
				expect(spread?.type.calls[0].parameters.length).toBeGreaterThan(0);
				if (typeof spread?.type.calls[0].returns !== "string") {
					expect(spread?.type.calls[0].returns.kind).toBe("null");
				}
			}
		}
	});

	it("recognizes aliased function", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toBe("Aliased");
		if (typeof aliased?.type === "string") {
			const type = types.get(aliased.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "Aliased",
				  "calls": [
				    {
				      "parameters": [],
				      "returns": {
				        "kind": "number",
				      },
				    },
				  ],
				  "kind": "function",
				  "sources": Set {
				    "function.svelte",
				  },
				}
			`);
			if (type) {
				expect(type.kind).toBe("function");
				if (type.kind === "function") {
					expect(type.calls.length).toBeGreaterThan(0);
					expect(type.calls[0].returns).not.toBeTypeOf("string");
					expect(type.alias).toBe(aliased.type);
					expect(type.sources).toBeDefined();
					expect(type.calls[0].parameters.length).toBe(0);
					if (typeof type.calls[0].returns !== "string") {
						expect(type.calls[0].returns.kind).toBe("number");
					}
				}
			}
		}
	});

	it("recognizes anonymous function with aliased return type", ({ expect }) => {
		const aliased_return = props.get("aliased-return");
		expect(aliased_return).toBeDefined();
		expect(aliased_return?.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [],
			      "returns": {
			        "kind": "symbol",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		if (aliased_return && typeof aliased_return?.type !== "string") {
			expect(aliased_return?.type.kind).toBe("function");
			if (aliased_return.type.kind === "function") {
				expect(aliased_return.type.calls.length).toBeGreaterThan(0);
				expect(aliased_return.type.calls[0].returns).not.toBeTypeOf("string");
				expect(aliased_return.type.alias).not.toBeDefined();
				expect(aliased_return.type.sources).not.toBeDefined();
				expect(aliased_return.type.calls[0].parameters.length).toBe(0);
				if (typeof aliased_return.type.calls[0].returns !== "string") {
					expect(aliased_return.type.calls[0].returns.kind).toBe("symbol");
				}
			}
		}
	});
});
