import ts from "typescript";
import * as tsvfs from "@typescript/vfs";

import { parse, createCacheStorage, encode } from "svelte-docgen";

import shim from "svelte2tsx/svelte-shims-v4.d.ts?raw";

export function prepareDocgen(fsmap: Map<string, string>) {
	fsmap.set("/node_modules/svelte2tsx/svelte-shims-v4.d.ts", shim);

	const system = tsvfs.createSystem(fsmap);
	const cache = createCacheStorage(system);

	return (source: string) => {
		cache.delete("/src/Demo.svelte.tsx");
		const parsed = parse(source, {
			cache,
			filepath: "/src/Demo.svelte",
			system: system,
			host: tsvfs.createVirtualCompilerHost(system, {}, ts).compilerHost,
		});
		return encode(parsed, { indent: 2 });
	};
}
