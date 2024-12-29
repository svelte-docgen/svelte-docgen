import { error } from "@sveltejs/kit";

import { building, dev } from "$app/environment";

export async function load(ev) {
	if (!building && !dev) throw new Error("Unreachable");
	const [path, sveltepress] = await Promise.all([
		import("node:path"),
		import("@sveltepress/vite"),
	]);
	const { params, parent } = ev;
	const { packages } = await parent();
	const pkg =
		packages.get(params.name) || packages.get(`${params.org}/${params.name}`);
	if (!pkg) throw error(404, `Unrecognized package name "${params.name}"`);
	const html = await sveltepress.mdToSvelte({
		mdContent: pkg.readme,
		filename: path.join(pkg.dirname, "README.md"),
	});
	return { pkg, html };
}
