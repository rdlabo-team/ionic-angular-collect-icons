import { Project, SyntaxKind } from "ts-morph";
import type { CallExpression, SourceFile, Statement } from "ts-morph";
import { CliOptions } from "../../types/cli-options";

import { saveFileChanges } from "../../utils/log-utils";
import { addImportToFile } from "../../utils/typescript-utils";
import { getRelativePath } from "../../utils/cli-utils";

const RUNTIME_MODULE = "@rdlabo/ionic-angular-collect-icons/runtime";

const getUseIconsModuleSpecifier = (
  sourceFile: SourceFile,
  cliOptions: CliOptions,
): string => {
  const relativePath = getRelativePath(
    sourceFile.getFilePath(),
    [cliOptions.projectPath, cliOptions.iconPath].join("/"),
  )
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "");
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
};

const getTopLevelCall = (statement: Statement): CallExpression | undefined => {
  if (statement.getKind() !== SyntaxKind.ExpressionStatement) {
    return undefined;
  }
  return statement.getFirstDescendantByKind(SyntaxKind.CallExpression);
};

const isCallWithUseIcons = (
  call: CallExpression | undefined,
  functionName: string,
): call is CallExpression =>
  call?.getExpression().getText() === functionName &&
  call.getArguments().length === 1 &&
  call.getArguments()[0]?.getText() === "useIcons";

const hasNamedImport = (
  sourceFile: SourceFile,
  moduleSpecifier: string,
  importName: string,
): boolean =>
  sourceFile
    .getImportDeclaration(moduleSpecifier)
    ?.getNamedImports()
    .some(
      (candidate) =>
        candidate.getName() === importName && !candidate.getAliasNode(),
    ) === true;

const hasNamespaceImport = (
  sourceFile: SourceFile,
  moduleSpecifier: string,
  importName: string,
): boolean =>
  sourceFile
    .getImportDeclaration(moduleSpecifier)
    ?.getNamespaceImport()
    ?.getText() === importName;

const getGeneratedUseIconsImport = (
  sourceFile: SourceFile,
  cliOptions: CliOptions,
): ReturnType<SourceFile["getImportDeclaration"]> => {
  const canonical = getUseIconsModuleSpecifier(sourceFile, cliOptions);
  const legacy = canonical.startsWith("./") ? canonical.slice(2) : canonical;
  return sourceFile
    .getImportDeclarations()
    .find(
      (declaration) =>
        declaration.getNamespaceImport()?.getText() === "useIcons" &&
        [canonical, legacy].includes(declaration.getModuleSpecifierValue()),
    );
};

const isLegacyTernaryCall = (call: CallExpression | undefined): boolean => {
  if (
    call?.getExpression().getText() !== "addIcons" ||
    call.getArguments().length !== 1
  ) {
    return false;
  }
  const conditional = call
    .getArguments()[0]
    ?.asKind(SyntaxKind.ConditionalExpression);
  return (
    conditional?.getCondition().getText() === "environment.production" &&
    conditional.getWhenTrue().getText() === "useIcons" &&
    conditional.getWhenFalse().getText() === "allIcons"
  );
};

const getLegacyInitializer = (
  sourceFile: SourceFile,
  cliOptions: CliOptions,
): Statement | undefined => {
  if (
    !hasNamedImport(sourceFile, "ionicons", "addIcons") ||
    !getGeneratedUseIconsImport(sourceFile, cliOptions)
  ) {
    return undefined;
  }

  return sourceFile.getStatements().find((statement) => {
    const call = getTopLevelCall(statement);
    if (isLegacyTernaryCall(call)) {
      return hasNamespaceImport(sourceFile, "ionicons/icons", "allIcons");
    }
    return cliOptions.migrate === true && isCallWithUseIcons(call, "addIcons");
  });
};

const hasCurrentInitializer = (sourceFile: SourceFile): boolean =>
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .some((call) => isCallWithUseIcons(call, "initializeIonicons"));

const removeNamedImport = (
  sourceFile: SourceFile,
  moduleSpecifier: string,
  importName: string,
): void => {
  const declaration = sourceFile.getImportDeclaration(moduleSpecifier);
  const specifier = declaration
    ?.getNamedImports()
    .find((candidate) => candidate.getName() === importName);
  specifier?.remove();
  if (
    declaration &&
    declaration.getNamedImports().length === 0 &&
    !declaration.getDefaultImport() &&
    !declaration.getNamespaceImport()
  ) {
    declaration.remove();
  }
};

const removeLegacyAllIconsImport = (sourceFile: SourceFile): void => {
  const declaration = sourceFile.getImportDeclaration("ionicons/icons");
  if (declaration?.getNamespaceImport()?.getText() === "allIcons") {
    declaration.remove();
  }
};

export const initializeAddIcons = async (
  project: Project,
  cliOptions: CliOptions,
) => {
  const candidates = [
    project.getSourceFile("app.config.ts"),
    project.getSourceFile("main.ts"),
  ].filter((sourceFile) => sourceFile !== undefined);
  const prodModeSource =
    candidates.find((sourceFile) =>
      getLegacyInitializer(sourceFile, cliOptions),
    ) ??
    candidates.find(hasCurrentInitializer) ??
    candidates[0];

  if (prodModeSource === undefined) {
    // If the project does not base angular standalone structured, do nothing.
    return;
  }

  const statements = prodModeSource.getStatements();
  if (hasCurrentInitializer(prodModeSource)) {
    return;
  }

  const legacyInitializer = getLegacyInitializer(prodModeSource, cliOptions);
  if (legacyInitializer) {
    if (cliOptions.migrate === false) {
      return "declined" as const;
    }
    if (cliOptions.migrate !== true) {
      return "permission-required" as const;
    }
    const useIconsImport = getGeneratedUseIconsImport(
      prodModeSource,
      cliOptions,
    );
    useIconsImport?.setModuleSpecifier(
      getUseIconsModuleSpecifier(prodModeSource, cliOptions),
    );
    const addIconsImport = prodModeSource.getImportDeclaration("ionicons");
    const allIconsImport =
      prodModeSource.getImportDeclaration("ionicons/icons");
    const hasOtherAddIconsUsage = statements.some(
      (statement) =>
        statement !== legacyInitializer &&
        statement !== addIconsImport &&
        /\baddIcons\b/.test(statement.getText()),
    );
    const hasOtherAllIconsUsage = statements.some(
      (statement) =>
        statement !== legacyInitializer &&
        statement !== allIconsImport &&
        /\ballIcons\b/.test(statement.getText()),
    );
    if (!hasOtherAddIconsUsage) {
      removeNamedImport(prodModeSource, "ionicons", "addIcons");
    }
    if (!hasOtherAllIconsUsage) {
      removeLegacyAllIconsImport(prodModeSource);
    }
    addImportToFile(prodModeSource, "initializeIonicons", RUNTIME_MODULE);
    legacyInitializer.replaceWithText("void initializeIonicons(useIcons);");
    await saveFileChanges(prodModeSource, cliOptions, { format: false });
    return "changed" as const;
  }

  if (!cliOptions.initialize) {
    return;
  }

  // パフォーマンス最適化: getFullText()を一度だけ呼び出す
  const enableProdMode = statements.find((source) => {
    const text = source.getFullText();
    return text.includes("enableProdMode()");
  });
  if (!enableProdMode) {
    // If the project does not base angular standalone structured, do nothing.
    return;
  }

  const importIonIcons = prodModeSource.getImportDeclaration("ionicons");
  if (importIonIcons) {
    const importIconSpecifier = importIonIcons
      .getNamedImports()
      .find((n) => n.getName() === "addIcons");
    if (importIconSpecifier) {
      const hasAddIconsCall = prodModeSource
        .getDescendantsOfKind(SyntaxKind.CallExpression)
        .some((call) => call.getExpression().getText() === "addIcons");
      if (hasAddIconsCall) {
        // Preserve custom initialization that does not match a known shape.
        return;
      }
      removeNamedImport(prodModeSource, "ionicons", "addIcons");
    }
  }

  addImportToFile(prodModeSource, "initializeIonicons", RUNTIME_MODULE);

  prodModeSource.addImportDeclaration({
    namespaceImport: "useIcons",
    moduleSpecifier: getUseIconsModuleSpecifier(prodModeSource, cliOptions),
  });

  prodModeSource.insertStatements(
    enableProdMode.getChildIndex() + 1,
    `void initializeIonicons(useIcons);`,
  );

  await saveFileChanges(prodModeSource, cliOptions, { format: false });
  return "changed" as const;
};
