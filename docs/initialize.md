Wire `addIcons` after [Installation](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/readme#installation). See also [Usage](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/usage).

Build environments must install development dependencies: the generated code imports this package’s runtime, which is bundled into the application.

### Automatic configuration

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

Expect `src/use-icons.ts` plus an `addIcons` registration in `main.ts` / `app.config.ts`.

### Manual configuration

#### 1. Run the CLI

```bash
npx @rdlabo/ionic-angular-collect-icons
```

This will generate `src/use-icons.ts`.

#### 2. Import the generated file in your `main.ts` ( or `app.config.ts` ) file:

```diff
+ import { initializeIonicons } from '@rdlabo/ionic-angular-collect-icons/runtime';
+ import * as useIcons from './use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  void initializeIonicons(useIcons);
```

`initializeIonicons` registers the collected icons synchronously. Angular's
`isDevMode()` then enables the complete catalog from an isolated lazy bundle in
development. Production starts without downloading that catalog bundle.

When an interactive collector run detects the ternary initializer emitted by
older releases, it asks whether to migrate it. The default answer is **Yes**.
Selecting **No** leaves the initializer unchanged. Existing custom
`addIcons(...)` calls are also left unchanged. See
[Migration](./migration.md#upgrade-the-icon-initializer) for preview,
non-interactive, and matching details.

#### 3. Remove other `addIcons` calls in class constructor

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```
