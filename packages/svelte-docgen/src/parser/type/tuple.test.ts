import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../kind/guard.js";

describe("Tuple", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				type Letter = "a" | "b" | "c";
				type Num = 0 | 1 | 2;
				type Aliased = [string, boolean];
				type Recursive = number | [string | Recursive];
				interface Props {
					anonymous: [Letter, Num];
					strict: readonly [Letter, Num];
					empty: [];
					"really-empty": readonly [];
					aliased: Aliased;
					recursive: Recursive;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("tuple.svelte"),
	);

	it("documents anonymous 'tuple'", ({ expect }) => {
		const anonymous = props.get("anonymous");
		expect(anonymous?.type).toBe("[Letter, Num]");
		const type = types.get("[Letter, Num]");
		expect(type).toMatchInlineSnapshot(`
			{
			  "elements": [
			    "Letter",
			    "Num",
			  ],
			  "isReadonly": false,
			  "kind": "tuple",
			}
		`);
		expect(type?.kind).toBe("tuple");
		expect((type as Doc.Tuple).isReadonly).toBe(false);
		expect((type as Doc.Tuple).elements.length).toBeGreaterThan(0);
	});

	it("recognizes 'readonly'", ({ expect }) => {
		const strict = props.get("strict");
		expect(strict?.type).toBe("readonly [Letter, Num]");
		const type = types.get("readonly [Letter, Num]");
		expect(type).toMatchInlineSnapshot(`
			{
			  "elements": [
			    "Letter",
			    "Num",
			  ],
			  "isReadonly": true,
			  "kind": "tuple",
			}
		`);
		expect(type?.kind).toBe("tuple");
		expect((type as Doc.Tuple).isReadonly).toBe(true);
		expect((type as Doc.Tuple).elements.length).toBeGreaterThan(0);
	});

	it("recognizes empty tuple", ({ expect }) => {
		const empty = props.get("empty");
		expect(empty?.type).toBe("[]");
		const type = types.get("[]");
		expect(type).toMatchInlineSnapshot(`
			{
			  "elements": [],
			  "isReadonly": false,
			  "kind": "tuple",
			}
		`);
		expect(type?.kind).toBe("tuple");
		expect((type as Doc.Tuple).isReadonly).toBe(false);
		expect((type as Doc.Tuple).elements).toHaveLength(0);
	});

	it("recognizes 'readonly' empty tuple", ({ expect }) => {
		const empty = props.get("really-empty");
		expect(empty?.type).toBe("readonly []");
		const type = types.get("readonly []");
		expect(type).toMatchInlineSnapshot(`
			{
			  "elements": [],
			  "isReadonly": true,
			  "kind": "tuple",
			}
		`);
		expect(type?.kind).toBe("tuple");
		expect((type as Doc.Tuple).isReadonly).toBe(true);
		expect((type as Doc.Tuple).elements).toHaveLength(0);
	});

	it("recognizes aliased tuple type", ({ expect }) => {
		expect(props.get("aliased")!.type).toBe("Aliased");
	});

	it("recognizes recursive tuple", ({ expect }) => {
		const recursive = props.get("recursive");
		expect(recursive?.type).toBe("Recursive");
		const type = types.get("Recursive");
		expect((type as Doc.Union)?.types.length).toBe(2);
		const anon = (type as Doc.Union)?.types[1];
		if (!isTypeRef(anon)) throw new Error("Expected type reference");
		const anon_type = types.get(anon);
		const anon2 = (anon_type as Doc.Tuple)?.elements[0];
		if (isTypeRef(anon2)) throw new Error("Expected union");
		expect(anon2?.kind).toBe("union");
		expect((anon2 as Doc.Union)?.types.length).toBe(3);
	});

	it("collects aliased types", ({ expect }) => {
		expect(types).toMatchInlineSnapshot(`
			Map {
			  "[Letter, Num]" => {
			    "elements": [
			      "Letter",
			      "Num",
			    ],
			    "isReadonly": false,
			    "kind": "tuple",
			  },
			  "Letter" => {
			    "alias": "Letter",
			    "aliasSource": "tuple.svelte",
			    "kind": "union",
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
			  },
			  "Num" => {
			    "alias": "Num",
			    "aliasSource": "tuple.svelte",
			    "kind": "union",
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
			  },
			  "readonly [Letter, Num]" => {
			    "elements": [
			      "Letter",
			      "Num",
			    ],
			    "isReadonly": true,
			    "kind": "tuple",
			  },
			  "[]" => {
			    "elements": [],
			    "isReadonly": false,
			    "kind": "tuple",
			  },
			  "readonly []" => {
			    "elements": [],
			    "isReadonly": true,
			    "kind": "tuple",
			  },
			  "Aliased" => {
			    "alias": "Aliased",
			    "aliasSource": "tuple.svelte",
			    "elements": [
			      {
			        "kind": "string",
			      },
			      {
			        "kind": "boolean",
			      },
			    ],
			    "isReadonly": false,
			    "kind": "tuple",
			  },
			  "Recursive" => {
			    "alias": "Recursive",
			    "aliasSource": "tuple.svelte",
			    "kind": "union",
			    "types": [
			      {
			        "kind": "number",
			      },
			      "[<anon:8>]",
			    ],
			  },
			  "[<anon:8>]" => {
			    "elements": [
			      {
			        "kind": "union",
			        "types": [
			          {
			            "kind": "string",
			          },
			          {
			            "kind": "number",
			          },
			          "[<anon:8>]",
			        ],
			      },
			    ],
			    "isReadonly": false,
			    "kind": "tuple",
			  },
			  "<anon:8>" => {
			    "kind": "union",
			    "types": [
			      {
			        "kind": "string",
			      },
			      {
			        "kind": "number",
			      },
			      "[<anon:8>]",
			    ],
			  },
			}
		`);
	});
});
