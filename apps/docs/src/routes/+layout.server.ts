import { building, dev } from "$app/environment";

import type { Example, Examples } from "$lib/util/example.ts";

export const prerender = true;

export async function load() {
	if (!building && !dev) throw new Error("Unreachable");
	const [
		//
		pathe,
		example_util,
	] = await Promise.all([
		//
		import("pathe"),
		import("$lib/util/example.ts"),
	]);
	const glob_examples = import.meta.glob("../../../../examples/*/{input.svelte,README.md}", {
		query: "?raw",
		import: "default",
	});
	// eslint-disable-next-line prefer-const
	let examples: Examples = new Map();
	for (const [filepath, mod] of Object.entries(glob_examples)) {
		const { base, dir } = pathe.parse(filepath);
		const id = example_util.get_id(dir);
		const content = await mod();
		if (typeof content !== "string") throw new Error("Unreachable - expected string");
		// @ts-expect-error WARN: Missing data will be filled after looping through every file
		const example: Example = examples.get(id) ?? { dirpath: dir };
		switch (base) {
			case "input.svelte": {
				examples.set(id, {
					...example,
					input: example_util.get_input(content),
				});
				continue;
			}
			case "README.md": {
				const readme = await example_util.get_readme(content);
				examples.set(id, {
					...example,
					readme,
				});
				continue;
			}
			default: {
				throw new Error(`Unrecognized & Unhandled file: ${base}`);
			}
		}
	}
	return {
		examples,
	};
}
