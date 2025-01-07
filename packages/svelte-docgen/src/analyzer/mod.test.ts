import { describe, expectTypeOf, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { analyze, parse } from "../mod.js";
import type { Events, Slots } from "../doc/type.ts";
import { getType } from "./mod.js";

describe(analyze.name, () => {
	it("typing works for legacy component", ({ expect }) => {
		const docgen = parse(
			`
			<script lang="ts">
				export let value: number;
			</script>
				`,
			create_options("analyze-legacy.svelte"),
		);
		const analyzed = analyze(docgen);
		expect(analyzed.isLegacy).toBe(true);
		if (analyzed.isLegacy) {
			expectTypeOf(analyzed.events).toMatchTypeOf<Events>();
			expectTypeOf(analyzed.slots).toMatchTypeOf<Slots>();
		} else {
			expectTypeOf<typeof analyzed.events>().toBeNever();
			expectTypeOf<typeof analyzed.slots>().toBeNever();
		}
	});

	it("typing works for modern component", ({ expect }) => {
		const docgen = parse(
			`
			<script lang="ts">
				interface Props {
					value?: number;
				}
				let props: Props = $props();
			</script>
				`,
			create_options("analyze-modern.svelte"),
		);
		const analyzed = analyze(docgen);
		expect(analyzed.isLegacy).toBe(false);
		if (analyzed.isLegacy) {
			expectTypeOf(analyzed.events).toMatchTypeOf<Events>();
			expectTypeOf(analyzed.slots).toMatchTypeOf<Slots>();
		} else {
			expectTypeOf<typeof analyzed.events>().toBeNever();
			expectTypeOf<typeof analyzed.slots>().toBeNever();
		}
	});
});

describe(getType.name, () => {
	const docgen = parse(
		`
		<script lang="ts">
			import type { Snippet } from "svelte";
			interface Props {
				ref: Snippet;
				type: "text";
			}
			let props: Props = $props();
		</script>
			`,
		create_options("get-type-ref.svelte"),
	);
	const analyzed = analyze(docgen);

	it("it handles type reference", ({ expect }) => {
		const ref = analyzed.props.all.get("ref");
		expect(ref).toBeDefined();
		if (ref) {
			expect(getType(ref.type, docgen.types)).toBeDefined();
			expect(getType(ref.type, docgen.types)).toMatchInlineSnapshot(`
				{
				  "alias": ""svelte".Snippet",
				  "calls": [
				    {
				      "parameters": [
				        {
				          "isOptional": false,
				          "name": "args",
				          "type": "[]",
				        },
				      ],
				      "returns": {
				        "kind": "intersection",
				        "types": [
				          {
				            "kind": "interface",
				            "members": Map {
				              "{@render ...} must be called with a Snippet" => {
				                "isOptional": false,
				                "isReadonly": false,
				                "type": {
				                  "kind": "literal",
				                  "subkind": "string",
				                  "value": "import type { Snippet } from 'svelte'",
				                },
				              },
				            },
				          },
				          "SnippetReturn",
				        ],
				      },
				    },
				  ],
				  "kind": "function",
				  "sources": Set {
				    node_modules/.pnpm/svelte@<semver>/node_modules/svelte/types/index.d.ts,
				  },
				}
			`);
		}
	});

	it("it handles non-referenced type", ({ expect }) => {
		const type = analyzed.props.all.get("type");
		expect(type).toBeDefined();
		if (type) {
			expect(getType(type.type, docgen.types)).toBeDefined();
			expect(getType(type.type, docgen.types)).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "string",
				  "value": "text",
				}
			`);
		}
	});
});
