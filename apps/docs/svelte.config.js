import path from "node:path";
import url from "node:url";

import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

import { HIGHLIGHT } from "./src/lib/util/md.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @satisfies {import("@sveltejs/kit").Config} */
const config = {
	extensions: [".md", ".svelte"],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),

		alias: {
			"$assets/*": path.resolve(__dirname, "..", "..", "assets", "*"),
		},

		prerender: {
			handleMissingId: "warn",
		},
	},

	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [
				// NOTE: The reason we use `.svelte.md` instead of `svx` is a better integration with IDEs
				".svelte.md",
			],
			highlight: HIGHLIGHT,
		}),
	],
};

export default config;
