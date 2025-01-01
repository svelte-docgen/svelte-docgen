import { SvelteMap } from "svelte/reactivity";
import { parse, createCacheStorage } from "svelte-docgen";
import { ssp } from "sveltekit-search-params";
import ts from "typescript";
import * as tsvfs from "@typescript/vfs";

// TODO: This can be removed once we migrate away from using `svelte2tsx`
import shim from "svelte2tsx/svelte-shims-v4.d.ts?raw";

export class Docgen {
	#cache: ReturnType<typeof createCacheStorage>;

	#compiler_options = {
		moduleDetection: ts.ModuleDetectionKind.Force,
		target: ts.ScriptTarget.ES2023, // FIXME: createDefaultMapFromCDN does not support ESNext at the moment
		module: ts.ModuleKind.ESNext,
		esModuleInterop: true,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
	} satisfies ts.CompilerOptions;

	#fsmap = $state(
		new SvelteMap([["/node_modules/svelte2tsx/svelte-shims-v4.d.ts", shim]]),
	);

	#sys: ts.System;

	constructor() {
		const base_sys = tsvfs.createSystem(this.#fsmap);
		this.#sys = {
			...base_sys,
			...{
				readFile(path) {
					return base_sys.readFile(path) || "";
				},
			},
		};
		this.#cache = createCacheStorage(this.#sys);
	}

	async init() {
		for (const [k, v] of await tsvfs.createDefaultMapFromCDN(
			this.#compiler_options,
			ts.version,
			false,
			ts,
			{
				// @ts-expect-error value can be undefined
				compressToUTF16: ssp.lz().encode,
				decompressFromUTF16: ssp.lz().decode,
			},
		)) {
			this.#fsmap.set(k, v as string);
		}
		// Load all of the Svelte `.d.ts` files in advance for the users
		for (const [k, v] of Object.entries(
			import.meta.glob("/node_modules/svelte/**/*.d.ts", {
				eager: true,
				exhaustive: true,
				import: "default",
				query: "?raw",
			}),
		)) {
			this.#fsmap.set(k, v as string);
		}
	}

	async generate(source: string) {
		this.#cache.delete("/src/Demo.svelte.tsx");
		try {
			return Promise.resolve(
				parse(source, {
					cache: this.#cache,
					filepath: "/src/Demo.svelte",
					sys: this.#sys,
					host: tsvfs.createVirtualCompilerHost(
						this.#sys,
						this.#compiler_options,
						ts,
					).compilerHost,
					ts_options: this.#compiler_options,
				}),
			);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

// export async function generate_docgen(source: string) {
// 	const fsmap = await tsvfs.createDefaultMapFromCDN(
// 		COMPILER_OPTIONS,
// 		ts.version,
// 		false,
// 		ts,
// 	);
// 	for (const [k, v] of Object.entries(
// 		import.meta.glob("/node_modules/svelte/**/*.d.ts", {
// 			eager: true,
// 			exhaustive: true,
// 			import: "default",
// 			query: "?raw",
// 		}),
// 	)) {
// 		fsmap.set(k, v as string);
// 	}
// 	try {
// 		return Promise.resolve(prepare_docgen(fsmap)(source));
// 	} catch (error) {
// 		return Promise.reject(error);
// 	}
// }
//
// function prepare_docgen(fsmap: Map<string, string>) {
// 	fsmap.set("/node_modules/svelte2tsx/svelte-shims-v4.d.ts", shim);
// 	const base_sys = tsvfs.createSystem(fsmap);
// 	// patch for @typescript/vfs, which throws an error by trying to read non-existent lib files
// 	// FIXME: remove this when @typescript/vfs is fixed, or stop using tsvfs.createDefaultMapFromCDN
// 	const sys: ts.System = {
// 		...base_sys,
// 		...{
// 			readFile(path) {
// 				return base_sys.readFile(path) || "";
// 			},
// 		},
// 	};
// 	const cache = createCacheStorage(sys);
// 	return (source: string) => {
// 		cache.delete("/src/Demo.svelte.tsx");
// 		return parse(source, {
// 			cache,
// 			filepath: "/src/Demo.svelte",
// 			sys: sys,
// 			host: tsvfs.createVirtualCompilerHost(sys, COMPILER_OPTIONS, ts)
// 				.compilerHost,
// 			ts_options: COMPILER_OPTIONS,
// 		});
// 	};
// }
