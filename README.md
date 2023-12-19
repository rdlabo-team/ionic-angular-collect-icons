# Ionic Angular Collect Icons

## What is this?

This library is used to uniquely group the ionIcons in a project, and generate for export ionIcons file. In small projects, it is difficult to manage `addIcons()` of ionIcons each time, so we automated it.

- development: Stress-free development by add all icons at `addIcons`.
- Production: Automatically collect and update the ionIcon used in the template prior to build.

Of course, to maximize bundle size reduction, it is important to load a minimum number of icons at each Component lazy loading. This is a compromise to speed up development.

This project is based [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) .

> [!WARNING]
> This project is experimental. Review all changes before committing them to your project.

## Initialize

```bash
npm install @rdlabo/ionic-angular-collect-icons --save-dev
```

### 🤖 Automatic Configuration

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

### 📝 Manual Configuration

#### 1. Run the CLI

```bash
npx @rdlabo/ionic-angular-collect-icons
```

This will generate `src/use-icons.ts`.

#### 2. Import the generated file in your `main.ts` ( or `app.config.ts` ) file:

```diff
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';
+ import * as useIcons from '../use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  addIcons(environment.production ? useIcons : allIcons);
```

#### 3. Remove other `addIcons` calls in class constructor

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```

## Usage

```bash
npx @rdlabo/ionic-angular-collect-icons
```

### Let's automate run

It is inefficient to run commands each time before running a production build, so put them in an npm script to automate the process. Example:

```diff
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
+   "prebuild": "npx @rdlabo/ionic-angular-collect-icons",
```

> [!WARNING]
> This method cannot be used for production builds without using the npm script.

## Optional

### --interactive [boolean]

If you want to set all CLI option using the prompts, set `true`. This can be used to check only the results in a Dry run.
The default is `false`.

```bash
npx @rdlabo/ionic-angular-collect-icons --interactive true
```

### --initialize [boolean]

If you want to initialize `addIcons` automatically, you can use the `--initialize` flag. The default is `false`. The CLI add lines:

```diff
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';
+ import * as useIcons from '../use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  addIcons(environment.production ? useIcons : allIcons);
```

the CLI will add lines at the file that has `enableProdMode()`. Of course, it can also be set manually.

And remove other `addIcons` calls in class constructor.

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

### --project-path [string]

If you want to specify the path to the project, you can use the `--project-path` flag. The default is the current directory.

```bash
npx @rdlabo/ionic-angular-collect-icons --project-path /path/to/project
```

Target files are under the `src` directory from the specified path.

- path/to/project + `src/**/*.ts`
- path/to/project + `src/**/*.html`
- path/to/project + `src/**/*.scss`

### --icon-path [string]

Default create file is (path/to/project +) `src/use-icons.ts`. If you want to specify the file name, you can use the `--icon-path` flag.

```bash
npx @rdlabo/ionic-angular-collect-icons  --icon-path src/other-use-icons.ts
```

## FAQ

- Can run addIcons in main.ts?

Yes. Please check this issue: https://github.com/ionic-team/ionic-framework/issues/28445#issuecomment-1789028722

> You're more than welcome to register them in main.ts or app.component.ts. You can then use them anywhere in your application. However, the initial bundle size may increase because the icons need to be loaded up front.

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
