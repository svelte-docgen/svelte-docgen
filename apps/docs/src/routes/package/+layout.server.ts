import normalize from "normalize-package-data";
import path from "pathe";

const ORG_NAME = "@svelte-docgen";
const PREFIX_EXCEPTIONS = new Set(["svelte-docgen", "vite-plugin-svelte-docgen"]);

interface Package {
	data: normalize.Package;
	dirname: string;
	readme: string;
}

export async function load() {
	const glob_packages = import.meta.glob("../../../../../packages/**/package.json", {
		import: "default",
	});
	const packages = new Map<string, Package>(
		await Promise.all(
			Object.entries(glob_packages).map(async ([pkg_path, mod]) => {
				const data = (await mod()) as normalize.Package;
				normalize(data, true);
				return [
					data.name,
					{
						data,
						dirname: get_pkg_dirname(pkg_path),
						// NOTE: We will update later
						readme: "",
					},
				] as const;
			}),
		),
	);
	const glob_readmes = import.meta.glob("../../../../../packages/**/README.md", {
		query: "?raw",
		import: "default",
	});
	for (const [md_path, mod] of Object.entries(glob_readmes)) {
		const name = get_pkg_name(md_path);
		const pkg = packages.get(name);
		if (!pkg) throw new Error(`Could not find package for: ${md_path}`);
		const readme = (await mod()) as string;
		packages.set(name, { ...pkg, readme });
	}
	return {
		packages,
	};
}

function get_pkg_dirname(input: string): string {
	return path.dirname(path.relative("../../../../../packages", input));
}

function get_pkg_name(input: string): string {
	const dirname = get_pkg_dirname(input);
	if (PREFIX_EXCEPTIONS.has(dirname)) return dirname;
	return `${ORG_NAME}/${dirname}`;
}
