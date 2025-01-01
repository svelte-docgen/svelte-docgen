import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { EditorState, type EditorStateConfig } from "@codemirror/state";
import { keymap, EditorView, ViewUpdate } from "@codemirror/view";
import { svelte } from "@replit/codemirror-lang-svelte";
import { basicSetup } from "codemirror";
import { Debounced } from "runed";

export class Manager {
	source: Debounced<string>;
	view: EditorView;
	update = $state<ViewUpdate>();

	#default_extensions = [
		basicSetup,
		EditorState.tabSize.of(2),
		// NOTE: Understand this: https://codemirror.net/examples/tab/
		keymap.of([indentWithTab]),
		indentUnit.of("\t"),
		svelte(),
	] satisfies EditorStateConfig["extensions"];

	constructor(options: { editor: HTMLDivElement; initial: string; debounce_delay?: number }) {
		this.view = new EditorView({
			parent: options.editor,
			state: EditorState.create({
				doc: options.initial,
				extensions: [
					//
					...this.#default_extensions,
					EditorView.updateListener.of((update) => {
						this.update = update;
					}),
				],
			}),
		});

		this.source = new Debounced(() => {
			return this.update?.state.doc.toString() ?? "";
		}, options.debounce_delay ?? 500);
	}

	/**
	 * Destroy the editor view to prevent memory leaks. Should be run in `onMount` return;
	 */
	destroy() {
		this.view.destroy();
	}
}
