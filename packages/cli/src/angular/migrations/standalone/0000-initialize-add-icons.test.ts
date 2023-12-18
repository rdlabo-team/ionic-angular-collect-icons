import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { dedent } from "ts-dedent";

import { initializeAddIcons } from "./0000-initialize-add-icons";
import {cwd} from 'node:process';

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

    await initializeAddIcons(project, { dryRun: false, iconPath: "src/use-icons.ts", projectPath: cwd(), interactive: false, initialize: false });

    console.log(appModuleSourceFile.getText());
  });
});
