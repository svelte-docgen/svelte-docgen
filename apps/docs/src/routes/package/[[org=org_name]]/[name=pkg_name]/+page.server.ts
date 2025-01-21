import { error } from "@sveltejs/kit";
import { compile } from "mdsvex";

import { building, dev } from "$app/environment";

export async function load(ev) {
	if (!building && !dev) throw new Error("Unreachable");
	const { HIGHLIGHT } = await import("$lib/util/md.js");
	const { params, parent } = ev;
	const { packages } = await parent();
	const pkg = packages.get(params.org ? `${params.org}/${params.name}` : params.name);
	if (!pkg) throw error(404, `Unrecognized package name "${params.name}"`);
	const html = await compile(pkg.readme, { highlight: HIGHLIGHT });
	if (!html) {
		throw error(500, `Failed to compile README.md for ${pkg.data.name}`);
	}
	return { pkg, html };
}
