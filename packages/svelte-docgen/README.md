<p align="center">
    <img
        alt="svelte-docgen logo"
        src="../../assets/brand/logo.svg"
        width="180"
    >
    <br>
    <img
        alt="Latest package version on NPM registry"
        src="https://img.shields.io/npm/v/svelte-docgen?style=for-the-badge&logo=npm"
    >
    <img
        alt="Package license"
        src="https://img.shields.io/npm/v/svelte-docgen?style=for-the-badge&logo=npm"
    >
    <img
        alt="Required Svelte version"
        src="https://img.shields.io/npm/dependency-version/svelte-docgen/peer/svelte?style=for-the-badge&logo=svelte"
    >

</p>

# `svelte-docgen`

**Inspired by [`react-docgen`](https://github.com/reactjs/react-docgen).**\
A highly customizable library that extracts information from [Svelte] components.
Then returns in a structured machine-readable format from which documentation can be generated.

## Why?

Because we believe in _effortless_ documentation for Svelte components.
Without leaving the `*.svelte` file, which is the _source of truth_.

## Terminology

- `docgen` - generated data for documentation purposes

---

## Features

Our library has a focus on the following features.

> [!TIP]
> Is there any other feature you were looking for and you believe it should be a part of this library?
> Take a look at [💡Ideas discussions](https://github.com/svelte-docgen/svelte-docgen/discussions/categories/ideas).
> If it still not there, then [please 🙏 share with us!](https://github.com/svelte-docgen/svelte-docgen/discussions/new?category=ideas)

### Component description and tags

It's useful to give a quick or verbose description about the Svelte component.
Without leaving the original `*.svelte` file, you can provide some details to be extracted by our library.

#### Description

Previously, Svelte tools had a support to provide a description via HTML comment _at the root_ of the fragment.
And also, it has to have a `@component` tag. Anything after this tag is treated as component _description_.

**We recommend to place it at the very top of the `*.svelte` file**.

Example:

```svelte
<!--
@component This is a very quick component description.
-->
```

Our extractor handles:

- multi-line,
- 🚧 inlined tags, such as `{@link <some link>}`
- whitespace.

> [!IMPORTANT]
> You are absolutely free to write component description using markdown!
>
> However, keep in mind that the syntax highlight is not this library responsibility.
> And that this library does not parse/transform markdown syntax to HTML.

#### Tags

If you're familiar with JSDoc, then you already know what tags are.
Every line starting with a `@<tag-name>` will be extracted. They can be repetitive, multi-line, contain inlined tag, etc.

> [!NOTE]
> They will be extracted as long as they are within the first root HTML comment with a `@component` tag.

Example:

```svelte
<!--
@component 👈 - it can be empty, but is mandatory to include it in order start extraction of tags

👇 - example tags
@category Atom
@author You
@status stable
-->
```

> [!IMPORTANT]
>
> **There is no official specification for tags**, like in JSDoc or TSDoc.
> This isn't our focus _yet_, and we are open to participate in this discussion.

---

### Types

Our goal is to **align with terminology from TypeScript Compiler API**, which is used under the hood.
This also gives the library an ability to have _computed_ types, without lies.

We also hope this will help you/us to communicate and understand better what is what.
Anything that will help [Svelte] ecosystem to grow and its community to strengthen its knowledge.

Currently we have three categories for type kinds.

#### Base types

They're the _simple_ ones.

> [!WARNING]
> Not to be confused with primitives!

They don't provide any more structure other than the name of type _kind_:

- `any`
- `bigint`
- `boolean`
- `never`
- `null`
- `number`
- `object`
- `string`
- `symbol`
- `undefined`
- `unknown`
- `void`

We provide a set of types via `BASIC_TYPE_KIND` and a type-guard function `isBaseType`.

#### Structured types

They're more advanced than _base_ types. Because they provide more data in their structure:

- `array`
- `constructible`
- `function`
- `interface`
- `intersection`
- `literal`
- `tuple`
- `union`

We provide a set of types via `STRUCTURE_TYPE_KIND` and a type-guard function `isStructuredType`.

#### Instantiable types

Well, like in TypeScript... sometimes we need to go deeper, to make types more smarter, because can be _instantiantable_.
In other words, they're related to subject of using generics or generic type parameters.

They have most advanced structure, so use them with caution:

- `conditional`
- `index`
- `indexed-access`
- `string-mapping`
- `substitution`
- `template-literal`
- `type-parameter`

We provide a set of types via `INSTANTIABLE_TYPE_KIND` and a type-guard function `isInsstantiableType`.

---

### Legacy support

We try to adapt to [Svelte] maintainers principle of library being backwards compatible with one major previous version - of `svelte` library.

Our library is capable to recognize when the component uses a _legacy syntax_.
Based on this, we provide extra information, that is related to the documentation or usage of this component.

Currently previous major version of Svelte is `v4`, thus we extract data related to:

- [slots]()
- [custom event handlers]()

> [!CAUTION]
> Currently, we're unable to recognize whether slots are _optional_ or not. [Tracking issue](https://github.com/svelte-docgen/svelte-docgen/issues/10).

---

### Exports

Svelte allows us to define exports inside the `*.svelte` file. Those data are important to be included in documentation.

#### Modern

In the modern version of Svelte, they can be defined inside the `<script module>` tag.

> [!CAUTION]
> 🚧 This feature is a Work in Progress. [Tracking issue]().

#### Legacy

In legacy version of Svelte, prior to `v4` it was possible to define the `<script>` _(instance)_ tag.

---

### Props analysis

We provide an analyzer via [`analyze()`](#analyze) function to give you more details related to parsed _docgen_ data of
a Svelte component.

Our analyzer is capable to tell you the following information.

#### Optional

The most important question is whether the prop is _optional_ or _required_.
Our library will tell you.

Example:

```svelte
<script lang="ts">
    interface Props {
        optional?: string;
        //      👆 This is how you can define an optional prop
    }

    let { optional }: Props = $props();
<script>
```

##### Default

In TypeScript world, if the prop _(or to be more specific - an interface member)_ is optional, then,
it can have _optionally!_ a **default value**. We also provide a type data related to this default value.

Example:

```svelte
<script lang="ts">
    interface Props {
        optional_with_default?: string;
    }

    let { optional_with_default = "Fallback string value" }: Props = $props();
    //                            👆 This is how you define a default value.
<script>
```

In the above example, default value's type of prop `optional_with_default` is a string literal with `"Fallback string value"`.

#### Bindable

Since Svelte `v5`, you are allowed to control whether component can be `$bindable()` or not.

Example:

```svelte
<script lang="ts">
    interface Props {
        value?: number;
    }

    let { value = $bindable() }: Props = $props();
    //            👆 This his how you define a bindable property
<script>
```

> [!CAUTION] > [**In Svelte prior to `v4` every component is bindable**]()!

#### Event handlers

We believe that they should be properly typed using `"svelte/elements"`, as part of _standardization_.
Whether you're interested only in those, you can extract a map of them.

#### ARIA

Same as above, but only for [`aria-*`] attributes. You can extract a map of props with those.

#### Data attributes

Same as above, but only for [`data-*`] attributes. You can extract a map of props with those.

#### Extended

Some props are not _directly_ defined inside the `*.svelte` component. They could be **extended**.
Our library is capable to recognize _where_ is the prop located.

Example:

```svelte
<script lang="ts">
    import type { OuterInterface } from "./outer.ts";

    interface Props extends OuterInterface {
        custom: unknown;
    }
<script>
```

```ts
// outer.ts
export interface OuterInterface {
  extended: "👋 Hey!";
}
```

In the above example, a prop `extended` with a type of string literal `"👋 Hey!"` _is extended_.

##### Extended by Svelte

Is may also be useful to know whether types are extended by [Svelte] types.
In most _(if not all)_ cases, it would be from `"svelte/elements"`.

Example:

```svelte
<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props extends HTMLButtonAttributes {
        variant: "filled" | "outlined";
    }
<script>
```

Our library will provide a docgen data for a prop e.g. `disabled`.
That's because it was extended from `HTMLButtonAttributes` interface.

Our analyzer will also recognize that it was **extended by Svelte** based on the `sources` _(a set of paths where the
type is declared)_ - it checks whether they're extended from types inside the `"svelte"` or `"svelte/*"` module(s).

#### Snippets

Our library is capable to recognize props which are Snippets.
Internally, they're functions.
So, we also provide an easy access to data of its parameters types via `getSnippetParameters()`.
You can also extract a map of props with snippets only separately for your own purposes.

---

## Installation

**We're aiming to make this library cross-runtime friendly**.
Whether is it browser, Bun, Deno, Node.js or any Edge-runtime.

### Browser

🚧 TBA - fetch from CDN.

### Bun

<details>

```sh
bun add --dev svelte-docgen
```

</details>

### Deno

#### From NPM registry

<details>

```sh
deno add --dev npm:svelte-docgen
```

</details>

#### From JSR registry

🚧 TBA

### Node.js

#### npm

<details>

```sh
npm install --save-dev svelte-docgen
```

</details>

#### pnpm

<details>

```sh
pnpm add --save-dev svelte-docgen
```

</details>

#### yarn

<details>

```sh
yarn add --dev svelte-docgen
```

</details>

---

## Getting started

The following sections should help yourself attained with using this library.
We want to make your thought process to be simple.

1. You [`parse()`](#parse) first,
2. Then you [`analyze()`]#analyze) the docgen data.

### parse

This function accepts the _stringified source code_, and then it will generate a _raw_ [docgen](#terminology) data.

Example:

```ts
import { createCacheStorage, parse } from "svelte-docgen";

const docgen = parse("<source code>", { cache: createCacheStorage() });
```

Where as:

- `<source code>` is the _stringified source code_ of the Svelte component.

> [!NOTE]
> Please notice that there's also passed option _(which is optional)_ `{ cache: createCacheStorage() }`.\
> **We recommend to use it when you need to parse more than one file.**
> That's because TypeScript Compiler API takes a time to boot up, and after that it works faster.

### analyze

Because parser will generate a _raw_ docgen data, and there's still some work to do to make the JSON output smaller,
which should favor you to make your bundle smaller or a smaller packet to send data via RESTful API request.

Hence we move logic related to analysis of the docgen data to separate function - `analyze`.
Internally it uses JavaScript getters and internal caching to optimize the memory usage.

Example:

```ts
import { analyze, createCacheStorage, parse } from "svelte-docgen";

const docgen = parse("<source code>", { cache: createCacheStorage() });
const analyzed = analyze(docgen);
```

---

## Docgen schema / API

### Raw

🚧 WIP

### Analyzed

🚧 WIP

#### Component

- `isLegacy`
- `description`
- `tags`
- `exports`
- `props`
- `types`
- `events` _(available only when `legacy: true`)_
- `slots` _(available only when `legacy: true`)_

#### Props

- `all`
- `aria`
- `data`
- `events`
- `snippets`
- `uncategorized`

#### Prop

- `description`
- `tags`
- `isBindable`
- `isOptional`
- `default` _(available only when `isOptional: true`)_
- `isOptional`
- `isExtended`
- `isExtendedBySvelte`
- `sources`
- `type`
- `isEventHandler`
- `isSnippet`
- `getSnippetParameters()` _(available only when `isSnippet: true`)_

<!-- LINKS: -->

[Svelte]: https://svelte.dev
