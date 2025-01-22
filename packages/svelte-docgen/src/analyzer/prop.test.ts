import path from "node:path";
import url from "node:url";

import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";
import { PropAnalyzer } from "./prop.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe(PropAnalyzer.name, () => {
	describe("getter .description", () => {
		it("returns data when JSDoc tag is present above prop", ({ expect }) => {
			const { props, types, isLegacy } = parse(
				`
				<script lang="ts">
					interface Props {
						/** Example description. */
						described: any;
					}
					let prop: Props = $props();
				</script>
				`,
				create_options("analyze-property-description-described.svelte"),
			);
			const described = props.get("described");
			expect(described).toBeDefined();
			if (described) {
				const { description } = new PropAnalyzer({ data: described, types, isLegacy });
				expect(description).toBeDefined();
				if (description) {
					expect(description.length).toBe(1);
					expect(description[0].text).toMatchInlineSnapshot(`"Example description."`);
				}
			}
		});

		it("returns undefined when no description found", ({ expect }) => {
			const { props, types, isLegacy } = parse(
				`
				<script lang="ts">
					interface Props {
						undescribed: any;
					}
					let prop: Props = $props();
				</script>
				`,
				create_options("analyze-property-description-undescribed.svelte"),
			);
			const undescribed = props.get("undescribed");
			expect(undescribed).toBeDefined();
			if (undescribed) {
				const { description } = new PropAnalyzer({ data: undescribed, types, isLegacy });
				expect(description).not.toBeDefined();
			}
		});
	});

	describe("getter .tags", () => {
		it("returns empty array if no tags found", ({ expect }) => {
			const { props, types, isLegacy } = parse(
				`
				<script lang="ts">
					interface Props {
						tagless: any;
					}
					let prop: Props = $props();
				</script>
				`,
				create_options("analyze-property-tags-empty.svelte"),
			);
			const tagless = props.get("tagless");
			expect(tagless).toBeDefined();
			if (tagless) {
				const { tags } = new PropAnalyzer({ data: tagless, types, isLegacy });
				expect(tags).toBeDefined();
				expect(tags.length).toBe(0);
			}
		});
	});

	describe("getter .isBindable", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				interface Props {
					value?: number;
					disabled?: boolean;
				}
				let { value = $bindable(0), disabled = false }: Props = $props();
			</script>
			`,
			create_options("analyze-property-is-bindable.svelte"),
		);
		it("returns true when prop is bindable", ({ expect }) => {
			const value = props.get("value");
			expect(value).toBeDefined();
			if (value) {
				const analyzer = new PropAnalyzer({ data: value, types, isLegacy });
				expect(analyzer.isBindable).toBe(true);
			}
		});

		it("returns false when prop is not bindable (modern)", ({ expect }) => {
			const disabled = props.get("disabled");
			expect(disabled).toBeDefined();
			if (disabled) {
				const analyzer = new PropAnalyzer({ data: disabled, types, isLegacy });
				expect(analyzer.isBindable).toBe(false);
			}
		});
	});

	describe("getter .isOptional", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				interface Props {
					optional?: any;
					required: unknown;
				}
				let props: Props = $props();
			</script>
			`,
			create_options("analyze-property-is-optional.svelte"),
		);
		it("returns true when prop is optional", ({ expect }) => {
			const optional = props.get("optional");
			expect(optional).toBeDefined();
			if (optional) {
				const analyzer = new PropAnalyzer({ data: optional, types, isLegacy });
				expect(analyzer.isOptional).toBe(true);
			}
		});

		it("returns false when prop is required", ({ expect }) => {
			const required = props.get("required");
			expect(required).toBeDefined();
			if (required) {
				const analyzer = new PropAnalyzer({ data: required, types, isLegacy });
				expect(analyzer.isBindable).toBe(false);
			}
		});
	});

	describe("getter .default", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				interface Props {
					defaultized?: Date;
					optional?: any;
					required: unknown;
				}
				let { defaultized = new Date() }: Props = $props();
			</script>
			`,
			create_options("analyze-property-default.svelte"),
		);
		it("it returns type (without reference) when it has default", ({ expect }) => {
			const defaultized = props.get("defaultized");
			expect(defaultized).toBeDefined();
			if (defaultized) {
				const analyzer = new PropAnalyzer({ data: defaultized, types, isLegacy });
				expect(analyzer.isOptional).toBe(true);
				expect(analyzer.default).toBeDefined();
				expect(analyzer.default).not.toBeTypeOf("string");
				expect(analyzer.default).toMatchInlineSnapshot(`
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
					    node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es5.d.ts,
					    node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
					    node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es2020.date.d.ts,
					  },
					}
				`);
			}
		});

		it("returns undefined when optional prop doesn't have a default value", ({ expect }) => {
			const optional = props.get("optional");
			expect(optional).toBeDefined();
			if (optional) {
				const analyzer = new PropAnalyzer({ data: optional, types, isLegacy });
				expect(analyzer.isOptional).toBe(true);
				expect(analyzer.default).not.toBeDefined();
			}
		});

		it("throws error when attempting to access default value in required prop", ({ expect }) => {
			const required = props.get("required");
			expect(required).toBeDefined();
			if (required) {
				const analyzer = new PropAnalyzer({ data: required, types, isLegacy });
				expect(analyzer.isOptional).toBe(false);
				expect(() => analyzer.default).toThrowErrorMatchingInlineSnapshot(`[Error: Not optional!]`);
			}
		});
	});

	describe("getter .isEventHandler", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				import type { EventHandler, MouseEventHandler } from "svelte/elements";

				interface Props {
					onclick: MouseEventHandler<HTMLDivElement>;
					onkeydown: EventHandler<KeyboardEvent, HTMLDivElement>;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("analyze-property-event-handler.svelte"),
		);

		it("recognizes event handler when using `<Name>EventHandler` type helper", ({ expect }) => {
			const onclick = props.get("onclick");
			expect(onclick).toBeDefined();
			if (onclick) {
				const analyzer = new PropAnalyzer({ data: onclick, types, isLegacy });
				expect(analyzer.isEventHandler).toBe(true);
			}
		});

		it("recognizes event handler when using `EventHandler` type helper", ({ expect }) => {
			const onkeydown = props.get("onkeydown");
			if (onkeydown) {
				const analyzer = new PropAnalyzer({ data: onkeydown, types, isLegacy });
				expect(analyzer.isEventHandler).toBe(true);
			}
		});

		it("recognizes event handlers from extended props", ({ expect }) => {
			const { props, types } = parse(
				`
			<script lang="ts">
				import type { HTMLButtonAttributes } from "svelte/elements";

				interface Props extends HTMLButtonAttributes {
				}
				let { ..._ }: Props = $props();
			</script>
			`,
				create_options("analyze-property-event-handler-extended.svelte"),
			);
			const onfocus = props.get("onfocus");
			if (onfocus) {
				const analyzer = new PropAnalyzer({ data: onfocus, types, isLegacy });
				expect(analyzer.isEventHandler).toBe(true);
			}
		});
	});

	describe("getters .isExtended & .sources", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				import type { HTMLButtonAttributes } from "svelte/elements";
				import type { CustomProps } from "${path.join(__dirname, "..", "..", "tests", "custom-extended.ts")}";
				interface Props extends HTMLButtonAttributes, CustomProps {}
				let prop: Props = $props();
			</script>
			`,
			create_options("analyze-property-is-extended-and-sources.svelte"),
		);

		it("recognizes prop extended by Svelte types", ({ expect }) => {
			const aria_hidden = props.get("aria-hidden");
			expect(aria_hidden).toBeDefined();
			if (aria_hidden) {
				const analyzer = new PropAnalyzer({ data: aria_hidden, types, isLegacy });
				expect(analyzer.isExtended).toBe(true);
				expect(analyzer.sources).toBeDefined();
				expect(analyzer.sources).toMatchInlineSnapshot(`
					Set {
					  node_modules/.pnpm/svelte@<semver>/node_modules/svelte/elements.d.ts,
					}
				`);
			}
		});

		it("recognizes not extended by Svelte prop", ({ expect }) => {
			const custom = props.get("exported");
			expect(custom).toBeDefined();
			expect(custom?.isExtended).toBe(true);
			if (custom) {
				const analyzer = new PropAnalyzer({ data: custom, types, isLegacy });
				expect(analyzer.isExtended).toBe(true);
				expect(analyzer.sources).toMatchInlineSnapshot(`
					Set {
					  "packages/svelte-docgen/tests/custom-extended.ts",
					}
				`);
			}
		});
	});

	describe("getter .sources", () => {
		it("recognizes prop extended by Svelte types", ({ expect }) => {
			const { props, types, isLegacy } = parse(
				`
				<script lang="ts">
					interface Props {
						local: any;
					}
					let prop: Props = $props();
				</script>
				`,
				create_options("analyze-property-sources-none.svelte"),
			);
			const local = props.get("local");
			expect(local).toBeDefined();
			if (local) {
				const analyzer = new PropAnalyzer({ data: local, types, isLegacy });
				expect(analyzer.isExtended).toBe(false);
				expect(() => analyzer.sources).toThrowErrorMatchingInlineSnapshot(`[Error: Not extended!]`);
			}
		});
	});

	describe("getter .isExtendedBySvelte", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				import type { HTMLButtonAttributes } from "svelte/elements";
				import type { CustomProps } from "${path.join(__dirname, "..", "..", "tests", "custom-extended.ts")}";

				interface Props extends HTMLButtonAttributes, CustomProps {}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("analyze-property-extended-by-svelte.svelte"),
		);

		it("recognizes prop extended by Svelte", ({ expect }) => {
			const aria_hidden = props.get("aria-hidden");
			expect(aria_hidden).toBeDefined();
			if (aria_hidden) {
				const analyzer = new PropAnalyzer({ data: aria_hidden, types, isLegacy });
				expect(analyzer.isExtendedBySvelte).toBe(true);
			}
		});

		it("recognizes not extended by Svelte prop", ({ expect }) => {
			const custom = props.get("exported");
			expect(custom).toBeDefined();
			expect(custom?.isExtended).toBe(true);
			if (custom) {
				const analyzer = new PropAnalyzer({ data: custom, types, isLegacy });
				expect(analyzer.isExtendedBySvelte).toBe(false);
				expect(custom).toMatchInlineSnapshot(`
					{
					  "isBindable": false,
					  "isExtended": true,
					  "isOptional": false,
					  "sources": Set {
					    "packages/svelte-docgen/tests/custom-extended.ts",
					  },
					  "tags": [],
					  "type": {
					    "kind": "string",
					  },
					}
				`);
			}
		});
	});

	describe("getter .isSnippet & getSnippetParameters()", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				import type { Snippet } from "svelte";

				type Color = "red" | "green" | "blue";
				interface Props {
					header?: Snippet<[string]>;
					children: Snippet;
					footer?: Snippet<[Color, number]>;
					whatever: any;
				}
				let { footer = default_footer }: Props = $props();
				const color = "red" satisfies Color;
			</script>

			{#snippet default_footer(color: Color, year: number)}
				<p class:color>{\`Copyright © \${year}\`}</p>
			{/snippet}

			{@render footer(color, new Date().getFullYear())}
			`,
			create_options("analyze-property-snippet.svelte"),
		);

		it("recognizes simple snippet without parameters", ({ expect }) => {
			const children = props.get("children");
			expect(children).toBeDefined();
			if (children) {
				const analyzer = new PropAnalyzer({ data: children, types, isLegacy });
				expect(analyzer.isSnippet).toBe(true);
				if (analyzer.isSnippet) {
					expect(analyzer.getSnippetParameters().elements).toHaveLength(0);
				}
			}
		});

		it("recognizes snippet with single parameter", ({ expect }) => {
			const header = props.get("header");
			expect(header).toBeDefined();
			if (header) {
				const analyzer = new PropAnalyzer({ data: header, types, isLegacy });
				expect(analyzer.isSnippet).toBe(true);
				if (analyzer.isSnippet) {
					expect(analyzer.getSnippetParameters().elements).toHaveLength(1);
				}
			}
		});

		it("recognizes snippet with multiple parameters", ({ expect }) => {
			const footer = props.get("footer");
			expect(footer).toBeDefined();
			if (footer) {
				const analyzer = new PropAnalyzer({ data: footer, types, isLegacy });
				expect(analyzer.isSnippet).toBe(true);
				if (analyzer.isSnippet) {
					expect(analyzer.getSnippetParameters().elements).toHaveLength(2);
				}
			}
		});

		it("returns false for non-snippet", ({ expect }) => {
			const whatever = props.get("whatever");
			expect(whatever).toBeDefined();
			if (whatever) {
				const analyzer = new PropAnalyzer({ data: whatever, types, isLegacy });
				expect(analyzer.isSnippet).toBe(false);
			}
		});
	});

	describe("getter .type", () => {
		const { props, types, isLegacy } = parse(
			`
			<script lang="ts">
				import type { Snippet } from "svelte";
				interface Props {
					children: Snippet;
				}
				let prop: Props = $props();
			</script>
			`,
			create_options("analyze-property-type.svelte"),
		);

		it("returns type (without reference) to the prop type", ({ expect }) => {
			const children = props.get("children");
			expect(children).toBeDefined();
			if (children) {
				const analyzer = new PropAnalyzer({ data: children, types, isLegacy });
				expect(analyzer.type).not.toBeTypeOf("string");
				expect(analyzer.type).toMatchInlineSnapshot(`
					{
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
					  "name": ""svelte".Snippet",
					  "sources": Set {
					    node_modules/.pnpm/svelte@<semver>/node_modules/svelte/types/index.d.ts,
					  },
					  "typeArgs": [
					    "[]",
					  ],
					}
				`);
			}
		});
	});
});
