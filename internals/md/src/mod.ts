import * as YAML from "@internals/yaml";
import rehypeShiki from "@shikijs/rehype/core";
import type * as AST from "mdast";
import { compile } from "mdsvex";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { matter } from "vfile-matter";

import { HIGHLIGHT, highlighter } from "./highlighter.js";

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

export function parse_html_comment_params(params: AST.Html | undefined): YAML.Document | undefined {
	if (!params) return;
	/* prettier-ignore */
	const raw_data = params?.value
		.replace(/<!--\sparams\s/, "")
		.replace(/-->/, "");
	return YAML.parseDocument(raw_data);
}

export function to_html(content: string) {
	return unified()
		.use(remarkParse)
		.use(remarkFrontmatter, ["yaml"])
		.use(() => (_tree, file) => matter(file))
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeShiki, highlighter, {
			themes: {
				dark: "github-dark",
				light: "github-light",
			},
		})
		.use(rehypeStringify)
		.process(content);
}

export function svelte_md_to_html(content: string, options: Partial<Parameters<typeof compile>[1]> = {}) {
	return compile(content, {
		highlight: HIGHLIGHT,
		...options,
	});
}
