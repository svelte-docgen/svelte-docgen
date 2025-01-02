import { SvelteMap } from "svelte/reactivity";
import { parse, createCacheStorage } from "svelte-docgen";
import { ssp } from "sveltekit-search-params";
import ts from "typescript";
import * as tsvfs from "@typescript/vfs";

// TODO: This can be removed once we migrate away from using `svelte2tsx`
import shim from "svelte2tsx/svelte-shims-v4.d.ts?raw";

export class Docgen {
	#cache: ReturnType<typeof createCacheStorage>;

	static #compiler_options = {
		moduleDetection: ts.ModuleDetectionKind.Force,
		target: ts.ScriptTarget.ES2023, // FIXME: createDefaultMapFromCDN does not support ESNext at the moment
		module: ts.ModuleKind.ESNext,
		esModuleInterop: true,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
	} satisfies ts.CompilerOptions;

	#fsmap: Map<string, string>;

	#sys: ts.System;

	static async init(): Promise<Docgen> {
		const map = new SvelteMap(
			await tsvfs.createDefaultMapFromCDN(
				this.#compiler_options,
				ts.version,
				true,
				ts,
				{
					// @ts-expect-error value can be undefined
					compressToUTF16: ssp.lz().encode,
					decompressFromUTF16: ssp.lz().decode,
				},
			),
		);
		// Load all of the Svelte `.d.ts` files in advance for the users
		for (const [k, v] of Object.entries(
			import.meta.glob("/node_modules/svelte/**/*.d.ts", {
				eager: true,
				exhaustive: true,
				import: "default",
				query: "?raw",
			}),
		)) {
			map.set(k, v as string);
		}
		return new Docgen(map);
	}

	private constructor(fsmap: SvelteMap<string, string>) {
		this.#fsmap = fsmap;
		this.#fsmap.set("/node_modules/svelte2tsx/svelte-shims-v4.d.ts", shim);
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

	async generate(source: string) {
		this.#cache.delete("/src/Demo.svelte.tsx");
		try {
			const parsed = parse(source, {
				cache: this.#cache,
				filepath: "/src/Demo.svelte",
				sys: this.#sys,
				host: tsvfs.createVirtualCompilerHost(this.#sys, Docgen.#compiler_options, ts).compilerHost,
				ts_options: Docgen.#compiler_options,
			});
			return Promise.resolve(parsed);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
