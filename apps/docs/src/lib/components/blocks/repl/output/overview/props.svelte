<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";
	// FIXME: It throws error when trying to optimize import path
	import { Braces as IconBraces, BadgeInfo as IconBadgeInfo } from "lucide-svelte";
	import { mode } from "mode-watcher";
	import { analyzeProperty, parse } from "svelte-docgen";
	import type { ComponentProps } from "svelte";
	import type * as Doc from "svelte-docgen/doc";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import { Badge } from "$lib/components/ui/badge/index.ts";
	import { Code } from "$lib/components/ui/code/index.ts";
	import * as Dialog from "$lib/components/ui/dialog/index.ts";
	import * as Table from "$lib/components/ui/table/index.ts";

	import { highlighter } from "$lib/md/highlighter.js";

	interface Props extends ComponentProps<typeof Accordion.Item>, Pick<ReturnType<typeof parse>, "props" | "types"> {}
	let { props, types, ...rest_props }: Props = $props();

	const is_empty = $derived(props.size === 0);

	function create_dialog_description_code(name: string, data: Doc.Prop): string {
		const type = typeof data.type === "string" ? data.type : data.type.kind;
		const code = `
interface Props {
+   /**
+    * 👉 Insert prop description here. 👈
+    */
    ${name}: ${type};
}
		`;
		return highlighter.codeToHtml(code, { lang: "diff", theme: `github-${$mode ?? "light"}` });
	}

	$effect(() => {
		for (const [n, prop] of props) {
			if (n === "children") {
				console.log({ analyis: analyzeProperty(prop, types) })
			}
		}
	});
</script>

<Accordion.Item
	{...rest_props}
	disabled={is_empty}
	value="props"
>
	<Accordion.Trigger class="trigger">
		<span class="inline-flex items-center gap-2">
			<IconBraces /> Props
		</span>
	</Accordion.Trigger>

	<Accordion.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Description</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each props as [name, prop]}
					{@const analysis = analyzeProperty(prop, types)}
					<Table.Row>
						<Table.Cell class="font-medium">
							<div class="flex flex-col items-start gap-1">
								<Code>{name}</Code>
								{#if prop.isBindable}
									<Badge variant="outline">$bindable()</Badge>
								{/if}
								{#if analysis.isSnippet}
									<Badge variant="outline">Snippet</Badge>
								{/if}
							</div>
						</Table.Cell>

						<Table.Cell>TODO</Table.Cell>

						<Table.Cell>
							{#if prop.description}
								<p>{prop.description}</p>
							{:else}
								<p
									class="inline-flex flex-row items-center gap-1 whitespace-nowrap italic text-amber-700/70 dark:text-amber-300/70"
								>
									Not described.
									<Dialog.Root>
										<Dialog.Trigger>
											<IconBadgeInfo />
											<span class="sr-only">Get help.</span>
										</Dialog.Trigger>

										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>How to provide a description to component prop?</Dialog.Title>
											</Dialog.Header>
											<Dialog.Description>
												<p>
													Above the component prop type declaration, insert a JSDoc comment with
													description. Example:
												</p>
												<!-- eslint-disable-next-line svelte/no-at-html-tags - Is ok, is sanitized. -->
												{@html DOMPurify.sanitize(create_dialog_description_code(name, prop))}
											</Dialog.Description>
										</Dialog.Content>
									</Dialog.Root>
								</p>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Accordion.Content>
</Accordion.Item>
