# Examples

This directory contains examples of _what is possible_ to do with `svelte-docgen`.

## Instructions

Each example must be isolated into **separated folder**.

### Parent directory

1. Name is treated as **id**.
1. It must be **unique**.
1. It must be in `snake-case` format.

### `input.svelte` file

1. It will be _encoded_ to provide an URL search parameter _(`input`)_ for preview in the playground.

### `README.md` file

1. Must have included `frontmatter` _(at the top in YAML format)_ with:

   - `title`,
   - `description`.

2. Content will be used as documentation somewhere in the future.
