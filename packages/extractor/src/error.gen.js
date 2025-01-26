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

/**
 * Our extractor expected `bindings` to have literal string types in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function bindings_without_literal_string_types() {
	throw new Error(get_url("bindings_without_literal_string_types"));
}

/**
 * The provided Svelte source code `filepath` must end with an `.svelte` extension.
 * 
 * @returns {never}
 */
export function invalid_svelte_filepath_extension() {
	throw new Error(get_url("invalid_svelte_filepath_extension"));
}

/**
 * Our extractor could not find an AST node of `FunctionDeclaration` with `render` name in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_render_fn() {
	throw new Error(get_url("not_found_render_fn"));
}

/**
 * Our extractor could not find a signature of `render` function in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_render_fn_signature() {
	throw new Error(get_url("not_found_render_fn_signature"));
}

/**
 * Our extractor could not find a source file of the following file path:
 * {filepath}
 * 
 * If the path is correct, before creating an issue, please ensure that in your `(j|t)sconfig.json` file you're including them in:
 * 
 * * `compilerOptions.libs` - if the types comes from [high level libraries](https://www.typescriptlang.org/tsconfig/#high-level-libraries), such as:
 *   * `"DOM"`
 *   * `"DOM.Iterable"`
 *   * `"ESNext"`
 * * `compilerOptions.types` - if the types comes from [type definitions](https://www.typescriptlang.org/tsconfig#types), but they're not *directly* imported inside the source code.
 * 
 * @param {Object} params
 * @param {string} params.filepath where the error occurred
 * @returns {never}
 */
export function not_found_source_file(params) {
	throw new Error(get_url("not_found_source_file", params));
}

/**
 * Our extractor could not find a source file of the following file path:
 * {filepath}
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @param {Object} params
 * @param {string} params.filepath
 * @returns {never}
 */
export function not_found_source_file_tsx(params) {
	throw new Error(get_url("not_found_source_file_tsx", params));
}

/**
 * Our extractor couldn't find a type for `bindings` in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_type_bindings() {
	throw new Error(get_url("not_found_type_bindings"));
}

/**
 * Our extractor couldn't find a type for `events` in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_type_events() {
	throw new Error(get_url("not_found_type_events"));
}

/**
 * Our extractor couldn't find a type for `exports` in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_type_exports() {
	throw new Error(get_url("not_found_type_exports"));
}

/**
 * Our extractor couldn't find a type for `props` in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_type_props() {
	throw new Error(get_url("not_found_type_props"));
}

/**
 * Our extractor couldn't find a type for `slots` in the compiled TSX file.
 * 
 * This is likely a bug on our side.
 * Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
 * 
 * @returns {never}
 */
export function not_found_type_slots() {
	throw new Error(get_url("not_found_type_slots"));
}