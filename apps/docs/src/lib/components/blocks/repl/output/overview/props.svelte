<script lang="ts">
	import IconSvelte from "@icons-pack/svelte-simple-icons/icons/SiSvelte";
	import DOMPurify from "isomorphic-dompurify";
	import IconBadgeInfo from "lucide-svelte/icons/badge-info";
	import IconBraces from "lucide-svelte/icons/braces";
	import IconAlert from "lucide-svelte/icons/circle-alert";
	import IconExtended from "lucide-svelte/icons/diamond-plus";
	import { mode } from "mode-watcher";
	import { analyzeProperty, parse } from "svelte-docgen";
	import type { ComponentProps } from "svelte";
	import type * as Doc from "svelte-docgen/doc";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import { Badge } from "$lib/components/ui/badge/index.ts";
	import { Code } from "$lib/components/ui/code/index.ts";
	import * as Dialog from "$lib/components/ui/dialog/index.ts";
	import * as Table from "$lib/components/ui/table/index.ts";
	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	import { highlighter } from "$lib/md/highlighter.js";

	interface Props extends ComponentProps<typeof Accordion.Item>, Pick<ReturnType<typeof parse>, "props" | "types"> {}
	let { props, types, ...rest_props }: Props = $props();

	let is_empty = $derived(props.size === 0);

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

	function get_type_kind(prop: Doc.Prop): Doc.Type['kind'] {
		if (typeof prop.type === "string") {
			const type = types.get(prop.type);
			if (!type) throw new Error("Unreachable");
			return type.kind;
		}
		return prop.type.kind;
	}

	function stringify_description(description: NonNullable<Doc.Prop['description']>): string {
		let output = "";
		for (const part of description) {
			if (part.kind === "text") {
				output += part.text;
			} else {
				// TODO: Will need to handle inlined tags properly
				output += part.text;
			}
		}
		return output;
	}
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
								<span class="inline-flex flex-row gap-1 name-and-icons">
									<Code class={[!prop.isOptional && "border-2 border-destructive"]}>{name}</Code>
									{#if !prop.isOptional}
										<Tooltip.Provider>
											<Tooltip.Root>
												<Tooltip.Trigger class="text-sm text-destructive">
													<IconAlert />
												</Tooltip.Trigger>

												<Tooltip.Content>
													<p>This is a <strong>required</strong> property.</p>
												</Tooltip.Content>
											</Tooltip.Root>
										</Tooltip.Provider>
									{/if}

									{#if prop.isExtended}
										<Tooltip.Provider>
											<Tooltip.Root>
												<Tooltip.Trigger class="text-cyan-500">
													<IconExtended />
												</Tooltip.Trigger>

												<Tooltip.Content>
													<p>This property was <strong>extended</strong> from other type/interface.</p>
												</Tooltip.Content>
											</Tooltip.Root>
										</Tooltip.Provider>
									{/if}

									{#if analysis.isExtendedBySvelte}
										<Tooltip.Provider>
											<Tooltip.Root>
												<Tooltip.Trigger>
													<IconSvelte />
												</Tooltip.Trigger>

												<Tooltip.Content>
													<p>This property was <strong>extended</strong> from Svelte types.</p>
												</Tooltip.Content>
											</Tooltip.Root>
										</Tooltip.Provider>
									{/if}
								</span>

								{#if prop.isBindable}
									<a href="https://svelte.dev/docs/svelte/$bindable">
										<Badge variant="outline">
											$bindable
										</Badge>
									</a>
								{/if}

								{#if analysis.isEventHandler}
									<a href="https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers">
										<Badge variant="outline">
											Event handler
										</Badge>
									</a>
								{/if}

								{#if analysis.isSnippet}
									<a href="https://svelte.dev/docs/svelte/svelte#Snippet">
										<Badge variant="outline">
											Snippet
										</Badge>
									</a>
								{/if}
							</div>
						</Table.Cell>

						<Table.Cell>{get_type_kind(prop)}</Table.Cell>

						<Table.Cell>
							{#if prop.description}
								<p>{stringify_description(prop.description)}</p>
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

<style>
	:global(.name-and-icons svg) {
		width: 1em;
		height: 1em;
	}
</style>
