import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import { error } from "@sveltejs/kit";
import { mdToSvelte } from "@sveltepress/vite";

export async function load(ev) {
	const { params, parent } = ev;
	const { packages } = await parent();
	const name = globalThis.decodeURIComponent(params.name);
	const pkg = packages.get(name);
	if (!pkg) throw error(404, `Unrecognized package name "${name}"`);
	if (!pkg.repository || !("directory" in pkg.repository) || typeof pkg.repository.directory !== "string") {
		throw error(500, `Package "${name}" doesn't have a 'repository.directory' field.`);
	}
	const pkg_dir_url = url.pathToFileURL(path.join("..", "..", pkg.repository.directory));
	const readme_url = url.pathToFileURL(path.join(pkg_dir_url.pathname, "README.md"));
	const readme = await mdToSvelte({
		mdContent: await fs.readFile(readme_url, "utf-8"),
		filename: readme_url.pathname,
	});
	return { pkg, pkg_dir_path: pkg_dir_url.pathname, readme };
}
