<script module lang="ts">
	export type Items = "snippets" | "events" | "aria" | "data" | "uncategorized";

	/** Session storage key */
	export const SS_KEY = "output-overview-accordion-props";
</script>

<script lang="ts">
	import IconBraces from "lucide-svelte/icons/braces";
	import type { analyze } from "svelte-docgen";
	import type { ComponentProps } from "svelte";
	import { SvelteSet } from "svelte/reactivity";

	import * as Accordion from "$lib/components/ui/accordion/index.ts";
	import * as Tooltip from "$lib/components/ui/tooltip/index.ts";

	import PropsTable from "./table.svelte";

	interface Props extends ComponentProps<typeof Accordion.Item> {
		props: ReturnType<typeof analyze>["props"];
		types: ReturnType<typeof analyze>["types"];
	}
	let { props, types, ...rest_props }: Props = $props();

	const stored = globalThis.window !== undefined ? window.sessionStorage.getItem(SS_KEY) : null;
	let accordion_state = $state<SvelteSet<Items>>(new SvelteSet(stored ? (JSON.parse(stored) as Items[]) : []));
	let is_empty = $derived(props.all.size === 0);
	let snippets = $derived(props.snippets);
	let events = $derived(props.events);
	let aria = $derived(props.aria);
	let data = $derived(props.data);
	let uncategorized = $derived(props.uncategorized);
</script>

<Accordion.Item {...rest_props} disabled={is_empty} value="props">
	<Accordion.Trigger class="trigger">
		<span class="inline-flex items-center gap-2">
			<IconBraces /> Props {props.all.size > 0 ? `(${props.all.size})` : ""}
		</span>
	</Accordion.Trigger>

	<Accordion.Content class="container">
		<Accordion.Root
			type="multiple"
			bind:value={() => Iterator.from(accordion_state).toArray(), (v) => (accordion_state = new SvelteSet(v))}
		>
			{#if snippets.size > 0}
				<Accordion.Item value="snippets">
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="w-full">
								<Accordion.Trigger>Snippets ({snippets.size})</Accordion.Trigger>
							</Tooltip.Trigger>

							<Tooltip.Content>
								<p>
									Reusable chunks of markup inside your components.<br />
									Read more about them on
									<a href="https://svelte.dev/docs/svelte/snippet" class="underline"
										>Svelte documentation</a
									>.
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>

					<Accordion.Content>
						<PropsTable props={snippets} {types} />
					</Accordion.Content>
				</Accordion.Item>
			{/if}

			{#if events.size > 0}
				<Accordion.Item value="events">
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="w-full">
								<Accordion.Trigger>Event handlers ({events.size})</Accordion.Trigger>
							</Tooltip.Trigger>

							<Tooltip.Content>
								<p>
									Signals fired inside the browser window that notify of changes in the browser or
									operating system environment.<br />
									Read more about them on
									<a
										href="https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers"
										class="underline">MDN documentation</a
									>.
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>

					<Accordion.Content>
						<PropsTable props={events} {types} />
					</Accordion.Content>
				</Accordion.Item>
			{/if}

			{#if aria.size > 0}
				<Accordion.Item value="aria">
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="w-full">
								<Accordion.Trigger>ARIA ({aria.size})</Accordion.Trigger>
							</Tooltip.Trigger>

							<Tooltip.Content>
								<p>
									Accessible Rich Internet Applications (ARIA) is a set of roles and attributes that
									define ways to make web content and web applications (especially those developed
									with JavaScript) more accessible to people with disabilities. Read more about them
									on <a
										href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA"
										class="underline">MDN documentation</a
									>.
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>

					<Accordion.Content>
						<PropsTable props={aria} {types} />
					</Accordion.Content>
				</Accordion.Item>
			{/if}

			{#if data.size > 0}
				<Accordion.Item value="data">
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="w-full">
								<Accordion.Trigger>Data attributes ({data.size})</Accordion.Trigger>
							</Tooltip.Trigger>

							<Tooltip.Content>
								<p>
									Custom data attributes, that allow proprietary information to be exchanged between
									the HTML and its DOM representation by scripts.<br />
									Read more about them on
									<a
										href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*"
										class="underline">MDN documentation</a
									>.
								</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>

					<Accordion.Content>
						<PropsTable props={data} {types} />
					</Accordion.Content>
				</Accordion.Item>
			{/if}

			{#if uncategorized.size > 0}
				<Accordion.Item value="uncategorized">
					<Accordion.Trigger>Other ({uncategorized.size})</Accordion.Trigger>
					<Accordion.Content>
						<PropsTable props={uncategorized} {types} />
					</Accordion.Content>
				</Accordion.Item>
			{/if}
		</Accordion.Root>
	</Accordion.Content>
</Accordion.Item>
