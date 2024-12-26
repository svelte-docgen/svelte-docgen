import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { svelte } from "@replit/codemirror-lang-svelte";
import { basicSetup } from "codemirror";

// new EditorView({
// 	state: EditorState.create({
// 		doc: `<script>let a = "hello world";</script> <div>{a}</div>`,
// 		extensions: [basicSetup, svelte()],
// 	}),
// 	parent: document.querySelector("#editor"),
// });

export class Manager {
	#view: EditorView;
	state: EditorState = $state(this.#create_state());

	constructor(view: EditorView) {
		this.#view = view;
	}

	#create_state(): EditorState {
		return EditorState.create({
			// TODO:
			doc: "",
			extensions: [svelte()],
		});
	}

	#update_state(content: string): void {
		const current = this.state.doc.toString();
		this.state.update({
			changes: {
				from: 0,
				to: current.length,
				insert: content,
			},
		});
	}
}
