<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";
	// FIXME: It throws error when trying to optimize import path
	import { BadgeInfo as IconBadgeInfo } from "lucide-svelte";
	import IconNotepad from "lucide-svelte/icons/notepad-text";
	import { mode } from "mode-watcher";
	import type { ComponentProps } from "svelte";
	import * as Doc from "svelte-docgen/doc";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import { Code } from "$lib/components/ui/code/index.ts";
	import * as Dialog from "$lib/components/ui/dialog/index.ts";

	import { highlighter } from "$lib/md/highlighter.js";

	interface Props extends ComponentProps<typeof Accordion.Item> {
		description: Doc.Docable["description"];
	}
	let { description, ...rest_props }: Props = $props();

	const has_description = $derived(Boolean(description));

	const unwrapped = $derived.by(() => {
		if (!description) return;
		return description.reduce((previous, current) => {
			// WARN: Do we need to handle spacing or something?
			if (current.kind === "text") previous += current.text;
			// TODO:
			else throw new Error("Unimplemented");
			return previous;
		}, "");
	});

	function create_dialog_description_code(): string {
		const code = `
+ <!--
+ @component
+ 👉 Insert component description here. 👈
+ -->
		`;
		return highlighter.codeToHtml(code, { lang: "diff", theme: `github-${$mode ?? "light"}` });
	}
</script>

<Accordion.Item value="description" {...rest_props}>
	<Accordion.Trigger class="trigger">
		<span class="inline-flex items-center gap-2">
			<IconNotepad />
			Description
		</span>
	</Accordion.Trigger>

	<Accordion.Content>
		{#if has_description}
			<pre>{unwrapped}</pre>
		{:else}
			<p
				class="inline-flex flex-row items-center gap-1 whitespace-nowrap italic text-amber-700/70 dark:text-amber-300/70"
			>
				No description.

				<Dialog.Root>
					<Dialog.Trigger>
						<IconBadgeInfo class="" />
						<span class="sr-only">Get help.</span>
					</Dialog.Trigger>

					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>How to create a component description?</Dialog.Title>
						</Dialog.Header>
						<Dialog.Description>
							<p>
								Create a HTML comment with a <Code>@component</Code> tag at the root of fragment.<br />
								For readability,
								<strong>we recommend it to place at the top of the Svelte component file</strong>.
								Example:
							</p>
							<!-- eslint-disable-next-line svelte/no-at-html-tags - Is ok, is sanitized. -->
							{@html DOMPurify.sanitize(create_dialog_description_code())}
						</Dialog.Description>
					</Dialog.Content>
				</Dialog.Root>
			</p>
		{/if}
	</Accordion.Content>
</Accordion.Item>
