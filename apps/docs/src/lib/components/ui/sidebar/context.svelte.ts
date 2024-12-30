import { getContext, setContext } from "svelte";

import { IsMobile } from "$lib/hooks/is-mobile.svelte.ts";

import { KEYBOARD_SHORTCUT } from "./constants.ts";

type Getter<T> = () => T;

export type StateProps = {
	/**
	 * A getter function that returns the current open state of the sidebar.
	 * We use a getter function here to support `bind:open` on the `Sidebar.Provider`
	 * component.
	 */
	open: Getter<boolean>;
	/**
	 * A function that sets the open state of the sidebar. To support `bind:open`, we need
	 * a source of truth for changing the open state to ensure it will be synced throughout
	 * the sub-components and any `bind:` references.
	 */
	set_open: (open: boolean) => void;
};

class State {
	readonly props: StateProps;
	#is_mobile: IsMobile;

	open_mobile = $state(false);

	open = $derived.by(() => this.props.open());
	state = $derived.by(() => (this.open ? "expanded" : "collapsed"));

	set_open: StateProps["set_open"];

	constructor(props: StateProps) {
		this.set_open = props.set_open;
		this.#is_mobile = new IsMobile();
		this.props = props;
	}

	// Convenience getter for checking if the sidebar is mobile
	// without this, we would need to use `sidebar.isMobile.current` everywhere
	get is_mobile() {
		return this.#is_mobile.current;
	}

	// Event handler to apply to the `<svelte:window>`
	handle_shortcut_keydown = (e: KeyboardEvent) => {
		if (e.key === KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			this.toggle();
		}
	};

	set_open_mobile = (value: boolean) => {
		this.open_mobile = value;
	};

	toggle = () => {
		return this.#is_mobile.current
			? (this.open_mobile = !this.open_mobile)
			: this.set_open(!this.open);
	};
}

const SYMBOL_KEY = "scn-sidebar";

/**
 * Instantiates a new sidebar {@link State} instance and sets it in the context.
 *
 * @param props The constructor props for the {@link State} class.
 * @returns  The {@link State} instance.
 */
export function set(props: StateProps): State {
	return setContext(Symbol.for(SYMBOL_KEY), new State(props));
}

/**
 * Retrieves the {@link State} instance from the context. This is a class instance,
 * so you cannot destructure it.
 * @returns The {@link State} instance.
 */
export function use(): State {
	return getContext(Symbol.for(SYMBOL_KEY));
}
