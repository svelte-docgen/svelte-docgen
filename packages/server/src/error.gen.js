/**
 * ⚠️ **DO NOT EDIT MANUALLY!**
 * This file is auto-generated via pre-build script "generate-errors".
 * @module
 */

/**
 * @param {string} pathname
 * @param {Record<string, string>} [params]
 * @returns {string}
 */
function get_url(pathname, params) {
	let url = new URL(`/${pathname}`, import.meta.env.BASE_URL);
	if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	return url.toString();
}