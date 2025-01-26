import * as YAML from "@internals/yaml";
import type * as AST from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

export type * as AST from "mdast";

/* prettier-ignore */
export const parser = unified()
	.use(remarkParse)
	.use(remarkGfm);

export const printer = unified().use(remarkStringify);

export function get_heading_text(heading: AST.Heading): string {
	if (heading.children[0].type !== "text") throw new Error("Unreachable");
	return heading.children[0].value;
}

export function parse_params(params: AST.Html | undefined): YAML.Document | undefined {
	if (!params) return;
	/* prettier-ignore */
	const raw_data = params?.value
		.replace(/^<!--params/, "")
		.replace(/-->$/, "")
		.trim();
	return YAML.parseDocument(raw_data);
}
