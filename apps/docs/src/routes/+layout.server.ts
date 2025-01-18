import type { ComponentProps } from "svelte";

import { building, dev } from "$app/environment";
import { base } from "$app/paths";
import type NavPlayground from "$lib/components/blocks/app-sidebar/nav-playground.svelte";

export const prerender = true;

type ExampleTitle = string;
type ExampleURL = string;

export async function load() {
	if (!building && !dev) throw new Error("Unreachable");
	const [
		//
		pathe,
		str,
		{ ssp },
	] = await Promise.all([
		//
		import("pathe"),
		import("es-toolkit/string"),
		import("sveltekit-search-params"),
	]);
	const glob_examples = import.meta.glob("../../../../examples/**/input.svelte", {
		query: "?raw",
		import: "default",
	});
	// eslint-disable-next-line prefer-const
	let examples: ComponentProps<typeof NavPlayground>["items"] = new Map();
	for (const [k, v] of Object.entries(glob_examples)) {
		const title = get_example_title({ pathe, str, key: k });
		const url = get_example_url({ ssp, value: (await v()) as string });
		examples.set(title, {
			name: title,
			url,
		});
	}
	return {
		examples,
	};
}

interface GetExampleTitleParams {
	pathe: typeof import("pathe");
	str: typeof import("es-toolkit/string");
	key: string;
}
function get_example_title(params: GetExampleTitleParams): ExampleTitle {
	const { dir } = params.pathe.parse(params.key);
	const last_dir_name = dir.split("/").at(-1);
	if (!last_dir_name) throw Error("Could not get last dir name");
	return params.str.startCase(last_dir_name);
}

interface GetExampleURLParams {
	ssp: (typeof import("sveltekit-search-params"))["ssp"];
	value: string;
}
function get_example_url(params: GetExampleURLParams): ExampleURL {
	const input = params.ssp.lz().encode(params.value);
	if (!input) throw Error("Could not encode input");
	const url_params = new URLSearchParams([["input", input]]);
	return `${base}/playground?${url_params}`;
}
