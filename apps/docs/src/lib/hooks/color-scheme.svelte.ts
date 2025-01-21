export type ColorScheme = "light" | "dark" | "system";

/** Local storage key */
export const LS_KEY = "color-scheme";

class Context {
	#current = $state<ColorScheme>(this.#stored ?? "system");

	get current(): ColorScheme {
		return this.#current;
	}

	get #stored(): ColorScheme | undefined {
		return (window.localStorage.getItem(LS_KEY) as ColorScheme) ?? undefined;
	}
}

export const COLOR_SCHEME = new Context();

COLOR_SCHEME.LS;
