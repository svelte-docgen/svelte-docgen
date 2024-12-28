import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../doc/utils.js";

describe("Instantiable types", () => {
	const { props, types } = parse(
		`
		<script lang="ts" generics="K">
			let { ..._ }: {
			  index: keyof K;
				indexedAccess: number[keyof K];
				conditional: K extends string ? true : false;
				stringMapping: Uppercase<K>; 
				templateLiteral: \`Hello, \${K}!\`;
			} = $props();
		</script>
		`,
		create_options("type-parameter.svelte"),
	);

	it("documents 'index'", ({ expect }) => {
		const index = props.get("index");
		if (!index?.type || isTypeRef(index?.type)) throw new Error("must be a type");
		expect(index?.type.kind).toBe("index");
	});

	it("documents 'indexedAccess'", ({ expect }) => {
		const indexedAccess = props.get("indexedAccess");
		if (!indexedAccess?.type || isTypeRef(indexedAccess?.type)) throw new Error("must be a type");
		expect(indexedAccess.type?.kind).toBe("indexed-access");
		expect(indexedAccess.type).toMatchInlineSnapshot(`
			{
			  "indexType": {
			    "kind": "index",
			    "type": "K",
			  },
			  "kind": "indexed-access",
			  "objectType": {
			    "kind": "number",
			  },
			}
		`);
	});

	it("documents 'conditional'", ({ expect }) => {
		const conditional = props.get("conditional");
		if (!conditional?.type || isTypeRef(conditional?.type)) throw new Error("must be a type");
		expect(conditional?.type.kind).toBe("conditional");
		expect(conditional.type).toMatchInlineSnapshot(`
			{
			  "checkType": "K",
			  "extendsType": {
			    "kind": "string",
			  },
			  "kind": "conditional",
			  "resolvedFalseType": {
			    "kind": "literal",
			    "subkind": "boolean",
			    "value": false,
			  },
			  "resolvedTrueType": {
			    "kind": "literal",
			    "subkind": "boolean",
			    "value": true,
			  },
			}
		`);
	});

	it("documents 'templateLiteral'", ({ expect }) => {
		const templateLiteral = props.get("templateLiteral");
		if (!templateLiteral?.type || isTypeRef(templateLiteral?.type)) throw new Error("must be a type");
		expect(templateLiteral.type?.kind).toBe("template-literal");
		expect(templateLiteral.type).toMatchInlineSnapshot(`
			{
			  "kind": "template-literal",
			  "texts": [
			    "Hello, ",
			    "!",
			  ],
			  "types": [
			    "K",
			  ],
			}
		`);
	});

	it("documents 'stringMapping'", ({ expect }) => {
		const stringMapping = props.get("stringMapping");
		expect(stringMapping?.type).toBe("Uppercase");
		const type = types.get("Uppercase");
		expect(type?.kind).toBe("string-mapping");
		expect(type).toMatchInlineSnapshot(`
			{
			  "kind": "string-mapping",
			  "name": "Uppercase",
			  "type": "K",
			}
		`);
	});
});
