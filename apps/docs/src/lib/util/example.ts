import pathe from "pathe";
import { ssp } from "sveltekit-search-params";
import * as v from "valibot";

export type ExampleId = string;

export interface ExampleInput {
	raw: string;
	encoded: string;
}

export const MATTER_SCHEMA = v.object({
	title: v.string(),
	description: v.string(),
});

export type ExampleMatter = v.InferOutput<typeof MATTER_SCHEMA>;

export function get_matter_data(data: Record<string, unknown>): ExampleMatter {
	return v.parse(MATTER_SCHEMA, data.matter);
}

export interface ExampleReadme {
	raw: string;
	compiled: string;
	matter: ExampleMatter;
}

export interface Example {
	dirpath: string;
	input: ExampleInput;
	readme: ExampleReadme;
}

export type Examples = Map<ExampleId, Example>;

export function get_input(content: string): ExampleInput {
	return {
		raw: content,
		encoded: ssp.lz().encode(content) ?? "",
	};
}

export async function get_readme(content: string): Promise<ExampleReadme> {
	const { compile_md } = await import("$lib/util/md.js");
	const compiled = await compile_md(content);
	return {
		raw: content,
		compiled: compiled.toString(),
		matter: get_matter_data(compiled.data),
	};
}

export function get_id(dir: string): ExampleId {
	const parent_dir_name = dir.split(pathe.sep).at(-1);
	if (!parent_dir_name) throw Error("Could not get parent dir name");
	return parent_dir_name;
}
