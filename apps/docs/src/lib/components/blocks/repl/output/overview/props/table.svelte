<script lang="ts">
	import IconSvelte from "@icons-pack/svelte-simple-icons/icons/SiSvelte";
	import DOMPurify from "isomorphic-dompurify";
	import IconBadgeInfo from "lucide-svelte/icons/badge-info";
	import IconExtended from "lucide-svelte/icons/diamond-plus";
	import { mode } from "mode-watcher";
	import type { ComponentProps } from "svelte";
	import type { analyze } from "svelte-docgen";

	import { Badge } from "$lib/components/ui/badge/index.ts";
	import { Code } from "$lib/components/ui/code/index.ts";
	import * as Dialog from "$lib/components/ui/dialog/index.ts";
	import * as Table from "$lib/components/ui/table/index.ts";
	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	import { highlighter } from "$lib/md/highlighter.js";

	import Type from "./type.svelte";

	interface Props extends ComponentProps<typeof Table.Root> {
		props: ReturnType<typeof analyze>["props"]["all"];
		types: ReturnType<typeof analyze>["types"];
	}

	let { props, types, ...rest_props }: Props = $props();

	type AnalyzedProp = typeof props extends Map<string, infer T> ? T : never;

	function create_dialog_description_code(name: string, data: AnalyzedProp): string {
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

	function stringify_description(description: NonNullable<AnalyzedProp["description"]>): string {
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

<Table.Root {...rest_props}>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Type</Table.Head>
			<Table.Head>Description</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each props as [name, prop]}
			<Table.Row>
				<Table.Cell class="font-medium">
					<div class="flex flex-col items-start gap-1">
						<Code class="whitespace-nowrap">{name}</Code>
						<span class="name-and-icons inline-flex flex-row gap-1">
							{#if prop.isOptional}
								<span class="text-foreground font-light italic">optional</span>
							{:else}
								<span class="text-destructive">required</span>
							{/if}

							{#if prop.isExtended}
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger class="text-cyan-500">
											<IconExtended />
										</Tooltip.Trigger>

										<Tooltip.Content>
											<p>
												This property was <strong>extended</strong> from other type/interface.
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
							{/if}

							{#if prop.isExtendedBySvelte}
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<IconSvelte />
										</Tooltip.Trigger>

										<Tooltip.Content>
											<p>
												This property was <strong>extended</strong> from Svelte types.
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
							{/if}
						</span>

						{#if prop.isBindable}
							<a href="https://svelte.dev/docs/svelte/$bindable">
								<Badge variant="outline">$bindable</Badge>
							</a>
						{/if}
					</div>
				</Table.Cell>

				<Table.Cell>
					<Type type={prop.type} {types} />
				</Table.Cell>

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

<style>
	:global(.name-and-icons svg) {
		width: 1em;
		height: 1em;
	}
</style>
