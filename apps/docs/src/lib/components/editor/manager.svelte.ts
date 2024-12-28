import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";

export class Manager {
	view = $state<EditorView>();
	state: EditorState | undefined = $derived(this.view?.state);

	constructor() {
		// this.#view = view;
		// this.state = EditorState.create({
		// 	doc: initial,
		// 	extensions: [svelte()],
		// });
	}

	// set view(view: EditorView) {
	// 	this.#view = view;
	// }
	//
	// get view(): EditorView {
	// 	if (this.#view) return this.#view;
	// 	throw new Error("EditorView was not set before accessing.");
	// }

	// #update_state(content: string): void {
	// 	const current = this.state.doc.toString();
	// 	this.state.update({
	// 		changes: {
	// 			from: 0,
	// 			to: current.length,
	// 			insert: content,
	// 		},
	// 	});
	// }
}
