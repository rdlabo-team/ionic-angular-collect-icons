import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import dedent from "ts-dedent";

import { migrateComponents } from "./0002-import-standalone-component";

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

      project.createSourceFile(
        "foo.component.ts",
        dedent(component),
      );

      const useIconFile = project.createSourceFile(
        "use-icons.ts",
        dedent(``),
      );

      await migrateComponents(project, { dryRun: false });

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });
});
