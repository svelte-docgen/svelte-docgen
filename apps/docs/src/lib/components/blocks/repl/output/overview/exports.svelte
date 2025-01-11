<script lang="ts">
	import IconFileUp from "lucide-svelte/icons/file-up";
	import type { analyze } from "svelte-docgen";
	import type { ComponentProps } from "svelte";
	import type * as Doc from "svelte-docgen/doc";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import { Code } from "$lib/components/ui/code/index.ts";
	import * as Table from "$lib/components/ui/table/index.ts";

	interface Props extends ComponentProps<typeof Accordion.Item> {
		exports: ReturnType<typeof analyze>["exports"];
		types: ReturnType<typeof analyze>["types"];
	}
	let { exports, types, ...rest_props }: Props = $props();

	let is_empty = $derived(exports.size === 0);

	function get_type_kind(export_: Doc.TypeOrRef): Doc.Type["kind"] {
		if (typeof export_ === "string") {
			const type = types.get(export_);
			if (!type) throw new Error("Unreachable");
			return type.kind;
		}
		return export_.kind;
	}
</script>

<Accordion.Item {...rest_props} disabled={is_empty} value="exports">
	<Accordion.Trigger class="trigger">
		<span class="inline-flex items-center gap-2">
			<IconFileUp /> Exports
		</span>
	</Accordion.Trigger>

	<Accordion.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Type</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each exports as [name, export_]}
					<Table.Row>
						<Table.Cell class="font-medium">
							<div class="flex flex-col items-start gap-1">
								<span class="inline-flex flex-row gap-1">
									<Code>{name}</Code>
								</span>
							</div>
						</Table.Cell>

						<Table.Cell>{get_type_kind(export_)}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Accordion.Content>
</Accordion.Item>
