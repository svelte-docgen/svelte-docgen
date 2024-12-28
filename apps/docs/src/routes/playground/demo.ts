import ts from "typescript";
import * as tsvfs from "@typescript/vfs";

import { parse, createCacheStorage } from "svelte-docgen";

import shim from "svelte2tsx/svelte-shims-v4.d.ts?raw";

export const COMPILER_OPTIONS: ts.CompilerOptions = {
	moduleDetection: ts.ModuleDetectionKind.Force,
	target: ts.ScriptTarget.ES2023, // FIXME: createDefaultMapFromCDN does not support ESNext at the moment
	module: ts.ModuleKind.ESNext,
	esModuleInterop: true,
	moduleResolution: ts.ModuleResolutionKind.Bundler,
};

export function prepareDocgen(fsmap: Map<string, string>) {
	fsmap.set("/node_modules/svelte2tsx/svelte-shims-v4.d.ts", shim);

	const base_sys = tsvfs.createSystem(fsmap);
	// patch for @typescript/vfs, which throws an error by trying to read non-existent lib files
	// FIXME: remove this when @typescript/vfs is fixed, or stop using tsvfs.createDefaultMapFromCDN
	const sys: ts.System = {
		...base_sys,
		...{
			readFile(path) {
				return base_sys.readFile(path) || "";
			},
		},
	};
	const cache = createCacheStorage(sys);

	return (source: string) => {
		cache.delete("/src/Demo.svelte.tsx");
		return parse(source, {
			cache,
			filepath: "/src/Demo.svelte",
			sys: sys,
			host: tsvfs.createVirtualCompilerHost(sys, COMPILER_OPTIONS, ts)
				.compilerHost,
			ts_options: COMPILER_OPTIONS,
		});
	};
}
