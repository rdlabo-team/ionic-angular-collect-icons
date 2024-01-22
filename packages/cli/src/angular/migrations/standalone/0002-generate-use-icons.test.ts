import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import dedent from "ts-dedent";
import { cwd } from "node:process";

import { generateUseIcons } from "./0002-generate-use-icons";
import { createTestIconFile } from "./test-helper";

describe("migrateComponents", () => {
  describe("standalone angular components", () => {
    it("should detect and import icons used in the template", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: '<ion-icon name="logo-ionic"></ion-icon><ion-icon name="close-outline"></ion-icon>',
          standalone: true
        })
        export class MyComponent { }
      `;

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.ts",
          sourceFileText: dedent(component),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });

    it("should detect and import icons of ios used in the template", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: '<ion-icon ios="logo-ionic"></ion-icon><ion-icon ios="close-outline"></ion-icon>',
          standalone: true
        })
        export class MyComponent { }
      `;

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.ts",
          sourceFileText: dedent(component),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });

  describe("angular control flow", () => {
    it("@if", async () => {
      const component = `
        import { Component } from "@angular/core";

        @Component({
          selector: 'my-component',
          template: '@if(1 === 1) {<ion-icon name="logo-ionic"></ion-icon><ion-icon name="close-outline"></ion-icon> }',
          standalone: true
        })
        export class MyComponent { }
      `;

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.ts",
          sourceFileText: dedent(component),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });

    it("@for", async () => {
      const html = `
        @for (item of vm.computedThreadList(); track item.threadId; let i = $index) {
            <ion-icon name="image-outline" color="medium"></ion-icon>
        }
      `;

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.html",
          sourceFileText: dedent(html),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { imageOutline } from "ionicons/icons";`),
      );
    });

    it("@switch", async () => {
      const html = `
        @switch (flag) {
          @case ('A') {
            <ion-icon name="image-outline" color="medium"></ion-icon>
          }
          @default { <ion-icon name="close-outline" color="medium"></ion-icon> }
        }
      `;

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.html",
          sourceFileText: dedent(html),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { imageOutline, closeOutline } from "ionicons/icons";`),
      );
    });

    it("@defer", async () => {
      const html = `
        @defer (when loaded) {
          <ion-icon name="image-outline" color="medium"></ion-icon>
        } @loading {
          <ion-icon name="accessibility-outline"></ion-icon>
        } @placeholder {
        }
      `;

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.html",
          sourceFileText: dedent(html),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(
          `export { imageOutline, accessibilityOutline } from "ionicons/icons";`,
        ),
      );
    });
  });

  describe("get binding name", () => {
    it("should detect and import icons used in the template", async () => {
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

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.ts",
          sourceFileText: dedent(component),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });

  describe("get double binding name", () => {
    it("should detect and import icons used in the template", async () => {
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

      const useIconFile = await createTestIconFile([
        {
          filePath: "foo.component.ts",
          sourceFileText: dedent(component),
        },
      ]);

      expect(dedent(useIconFile.getText())).toBe(
        dedent(`export { logoIonic, closeOutline } from "ionicons/icons";`),
      );
    });
  });
});
