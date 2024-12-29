import { error } from "@sveltejs/kit";

import { building, dev } from "$app/environment";

export async function load(ev) {
	if (!building && !dev) throw new Error("Unreachable");
	const [path, sveltepress, theme] = await Promise.all([
		import("node:path"),
		import("@sveltepress/vite"),
		import("@sveltepress/theme-default"),
	]);
	const { params, parent } = ev;
	const { packages } = await parent();
	const pkg = packages.get(params.org ? `${params.org}/${params.name}` : params.name);
	if (!pkg) throw error(404, `Unrecognized package name "${params.name}"`);
	const html = await sveltepress.mdToSvelte({
		highlighter: theme.highlighter,
		mdContent: pkg.readme,
		filename: path.join(pkg.dirname, "README.md"),
	});
	return { pkg, html };
}
