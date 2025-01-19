# Examples

This directory contains examples of _what is possible_ to do with `svelte-docgen`.

## Instructions

Each example must be isolated into **separated folder**.

1. _Parent_ directory name is treated as **id**.

   1. It must be **unique**.
   1. It must be in in `snake-case` format.

1. Each directory **must contain**:

   1. `input.svelte` file

      1. It will be _encoded_ to provide an URL search parameter _(`input`)_ to preview in the playground.

   1. `README.svelte.md` file

      1. Must have inncluded `frontmatter` _(at the top in YAML format)_ with:

         - `title`,
         - `description`.

      1. Is compiled with [`mdsvex`].

[`mdsvex`]: https://github.com/pngwn/mdsvex
