import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { json } from "@codemirror/lang-json";
import { type EditorStateConfig, Compartment, EditorState } from "@codemirror/state";
import { type ViewUpdate, keymap, EditorView } from "@codemirror/view";
import { svelte } from "@replit/codemirror-lang-svelte";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { basicSetup } from "codemirror";
import { mode } from "mode-watcher";
import { Debounced } from "runed";

const theme_config = new Compartment();

export const SUPPORTED_LANGS = new Set(["json", "svelte"] as const);
export type Lang = typeof SUPPORTED_LANGS extends Set<infer T> ? T : never;

export class Context {
	source: Debounced<string>;
	view: EditorView;
	update = $state<ViewUpdate>();

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
	] satisfies EditorStateConfig["extensions"];

	constructor(options: {
		debounce_delay?: number;
		container: HTMLDivElement;
		initial?: string;
		lang: Lang;
		readonly?: boolean;
	}) {
		// eslint-disable-next-line prefer-const
		let extensions = [
			//
			...this.#default_extensions,
			EditorView.updateListener.of((update) => {
				this.update = update;
			}),
		];
		if (options.lang === "json") {
			extensions.push(json());
		}
		if (options.lang === "svelte") {
			extensions.push(svelte());
		}
		if (options.readonly) {
			extensions.push(EditorState.readOnly.of(true));
		}
		this.view = new EditorView({
			parent: options.container,
			state: EditorState.create({
				doc: options.initial,
				extensions,
			}),
		});
		this.source = new Debounced(() => {
			return this.update?.state.doc.toString() ?? "";
		}, options.debounce_delay ?? 400);
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
