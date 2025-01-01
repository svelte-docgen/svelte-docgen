import { parse, createCacheStorage } from "svelte-docgen";
import { ssp } from "sveltekit-search-params";
import ts from "typescript";
import * as tsvfs from "@typescript/vfs";

import * as Repl from "$lib/components/blocks/repl/index.ts";

// TODO: This can be removed once we migrate away from using `svelte2tsx`
import shim from "svelte2tsx/svelte-shims-v4.d.ts?raw";

const COMPILER_OPTIONS: ts.CompilerOptions = {
	moduleDetection: ts.ModuleDetectionKind.Force,
	target: ts.ScriptTarget.ES2023, // FIXME: createDefaultMapFromCDN does not support ESNext at the moment
	module: ts.ModuleKind.ESNext,
	esModuleInterop: true,
	moduleResolution: ts.ModuleResolutionKind.Bundler,
};

function prepare_docgen(fsmap: Map<string, string>) {
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
			host: tsvfs.createVirtualCompilerHost(sys, COMPILER_OPTIONS, ts).compilerHost,
			ts_options: COMPILER_OPTIONS,
		});
	};
}

export async function generate_docgen(manager?: Repl.Manager) {
	if (!manager?.source.current) throw new Error("Unreachable");
	const fsmap = await tsvfs.createDefaultMapFromCDN(COMPILER_OPTIONS, ts.version, false, ts, {
		// @ts-expect-error value can be undefined
		compressToUTF16: ssp.lz().encode,
		decompressFromUTF16: ssp.lz().decode,
	});
	for (const [k, v] of Object.entries(
		import.meta.glob("/node_modules/svelte/**/*.d.ts", {
			eager: true,
			exhaustive: true,
			import: "default",
			query: "?raw",
		}),
	)) {
		fsmap.set(k, v as string);
	}
	return prepare_docgen(fsmap)(manager.source.current);
}
