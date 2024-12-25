import { error } from "@sveltejs/kit";
import { mdToSvelte } from "@sveltepress/vite";
import path from "pathe";

export async function load(ev) {
	const { params, parent } = ev;
	const { packages } = await parent();
	const name = globalThis.decodeURIComponent(params.name);
	const pkg = packages.get(name);
	if (!pkg) throw error(404, `Unrecognized package name "${name}"`);
	const html = await mdToSvelte({
		mdContent: pkg.readme,
		filename: path.join(pkg.dirname, "README.md"),
	});
	return { pkg, html };
}
