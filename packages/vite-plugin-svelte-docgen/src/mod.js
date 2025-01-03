/**
 * Main module to be used from user perspective.
 * @module
 */

/**
 * @import { PluginOption } from "vite";
 */

import fs from "node:fs";
import url from "node:url";

import { print } from "esrap";
import * as docgen from "svelte-docgen";

import { transform_encoded } from "./transform.js";

const CACHE_STORAGE = docgen.createCacheStorage();

/**
 * This plugin creates _virtual_ JavaScript modules with data generated by `svelte-docgen` for targeted component - **on demand**.\
 * For more details, visit package's [README.md](https://github.com/svelte-docgen/svelte-docgen/tree/main/packages/vite-plugin-svelte-docgen).
 *
 * ## Setup
 *
 * Inside your [Vite config](https://vite.dev/config/):
 *
 * ```js
 * import { defineConfig } from "vite";
 * import pluginSvelteDocgen from "vite-plugin-svelte-docgen";
 * //     👆 import this package - you can name it however you want
 *
 * export default defineConfig({
 *     plugins: [
 *         // 👇 Add to plugins list - there's no strict requirement on the order
 *         pluginSvelteDocgen(),
 *     ],
 *     ...
 * });
 * ```
 *
 * ## Usage
 *
 * For the desired component you wish to import documentation data... simply **append the `?docgen` query to the module import path**.
 *
 * @example Static import
 *
 * ```js
 * import componentDocgen from "./path/to/Component.svelte?docgen";
 * //                                                     👆 Add this query parameter
 * ```
 *
 * @example Dynamic import
 * ```js
 * const componentDocgen = await import("./path/to/Component.svelte?docgen");
 * //                                                              👆 Add this query parameter
 * ```
 *
 * @returns {Promise<PluginOption[]>}
 */
async function plugin() {
	// TODO: Decide whether there is a need for plugin options
	// const user_options = new Options(user_options);
	return [
		{
			name: "vite-plugin-svelte-docgen",
			enforce: "pre",
			async resolveId(source, importer, options) {
				// https://rollupjs.org/plugin-development/#resolveid
				if (!importer) return;
				if (!source.endsWith(".svelte?docgen")) return;
				const resolution = await this.resolve(source.replace(/\?docgen$/, ""), importer, options);
				if (resolution) {
					return `\0virtual:${resolution.id}.docgen.js`;
				}
			},
			load(id) {
				if (id.startsWith("\0virtual:") && id.endsWith(".docgen.js")) {
					/* prettier-ignore */
					const original_svelte_filepath = id
					.replace("\0virtual:", "")
					.replace(".docgen.js", "");
					const svelte_filepath_url = url.pathToFileURL(original_svelte_filepath);
					const source = fs.readFileSync(svelte_filepath_url, "utf-8");
					const parsed = docgen.parse(source, {
						// @ts-expect-error: FIXME: Perhaps we really should change this to loose string type
						filepath: svelte_filepath_url.pathname,
						cache: CACHE_STORAGE,
					});
					const stringified = `export default /** @type {const} */(${docgen.encode(parsed)});`;
					const ast = transform_encoded(this.parse(stringified));
					const { code } = print(ast);
					return code;
				}
			},
		},
	];
}

export default plugin;
