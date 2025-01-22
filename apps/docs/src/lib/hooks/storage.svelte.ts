import { browser } from "$app/environment";
import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

export type Kind = "local" | "session";

export class ReactiveStorage<V extends string> {
	readonly kind: Kind;
	readonly key: string;

	#current: V | null = $state(null);

	constructor(kind: Kind, key: string) {
		this.kind = kind;
		this.key = key;
		if (browser) this.#current = this.storage.getItem(this.key) as V | null;
	}

	get storage(): Storage {
		switch (this.kind) {
			case "local":
				return window.localStorage;
			case "session":
				return window.sessionStorage;
			default:
				throw new Error("Invalid storage kind", this.kind);
		}
	}

	get value(): V | null {
		this.#subscribe();
		return this.#current;
	}

	set value(v: V | null) {
		this.#current = v;
		if (browser) {
			if (v === null) window.localStorage.removeItem(this.key);
			else window.localStorage.setItem(this.key, v);
		}
	}

	#subscribe(): () => void {
		return createSubscriber(() => on(window, "storage", this.#handle_storage_event));
	}

	#handle_storage_event(event: StorageEvent): void {
		if (event.key === this.key) this.#current = event.newValue as V | null;
	}
}
