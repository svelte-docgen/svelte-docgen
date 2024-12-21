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
		const last_modified = ts.sys.getModifiedTime?.(filepath);
		if (cached?.last_modified?.getTime() === last_modified?.getTime()) return cached;
	}

	/**
	 * @param {string} filepath
	 * @param {Partial<CachedFile>} updated
	 * @returns {CachedFile}
	 * */
	set(filepath, updated) {
		const cached = this.#cached.get(filepath);
		if (cached) return { ...cached, ...updated };
		const last_modified = ts.sys.getModifiedTime?.(filepath);
		const value = { ...updated, last_modified };
		this.#cached.set(filepath, value);
		return value;
	}
}

/** @returns {Cache} */
export const createCacheStorage = () => new Cache();
