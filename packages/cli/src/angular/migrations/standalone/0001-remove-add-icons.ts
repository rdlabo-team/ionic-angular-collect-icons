import { Project, ts } from "ts-morph";
import { CliOptions } from "../../../types/cli-options";

import { saveFileChanges } from "../../utils/log-utils";

export const removeAddIcons = async (
  project: Project,
  cliOptions: CliOptions,
) => {
  for (const sourceFile of project.getSourceFiles()) {
    const importIcons = sourceFile.getImportDeclaration("ionicons/icons");
    if (!importIcons) {
      // If the ionicons import does not exist, then this file do not use ion-icon
      continue;
    }
    importIcons.remove();

    const constructor = sourceFile.getClasses()[0].getConstructors()[0];
    if (!constructor) {
      // Create the constructor if it does not exist
      continue;
    }

    const addIcons = constructor.getStatements().find((l) => {
      return l.getFullText().includes("addIcons");
    });

    if (addIcons) {
      addIcons.remove();
    }
    await saveFileChanges(sourceFile, cliOptions);
  }
};
