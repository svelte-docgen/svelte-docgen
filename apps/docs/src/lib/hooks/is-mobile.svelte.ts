import { untrack } from "svelte";

export class IsMobile {
	#breakpoint = 768;
	#current = $state<boolean>(false);

	constructor() {
		$effect(() => {
			return untrack(() => {
				const mql = window.matchMedia(`(max-width: ${this.#breakpoint - 1}px)`);
				const on_change = () => {
					this.#current = window.innerWidth < this.#breakpoint;
				};
				mql.addEventListener("change", on_change);
				on_change();
				return () => {
					mql.removeEventListener("change", on_change);
				};
			});
		});
	}

	get current(): boolean {
		return this.#current;
	}
}
