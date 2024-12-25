import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../doc/type.js";

describe("TypeParam", () => {
	const { props } = parse(
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
		if (!unknown || isTypeRef(unknown.type)) throw new Error("Expected a type");
		expect(unknown.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "U",
			}
		`);
		expect(unknown.type.kind).toBe("type-parameter");
		expect((unknown.type as Doc.TypeParam).isConst).toBe(false);
		const constraint = (unknown?.type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint)) throw new Error("Expected a type");
		expect(constraint.kind).toBe("unknown");
		expect((unknown.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes `const`", ({ expect }) => {
		const constant = props.get("constant");
		if (!constant || isTypeRef(constant.type)) throw new Error("Expected a type");
		expect(constant.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "isConst": true,
			  "kind": "type-parameter",
			  "name": "C",
			}
		`);
		expect(constant.type.kind).toBe("type-parameter");
		expect((constant.type as Doc.TypeParam).isConst).toBe(true);
		const constraint = (constant?.type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint)) throw new Error("Expected a type");
		expect(constraint.kind).toBe("unknown");
		expect((constant?.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes constraint", ({ expect }) => {
		const constraint = props.get("constraint");
		if (!constraint || isTypeRef(constraint.type)) throw new Error("Expected a type");
		expect(constraint.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "number",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "R",
			}
		`);
		expect(constraint.type.kind).toBe("type-parameter");
		expect((constraint.type as Doc.TypeParam).isConst).toBe(false);
		const constraint2 = (constraint?.type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint2)) throw new Error("Expected a type");
		expect(constraint2.kind).toBe("number");
		expect((constraint.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes default", ({ expect }) => {
		const default_ = props.get("default");
		if (!default_ || isTypeRef(default_.type)) throw new Error("Expected a type");
		expect(default_.type).toMatchInlineSnapshot(`
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
		expect(default_.type.kind).toBe("type-parameter");
		expect((default_.type as Doc.TypeParam).isConst).toBe(false);
		const constraint = (default_?.type as Doc.TypeParam).constraint;
		if (isTypeRef(constraint)) throw new Error("Expected a type");
		expect(constraint.kind).toBe("unknown");
		const default2 = (default_.type as Doc.TypeParam).default as Doc.TypeParam;
		console.log(default2);
		if (!default2 || isTypeRef(default2)) throw new Error("Expected a type");
		expect(default2.kind).toBe("string");
	});
});
