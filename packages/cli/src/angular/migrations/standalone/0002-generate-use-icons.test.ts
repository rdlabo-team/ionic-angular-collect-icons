import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import dedent from "ts-dedent";
import { cwd } from "node:process";

import { generateUseIcons } from "./0002-generate-use-icons";

describe("migrateComponents", () => {
  describe("standalone angular components", () => {
    it("should detect and import icons used in the template", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: '<ion-icon name="logo-ionic"></ion-icon><ion-icon name="close-outline"></ion-icon>',
          standalone: true
        })
        export class MyComponent { }
      `;

      project.createSourceFile("foo.component.ts", dedent(component));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });

  describe("angular control flow", () => {
    it("@if", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: '@if(1 === 1) {<ion-icon name="logo-ionic"></ion-icon><ion-icon name="close-outline"></ion-icon> }',
          standalone: true
        })
        export class MyComponent { }
      `;

      project.createSourceFile("foo.component.ts", dedent(component));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });

    it("@for", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

      const html = `
        @for (item of vm.computedThreadList(); track item.threadId; let i = $index) {
            <ion-icon name="image-outline" color="medium"></ion-icon>
        }
      `;

      project.createSourceFile("foo.component.html", dedent(html));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { imageOutline } from "ionicons/icons";`),
      );
    });

    it("@switch", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

      const html = `
        @switch (flag) {
          @case ('A') {
            <ion-icon name="image-outline" color="medium"></ion-icon>
          }
          @default { <ion-icon name="close-outline" color="medium"></ion-icon> }
        }
      `;

      project.createSourceFile("foo.component.html", dedent(html));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { imageOutline, closeOutline } from "ionicons/icons";`),
      );
    });

    it("@defer", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

      const html = `
        @defer (when loaded) {
          <ion-icon name="image-outline" color="medium"></ion-icon>
        } @loading {
          <ion-icon name="accessibility-outline"></ion-icon>
        } @placeholder {
        }
      `;

      project.createSourceFile("foo.component.html", dedent(html));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(
          `export { imageOutline, accessibilityOutline } from "ionicons/icons";`,
        ),
      );
    });
  });

  describe("get binding name", () => {
    it("should detect and import icons used in the template", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: \`<ion-icon [name]="is ? 'logo-ionic' : 'close-outline'"></ion-icon>\`,
          standalone: true
        })
        export class MyComponent {
            public is = true;
        }
      `;

      project.createSourceFile("foo.component.ts", dedent(component));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });

  describe("get double binding name", () => {
    it("should detect and import icons used in the template", async () => {
      const project = new Project({ useInMemoryFileSystem: true });

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

      project.createSourceFile("foo.component.ts", dedent(component));

      const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

      await generateUseIcons(project, {
        dryRun: false,
        iconPath: "src/use-icons.ts",
        projectPath: cwd(),
        interactive: false,
        initialize: false,
      });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });
});
