import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
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
			interface Props {
				custom: Custom;
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
		expect(custom).toBeDefined();
		expect(custom?.type).toBe("Custom");
		if (typeof custom?.type === "string") {
			const type = types.get(custom.type);
			expect(type).toBeDefined();
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
				              "kind": "undefined",
				            },
				            {
				              "kind": "number",
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
			if (type) {
				expect(type.kind).toBe("constructible");
				if (type.kind === "constructible") {
					expect(type.constructors.length).toBeGreaterThan(0);
					expect(type.name).toBe(custom.type);
				}
			}
		}
	});

	it("recognizes builtin `Date`", ({ expect }) => {
		const date = props.get("date");
		expect(date).toBeDefined();
		expect(date?.type).toBe("Date");
		if (typeof date?.type === "string") {
			const type = types.get(date.type);
			expect(type).toBeDefined();
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
				              "kind": "undefined",
				            },
				            {
				              "kind": "number",
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
				              "kind": "undefined",
				            },
				            {
				              "kind": "number",
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
				              "kind": "undefined",
				            },
				            {
				              "kind": "number",
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
				              "kind": "undefined",
				            },
				            {
				              "kind": "number",
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
				              "kind": "undefined",
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
			if (type) {
				expect(type.kind).toBe("constructible");
				if (type.kind === "constructible") {
					expect(type.constructors.length).toBeGreaterThan(0);
					expect(type.name).toBe(date.type);
				}
			}
		}
	});

	it("recognizes builtin `Map`", ({ expect }) => {
		const map = props.get("map");
		expect(map).toBeDefined();
		expect(map?.type).toBe("Map");
		if (typeof map?.type === "string") {
			const type = types.get(map.type);
			expect(type).toBeDefined();
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
				          "nonNullable": {
				            "element": {
				              "elements": [
				                {
				                  "constraint": {
				                    "kind": "unknown",
				                  },
				                  "isConst": false,
				                  "kind": "type-parameter",
				                  "name": "K",
				                },
				                {
				                  "constraint": {
				                    "kind": "unknown",
				                  },
				                  "isConst": false,
				                  "kind": "type-parameter",
				                  "name": "V",
				                },
				              ],
				              "isReadonly": true,
				              "kind": "tuple",
				            },
				            "isReadonly": true,
				            "kind": "array",
				          },
				          "types": [
				            {
				              "kind": "undefined",
				            },
				            {
				              "kind": "null",
				            },
				            {
				              "element": {
				                "elements": [
				                  {
				                    "constraint": {
				                      "kind": "unknown",
				                    },
				                    "isConst": false,
				                    "kind": "type-parameter",
				                    "name": "K",
				                  },
				                  {
				                    "constraint": {
				                      "kind": "unknown",
				                    },
				                    "isConst": false,
				                    "kind": "type-parameter",
				                    "name": "V",
				                  },
				                ],
				                "isReadonly": true,
				                "kind": "tuple",
				              },
				              "isReadonly": true,
				              "kind": "array",
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
				          "nonNullable": "Iterable",
				          "types": [
				            {
				              "kind": "undefined",
				            },
				            {
				              "kind": "null",
				            },
				            "Iterable",
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
			if (type) {
				expect(type.kind).toBe("constructible");
				if (type.kind === "constructible") {
					expect(type.constructors.length).toBeGreaterThan(0);
					expect(type.name).toBe(map.type);
				}
			}
		}
	});

	it("recognizes builtin `Set`", ({ expect }) => {
		const set = props.get("set");
		expect(set).toBeDefined();
		expect(set?.type).toBe("Set");
		if (typeof set?.type === "string") {
			const type = types.get(set.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
				  "constructors": [
				    [
				      {
				        "isOptional": true,
				        "name": "values",
				        "type": {
				          "kind": "union",
				          "nonNullable": {
				            "element": {
				              "constraint": {
				                "kind": "unknown",
				              },
				              "default": {
				                "kind": "any",
				              },
				              "isConst": false,
				              "kind": "type-parameter",
				              "name": "T",
				            },
				            "isReadonly": true,
				            "kind": "array",
				          },
				          "types": [
				            {
				              "kind": "undefined",
				            },
				            {
				              "kind": "null",
				            },
				            {
				              "element": {
				                "constraint": {
				                  "kind": "unknown",
				                },
				                "default": {
				                  "kind": "any",
				                },
				                "isConst": false,
				                "kind": "type-parameter",
				                "name": "T",
				              },
				              "isReadonly": true,
				              "kind": "array",
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
				          "nonNullable": "Iterable",
				          "types": [
				            {
				              "kind": "undefined",
				            },
				            {
				              "kind": "null",
				            },
				            "Iterable",
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
			if (type) {
				expect(type.kind).toBe("constructible");
				if (type.kind === "constructible") {
					expect(type.constructors.length).toBeGreaterThan(0);
					expect(type.name).toBe(set.type);
				}
			}
		}
	});
});
