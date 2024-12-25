import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";
import type * as Doc from "../../doc/type.js";

describe("Intersection", () => {
	const { props, types } = parse(
		`
			<script lang="ts">
				type Aliased = number & {};
				interface Props {
					anonymous: string & {};
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("intersection.svelte"),
	);

	it("documents anonymous 'intersection'", ({ expect }) => {
		const anonymous = props.get("anonymous");
		expect(anonymous).toBeDefined();
		expect(anonymous?.type).toMatchInlineSnapshot(`
			{
			  "kind": "intersection",
			  "types": [
			    {
			      "kind": "string",
			    },
			    {
			      "kind": "object",
			    },
			  ],
			}
		`);
		if (anonymous && typeof anonymous?.type !== "string") {
			expect(anonymous?.type.kind).toBe("intersection");
			if (anonymous.type.kind === "intersection") {
				expect(anonymous?.type.alias).not.toBeDefined();
				expect(anonymous?.type.types.length).toBeGreaterThan(0);
				expect(anonymous?.type.sources).not.toBeDefined();
			}
		}
	});

	it("recognizes aliased", ({ expect }) => {
		expect(props.get("aliased")!.type).toBe("Aliased");
	});

	it("collects aliases", ({ expect }) => {
		expect(types).toMatchInlineSnapshot(`
			{
			  "Aliased": {
			    "alias": "Aliased",
			    "kind": "intersection",
			    "sources": Set {
			      "intersection.svelte",
			    },
			    "types": [
			      {
			        "kind": "number",
			      },
			      {
			        "kind": "object",
			      },
			    ],
			  },
			}
		`);
		const aliased = types["Aliased"] as Doc.Intersection;
		expect(aliased.sources).toBeDefined();
		expect(aliased.types.length).greaterThan(0);
	});
});
