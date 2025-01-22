import { MediaQuery } from "svelte/reactivity";

import { ReactiveStorage } from "./storage.svelte.ts";

export const VALUES = new Set(["light", "dark", "system"] as const);
export type ColorScheme = typeof VALUES extends Set<infer T> ? T : never;
export type UsedColorScheme = Exclude<ColorScheme, "system">;

/** `data-*` attribute name */
export const DATA_ATTR = "data-color-scheme";

class Watcher {
	#stored = new ReactiveStorage<ColorScheme>("local", "color-scheme");
	#mq_prefers_dark = new MediaQuery("prefers-color-scheme: dark");

	#current: ColorScheme = $state(this.#stored.value ?? "system");

	used: UsedColorScheme = $derived.by(() => {
		const current = this.#current;
		if (current === "system") return this.user_preference;
		return current;
	});

	user_preference: UsedColorScheme = $derived.by(() => {
		return this.#mq_prefers_dark.current ? "dark" : "light";
	});

	constructor() {
		$effect(() => {
			this.#stored.value = this.#current;
		});
	}

	get current(): ColorScheme {
		return this.#current;
	}

	set current(value: ColorScheme) {
		this.#current = value;
	}
}

let cached_watcher: Watcher | undefined;

export function get_watcher(): Watcher {
	if (cached_watcher) return cached_watcher;
	cached_watcher = new Watcher();
	return cached_watcher;
}
