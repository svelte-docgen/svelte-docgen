import { describe, it } from "vitest";

import url from "url";
import path from "path";
import ts from "typescript";
import { get_root_path_url } from "./shared.js";

describe("get_root_path_url", () => {
	const basedir = path.resolve(path.join(url.fileURLToPath(import.meta.url), "../../"));
	const sys = {
		...ts.sys,
		fileExists: (filepath: string) => {
			if (path.dirname(filepath).length <= basedir.length) {
				return false;
			}
			return ts.sys.fileExists(filepath);
		},
	};

	it("can found pnpm workspace", ({ expect }) => {
		expect(
			get_root_path_url(sys, path.join(basedir, "tests/dummy-packages/pnpm-workspace/member/src")).pathname,
		).toBe(path.join(basedir, "tests/dummy-packages/pnpm-workspace"));
	});

	it("can found npm workspace", ({ expect }) => {
		expect(
			get_root_path_url(sys, path.join(basedir, "tests/dummy-packages/npm-workspace/member/src")).pathname,
		).toBe(path.join(basedir, "tests/dummy-packages/npm-workspace"));
	});

	it("can found bare package", ({ expect }) => {
		expect(get_root_path_url(sys, path.join(basedir, "tests/dummy-packages/package/src")).pathname).toBe(
			path.join(basedir, "tests/dummy-packages/package"),
		);
	});
});
