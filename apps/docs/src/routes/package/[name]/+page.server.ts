import { error } from "@sveltejs/kit";

import { building } from "$app/environment";

export async function load(ev) {
	const { params, parent } = ev;
	const { packages } = await parent();
	const name = globalThis.decodeURIComponent(params.name);
	const pkg = packages.get(name);
	if (!pkg) throw error(404, `Unrecognized package name "${name}"`);
	if (building) {
		const [path, sveltepress] = await Promise.all([
			import("node:path"),
			import("@sveltepress/vite"),
		]);
		const html = await sveltepress.mdToSvelte({
			mdContent: pkg.readme,
			filename: path.join(pkg.dirname, "README.md"),
		});
		return { pkg, html };
	}
	throw new Error("Unreachable");
}
