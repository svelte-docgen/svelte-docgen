import { Dialog } from "bits-ui";

import Overlay from "./overlay.svelte";
import Content from "./content.svelte";
import Header from "./header.svelte";
import Footer from "./footer.svelte";
import Title from "./title.svelte";
import Description from "./description.svelte";

const Root = Dialog.Root;
const Close = Dialog.Close;
const Trigger = Dialog.Trigger;
const Portal = Dialog.Portal;

export {
	Root,
	Close,
	Trigger,
	Portal,
	Overlay,
	Content,
	Header,
	Footer,
	Title,
	Description,
};
