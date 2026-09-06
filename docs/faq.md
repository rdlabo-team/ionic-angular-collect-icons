- Can run addIcons in main.ts?

Yes. Please check this issue: https://github.com/ionic-team/ionic-framework/issues/28445#issuecomment-1789028722

> You're more than welcome to register them in main.ts or app.component.ts. You can then use them anywhere in your application. However, the initial bundle size may increase because the icons need to be loaded up front.

- Support Unit Test?

When the test runner does not execute `main.ts`, call `addIcons` from the test setup file or from individual tests. For Karma-style projects that still use `src/test.ts`, register icons there; for Vitest or other runners, use that runner's setup file.

- Support binding icon name?

No, and we do not plan to support this program. For example, this kind of code is difficult to follow until it is displayed.

```ts
@Component({
  selector: "app-example",
  template: ` <ion-icon [name]="iconName"></ion-icon> `,
})
export class ExampleComponent {
  iconName = "add";

  ionViewWillEnter() {
    setTimeout(() => {
      this.iconName = "remove";
    }, 1000);
  }
}
```

If you are doing this kind of complex processing, please import manually.

Alternatively, if you have a limited number of icons you're binding to, you can add a block in your template as a "hint."

```html
<!-- This is a trick to get ionic-angular-collect-icons
     to include the icons, but it will never render. -->
@if(false) {
<ion-icon name="home"></ion-icon>
<ion-icon name="people"></ion-icon>
}
```

It's not ideal, but it will help to maintain the automation.

- Why not addIcons in each component?

This is to minimize diffs by libraries. I did not like to have every component change on every run. I wanted to keep the diff as small as possible.
