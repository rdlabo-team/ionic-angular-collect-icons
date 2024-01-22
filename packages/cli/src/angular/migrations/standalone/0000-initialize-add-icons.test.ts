import { describe, expect, it } from "vitest";
import { Project } from "ts-morph";
import { dedent } from "ts-dedent";

import { initializeAddIcons } from "./0000-initialize-add-icons";
import { cwd } from "node:process";

describe("initializeAddIcons", () => {
  it("initialize add icons to file", async () => {
    const project = new Project({ useInMemoryFileSystem: true });

    const appModuleSourceFile = project.createSourceFile(
      cwd() + "/src/main.ts",
      dedent(`
      import { environment } from './environments/environment';
      
      if (environment.production) {
        enableProdMode();
      }
      
      bootstrapApplication(AppComponent, {
        providers: [
          { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
          provideIonicAngular(),
          provideRouter(routes),
        ],
      });
      `),
    );

    await initializeAddIcons(project, {
      dryRun: false,
      iconPath: "src/use-icons.ts",
      projectPath: cwd(),
      interactive: false,
      initialize: false,
    });

    expect(dedent(appModuleSourceFile.getText())).toBe(
      dedent(`
      import { environment } from './environments/environment';
      import { addIcons } from "ionicons";
      import * as allIcons from "ionicons/icons";
      import * as useIcons from "use-icons";
      
      if (environment.production) {
          enableProdMode();
      }
      addIcons(environment.production ? useIcons : allIcons);
      
      bootstrapApplication(AppComponent, {
          providers: [
              { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
              provideIonicAngular(),
              provideRouter(routes),
          ],
      });
      `),
    );
  });
});
