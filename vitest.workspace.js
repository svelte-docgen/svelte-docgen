/**
 * @import { UserWorkspaceConfig } from "vitest/config";
 */

import path from "node:path";
import url from "node:url";

import { loadEnv } from "vite";
import { defineWorkspace } from "vitest/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @satisfies {NonNullable<UserWorkspaceConfig>["test"]} */
const SHARED = {
	env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
	setupFiles: [path.resolve(__dirname, "tests", "setup.ts")],
	snapshotSerializers: [path.resolve(__dirname, "tests", "snapshot-serializer.ts")],
	typecheck: {
		enabled: true,
	},
};

/** @see {@link https://vitest.dev/guide/workspace} */
const config = defineWorkspace([
	{
		test: {
			...SHARED,
			name: "svelte-docgen",
			root: path.resolve(__dirname, "packages", "svelte-docgen"),
		},
	},
	{
		test: {
			...SHARED,
			name: "@svelte-docgen/extractor",
			root: path.resolve(__dirname, "packages", "extractor"),
		},
	},
	{
		test: {
			...SHARED,
			name: "@svelte-docgen/server",
			root: path.resolve(__dirname, "packages", "server"),
		},
	},
	{
		test: {
			...SHARED,
			name: "vite-plugin-svelte-docgen",
			root: path.resolve(__dirname, "packages", "vite-plugin-svelte-docgen"),
		},
	},
]);

export default config;
