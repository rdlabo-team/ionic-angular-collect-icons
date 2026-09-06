Run the collector before production builds. Call this after [Initialize](./initialize.md).

```bash
npx @rdlabo/ionic-angular-collect-icons
```

### Automate before build

Put the collector in an npm script so production builds refresh `src/use-icons.ts`:

```diff
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
+   "prebuild": "npx @rdlabo/ionic-angular-collect-icons",
```

> [!WARNING]
> This method cannot be used for production builds without using the npm script.

### Production check

1. Add one static icon to a template, for example `<ion-icon name="home"></ion-icon>`.
2. Run the collector and confirm the matching export in `src/use-icons.ts`.
3. Run `npm run build`.

Dynamic `[name]` bindings are not collected. Register those icons manually, or see the binding notes in [FAQ](./faq.md).
