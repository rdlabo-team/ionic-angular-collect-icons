import { describe, expect, it } from "vitest";
import dedent from "ts-dedent";
import {createTestIconFile} from "./test-helper";
import {Project} from 'ts-morph';
import {generateUseIcons} from './0002-generate-use-icons';
import {cwd} from 'node:process';

describe("migrateComponents", () => {
  describe("compare existing icons", () => {
    it("added from existing icons", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: \`<ion-icon [name]="is ? 'logo-ionic' : has ? 'logo-ionic' : 'close-outline'"></ion-icon>\`,
          standalone: true
        }) 
        export class MyComponent {
            public is = true;
            public has = true;
        }
      `;

      const project = new Project({useInMemoryFileSystem: true});
      project.createSourceFile("foo.component.ts", dedent(component));
      project.createSourceFile("use-icons.ts", dedent(`export { closeOutline } from "ionicons/icons";`));

      const result = await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(result).toBe(true);
    });

    it("remove from existing icons", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: \`<ion-icon [name]="is ? 'logo-ionic' : has ? 'logo-ionic' : 'close-outline'"></ion-icon>\`,
          standalone: true
        }) 
        export class MyComponent {
            public is = true;
            public has = true;
        }
      `;

      const project = new Project({useInMemoryFileSystem: true});
      project.createSourceFile("foo.component.ts", dedent(component));
      project.createSourceFile("use-icons.ts", dedent(`export { logoIonic, closeOutline, addCircleOutline } from "ionicons/icons";`));

      const result = await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(result).toBe(true);
    });

    it("change only order from existing icons", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: \`<ion-icon [name]="is ? 'logo-ionic' : has ? 'logo-ionic' : 'close-outline'"></ion-icon>\`,
          standalone: true
        }) 
        export class MyComponent {
            public is = true;
            public has = true;
        }
      `;

      const project = new Project({useInMemoryFileSystem: true});
      project.createSourceFile("foo.component.ts", dedent(component));
      project.createSourceFile("use-icons.ts", dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`));

      const result = await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(result).toBe(false);
    });

    it("no change from existing icons", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: \`<ion-icon [name]="is ? 'logo-ionic' : has ? 'logo-ionic' : 'close-outline'"></ion-icon>\`,
          standalone: true
        }) 
        export class MyComponent {
            public is = true;
            public has = true;
        }
      `;

      const project = new Project({useInMemoryFileSystem: true});
      project.createSourceFile("foo.component.ts", dedent(component));
      project.createSourceFile("use-icons.ts", dedent(`export { closeOutline, logoIonic } from "ionicons/icons";`));

      const result = await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(result).toBe(false);
    });
  });
});
