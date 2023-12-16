# Ionic Angular Collect Icons

## What is this?

This library is used to uniquely group the ionIcons in a project and export them from `use-icons.ts`. In small projects, it is difficult to manage `addIcons()` of ionIcons each time, so we automated it.

- development: Stress-free development by `addIcons()` for all icons.
- Production: Automatically collect and update the ionIcon used in the template prior to build. 

Of course, to maximize bundle size reduction, it is important to load a minimum number of icons at each Component lazy loading. This is a compromise to speed up development.

This project is based [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) .


> [!WARNING]
> This project is experimental. Review all changes before committing them to your project.

## Usage

1. Run the CLI

```bash
npx @rdlabo/ionic-angular-collect-icons
```

This will overwrite `use-icons.ts` if it exists, or automatically generate `src/use-icons.ts` if not. If you wish to place this file in an arbitrary location, move it.

2. Import the generated file in your `main.ts` ( or `app.config.ts` ) file:

```diff
+ import * as useIcons from '../use-icons';
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';

  if (environment.production) {
    enableProdMode();
+   addIcons(useIcons);
- }
+ } else {
+   addIcons(allIcons);
+ }
```

- Can run addIcons in main.ts?

Yes. Please check this issue: https://github.com/ionic-team/ionic-framework/issues/28445#issuecomment-1789028722

> You're more than welcome to register them in main.ts or app.component.ts. You can then use them anywhere in your application. However, the initial bundle size may increase because the icons need to be loaded up front.


3. Add npm script for generate `use-icons.ts` file at every build:

```diff
  "scripts": {
    "ng": "ng",
    "start": "ng run serve",
    "build": "ng build --localize",
+   "prebuild": "npx @rdlabo/ionic-angular-collect-icons --non-interactive false",
```


## Developing

1. Clone this repository.
2. Run `pnpm install` to install dependencies
3. Run `pnpm run dev` to start the dev server, this will watch for changes and rebuild the project
4. Run `pnpm run start --filter=cli` to start the CLI and test the code mods

### Testing

This project uses [Vitest](https://vitest.dev/) for unit testing.

| Command               | Description                 |
| --------------------- | --------------------------- |
| `pnpm run test`       | Run all tests               |
| `pnpm run test:watch` | Run all tests in watch mode |

### Formatting

This project uses [Prettier](https://prettier.io/) for code formatting.

Run `pnpm run format` to format all files in the project.

### Additional Resources

- [Typescript AST Explorer](https://ts-ast-viewer.com/)
- [ts-morph API Docs](https://ts-morph.com/)
- [Clack Prompts Docs](https://github.com/natemoo-re/clack/tree/main/packages/prompts#readme)
