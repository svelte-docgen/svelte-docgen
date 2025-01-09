<p align="center">
    <img
        alt="svelte-docgen logo"
        src="./assets/brand/logo.svg"
        width="180"
    >
    <br>
    <img
        alt="GitHub Actions Workflow Status"
        src="https://img.shields.io/github/actions/workflow/status/svelte-docgen/svelte-docgen/ci.yml?branch=main&style=for-the-badge&logo=github&label=CI"
    >
    <img
        alt="Codecov icon"
        src="https://img.shields.io/codecov/c/github/svelte-docgen/svelte-docgen?style=for-the-badge&logo=codecov&link=https%3A%2F%2Fapp.codecov.io%2Fgh%2Fsvelte-docgen%2Fsvelte-docgen"
    >
</p>

# `svelte-docgen`

This project is a monorepo for [`svelte-docgen`](./packages/svelte-docgen) related packages.

> [!WARNING]
> This project is still a work in progress. [See roadmap for `v1`](https://github.com/svelte-docgen/svelte-docgen/issues/5).

## Packages

| Package                                                                                     | Description                                                                                           |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`svelte-docgen`](./packages/svelte-docgen)                                                 | Core package                                                                                          |
| `@svelte-docgen/cli` [🚧 Tracking](https://github.com/svelte-docgen/svelte-docgen/issues/9) | Standalone CLI                                                                                        |
| [`@svelte-docgen/extractor`](./packages/extractor)                                          | Extracting types from `*.svelte` files to write your own                                              |
| [`@svelte-docgen/server`](./packages/server)                                                | Run a server which allows fetching docs on demand                                                     |
| [`vite-plugin-svelte-docgen`](./packages/vite-plugin-svelte-docgen)                         | [Vite](https://github.com/vitejs/vite) plugin which creates virtual files for your stories on demand. |

---

## Contributing

Take a look at the [contributing guide](./.github/CONTRIBUTING.md).

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
**Contributions of any kind are welcome!**

💌 to these people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/xeho91"><img src="https://avatars.githubusercontent.com/u/18627568?v=4?s=50" width="50px;" alt="Mateusz Kadlubowski"/><br /><sub><b>Mateusz Kadlubowski</b></sub></a><br /><a href="https://github.com/svelte-docgen/svelte-docgen/commits?author=xeho91" title="Code">💻</a> <a href="#infra-xeho91" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-xeho91" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ciscorn"><img src="https://avatars.githubusercontent.com/u/5351911?v=4?s=50" width="50px;" alt="Taku Fukada"/><br /><sub><b>Taku Fukada</b></sub></a><br /><a href="https://github.com/svelte-docgen/svelte-docgen/commits?author=ciscorn" title="Code">💻</a> <a href="#infra-ciscorn" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-ciscorn" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

> [!NOTE]
> We also put a lot of effort to make this project [e18e](https://e18e.dev/)-friendly.

### Support

If you don't have time, but you need this project to work, or resolve an existing issue, consider [sponsorship](https://github.com/sponsors/svelte-docgen).

---

## Authors

- Mateusz "[xeho91](https://github.com/xeho91)" Kadlubowski
- Taku "[ciscorn](https://github.com/ciscorn)" Fukada
