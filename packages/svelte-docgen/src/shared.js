/**
 * @import { extract } from "@svelte-docgen/extractor";
 */

import pathe from "pathe";
import ts from "typescript";

const IS_NODE_LIKE = globalThis.process?.cwd !== undefined;

/**
 * @internal
 * @typedef {ReturnType<typeof extract>} Extractor
 */

/**
 * @internal
 * @param {ts.Type} type
 * @returns {type is ts.ObjectType}
 */
export function is_object_type(type) {
	return (type.flags & ts.TypeFlags.Object || type.flags & ts.TypeFlags.NonPrimitive) !== 0;
}

/**
 * @internal
 * @param {ts.Type} type
 * @returns {type is ts.TypeReference}
 */
export function is_type_reference(type) {
	return is_object_type(type) && (type.objectFlags & ts.ObjectFlags.Reference) !== 0;
}

/**
 * @internal
 * @param {ts.Type} type
 * @returns {type is ts.TupleType}
 */
export function is_tuple_type(type) {
	return is_object_type(type) && (type.objectFlags & ts.ObjectFlags.Tuple) !== 0;
}

/**
 * @internal
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
export function is_symbol_optional(symbol) {
	return (symbol.flags & ts.SymbolFlags.Optional) !== 0;
}

/**
 * @internal
 * @param {string} source
 * @returns {string}
 */
export function remove_tsx_extension(source) {
	return source.replace(/\.tsx$/, "");
}

/**
 * @internal
 * @param {ts.Type} type
 * @returns {ts.Symbol}
 */
export function get_type_symbol(type) {
	const symbol = type.getSymbol();
	if (symbol) return symbol;
	// TODO: Document error
	throw new Error("Could not get symbol of type");
}

/**
 * @internal
 * @template {ts.Type} [T=ts.Type]
 * @typedef GetTypeParams
 * @prop {T} type
 * @prop {Extractor} extractor
 * @prop {string} [self]
 */

/**
 * @internal
 * @param {ts.Type} type
 * @param {Extractor} extractor
 * @returns {readonly ts.Signature[]}
 */
export function get_construct_signatures(type, extractor) {
	const symbol = get_type_symbol(type);
	const symbol_type = extractor.checker.getTypeOfSymbol(symbol);
	return extractor.checker.getSignaturesOfType(symbol_type, ts.SignatureKind.Construct);
}

/**
 * @internal
 * @param {ts.TypeParameter} type
 * @returns {boolean}
 */
export function is_const_type_param(type) {
	const symbol = type.symbol;
	const declarations = symbol.getDeclarations();
	// TODO: Document error
	if (!declarations || declarations.length === 0)
		throw new Error(`Could not get declarations of type parameter ${symbol.name}`);
	return declarations.some((declaration) => {
		const modifiers = ts.getCombinedModifierFlags(declaration);
		return (modifiers & ts.ModifierFlags.Const) !== 0;
	});
}

/**
 * @internal
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
export function is_symbol_readonly(symbol) {
	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0) return false;
	return declarations.some((d) => {
		const modifiers = ts.getCombinedModifierFlags(d);
		return (modifiers & ts.ModifierFlags.Readonly) !== 0;
	});
}

/**
 * @internal
 * Creates a Set with stringified **relative** paths of declaration file(s) where the type was declared.
 *
 * In order to make it relative, it trims out _root_ from the path. Also for security resons to prevent exposing the
 * full path to third-parties: https://github.com/svelte-docgen/svelte-docgen/issues/29
 *
 * It also trims `.tsx` extension for the filepaths with `*.svelte` - internally is appended to make it work with
 * TypeScript Compiler API {@link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API}.
 *
 * @param {ts.Declaration[]} declarations Passed from {@link ts.Symbol} or {@link ts.Type}
 * @param {URL} root_path_url {@link get_root_path_url}
 * @returns {Set<string>}
 */
export function get_sources(declarations, root_path_url) {
	return new Set(
		declarations.map((d) => {
			/* prettier-ignore */
			return d
				.getSourceFile()
				.fileName.replace(".tsx", "")
				.replace(root_path_url.pathname, "");
		}),
	);
}

/**
 * @internal
 * Find the _root_ path of the project.
 * It covers monorepo case _(based on existence of `pnpm-workspace.yaml` or field `package.json#workspaces`)_.
 * Field `package.json#workspaces` is also case for: npm, yarn, Deno, and Bun.
 *
 * @param {ts.System} sys TypeScript system for I/O operations.
 * @param {string} [directory] Directory to start searching from. Default is `process.cwd()`.
 * @returns {URL} URI with path of either monorepo root or a basename of nearest `package.json` file.
 * @throws {Error} If it cannot find nearest `package.json` file if project isn't a monorepo.
 */
export function get_root_path_url(sys, directory) {
	if (!IS_NODE_LIKE) {
		// Set the root of the virtual file system (VFS) as the root
		return new URL("file:///");
	}

	directory = pathe.resolve(directory ?? process.cwd());
	const { root } = pathe.parse(directory);
	/** @type {string | undefined} */
	let found_dir;
	while (directory) {
		// Case 1: pnpm workspace
		const pnpm_workspace_yaml_filepath = pathe.join(directory, "pnpm-workspace.yaml");
		const pnpm_workspace_yml_filepath = pathe.join(directory, "pnpm-workspace.yml");
		if (sys.fileExists(pnpm_workspace_yml_filepath) || sys.fileExists(pnpm_workspace_yaml_filepath)) {
			found_dir = directory;
			break;
		}
		// Case 2: Others
		const package_json_filepath = pathe.join(directory, "package.json");
		if (sys.fileExists(package_json_filepath)) {
			const content = sys.readFile(package_json_filepath, "utf-8");
			if (content) {
				if (JSON.parse(content).workspaces) {
					// workspaces field found
					found_dir = directory;
					break;
				} else if (!found_dir) {
					found_dir = directory;
				}
			}
		}
		// NOTE: This goes root up
		if (directory === root) break;
		directory = pathe.dirname(directory);
	}

	if (!found_dir) {
		// TODO: Document error
		throw new Error("Could not determine the the root path.");
	}
	return new URL(`file://${found_dir}`);
}
