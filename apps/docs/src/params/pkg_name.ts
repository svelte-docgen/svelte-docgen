import type { ORG_NAME } from "./org_name.ts";

export const EXCEPTIONS = new Set([
	"svelte-docgen",
	"vite-plugin-svelte-docgen",
] as const);

// TODO: Make it dynamic, but can we use file system access?
export const PKG_NAMES = EXCEPTIONS.union(
	new Set(["extractor", "server"] as const),
);

type Exception = typeof EXCEPTIONS extends Set<infer T> ? T : never;
type PackageName = `${typeof ORG_NAME}/${string}` | Exception;

/**
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param): param is PackageName {
	// @ts-expect-error: WARN: `Set.has()` doesn't accept loose `string`
	return PKG_NAMES.has(param);
}
