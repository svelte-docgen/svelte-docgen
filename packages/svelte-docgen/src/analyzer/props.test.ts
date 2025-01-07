import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";

import { PropsAnalyzer } from "./props.js";

const parsed_modern = parse(
	`
	<script lang="ts">
		import type { HTMLButtonAttributes } from "svelte/elements";

		interface Props extends HTMLButtonAttributes {}
		let props: Props = $props();
	</script>
	`,
	create_options("analyze-component-props-modern.svelte"),
);
const parsed_legacy = parse(
	`
	<script lang="ts">
		import type { HTMLButtonAttributes } from "svelte/elements";

		type $$Props = HTMLButtonAttributes;
		export let disabled: boolean | null | undefined = undefined;
	</script>
	`,
	create_options("analyze-component-props.svelte"),
);

describe(PropsAnalyzer.name, () => {
	describe("getter .all", () => {
		it("when component is legacy, modern event handlers are omitted", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_legacy);
			const { all } = analyzer;
			expect(all.get("on:click")).toBeDefined();
			expect(all.get("onclick")).not.toBeDefined();
			expect(all.get("disabled")).toBeDefined();
		});

		it("when component is not legacy (modern), legacy event handlers are omitted", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_modern);
			const { all } = analyzer;
			expect(all.get("onclick")).toBeDefined();
			expect(all.get("on:click")).not.toBeDefined();
			expect(all.get("disabled")).toBeDefined();
		});
	});

	describe("getter .aria", () => {
		it("returns filtered props map which are ARIA related only", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_modern);
			const { aria } = analyzer;
			expect([...aria.keys()]).toMatchInlineSnapshot(`
				[
				  "aria-activedescendant",
				  "aria-atomic",
				  "aria-autocomplete",
				  "aria-busy",
				  "aria-checked",
				  "aria-colcount",
				  "aria-colindex",
				  "aria-colspan",
				  "aria-controls",
				  "aria-current",
				  "aria-describedby",
				  "aria-details",
				  "aria-disabled",
				  "aria-dropeffect",
				  "aria-errormessage",
				  "aria-expanded",
				  "aria-flowto",
				  "aria-grabbed",
				  "aria-haspopup",
				  "aria-hidden",
				  "aria-invalid",
				  "aria-keyshortcuts",
				  "aria-label",
				  "aria-labelledby",
				  "aria-level",
				  "aria-live",
				  "aria-modal",
				  "aria-multiline",
				  "aria-multiselectable",
				  "aria-orientation",
				  "aria-owns",
				  "aria-placeholder",
				  "aria-posinset",
				  "aria-pressed",
				  "aria-readonly",
				  "aria-relevant",
				  "aria-required",
				  "aria-roledescription",
				  "aria-rowcount",
				  "aria-rowindex",
				  "aria-rowspan",
				  "aria-selected",
				  "aria-setsize",
				  "aria-sort",
				  "aria-valuemax",
				  "aria-valuemin",
				  "aria-valuenow",
				  "aria-valuetext",
				]
			`);
			expect(aria.size).toBe(48);
			expect(aria.get("aria-label")).toBeDefined();
		});
	});

	describe("getter .data", () => {
		it("returns filtered props map which are data attributes only", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_modern);
			const { data } = analyzer;
			expect([...data.keys()]).toMatchInlineSnapshot(`
				[
				  "data-sveltekit-keepfocus",
				  "data-sveltekit-noscroll",
				  "data-sveltekit-preload-code",
				  "data-sveltekit-preload-data",
				  "data-sveltekit-reload",
				  "data-sveltekit-replacestate",
				]
			`);
			expect(data.size).toBe(6);
			expect(data.get("data-sveltekit-preload-data")).toBeDefined();
		});
	});

	describe("getter .events", () => {
		it("returns filtered props map which are event handlers only", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_modern);
			const { events } = analyzer;
			expect([...events.keys()]).toMatchInlineSnapshot(`
				[
				  "oncopy",
				  "oncopycapture",
				  "oncut",
				  "oncutcapture",
				  "onpaste",
				  "onpastecapture",
				  "oncompositionend",
				  "oncompositionendcapture",
				  "oncompositionstart",
				  "oncompositionstartcapture",
				  "oncompositionupdate",
				  "oncompositionupdatecapture",
				  "onfocus",
				  "onfocuscapture",
				  "onfocusin",
				  "onfocusincapture",
				  "onfocusout",
				  "onfocusoutcapture",
				  "onblur",
				  "onblurcapture",
				  "onchange",
				  "onchangecapture",
				  "onbeforeinput",
				  "onbeforeinputcapture",
				  "oninput",
				  "oninputcapture",
				  "onreset",
				  "onresetcapture",
				  "onsubmit",
				  "onsubmitcapture",
				  "oninvalid",
				  "oninvalidcapture",
				  "onformdata",
				  "onformdatacapture",
				  "onload",
				  "onloadcapture",
				  "onerror",
				  "onerrorcapture",
				  "onbeforetoggle",
				  "onbeforetogglecapture",
				  "ontoggle",
				  "ontogglecapture",
				  "oncontentvisibilityautostatechange",
				  "oncontentvisibilityautostatechangecapture",
				  "onkeydown",
				  "onkeydowncapture",
				  "onkeypress",
				  "onkeypresscapture",
				  "onkeyup",
				  "onkeyupcapture",
				  "onabort",
				  "onabortcapture",
				  "oncanplay",
				  "oncanplaycapture",
				  "oncanplaythrough",
				  "oncanplaythroughcapture",
				  "oncuechange",
				  "oncuechangecapture",
				  "ondurationchange",
				  "ondurationchangecapture",
				  "onemptied",
				  "onemptiedcapture",
				  "onencrypted",
				  "onencryptedcapture",
				  "onended",
				  "onendedcapture",
				  "onloadeddata",
				  "onloadeddatacapture",
				  "onloadedmetadata",
				  "onloadedmetadatacapture",
				  "onloadstart",
				  "onloadstartcapture",
				  "onpause",
				  "onpausecapture",
				  "onplay",
				  "onplaycapture",
				  "onplaying",
				  "onplayingcapture",
				  "onprogress",
				  "onprogresscapture",
				  "onratechange",
				  "onratechangecapture",
				  "onseeked",
				  "onseekedcapture",
				  "onseeking",
				  "onseekingcapture",
				  "onstalled",
				  "onstalledcapture",
				  "onsuspend",
				  "onsuspendcapture",
				  "ontimeupdate",
				  "ontimeupdatecapture",
				  "onvolumechange",
				  "onvolumechangecapture",
				  "onwaiting",
				  "onwaitingcapture",
				  "onauxclick",
				  "onauxclickcapture",
				  "onclick",
				  "onclickcapture",
				  "oncontextmenu",
				  "oncontextmenucapture",
				  "ondblclick",
				  "ondblclickcapture",
				  "ondrag",
				  "ondragcapture",
				  "ondragend",
				  "ondragendcapture",
				  "ondragenter",
				  "ondragentercapture",
				  "ondragexit",
				  "ondragexitcapture",
				  "ondragleave",
				  "ondragleavecapture",
				  "ondragover",
				  "ondragovercapture",
				  "ondragstart",
				  "ondragstartcapture",
				  "ondrop",
				  "ondropcapture",
				  "onmousedown",
				  "onmousedowncapture",
				  "onmouseenter",
				  "onmouseleave",
				  "onmousemove",
				  "onmousemovecapture",
				  "onmouseout",
				  "onmouseoutcapture",
				  "onmouseover",
				  "onmouseovercapture",
				  "onmouseup",
				  "onmouseupcapture",
				  "onselect",
				  "onselectcapture",
				  "onselectionchange",
				  "onselectionchangecapture",
				  "onselectstart",
				  "onselectstartcapture",
				  "ontouchcancel",
				  "ontouchcancelcapture",
				  "ontouchend",
				  "ontouchendcapture",
				  "ontouchmove",
				  "ontouchmovecapture",
				  "ontouchstart",
				  "ontouchstartcapture",
				  "ongotpointercapture",
				  "ongotpointercapturecapture",
				  "onpointercancel",
				  "onpointercancelcapture",
				  "onpointerdown",
				  "onpointerdowncapture",
				  "onpointerenter",
				  "onpointerentercapture",
				  "onpointerleave",
				  "onpointerleavecapture",
				  "onpointermove",
				  "onpointermovecapture",
				  "onpointerout",
				  "onpointeroutcapture",
				  "onpointerover",
				  "onpointerovercapture",
				  "onpointerup",
				  "onpointerupcapture",
				  "onlostpointercapture",
				  "onlostpointercapturecapture",
				  "ongamepadconnected",
				  "ongamepaddisconnected",
				  "onscroll",
				  "onscrollcapture",
				  "onscrollend",
				  "onscrollendcapture",
				  "onresize",
				  "onresizecapture",
				  "onwheel",
				  "onwheelcapture",
				  "onanimationstart",
				  "onanimationstartcapture",
				  "onanimationend",
				  "onanimationendcapture",
				  "onanimationiteration",
				  "onanimationiterationcapture",
				  "ontransitionstart",
				  "ontransitionstartcapture",
				  "ontransitionrun",
				  "ontransitionruncapture",
				  "ontransitionend",
				  "ontransitionendcapture",
				  "ontransitioncancel",
				  "ontransitioncancelcapture",
				  "onoutrostart",
				  "onoutrostartcapture",
				  "onoutroend",
				  "onoutroendcapture",
				  "onintrostart",
				  "onintrostartcapture",
				  "onintroend",
				  "onintroendcapture",
				  "onmessage",
				  "onmessagecapture",
				  "onmessageerror",
				  "onmessageerrorcapture",
				  "onvisibilitychange",
				  "onvisibilitychangecapture",
				  "onbeforematch",
				  "onbeforematchcapture",
				  "oncancel",
				  "oncancelcapture",
				  "onclose",
				  "onclosecapture",
				  "onfullscreenchange",
				  "onfullscreenchangecapture",
				  "onfullscreenerror",
				  "onfullscreenerrorcapture",
				]
			`);
			expect(events.size).toBe(214);
			expect(events.get("onchange")).toBeDefined();
		});
	});

	describe("getter .snippets", () => {
		it("returns filtered props map which are snippets only", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_modern);
			const { snippets } = analyzer;
			expect([...snippets.keys()]).toMatchInlineSnapshot(`
				[
				  "children",
				]
			`);
			expect(snippets.size).toBe(1);
			expect(snippets.get("children")).toBeDefined();
		});
	});

	describe("getter .uncategorized", () => {
		it("returns filtered props map which doesn't belong to any common category", ({ expect }) => {
			const analyzer = new PropsAnalyzer(parsed_modern);
			const { uncategorized } = analyzer;
			expect([...uncategorized.keys()]).toMatchInlineSnapshot(`
				[
				  "disabled",
				  "form",
				  "formaction",
				  "formenctype",
				  "formmethod",
				  "formnovalidate",
				  "formtarget",
				  "name",
				  "type",
				  "value",
				  "popovertarget",
				  "popovertargetaction",
				  "accesskey",
				  "autocapitalize",
				  "autofocus",
				  "class",
				  "contenteditable",
				  "contextmenu",
				  "dir",
				  "draggable",
				  "elementtiming",
				  "enterkeyhint",
				  "hidden",
				  "id",
				  "lang",
				  "part",
				  "placeholder",
				  "slot",
				  "spellcheck",
				  "style",
				  "tabindex",
				  "title",
				  "translate",
				  "inert",
				  "popover",
				  "writingsuggestions",
				  "radiogroup",
				  "role",
				  "about",
				  "datatype",
				  "inlist",
				  "prefix",
				  "property",
				  "resource",
				  "typeof",
				  "vocab",
				  "autosave",
				  "color",
				  "itemprop",
				  "itemscope",
				  "itemtype",
				  "itemid",
				  "itemref",
				  "results",
				  "security",
				  "unselectable",
				  "inputmode",
				  "is",
				  "innerHTML",
				  "textContent",
				  "innerText",
				  "contentRect",
				  "contentBoxSize",
				  "borderBoxSize",
				  "devicePixelContentBoxSize",
				]
			`);
			expect(uncategorized.size).toBe(65);
			expect(uncategorized.get("disabled")).toBeDefined();
		});
	});
});
