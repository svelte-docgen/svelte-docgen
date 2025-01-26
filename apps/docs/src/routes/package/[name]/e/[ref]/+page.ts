import { error } from "@sveltejs/kit";

export async function load(ev) {
	const { params, parent } = ev;
	const { sections } = await parent();
	const section = sections.get(params.ref);
	if (!section) {
		throw error(404, `Unrecognized error reference "${params.ref}"`);
	}
	return { section };
}
