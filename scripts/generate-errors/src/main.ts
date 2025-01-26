import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import url from "node:url";

import * as MD from "@internals/md";
import * as YAML from "@internals/yaml";

export default async function main(): Promise<void> {
	const cwd = process.cwd();
	const errors_md_filepath = path.join(cwd, "ERRORS.md");
	const errors_md_content = await fs.readFile(errors_md_filepath, "utf-8");
	const entries = get_error_entries(errors_md_content);
	const header_comment = `
/**
 * ⚠️ **DO NOT EDIT MANUALLY!**
 * This file is auto-generated via pre-build script "generate-errors".
 * @module
 */

/**
 * @param {string} pathname
 * @param {Record<string, string>} [params]
 * @returns {string}
 */
function get_url(pathname, params) {
	let url = new URL(\`/$\{pathname}\`, import.meta.env.BASE_URL);
	if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	return url.toString();
}
`.trimStart();
	const content = Iterator.from(entries).reduce((output, entry) => {
		const [name, data] = entry;
		const parsed_params = MD.parse_params(data.params);
		output += "\n";
		output += "/**";
		if (data.section.length > 0) output += `\n${stringify_error_section(data.section)}`;
		if (parsed_params) output += `\n${stringify_params(parsed_params)}`;
		output += "\n";
		output += " * @returns {never}";
		output += "\n";
		output += " */";
		output += "\n";
		output += `
export function ${name}(${parsed_params ? "params" : ""}) {
	throw new Error(get_url("${name}"${parsed_params ? ", params" : ""}));
}
			`.trim();
		output += "\n";
		return output;
	}, header_comment);
	const error_gen_js_path = path.join(cwd, "src", "error.gen.js");
	fs.writeFile(error_gen_js_path, content.trim());
	console.log(`✅ Generated errors to filepath:\n${url.pathToFileURL(error_gen_js_path)}`);
}

interface ErrorEntry {
	heading: MD.AST.Heading;
	params?: MD.AST.Html;
	section: MD.AST.RootContent[];
}
type ErrorEntries = Map<string, ErrorEntry>;

function get_error_entries(md: string): ErrorEntries {
	const ast = MD.parser.parse(md);
	// eslint-disable-next-line prefer-const
	let results: ErrorEntries = new Map();
	let latest_second_heading: MD.AST.Heading | undefined = undefined;
	let latest_params: MD.AST.Html | undefined = undefined;
	let latest_section: MD.AST.RootContent[] = [];
	for (const node of ast.children) {
		if (node.type === "heading" && node.depth === 2) {
			if (latest_second_heading) {
				results.set(
					MD.get_heading_text(latest_second_heading),
					wrap_latest_to_entry({
						heading: latest_second_heading,
						section: latest_section,
						params: latest_params,
					}),
				);
			}
			latest_second_heading = node;
			latest_section = [];
			latest_params = undefined;
			continue;
		}
		if (!latest_second_heading) continue;
		if (node.type === "html" && node.value.startsWith("<!--params")) {
			latest_params = node;
			continue;
		}
		latest_section.push(node);
	}
	if (latest_second_heading) {
		results.set(
			MD.get_heading_text(latest_second_heading),
			wrap_latest_to_entry({
				heading: latest_second_heading,
				section: latest_section,
				params: latest_params,
			}),
		);
	}
	return results;
}

function wrap_latest_to_entry({
	heading,
	section,
	params,
}: {
	heading: MD.AST.Heading;
	section: MD.AST.RootContent[];
	params?: MD.AST.Html;
}): ErrorEntry {
	// eslint-disable-next-line prefer-const
	let entry: ErrorEntry = {
		heading,
		section,
	};
	if (params) entry.params = params;
	if (heading.children[0].type !== "text") throw new Error("Unreachable");
	return entry;
}

function stringify_error_section(section: MD.AST.RootContent[]): string {
	return MD.printer
		.stringify({ type: "root", children: section })
		.split("\n")
		.map((ln) => ` * ${ln}`)
		.join("\n");
}

export function stringify_params(ast: YAML.Document): string {
	let results = " * @param {Object} params";
	YAML.visit(ast, (_key, node, _path) => {
		if (YAML.isPair(node)) {
			results += "\n";
			if (!YAML.isScalar(node.value)) throw new Error("Unreachable");
			results += ` * @param {${node.value.value}} params.${node.key}`;
			if (node.value.comment) results += node.value.comment;
		}
	});
	return results;
}
