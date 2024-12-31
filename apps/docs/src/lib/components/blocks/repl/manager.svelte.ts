import { EditorState, type Transaction } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { svelte } from "@replit/codemirror-lang-svelte";
import { basicSetup } from "codemirror";
import { Debounced } from "runed";

export class Manager {
	#view: EditorView;

	transaction = $state<Transaction>();
	source: Debounced<string>;

	constructor(params: { editor: HTMLDivElement; initial: string }) {
		this.#view = new EditorView({
			dispatch: (t) => {
				this.transaction = t;
			},
			parent: params.editor,
			state: EditorState.create({
				doc: params.initial,
				extensions: [basicSetup, svelte()],
			}),
		});

		this.source = new Debounced(
			() => this.transaction?.newDoc.toString() ?? "",
			500,
		);

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
