Wire `addIcons` after [Installation](../README.md#installation). See also [Usage](./usage.md).

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
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';
+ import * as useIcons from './use-icons';

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
