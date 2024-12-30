export const ORG_NAME = "@svelte-docgen";
/**
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param: string): param is typeof ORG_NAME {
	return param === ORG_NAME;
}
