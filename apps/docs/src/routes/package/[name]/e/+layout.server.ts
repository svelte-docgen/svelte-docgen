import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import { marked, type MarkedOptions, type Token, type Tokens } from "marked";

export async function load(ev) {
	const { parent } = ev;
	const parent_data = await parent();
	const errors_md_url = url.pathToFileURL(path.join(parent_data.pkg_dir_path, "src", "ERRORS.md"));
	const errors_md_content = await fs.readFile(errors_md_url, "utf-8");
	return {
		...parent_data,
		sections: get_sections(errors_md_content),
	};
}

function get_sections(md: string): Map<string, string> {
	// eslint-disable-next-line prefer-const
	let results = new Map();
	const md_options = {
		gfm: true,
	} satisfies MarkedOptions;
	const md_ast = marked.lexer(md, md_options);
	let title: Tokens.Heading | undefined;
	let content: Token[] = [];
	for (const token of md_ast) {
		if (is_second_level_heading(token)) {
			if (title) {
				results.set(title.text.replaceAll("_", "-"), marked.parser(content, md_options));
			}
			title = token;
			content = [];
			continue;
		}
		content.push(token);
	}
	return results;
}

function is_second_level_heading(token: Token): token is Tokens.Heading {
	return token.type === "heading" && token.depth === 2;
}
