import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Constructible", () => {
	const { props, types } = parse(
		`
		<script lang="ts">
			class Custom {
				foo: string;
				bar?: number;
				baz: string;
				constructor(foo: string, bar?: number, baz = "hello") {
					this.foo = foo;
					this.bar = bar;
					this.baz = baz;
				}
			}
			class Custom2<T> {
			  foo: T;
			}
			type Aliased = Custom2<string>;
			interface Props {
				custom: Custom;
				aliased: Aliased;
				date: Date;
				map: Map<string, number>;
				set: Set<string>;
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("constructible.svelte"),
	);

	it("documents 'constructible' - custom", ({ expect }) => {
		const custom = props.get("custom");
		expect(custom?.type).toBe("Custom");
		// if (!custom || isTypeRef(custom.type)) throw new Error("expected a type");
		const type = types.get("Custom");
		expect(type?.kind).toBe("constructible");
		expect((type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
		expect(type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [
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
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "number",
			            },
			            {
			              "kind": "undefined",
			            },
			          ],
			        },
			      },
			      {
			        "default": {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "hello",
			        },
			        "isOptional": false,
			        "name": "baz",
			        "type": {
			          "kind": "string",
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Custom",
			  "sources": Set {
			    "constructible.svelte",
			  },
			}
		`);
	});

	it("recognizes 'aliased'", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased?.type).toBe("Aliased");
		const type = types.get("Aliased");
		expect(type?.kind).toBe("constructible");
		expect(type).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "constructors": [
			    [],
			  ],
			  "kind": "constructible",
			  "name": "Custom2",
			  "sources": Set {
			    "constructible.svelte",
			  },
			}
		`);
	});

	it("recognizes builtin `Date`", ({ expect }) => {
		const date = props.get("date");
		expect(date?.type).toBe("Date");
		const type = types.get("Date");
		expect(type?.kind).toBe("constructible");
		expect((type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
		expect(type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [],
			    [
			      {
			        "isOptional": false,
			        "name": "value",
			        "type": {
			          "kind": "union",
			          "types": [
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
			    [
			      {
			        "isOptional": false,
			        "name": "year",
			        "type": {
			          "kind": "number",
			        },
			      },
			      {
			        "isOptional": false,
			        "name": "monthIndex",
			        "type": {
			          "kind": "number",
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "date",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "number",
			            },
			            {
			              "kind": "undefined",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "hours",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "number",
			            },
			            {
			              "kind": "undefined",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "minutes",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "number",
			            },
			            {
			              "kind": "undefined",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "seconds",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "number",
			            },
			            {
			              "kind": "undefined",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "ms",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "number",
			            },
			            {
			              "kind": "undefined",
			            },
			          ],
			        },
			      },
			    ],
			    [
			      {
			        "isOptional": false,
			        "name": "value",
			        "type": {
			          "kind": "union",
			          "types": [
			            {
			              "kind": "string",
			            },
			            {
			              "kind": "number",
			            },
			            "Date",
			          ],
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Date",
			  "sources": Set {
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es5.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2020.date.d.ts,
			  },
			}
		`);
	});

	it("recognizes builtin `Map`", ({ expect }) => {
		const map = props.get("map");
		expect(map?.type).toBe("Map<string, number>");
		const type = types.get("Map<string, number>");
		expect(type?.kind).toBe("constructible");
		expect((type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
		expect(type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [],
			    [
			      {
			        "isOptional": true,
			        "name": "entries",
			        "type": {
			          "kind": "union",
			          "nonNullable": "ReadonlyArray<readonly [K, V]>",
			          "types": [
			            "ReadonlyArray<readonly [K, V]>",
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			          ],
			        },
			      },
			    ],
			    [],
			    [
			      {
			        "isOptional": true,
			        "name": "iterable",
			        "type": {
			          "kind": "union",
			          "nonNullable": "Iterable<readonly [K, V], any, any>",
			          "types": [
			            "Iterable<readonly [K, V], any, any>",
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			          ],
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Map",
			  "sources": Set {
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.collection.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			  },
			}
		`);
	});

	it("recognizes builtin `Set`", ({ expect }) => {
		const set = props.get("set");
		expect(set?.type).toBe("Set<string>");
		const type = types.get("Set<string>");
		expect(type?.kind).toBe("constructible");
		expect((type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
		expect(type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [
			      {
			        "isOptional": true,
			        "name": "values",
			        "type": {
			          "kind": "union",
			          "nonNullable": "ReadonlyArray<T>",
			          "types": [
			            "ReadonlyArray<T>",
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			          ],
			        },
			      },
			    ],
			    [
			      {
			        "isOptional": true,
			        "name": "iterable",
			        "type": {
			          "kind": "union",
			          "nonNullable": "Iterable<T, any, any>",
			          "types": [
			            "Iterable<T, any, any>",
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			          ],
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Set",
			  "sources": Set {
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.collection.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			    /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.esnext.collection.d.ts,
			  },
			}
		`);
	});
});
