import path from "pathe";
import ts from "typescript";

import { createCacheStorage } from "./cache.js";
import { IS_NODE_LIKE } from "./util.js";

/**
 * @import { SvelteFilepath, TSXFilepath } from "./util.js";
 */

/** @typedef {Partial<Options> & { filepath?: SvelteFilepath | (string & {}) }} UserOptions */

export class Options {
	/** @type {ReturnType<typeof createCacheStorage>} */
	cache;
	/** @type {SvelteFilepath} */
	filepath;
	/** @type {ts.System} */
	system;
	/** @type {ts.CompilerHost | undefined} */
	host;
	/** @type {string} */
	shims_path = get_module_url("svelte2tsx/svelte-shims-v4.d.ts").pathname;

	/** @param {UserOptions} user_options */
	constructor(user_options) {
		this.system = user_options.system ?? ts.sys;
		this.cache = user_options.cache ?? createCacheStorage(this.system);
		this.host = user_options.host;
		if (user_options.filepath) {
			const filepath = this.#parse_filepath(user_options.filepath);
			this.#validate_filepath(filepath);
			this.filepath = filepath;
		} else this.filepath = this.#random_filepath;
	}

	/** @return {TSXFilepath} */
	get tsx_filepath() {
		return `${this.filepath}.tsx`;
	}

	/**
	 * NOTE:
	 * User could pass a filepath as URI _(starting with "file://" protocol)_.
	 * In this case we're interested only in pathname, because TypeScript doesn't handle URI.
	 *
	 * @param {string} filepath
	 * @returns {string}
	 */
	#parse_filepath(filepath) {
		if (URL.canParse(filepath)) return new URL(filepath).pathname;
		return filepath;
	}

	/**
	 * @param {string} filepath
	 * @returns {asserts filepath is SvelteFilepath}
	 */
	#validate_filepath(filepath) {
		if (!filepath.endsWith(".svelte")) {
			// TODO: Document it
			throw new Error("Filepath must be a svelte file");
		}
	}

	/** @returns {SvelteFilepath} */
	get #random_filepath() {
		const random_str = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
		return `${random_str}.svelte`;
	}

	/** @returns {ts.CompilerOptions} */
	get_ts_options() {
		const cached = this.cache.get(this.tsx_filepath)?.options;
		if (cached) return cached;
		const options = this.#build_ts_options();
		this.cache.set(this.tsx_filepath, { options });
		return options;
	}

	/** @type {ts.CompilerOptions} */
	#forced_ts_options = {
		allowJs: true,
		checkJs: true,
		noEmit: true,
		skipDefaultLibCheck: true,
		skipLibCheck: true,
		sourceMap: false,
		strict: true,
	};

	/** @returns {ts.CompilerOptions} */
	#build_ts_options() {
		const configpath = this.#find_ts_config_path();
		if (configpath) {
			const config_file = ts.readConfigFile(configpath, this.system.readFile);
			const parsed = ts.parseJsonConfigFileContent(
				config_file.config,
				this.system,
				path.dirname(configpath),
				undefined,
				configpath,
				undefined,
				[
					{
						extension: "svelte",
						isMixedContent: true,
						scriptKind: ts.ScriptKind.Deferred,
					},
				],
			);
			return {
				...parsed.options,
				...this.#forced_ts_options,
			};
			// TODO: Create a warning when tsconfig.json `compilerOptions.lib` doesn't include DOM
		}
		return this.#forced_ts_options;
	}

	/**
	 * @returns {string | undefined}
	 */
	#find_ts_config_path() {
		return (
			ts.findConfigFile(this.tsx_filepath, this.system.fileExists) ||
			ts.findConfigFile(this.tsx_filepath, this.system.fileExists, "jsconfig.json")
		);
	}
}

/**
 * @internal
 * Get the file path to the module, with vfs environments in mind.
 * @param {string} specifier
 * @returns {URL}
 */
function get_module_url(specifier) {
	if (!IS_NODE_LIKE) {
		return new URL(`file:///node_modules/${specifier}`); // file in virtual file system
	}
	if (globalThis.process?.env.VITEST) {
		// @ts-expect-error FIXME: Ugly workaround for `import.meta.resolve` not working in Vitest: https://github.com/vitest-dev/vitest/issues/6953
		//eslint-disable-next-line no-undef
		__vite_ssr_import_meta__.resolve = (path) =>
			"file://" +
			globalThis
				// @ts-expect-error FIXME: 👆
				.createRequire(import.meta.url)
				.resolve(path);
	}
	return new URL(import.meta.resolve(specifier));
}
