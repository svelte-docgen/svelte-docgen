import path from "node:path";
import url from "node:url";

import { describe, it } from "vitest";

import { APP } from "./app.js";
import type { RequestOptions, ParsedComponent } from "./schema.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("POST /", () => {
	it("returns 200 on a valid request", async ({ expect }) => {
		const filepath = url.pathToFileURL(path.join(__dirname, "..", "examples", "test.svelte"));
		const keys = ["description", "props"] as const satisfies (keyof ParsedComponent)[];
		const body = {
			filepath: filepath.toJSON(),
			keys,
		} satisfies RequestOptions<(typeof keys)[number]>;
		const response = await APP.request("/", {
			method: "POST",
			body: JSON.stringify(body),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toMatchInlineSnapshot(
			`"{"props":[["custom",{"tags":[],"isBindable":false,"isExtended":true,"isOptional":false,"type":{"kind":"string"},"sources":["/packages/server/examples/test.svelte"]}],["children",{"tags":[],"isBindable":false,"isExtended":true,"isOptional":true,"type":{"kind":"union","types":["\\"svelte\\".Snippet<[]>",{"kind":"undefined"}],"nonNullable":"\\"svelte\\".Snippet<[]>"},"sources":["/packages/server/examples/test.svelte"]}]]}"`,
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
				  "output": {},
				  "success": false,
				  "typed": false,
				}
			`);
		});
	});
});
