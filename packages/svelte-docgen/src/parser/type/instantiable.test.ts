import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";
import { isTypeRef } from "../../doc/utils.js";
import type * as Doc from "../../doc/type.js";

describe("Instantiable types", () => {
	const { props, types } = parse(
		`
		<script lang="ts" generics="K">
		  type I<T> = keyof T;
			type IA<T> = number[keyof T];
			type C<T> = T extends string ? T : false;
			type SM<T> = Uppercase<T>; 
			type TL<G extends string , T extends string> = \`\${G}, \${T}!\`;
	 		let { ..._ }: {
			  index: I<K>;
				indexedAccess: IA<K>;
				conditional: C<K>;
				stringMapping: SM<K>;
				templateLiteral: TL<"Hello", K>;
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
		if (!indexedAccess || !isTypeRef(indexedAccess?.type)) throw new Error("must be a type");
		const type = types.get(indexedAccess.type)!;
		expect(type?.kind).toBe("indexed-access");
		expect(type).toMatchInlineSnapshot(`
			{
			  "alias": "IA",
			  "index": {
			    "kind": "index",
			    "type": "K",
			  },
			  "kind": "indexed-access",
			  "object": {
			    "kind": "number",
			  },
			  "sources": Set {
			    "type-parameter.svelte",
			  },
			}
		`);
	});

	it("documents 'conditional'", ({ expect }) => {
		const conditional = props.get("conditional");
		if (!conditional || !isTypeRef(conditional?.type)) throw new Error("must be a type");
		const type = types.get(conditional.type)!;
		expect(type.kind).toBe("conditional");
		const truthy = (type as Doc.Conditional).truthy!;
		if (isTypeRef(truthy)) throw new Error("must be a type");
		expect(truthy.kind).toBe("substitution");
		expect(type).toMatchInlineSnapshot(`
			{
			  "alias": "C",
			  "check": "K",
			  "extends": {
			    "kind": "string",
			  },
			  "falsy": {
			    "kind": "literal",
			    "subkind": "boolean",
			    "value": false,
			  },
			  "kind": "conditional",
			  "sources": Set {
			    "type-parameter.svelte",
			  },
			  "truthy": {
			    "base": "K",
			    "constraint": {
			      "kind": "string",
			    },
			    "kind": "substitution",
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
