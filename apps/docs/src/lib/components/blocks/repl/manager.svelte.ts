import { indentWithTab } from "@codemirror/commands";
import { EditorState, type EditorStateConfig, type Transaction } from "@codemirror/state";
import { keymap, EditorView } from "@codemirror/view";
import { svelte } from "@replit/codemirror-lang-svelte";
import { basicSetup } from "codemirror";
import { Debounced } from "runed";

export class Manager {
	#view: EditorView;

	transaction = $state<Transaction>();
	source: Debounced<string>;

	#default_extensions = [
		basicSetup,
		EditorState.tabSize.of(2),
		// NOTE: Understand this: https://codemirror.net/examples/tab/
		keymap.of([indentWithTab]),
		svelte(),
	] satisfies EditorStateConfig["extensions"];

	constructor(options: { editor: HTMLDivElement; initial: string; debounce_delay?: number }) {
		this.#view = new EditorView({
			dispatch: (t) => {
				this.transaction = t;
			},
			parent: options.editor,
			state: EditorState.create({
				doc: options.initial,
				extensions: this.#default_extensions,
			}),
		});

		this.source = new Debounced(() => this.transaction?.newDoc.toString() ?? "", options.debounce_delay ?? 500);

		/**
		 * Reactivity - update the editor view whenever there's a new transaction.
		 */
		$effect(() => {
			const { transaction } = this;
			if (transaction && transaction.docChanged) {
				this.#view.update([transaction]);
			}
		});
	}

	/**
	 * Destroy the editor view to prevent memory leaks. Should be run `onMount` return;
	 */
	destroy() {
		this.#view.destroy();
	}
}
