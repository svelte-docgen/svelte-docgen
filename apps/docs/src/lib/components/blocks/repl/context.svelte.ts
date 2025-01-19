import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { Compartment, EditorState, type EditorStateConfig } from "@codemirror/state";
import { keymap, EditorView } from "@codemirror/view";
import { svelte } from "@replit/codemirror-lang-svelte";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { basicSetup } from "codemirror";
import { mode } from "mode-watcher";

const theme_config = new Compartment();

export type EditorUpdateHandler = Parameters<(typeof EditorView)["updateListener"]["of"]>[0];

export class Context {
	view: EditorView;

	scheme = $state<"light" | "dark">();
	#scheme_unsubscriber = mode.subscribe((v) => (this.scheme = v));
	theme = $derived(this.scheme === "dark" ? githubDark : githubLight);

	#default_extensions = [
		theme_config.of(this.theme),
		basicSetup,
		EditorState.tabSize.of(2),
		// NOTE: Understand this: https://codemirror.net/examples/tab/
		keymap.of([indentWithTab]),
		indentUnit.of("\t"),
		svelte(),
	] satisfies EditorStateConfig["extensions"];

	constructor(options: {
		editor: HTMLDivElement;
		initial?: NonNullable<Parameters<(typeof EditorState)["create"]>[0]>["doc"];
		on_update?: EditorUpdateHandler;
	}) {
		// eslint-disable-next-line prefer-const
		let extensions = this.#default_extensions;
		if (options.on_update) {
			extensions.push(EditorView.updateListener.of(options.on_update));
		}
		this.view = new EditorView({
			parent: options.editor,
			state: EditorState.create({
				doc: options.initial,
				extensions,
			}),
		});
		this.#init();
	}

	/**
	 * Collect all of the effects in one place.
	 */
	#init() {
		/**
		 * Update the theme when the scheme changes.
		 */
		$effect(() => {
			this.view.dispatch({
				effects: theme_config.reconfigure(this.theme),
			});
		});
	}

	/**
	 * Should be run in `onMount` return;
	 * Destroy:
	 * - the editor view to prevent memory leaks.
	 * - svelte store subscriber for scheme
	 */
	destroy() {
		this.view.destroy();
		this.#scheme_unsubscriber();
	}
}
