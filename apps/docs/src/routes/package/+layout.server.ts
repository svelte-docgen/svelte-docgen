import type { Package as PkgData } from "normalize-package-data";

import { building, dev } from "$app/environment";

import { EXCEPTIONS } from "../../params/pkg_name.ts";
import { ORG_NAME } from "../../params/org_name.ts";

interface Package {
	data: PkgData;
	dirname: string;
	readme: string;
}

export async function load() {
	if (!building && !dev) throw new Error("Unreachable");
	const [{ default: normalize }, path] = await Promise.all([import("normalize-package-data"), import("node:path")]);
	const glob_packages = import.meta.glob("@/packages/*/package.json", {
		import: "default",
	});
	const packages = new Map<string, Package>(
		await Promise.all(
			Object.entries(glob_packages).map(async ([pkg_path, mod]) => {
				const data = (await mod()) as PkgData;
				normalize(data, true);
				return [
					data.name,
					{
						data,
						dirname: get_pkg_dirname({ input: pkg_path, path }),
						// NOTE: Placeholder - we will update below
						readme: "",
					},
				] as const;
			}),
		),
	);
	const glob_readmes = import.meta.glob("@/packages/**/README.md", {
		query: "?raw",
		import: "default",
	});
	for (const [md_path, mod] of Object.entries(glob_readmes)) {
		const name = get_pkg_name({ input: md_path, path });
		const pkg = packages.get(name);
		if (!pkg) throw new Error(`Could not find package entry for: ${md_path}`);
		const readme = (await mod()) as string;
		packages.set(name, { ...pkg, readme });
	}
	return {
		packages,
	};
}

function get_pkg_dirname(params: { input: string; path: typeof import("node:path") }): string {
	const { input, path } = params;
	return path.dirname(path.relative("../../packages", input));
}

function get_pkg_name(params: Parameters<typeof get_pkg_dirname>[0]): string {
	const dirname = get_pkg_dirname(params);
	// @ts-expect-error: WARN: `Set.has()` doesn't accept loose `string`
	if (EXCEPTIONS.has(dirname)) return dirname;
	return `${ORG_NAME}/${dirname}`;
}
