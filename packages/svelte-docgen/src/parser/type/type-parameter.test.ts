import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../kind/guard.js";

describe("TypeParam", () => {
	const { props, types } = parse(
		`
		<script lang="ts" generics="U, const C, R extends number, D = string">
			interface Props {
				unknown: U;
				constant: C;
				constraint: R;
				default: D;
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("type-parameter.svelte"),
	);

	it("documents unknown 'type-parameter'", ({ expect }) => {
		const unknown = props.get("unknown");
		expect(unknown?.type).toBe("U");
		const type = types.get("U")!;
		expect(type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "U",
			}
		`);
		expect(type.kind).toBe("type-parameter");
		expect((type as Doc.TypeParam).isConst).toBe(false);
		const constraint = (type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint)) throw new Error("Expected a type");
		expect(constraint.kind).toBe("unknown");
		expect((type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes `const`", ({ expect }) => {
		const constant = props.get("constant");
		expect(constant?.type).toBe("C");
		const type = types.get("C")!;
		expect(type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "isConst": true,
			  "kind": "type-parameter",
			  "name": "C",
			}
		`);
		expect(type.kind).toBe("type-parameter");
		expect((type as Doc.TypeParam).isConst).toBe(true);
		const constraint = (type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint)) throw new Error("Expected a type");
		expect(constraint.kind).toBe("unknown");
		expect((constant?.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes constraint", ({ expect }) => {
		const constraint = props.get("constraint");
		expect(constraint?.type).toBe("R");
		const type = types.get("R")!;
		expect(type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "number",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "R",
			}
		`);
		expect(type.kind).toBe("type-parameter");
		expect((type as Doc.TypeParam).isConst).toBe(false);
		const constraint2 = (type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint2)) throw new Error("Expected a type");
		expect(constraint2.kind).toBe("number");
		expect((type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes default", ({ expect }) => {
		const default_ = props.get("default");
		expect(default_?.type).toBe("D");
		const type = types.get("D")!;
		expect(type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "default": {
			    "kind": "string",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "D",
			}
		`);
		expect(type.kind).toBe("type-parameter");
		expect((type as Doc.TypeParam).isConst).toBe(false);
		const constraint = (type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint)) throw new Error("Expected a type");
		expect(constraint.kind).toBe("unknown");
		const default2 = (type as Doc.TypeParam).default as Doc.TypeParam;
		if (!default2 || isTypeRef(default2)) throw new Error("Expected a type");
		expect(default2.kind).toBe("string");
	});
});
