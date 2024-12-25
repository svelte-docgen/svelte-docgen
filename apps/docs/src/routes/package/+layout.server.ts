import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import normalize from "normalize-package-data";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function load() {
	const root_dir_url = url.pathToFileURL(
		path.resolve(__dirname, "..", "..", "..", "..", "..", "packages"),
	);
	const packages = new Map(
		await Promise.all(
			Iterator.from(await fs.readdir(root_dir_url, { withFileTypes: true }))
				.filter((dirent) => dirent.isDirectory())
				.map(async (dirent) => {
					const pkg_dir_path = path.resolve(dirent.parentPath, dirent.name);
					const pkg_path_url = url.pathToFileURL(
						path.join(pkg_dir_path, "package.json"),
					);
					const pkg_content = await fs.readFile(pkg_path_url, "utf-8");
					const pkg_data = JSON.parse(pkg_content);
					normalize(pkg_data, true);
					return [pkg_data.name, pkg_data as normalize.Package] as const;
				}),
		),
	);
	return {
		packages,
	};
}
