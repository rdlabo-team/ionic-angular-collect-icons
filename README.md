# @rdlabo/ionic-angular-collect-icons

<!-- rdlabo-docs-omit -->

[![npm version](https://badge.fury.io/js/@rdlabo%2Fionic-angular-collect-icons.svg)](https://badge.fury.io/js/@rdlabo%2Fionic-angular-collect-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- /rdlabo-docs-omit -->

Collect `ion-icon` names from templates and generate a production `addIcons` registration. Development can register all icons; production builds only the icons found in templates.

This project is based on [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods).

## Supported versions

- Node.js >= 22
- Ionic Angular >= 9.0.0
- Angular >= 18.0.0
- TypeScript >= 5.4.0
- ionicons >= 8.0.0
- @angular-eslint/template-parser 21 or 22

## Installation

```bash
npm install --save-dev \
  @rdlabo/ionic-angular-collect-icons \
  @angular-eslint/template-parser@^21
```

Use `@angular-eslint/template-parser@^22` instead when the consuming project uses Angular ESLint 22. The parser is a peer dependency so the collector uses the same Angular template parser major as the consuming project.

## Initialize

Wire `addIcons` and generate `src/use-icons.ts`:

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

Confirm that `src/use-icons.ts` exists and that `main.ts` (or `app.config.ts`) registers production icons from that file and development icons from `ionicons/icons`. Manual wiring steps are on [Initialize](./docs/initialize.md).

## Build confirmation

1. Add one static icon to a template, for example `<ion-icon name="home"></ion-icon>`.
2. Run `npx @rdlabo/ionic-angular-collect-icons` and confirm the matching export appears in `src/use-icons.ts`.
3. Run `npm run build`.

Automate the collector with `prebuild` as shown in [Usage](./docs/usage.md). Dynamic `[name]` bindings are not collected — register those icons manually ([FAQ](./docs/faq.md)).

## Documentation

- [Initialize](./docs/initialize.md) — automatic or manual `addIcons` wiring.
- [Usage](./docs/usage.md) — run the collector before production builds.
- [CLI Options](./docs/options.md) — `--dry-run`, `--initialize`, paths.
- [FAQ](./docs/faq.md) — tests, binding, and `main.ts`.
- [Migration](./docs/migration.md) — Ionic Angular 8 → 9 checks for existing apps.

<!-- rdlabo-docs-omit -->

**Full documentation:** [https://docs.rdlabo.dev/projects/ionic-angular-collect-icons](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons)

## Maintainers

- [rdlabo](https://rdlabo.dev/)

## License

This project is licensed under the [MIT License](./LICENSE).

<!-- /rdlabo-docs-omit -->
