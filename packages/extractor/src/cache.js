import ts from "typescript";

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
