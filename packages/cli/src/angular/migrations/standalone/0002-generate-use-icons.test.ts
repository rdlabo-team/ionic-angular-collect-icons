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
});
