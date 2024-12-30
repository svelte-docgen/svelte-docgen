import { DropdownMenu } from "bits-ui";

import CheckboxItem from "./checkbox-item.svelte";
import Content from "./content.svelte";
import GroupHeading from "./group-heading.svelte";
import Item from "./item.svelte";
import Label from "./label.svelte";
import RadioItem from "./radio-item.svelte";
import Separator from "./separator.svelte";
import Shortcut from "./shortcut.svelte";
import SubContent from "./sub-content.svelte";
import SubTrigger from "./sub-trigger.svelte";

const Sub = DropdownMenu.Sub;
const Root = DropdownMenu.Root;
const Trigger = DropdownMenu.Trigger;
const Group = DropdownMenu.Group;
const RadioGroup = DropdownMenu.RadioGroup;

export {
	CheckboxItem,
	Content,
	Group,
	GroupHeading,
	Item,
	Label,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
};
