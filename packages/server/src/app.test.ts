import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { describe, it } from "vitest";

import { APP } from "./app.js";
import type { BodySchema } from "./schema.js";

describe("POST /", () => {
	it("returns 200 on a valid request", async ({ expect }) => {
		const filepath = url.pathToFileURL(path.join(__dirname, "..", "examples", "test.svelte"));
		const body = {
			filepath: filepath.toJSON(),
			fields: ["description", "props"],
		} satisfies BodySchema;
		const response = await APP.request("/", {
			method: "POST",
			body: JSON.stringify(body),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toMatchInlineSnapshot(
			`{"props":[["custom",{"tags":[],"isBindable":false,"isExtended":false,"isOptional":false,"type":{"kind":"string"}}],["children",{"tags":[],"isBindable":false,"isExtended":false,"isOptional":true,"type":{"kind":"union","types":[{"kind":"undefined"},{"kind":"function","calls":[{"parameters":[{"name":"args","isOptional":false,"type":{"kind":"tuple","isReadonly":false,"elements":[]}}],"returns":{"kind":"intersection","types":[{"kind":"interface","members":[["{@render ...} must be called with a Snippet",{"isOptional":false,"isReadonly":false,"type":{"kind":"literal","subkind":"string","value":"import type { Snippet } from 'svelte'"}}]]},{"kind":"literal","subkind":"symbol"}]}},{"parameters":[{"name":"args","isOptional":false,"type":{"kind":"tuple","isReadonly":false,"elements":[]}}],"returns":{"kind":"intersection","types":[{"kind":"interface","members":[["{@render ...} must be called with a Snippet",{"isOptional":false,"isReadonly":false,"type":{"kind":"literal","subkind":"string","value":"import type { Snippet } from 'svelte'"}}]]},{"kind":"literal","subkind":"symbol"}]}}],"alias":"Snippet","sources":["<process-cwd>/node_modules/.pnpm/svelte@<semver>/node_modules/svelte/types/index.d.ts","<process-cwd>/node_modules/.pnpm/svelte@5.11.2/node_modules/svelte/types/index.d.ts"]}],"nonNullable":{"kind":"function","calls":[{"parameters":[{"name":"args","isOptional":false,"type":{"kind":"tuple","isReadonly":false,"elements":[]}}],"returns":{"kind":"intersection","types":[{"kind":"interface","members":[["{@render ...} must be called with a Snippet",{"isOptional":false,"isReadonly":false,"type":{"kind":"literal","subkind":"string","value":"import type { Snippet } from 'svelte'"}}]]},{"kind":"literal","subkind":"symbol"}]}},{"parameters":[{"name":"args","isOptional":false,"type":{"kind":"tuple","isReadonly":false,"elements":[]}}],"returns":{"kind":"intersection","types":[{"kind":"interface","members":[["{@render ...} must be called with a Snippet",{"isOptional":false,"isReadonly":false,"type":{"kind":"literal","subkind":"string","value":"import type { Snippet } from 'svelte'"}}]]},{"kind":"literal","subkind":"symbol"}]}}],"alias":"Snippet","sources":["<process-cwd>/node_modules/.pnpm/svelte@5.10.0/node_modules/svelte/types/index.d.ts","<process-cwd>/node_modules/.pnpm/svelte@5.11.2/node_modules/svelte/types/index.d.ts"]}}}]]}`,
		);
	});

	describe("returns 400 on an invalid request", () => {
		it("when filepath was not provided", async ({ expect }) => {
			const body = {
				fields: ["description", "props"],
			};
			const ressponse = await APP.request("/", {
				method: "POST",
				body: JSON.stringify(body),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(ressponse.status).toBe(400);
			const res_body = await ressponse.json();
			expect(res_body).toMatchInlineSnapshot(`
				{
				  "issues": [
				    {
				      "expected": "string",
				      "kind": "schema",
				      "message": "Invalid type: Expected string but received undefined",
				      "path": [
				        {
				          "input": {
				            "fields": [
				              "description",
				              "props",
				            ],
				          },
				          "key": "filepath",
				          "origin": "value",
				          "type": "object",
				        },
				      ],
				      "received": "undefined",
				      "type": "string",
				    },
				  ],
				  "output": {
				    "fields": [
				      "description",
				      "props",
				    ],
				  },
				  "success": false,
				  "typed": false,
				}
			`);
		});
	});
});