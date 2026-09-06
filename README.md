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

Confirm that `src/use-icons.ts` exists and that `main.ts` (or `app.config.ts`) registers production icons from that file and development icons from `ionicons/icons`. Manual wiring steps are on [Initialize](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/initialize).

## Build confirmation

1. Add one static icon to a template, for example `<ion-icon name="home"></ion-icon>`.
2. Run `npx @rdlabo/ionic-angular-collect-icons` and confirm the matching export appears in `src/use-icons.ts`.
3. Run `npm run build`.

Automate the collector with `prebuild` as shown in [Usage](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/usage). Dynamic `[name]` bindings are not collected — register those icons manually ([FAQ](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/faq)).

## Documentation

- [Initialize](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/initialize) — automatic or manual `addIcons` wiring.
- [Usage](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/usage) — run the collector before production builds.
- [CLI Options](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/options) — `--dry-run`, `--initialize`, paths.
- [FAQ](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/faq) — tests, binding, and `main.ts`.
- [Migration](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/migration) — Ionic Angular 8 → 9 checks for existing apps.

<!-- rdlabo-docs-omit -->

**Full documentation:** [https://docs.rdlabo.dev/projects/ionic-angular-collect-icons](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons)

## Prerelease channels

An open, non-draft pull request can be published to the npm `beta` dist-tag after its `CI`, `Lint`, `Package Candidate` workflows pass. A repository owner or maintainer must add a comment whose entire body is:

```text
/beta
```

The request authorizes only the pull request head SHA that existed when the comment was added. The workflow revalidates the owner or maintainer permission and head SHA immediately before publishing. Any new commit requires CI to pass again and a fresh owner or maintainer `/beta` comment. Fork pull requests are supported. Pull requests that change a release-gating workflow cannot be beta-published until those workflow changes land on `main`.

Beta versions use `<base>-beta.pr<PR number>.sha<12-character SHA>`. The candidate is built in a read-only workflow without npm publishing credentials. The privileged release workflow publishes only the validated immutable package artifact with lifecycle scripts disabled. A notification failure cannot invalidate a successful npm publish.

When a pull request is merged into `main`, it is automatically published to `beta` only after the required CI and `Package Candidate` succeed for that exact merge commit. Direct pushes to `main` do not publish a candidate.

Only `npm run release` creates a release tag. Stable `vX.Y.Z` tags publish to npm `latest`; revision/prerelease tags publish to `next`. Neither `beta` nor `next` publishing changes the npm `latest` dist-tag.

## Maintainers

- [rdlabo](https://rdlabo.dev/)

## License

This project is licensed under the [MIT License](./LICENSE).

<!-- /rdlabo-docs-omit -->
