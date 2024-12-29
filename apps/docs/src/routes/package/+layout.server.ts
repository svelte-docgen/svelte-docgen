import type { Package as NormalizedPkgData } from "normalize-package-data";

import { building } from "$app/environment";

const ORG_NAME = "@svelte-docgen";
const PREFIX_EXCEPTIONS = new Set([
	"svelte-docgen",
	"vite-plugin-svelte-docgen",
]);

interface Package {
	data: NormalizedPkgData;
	dirname: string;
	readme: string;
}

export async function load() {
	if (!building) throw new Error("Unreachable");
	const [{ default: normalize }, path] = await Promise.all([
		import("normalize-package-data"),
		import("node:path"),
	]);
	const glob_packages = import.meta.glob(
		"../../../../../packages/**/package.json",
		{
			import: "default",
		},
	);
	const packages = new Map<string, Package>(
		await Promise.all(
			Object.entries(glob_packages).map(async ([pkg_path, mod]) => {
				const data = (await mod()) as NormalizedPkgData;
				normalize(data, true);
				return [
					data.name,
					{
						data,
						dirname: get_pkg_dirname({ input: pkg_path, path }),
						// NOTE: We will update later
						readme: "",
					},
				] as const;
			}),
		),
	);
	const glob_readmes = import.meta.glob(
		"../../../../../packages/**/README.md",
		{
			query: "?raw",
			import: "default",
		},
	);
	for (const [md_path, mod] of Object.entries(glob_readmes)) {
		const name = get_pkg_name({ input: md_path, path });
		const pkg = packages.get(name);
		if (!pkg) throw new Error(`Could not find package for: ${md_path}`);
		const readme = (await mod()) as string;
		packages.set(name, { ...pkg, readme });
	}
	return {
		packages,
	};
}

function get_pkg_dirname(params: {
	input: string;
	path: typeof import("node:path");
}): string {
	const { input, path } = params;
	return path.dirname(path.relative("../../../../../packages", input));
}

function get_pkg_name(params: Parameters<typeof get_pkg_dirname>[0]): string {
	const dirname = get_pkg_dirname(params);
	if (PREFIX_EXCEPTIONS.has(dirname)) return dirname;
	return `${ORG_NAME}/${dirname}`;
}
