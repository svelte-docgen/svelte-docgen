import ts from "typescript";

import { IS_BROWSER } from "./util.js";

/**
 * @internal
 * Get the URI of the module, with environment in mind. Whether is it browser or other JavaScript runtime.
 * @param {string} specifier
 * @returns {URL}
 */
function get_module_url(specifier) {
	if (IS_BROWSER) {
		return new URL(specifier, `file://${globalThis.window.location.href}`);
	}
	if (globalThis.process?.env.VITEST) {
		// @ts-expect-error FIXME: Ugly workaround for `import.meta.resolve` not working in Vitest: https://github.com/vitest-dev/vitest/issues/6953
		//eslint-disable-next-line no-undef
		__vite_ssr_import_meta__.resolve = (path) =>
			globalThis
				// @ts-expect-error FIXME: 👆
				.createRequire(import.meta.url)
				.resolve(path);
	}
	return new URL(`file://${import.meta.resolve(specifier)}`);
}

/**
 * @typedef CachedFile
 * @prop {Date} [last_modified]
 * @prop {string} [content]
 * @prop {ts.SourceFile} [source]
 * @prop {ts.CompilerOptions} [options]
 */

class Cache {
	/** @type {Map<string, CachedFile>} */
	#cached = new Map();
	/** @type {ts.Program | undefined} */
	program;
	/** @type {Set<string>} */
	root_names = new Set([get_module_url("svelte2tsx/svelte-shims-v4.d.ts").pathname]);
	/** @type {ts.System} */
	#system;

	/** @param {ts.System | undefined} system */
	constructor(system) {
		this.#system = system ?? ts.sys;
	}

	/**
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	has(filepath) {
		return this.#cached.has(filepath);
	}

	/**
	 * @param {string} filepath
	 * @returns {CachedFile | undefined}
	 */
	get(filepath) {
		const cached = this.#cached.get(filepath);
		const last_modified = this.#system.getModifiedTime?.(filepath);
		if (cached?.last_modified?.getTime() === last_modified?.getTime()) return cached;
	}

	/**
	 * @param {string} filepath
	 */
	delete(filepath) {
		this.#cached.delete(filepath);
	}

	/**
	 * @param {string} filepath
	 * @param {Partial<CachedFile>} updated
	 * @returns {CachedFile}
	 * */
	set(filepath, updated) {
		const cached = this.#cached.get(filepath);
		if (cached) return { ...cached, ...updated };
		const last_modified = this.#system?.getModifiedTime?.(filepath);
		const value = { ...updated, last_modified };
		this.#cached.set(filepath, value);
		return value;
	}
}

/**
 * @param {ts.System} [system]
 * @returns {Cache}
 * */
export const createCacheStorage = (system) => new Cache(system);
