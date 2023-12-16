<h1>
  Ionic Angular Collect Icons
</h1>

<p>
Code mods to collect using ion-icons at project, and generate export file. This project is based [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) .
</p>

> [!WARNING]
> This project is experimental. Review all changes before committing them to your project.

## Initialize

## Usage

```bash
npx @rdlabo/ionic-angular-collect-icons
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
