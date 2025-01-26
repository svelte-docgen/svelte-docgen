## bindings_without_literal_string_types

Our extractor expected `bindings` to have literal string types in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## invalid_svelte_filepath_extension

The provided Svelte source code `filepath` must end with an `.svelte` extension.

## not_found_render_fn

Our extractor could not find an AST node of `FunctionDeclaration` with `render` name in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_render_fn_signature

Our extractor could not find a signature of `render` function in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_source_file

<!--params
filepath: string # where the error occurred
-->

Our extractor could not find a source file of the following file path:
{filepath}

If the path is correct, before creating an issue, please ensure that in your `(j|t)sconfig.json` file you're including them in:

- `compilerOptions.libs` - if the types comes from [high level libraries](https://www.typescriptlang.org/tsconfig/#high-level-libraries), such as:
  - `"DOM"`
  - `"DOM.Iterable"`
  - `"ESNext"`
- `compilerOptions.types` - if the types comes from [type definitions](https://www.typescriptlang.org/tsconfig#types), but they're not _directly_ imported inside the source code.

## not_found_source_file_tsx

<!--params
filepath: string
-->

Our extractor could not find a source file of the following file path:
{filepath}

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_type_bindings

Our extractor couldn't find a type for `bindings` in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_type_events

Our extractor couldn't find a type for `events` in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_type_exports

Our extractor couldn't find a type for `exports` in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_type_props

Our extractor couldn't find a type for `props` in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.

## not_found_type_slots

Our extractor couldn't find a type for `slots` in the compiled TSX file.

This is likely a bug on our side.
Please [create an issue](https://github.com/svelte-docgen/svelte-docgen/issues/new) with a source code example that caused this error.
