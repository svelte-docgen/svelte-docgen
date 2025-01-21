// External
export { createCacheStorage } from "@svelte-docgen/extractor";
// Internal
export { analyze } from "./analyzer/mod.js";
export { decode, encode } from "./codec.js";
export { BASE_TYPE_KINDS, STRUCTURED_TYPE_KINDS, INSTANTIABLE_TYPE_KINDS, TYPE_KINDS } from "./kind/core.js";
// FIXME: Need to track this: https://github.com/Rich-Harris/dts-buddy/blob/94d4ff35f48a487c081a3a48ceb3d9124712b84e/src/utils.js#L317
// export * as is from "./kind/mod.js";
// TODO: Replace with namespace `is` once the above is fixed
export { isTypeRef, isBaseType, isStructuredType, isInstantiableType } from "./kind/guard.js";
export { Options } from "./options.js";
export { parse } from "./parser/mod.js";
