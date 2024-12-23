/**
 * Svelte source code
 * @typedef {string} Source
 */

/**
 * Original Svelte filepath
 * @typedef {`${string}.svelte`} SvelteFilepath
 */

/**
 * Compiled with {@link svelte2tsx} Svelte **virtual** filepath
 * @typedef {`${SvelteFilepath}.tsx`} TSXFilepath
 */

export const IS_NODE_LIKE = globalThis.process?.cwd !== undefined;
