# svelte-docgen

## 0.2.0

### Minor Changes

- [#61](https://github.com/svelte-docgen/svelte-docgen/pull/61) [`1e4410f`](https://github.com/svelte-docgen/svelte-docgen/commit/1e4410fbb79187ca230bafd854af08b578457b61) Thanks [@ciscorn](https://github.com/ciscorn)! - Support recursive aliases and type references

- [#86](https://github.com/svelte-docgen/svelte-docgen/pull/86) [`6531ca0`](https://github.com/svelte-docgen/svelte-docgen/commit/6531ca039e55cd1a4f909abe36f3a36c01de7667) Thanks [@ciscorn](https://github.com/ciscorn)! - Support for inline tags in props doc comments

- [#100](https://github.com/svelte-docgen/svelte-docgen/pull/100) [`764f688`](https://github.com/svelte-docgen/svelte-docgen/commit/764f6886207f303c5369ee4167a2c5a549b68378) Thanks [@ciscorn](https://github.com/ciscorn)! - Merge `true | false | ...` into `boolean | ...`

- [#101](https://github.com/svelte-docgen/svelte-docgen/pull/101) [`617b149`](https://github.com/svelte-docgen/svelte-docgen/commit/617b149006788bafcab190961dde14aeefc14a2b) Thanks [@xeho91](https://github.com/xeho91)! - Revamp analysis part - remove `analyzeComponent` & `analyzeProperty` in favor of `analyze`.

- [#119](https://github.com/svelte-docgen/svelte-docgen/pull/119) [`238f32e`](https://github.com/svelte-docgen/svelte-docgen/commit/238f32e97415f49f6ed2ae84fc4ddaa708fa226f) Thanks [@xeho91](https://github.com/xeho91)! - Add types:

  - `StructuredType`
  - `InstantiableType`

- [#15](https://github.com/svelte-docgen/svelte-docgen/pull/15) [`5d6cbcc`](https://github.com/svelte-docgen/svelte-docgen/commit/5d6cbcc39a811f63fcc63ba97c5e8c8708eaabc2) Thanks [@xeho91](https://github.com/xeho91)! - ✨ Add `encode()` and `encode()` functions

- [#119](https://github.com/svelte-docgen/svelte-docgen/pull/119) [`238f32e`](https://github.com/svelte-docgen/svelte-docgen/commit/238f32e97415f49f6ed2ae84fc4ddaa708fa226f) Thanks [@xeho91](https://github.com/xeho91)! - Rename `ArrayType` to `Array`

- [#119](https://github.com/svelte-docgen/svelte-docgen/pull/119) [`238f32e`](https://github.com/svelte-docgen/svelte-docgen/commit/238f32e97415f49f6ed2ae84fc4ddaa708fa226f) Thanks [@xeho91](https://github.com/xeho91)! - Add new type guards:

  - `isTypeRef`
  - `isBaseType`
  - `isStructuredType`
  - `isInstantiableType`

### Patch Changes

- [#68](https://github.com/svelte-docgen/svelte-docgen/pull/68) [`958675c`](https://github.com/svelte-docgen/svelte-docgen/commit/958675c2d01118fad0a3412cb455f7c896c7aaee) Thanks [@ciscorn](https://github.com/ciscorn)! - Fix to handle tuples as TypeReference

- [#13](https://github.com/svelte-docgen/svelte-docgen/pull/13) [`088dbb5`](https://github.com/svelte-docgen/svelte-docgen/commit/088dbb5cfd79d2a29af5fa87e3027d28b171b8d8) Thanks [@xeho91](https://github.com/xeho91)! - Temporarily fix ESM issue due to `require.resolve` usage

- [#98](https://github.com/svelte-docgen/svelte-docgen/pull/98) [`e27d6d6`](https://github.com/svelte-docgen/svelte-docgen/commit/e27d6d671d36a73de2d0f0b23f45844483713ec7) Thanks [@xeho91](https://github.com/xeho91)! - fix: `isEventHandler` handling nullable union type

- [#45](https://github.com/svelte-docgen/svelte-docgen/pull/45) [`763e368`](https://github.com/svelte-docgen/svelte-docgen/commit/763e36800fefde50296bb9c4a64bf95c5799385d) Thanks [@ciscorn](https://github.com/ciscorn)! - Initial support for non-Node runtimes with experimental 'playground'

- [#68](https://github.com/svelte-docgen/svelte-docgen/pull/68) [`958675c`](https://github.com/svelte-docgen/svelte-docgen/commit/958675c2d01118fad0a3412cb455f7c896c7aaee) Thanks [@ciscorn](https://github.com/ciscorn)! - Add support for instantiable types

- [#122](https://github.com/svelte-docgen/svelte-docgen/pull/122) [`74fd4ee`](https://github.com/svelte-docgen/svelte-docgen/commit/74fd4ee07a578032de1f35cd0e831e2b591cb60d) Thanks [@ciscorn](https://github.com/ciscorn)! - Extract alias type arguments

- [#13](https://github.com/svelte-docgen/svelte-docgen/pull/13) [`088dbb5`](https://github.com/svelte-docgen/svelte-docgen/commit/088dbb5cfd79d2a29af5fa87e3027d28b171b8d8) Thanks [@xeho91](https://github.com/xeho91)! - Allow filepaths with URI _(with `file://`)_ protocol

- [#92](https://github.com/svelte-docgen/svelte-docgen/pull/92) [`227adc2`](https://github.com/svelte-docgen/svelte-docgen/commit/227adc2c5dd4e6dcee8c23041cc4a9bb1d1908b6) Thanks [@xeho91](https://github.com/xeho91)! - Fix incorrect handling of `analyzeProperty.isSnippet` in browser-like environments

- [#34](https://github.com/svelte-docgen/svelte-docgen/pull/34) [`115ebc7`](https://github.com/svelte-docgen/svelte-docgen/commit/115ebc73b520a9e341321b729be0df55b985554e) Thanks [@xeho91](https://github.com/xeho91)! - Convert paths inside `sources` set to relative to project root

- Updated dependencies [[`1aaeeff`](https://github.com/svelte-docgen/svelte-docgen/commit/1aaeeffabdb6a94f483288ccdbc88d7c610349f6), [`6531ca0`](https://github.com/svelte-docgen/svelte-docgen/commit/6531ca039e55cd1a4f909abe36f3a36c01de7667), [`088dbb5`](https://github.com/svelte-docgen/svelte-docgen/commit/088dbb5cfd79d2a29af5fa87e3027d28b171b8d8), [`763e368`](https://github.com/svelte-docgen/svelte-docgen/commit/763e36800fefde50296bb9c4a64bf95c5799385d), [`f9d770b`](https://github.com/svelte-docgen/svelte-docgen/commit/f9d770bd0424e690dc37d36531cc0b19c71ad515), [`457caa3`](https://github.com/svelte-docgen/svelte-docgen/commit/457caa39e70adc7726b996502ec0689e3bb14507), [`cfb4387`](https://github.com/svelte-docgen/svelte-docgen/commit/cfb43877f2164655a53a5f0f4a9569d296ab0734), [`088dbb5`](https://github.com/svelte-docgen/svelte-docgen/commit/088dbb5cfd79d2a29af5fa87e3027d28b171b8d8), [`e8923ed`](https://github.com/svelte-docgen/svelte-docgen/commit/e8923ed6cc8eacda404eee34bc0e6541a08a1ba5)]:
  - @svelte-docgen/extractor@0.2.0

## 0.1.0

### Minor Changes

- [#12](https://github.com/svelte-docgen/svelte-docgen/pull/12) [`f90a3c9`](https://github.com/svelte-docgen/svelte-docgen/commit/f90a3c9be1d81f72307d5f808147271d73c352cc) Thanks [@xeho91](https://github.com/xeho91)! - 💡Initial prototype version

### Patch Changes

- Updated dependencies [[`f90a3c9`](https://github.com/svelte-docgen/svelte-docgen/commit/f90a3c9be1d81f72307d5f808147271d73c352cc)]:
  - @svelte-docgen/extractor@0.1.0
