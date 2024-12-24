import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";

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
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toBe("Aliased");
		if (typeof aliased?.type === "string") {
			const type = types.get(aliased.type);
			expect(type).toBeDefined();
			expect(type).toMatchInlineSnapshot(`
				{
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
				}
			`);
			if (type) {
				expect(type.kind).toBe("intersection");
				if (type.kind === "intersection") {
					expect(type.types.length).toBeGreaterThan(0);
					expect(type.alias).toBe("Aliased");
					expect(type.sources).toBeDefined();
				}
			}
		}
	});
});
