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
});
