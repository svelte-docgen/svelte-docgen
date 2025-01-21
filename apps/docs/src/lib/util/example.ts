import pathe from "pathe";
import { ssp } from "sveltekit-search-params";
import * as v from "valibot";

export type ExampleId = string;

export interface ExampleInput {
	raw: string;
	encoded: string;
}

export interface ExampleReadme {
	raw: string;
	compiled: Awaited<ReturnType<typeof import("$lib/util/md.js").compile_svelte_md>>;
}

export const FM_DATA_SCHEMA = v.object({
	title: v.string(),
	description: v.string(),
});
export type ExampleFrontmatterData = v.InferOutput<typeof FM_DATA_SCHEMA>;

/**
 * fm - abbreviation for frontmatter
 */
export function get_fm_data(readme: ExampleReadme | undefined): ExampleFrontmatterData {
	return v.parse(FM_DATA_SCHEMA, readme?.compiled?.data?.fm);
}

export interface Example {
	dirpath: string;
	input: ExampleInput;
	readme: ExampleReadme;
	fm: ExampleFrontmatterData;
}

export type Examples = Map<ExampleId, Example>;

export function get_input(content: string): ExampleInput {
	return {
		raw: content,
		encoded: ssp.lz().encode(content) ?? "",
	};
}

export async function get_readme(content: string): Promise<ExampleReadme> {
	const { compile_svelte_md } = await import("$lib/util/md.js");
	const compiled = await compile_svelte_md(content);
	return {
		raw: content,
		compiled,
	};
}

export function get_id(dir: string): ExampleId {
	const parent_dir_name = dir.split(pathe.sep).at(-1);
	if (!parent_dir_name) throw Error("Could not get parent dir name");
	return parent_dir_name;
}
