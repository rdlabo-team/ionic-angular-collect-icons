import { Project } from "ts-morph";
import { CliOptions } from "../../../types/cli-options";

import { saveFileChanges } from "../../utils/log-utils";
import { addImportToFile } from "../../utils/typescript-utils";
import { getRelativePath } from "../../utils/cli-utils";

export const initializeAddIcons = async (
  project: Project,
  cliOptions: CliOptions,
) => {
  const prodModeSource =
    project.getSourceFile("app.config.ts") || project.getSourceFile("main.ts");

  if (prodModeSource === undefined) {
    // If the project does not base angular standalone structured, do nothing.
    return;
  }

  const enableProdMode = prodModeSource
    .getStatements()
    .find((source) => source.getFullText().includes("enableProdMode()"));
  if (!enableProdMode) {
    // If the project does not base angular standalone structured, do nothing.
    return;
  }

  const importIonIcons = prodModeSource.getImportDeclaration("ionicons");
  if (importIonIcons) {
    const namedIconsImports = importIonIcons.getNamedImports();
    const importIconSpecifier = namedIconsImports.find(
      (n) => n.getName() === "addIcons",
    );
    if (importIconSpecifier) {
      // Remove the addIcons import specifier.
      const addIcons = prodModeSource.getStatements().find((l) => {
        return l.getFullText().includes("addIcons");
      });
      if (addIcons) {
        // already initialize
        return;
      } else {
        // remove for initialize
        importIconSpecifier.remove();
      }
    }
  }

  addImportToFile(prodModeSource, "addIcons", "ionicons");
  prodModeSource.addImportDeclaration({
    defaultImport: "* as allIcons",
    moduleSpecifier: "ionicons/icons",
  });

  const relativePath = getRelativePath(
    prodModeSource.getFilePath(),
    [cliOptions.projectPath, cliOptions.iconPath].join("/"),
  );
  prodModeSource.addImportDeclaration({
    defaultImport: "* as useIcons",
    moduleSpecifier: relativePath.replace(".ts", ""),
  });

  prodModeSource.insertStatements(
    enableProdMode.getChildIndex() + 1,
    `addIcons(environment.production ? useIcons : allIcons);`,
  );

  return await saveFileChanges(prodModeSource, cliOptions);
};
