import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";

describe("Interface", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				interface A {
					name: string;
					age?: number;
					moo: () => void;
				}
				interface B {
					readonly x: number;
					readonly y: number;
				}
				type AsType = {
					ugly: true;
				};
				interface Empty {}
				type EmptyType = {};
				type Aliased = A;
				interface Recursive {
					recursive: Recursive;
				}
				interface Props {
					anonymous: { name: "Guy"; surname: "Fawkes" };
					a: A;
					b: B;
					"as-type": AsType;
					"empty-aliased": Empty;
					"empty-type": EmptyType;
					aliased: Aliased;
					recursive: Recursive;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("interface.svelte"),
	);

	it("documents anonymous `interface`", ({ expect }) => {
		const anonymous = props.get("anonymous");
		expect(anonymous).toBeDefined();
		expect(anonymous?.type).toMatchInlineSnapshot(`
			{
			  "kind": "interface",
			  "members": Map {
			    "name" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "literal",
			        "subkind": "string",
			        "value": "Guy",
			      },
			    },
			    "surname" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "literal",
			        "subkind": "string",
			        "value": "Fawkes",
			      },
			    },
			  },
			}
		`);
		expect(anonymous?.type.kind).toBe("interface");
		if (anonymous?.type.kind === "interface") {
			expect(anonymous.type.alias).not.toBeDefined();
			expect(anonymous?.type.members.size).toBe(2);
			expect(anonymous?.type.members.has("name")).toBe(true);
			expect(anonymous?.type.members.has("surname")).toBe(true);
		}
	});

	it("recognizes aliased interface", ({ expect }) => {
		const a = props.get("a");
		expect(a).toBeDefined();
		expect(a?.type).toBe("A");
		if (typeof a?.type === "string") {
			const type = types.get(a.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "A",
				  "kind": "interface",
				  "members": Map {
				    "name" => {
				      "isOptional": false,
				      "isReadonly": false,
				      "type": {
				        "kind": "string",
				      },
				    },
				    "age" => {
				      "isOptional": true,
				      "isReadonly": false,
				      "type": {
				        "kind": "union",
				        "nonNullable": {
				          "kind": "number",
				        },
				        "types": [
				          {
				            "kind": "undefined",
				          },
				          {
				            "kind": "number",
				          },
				        ],
				      },
				    },
				    "moo" => {
				      "isOptional": false,
				      "isReadonly": false,
				      "type": {
				        "calls": [
				          {
				            "parameters": [],
				            "returns": {
				              "kind": "void",
				            },
				          },
				        ],
				        "kind": "function",
				      },
				    },
				  },
				  "sources": Set {
				    "interface.svelte",
				  },
				}
			`);
			if (type) {
				expect(type.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(a.type);
				}
			}
		}
	});

	it("recognizes 'readonly' members", ({ expect }) => {
		const b = props.get("b");
		expect(b).toBeDefined();
		expect(b?.type).toBe("B");
		if (typeof b?.type === "string") {
			const type = types.get(b.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "B",
				  "kind": "interface",
				  "members": Map {
				    "x" => {
				      "isOptional": false,
				      "isReadonly": true,
				      "type": {
				        "kind": "number",
				      },
				    },
				    "y" => {
				      "isOptional": false,
				      "isReadonly": true,
				      "type": {
				        "kind": "number",
				      },
				    },
				  },
				  "sources": Set {
				    "interface.svelte",
				  },
				}
			`);
			if (type) {
				expect(type.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(b.type);
				}
			}
		}
	});

	it("recognizes types which contains type with reference to interface", ({ expect }) => {
		const as_type = props.get("as-type");
		expect(as_type).toBeDefined();
		expect(as_type?.type).toBe("AsType");
		if (typeof as_type?.type === "string") {
			const type = types.get(as_type.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "AsType",
				  "kind": "interface",
				  "members": Map {
				    "ugly" => {
				      "isOptional": false,
				      "isReadonly": false,
				      "type": {
				        "kind": "literal",
				        "subkind": "boolean",
				        "value": true,
				      },
				    },
				  },
				  "sources": Set {
				    "interface.svelte",
				  },
				}
			`);
			if (type) {
				expect(type.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(as_type.type);
				}
			}
		}
	});

	it("recognizes empty aliased interface", ({ expect }) => {
		const empty_aliased = props.get("empty-aliased");
		expect(empty_aliased).toBeDefined();
		expect(empty_aliased?.type).toBe("Empty");
		if (typeof empty_aliased?.type === "string") {
			const type = types.get(empty_aliased.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "Empty",
				  "kind": "interface",
				  "members": Map {},
				  "sources": Set {
				    "interface.svelte",
				  },
				}
			`);
			if (type) {
				expect(type.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(empty_aliased.type);
					expect(type.members.size).toBe(0);
				}
			}
		}
	});

	it("recognizes empty aliased interface as type", ({ expect }) => {
		const empty_type = props.get("empty-type");
		expect(empty_type).toBeDefined();
		expect(empty_type?.type).toBe("EmptyType");
		if (typeof empty_type?.type === "string") {
			const type = types.get(empty_type.type);
			expect(type).toBeDefined();
			if (type) {
				expect(type.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(empty_type.type);
					expect(type.members?.size).toBe(0);
				}
			}
		}
	});

	it("understands type which is an alias to interface only", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toBe("A");
		if (typeof aliased?.type === "string") {
			const type = types.get(aliased.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "A",
				  "kind": "interface",
				  "members": Map {
				    "name" => {
				      "isOptional": false,
				      "isReadonly": false,
				      "type": {
				        "kind": "string",
				      },
				    },
				    "age" => {
				      "isOptional": true,
				      "isReadonly": false,
				      "type": {
				        "kind": "union",
				        "nonNullable": {
				          "kind": "number",
				        },
				        "types": [
				          {
				            "kind": "undefined",
				          },
				          {
				            "kind": "number",
				          },
				        ],
				      },
				    },
				    "moo" => {
				      "isOptional": false,
				      "isReadonly": false,
				      "type": {
				        "calls": [
				          {
				            "parameters": [],
				            "returns": {
				              "kind": "void",
				            },
				          },
				        ],
				        "kind": "function",
				      },
				    },
				  },
				  "sources": Set {
				    "interface.svelte",
				  },
				}
			`);
			if (type) {
				expect(type?.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(aliased.type);
				}
			}
		}
	});

	it("handles circularity with recursive interface members", ({ expect }) => {
		const recursive = props.get("recursive");
		expect(recursive).toBeDefined();
		expect(recursive?.type).toBe("Recursive");
		if (typeof recursive?.type === "string") {
			const type = types.get(recursive.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "alias": "Recursive",
				  "kind": "interface",
				  "members": Map {
				    "recursive" => {
				      "isOptional": false,
				      "isReadonly": false,
				      "type": "Recursive",
				    },
				  },
				  "sources": Set {
				    "interface.svelte",
				  },
				}
			`);
			if (type) {
				expect(type.kind).toBe("interface");
				if (type.kind === "interface") {
					expect(type.alias).toBe(recursive.type);
				}
			}
		}
	});
});
