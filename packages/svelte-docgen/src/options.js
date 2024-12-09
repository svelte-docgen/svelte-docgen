import { Options as ExtractorOptions } from "@svelte-docgen/extractor";

/** @typedef {Partial<ConstructorParameters<typeof ExtractorOptions>[0]>} UserOptions */

export class Options extends ExtractorOptions {
	/** @param {UserOptions} user_options */
	// biome-ignore lint/complexity/noUselessConstructor: WIP
	constructor(user_options) {
		super(user_options);
		// TODO: Add more options
	}
}
