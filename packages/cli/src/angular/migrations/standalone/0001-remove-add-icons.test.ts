import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { dedent } from "ts-dedent";

import { removeAddIcons } from "./0001-remove-add-icons";
import { cwd } from "node:process";

describe("migrateAppModule", () => {
  it("should remove addIcons method", async () => {
    const project = new Project({ useInMemoryFileSystem: true });

    const component = `
        import { Component } from "@angular/core";
        import { addIcons } from "ionicons"; 
        import { readerOutline } from "ionicons/icons"; 

        @Component({
          selector: 'my-component',
          template: '',
          standalone: true
        }) 
        export class MyComponent {
          constructor() {
            addIcons([readerOutline]);
          }
        }
      `;

    const componentSourceFile = project.createSourceFile(
      "foo.component.ts",
      dedent(component),
    );

    await removeAddIcons(project, {
      dryRun: false,
      iconPath: "src/use-icons.ts",
      projectPath: cwd(),
      interactive: false,
      initialize: false,
    });

    expect(dedent(componentSourceFile.getText())).toBe(
      dedent(`
        import { Component } from "@angular/core";

        @Component({
            selector: 'my-component',
            template: '',
            standalone: true
        })
        export class MyComponent {
            constructor() {
            }
        }
      `),
    );
  });
});
