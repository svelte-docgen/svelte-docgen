# @svelte-docgen/extractor

## 0.2.0

### Minor Changes

- [#86](https://github.com/svelte-docgen/svelte-docgen/pull/86) [`6531ca0`](https://github.com/svelte-docgen/svelte-docgen/commit/6531ca039e55cd1a4f909abe36f3a36c01de7667) Thanks [@ciscorn](https://github.com/ciscorn)! - Support for inline tags in props doc comments

- [#103](https://github.com/svelte-docgen/svelte-docgen/pull/103) [`f9d770b`](https://github.com/svelte-docgen/svelte-docgen/commit/f9d770bd0424e690dc37d36531cc0b19c71ad515) Thanks [@xeho91](https://github.com/xeho91)! - Handle bindable props defined from `"svelte/elements"` types

### Patch Changes

- [`1aaeeff`](https://github.com/svelte-docgen/svelte-docgen/commit/1aaeeffabdb6a94f483288ccdbc88d7c610349f6) Thanks [@ciscorn](https://github.com/ciscorn)! - Fix an issue when processing components with a single $bindable.

- [#13](https://github.com/svelte-docgen/svelte-docgen/pull/13) [`088dbb5`](https://github.com/svelte-docgen/svelte-docgen/commit/088dbb5cfd79d2a29af5fa87e3027d28b171b8d8) Thanks [@xeho91](https://github.com/xeho91)! - Temporarily fix ESM issue due to `require.resolve` usage

- [#45](https://github.com/svelte-docgen/svelte-docgen/pull/45) [`763e368`](https://github.com/svelte-docgen/svelte-docgen/commit/763e36800fefde50296bb9c4a64bf95c5799385d) Thanks [@ciscorn](https://github.com/ciscorn)! - Initial support for non-Node runtimes with experimental 'playground'

- [#46](https://github.com/svelte-docgen/svelte-docgen/pull/46) [`457caa3`](https://github.com/svelte-docgen/svelte-docgen/commit/457caa39e70adc7726b996502ec0689e3bb14507) Thanks [@ciscorn](https://github.com/ciscorn)! - Fixed a cache key bug and resolved an issue caused by root_names reuse

- [#32](https://github.com/svelte-docgen/svelte-docgen/pull/32) [`cfb4387`](https://github.com/svelte-docgen/svelte-docgen/commit/cfb43877f2164655a53a5f0f4a9569d296ab0734) Thanks [@ciscorn](https://github.com/ciscorn)! - Fix calls to findConfigFile to use file path instead of source content

- [#13](https://github.com/svelte-docgen/svelte-docgen/pull/13) [`088dbb5`](https://github.com/svelte-docgen/svelte-docgen/commit/088dbb5cfd79d2a29af5fa87e3027d28b171b8d8) Thanks [@xeho91](https://github.com/xeho91)! - Allow filepaths with URI _(with `file://`)_ protocol

- [#53](https://github.com/svelte-docgen/svelte-docgen/pull/53) [`e8923ed`](https://github.com/svelte-docgen/svelte-docgen/commit/e8923ed6cc8eacda404eee34bc0e6541a08a1ba5) Thanks [@ciscorn](https://github.com/ciscorn)! - Fix default value handling for props with aliasing

## 0.1.0

### Minor Changes

- [#12](https://github.com/svelte-docgen/svelte-docgen/pull/12) [`f90a3c9`](https://github.com/svelte-docgen/svelte-docgen/commit/f90a3c9be1d81f72307d5f808147271d73c352cc) Thanks [@xeho91](https://github.com/xeho91)! - 💡Initial prototype version
