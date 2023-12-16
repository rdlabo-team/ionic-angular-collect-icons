import type { SourceFile } from "ts-morph";

export function getOrCreateConstructor(sourceFile: SourceFile) {
  let constructor = sourceFile.getClasses()[0].getConstructors()[0];

  if (!constructor) {
    // Create the constructor if it does not exist
    constructor = sourceFile.getClasses()[0].addConstructor();
  }

  return constructor;
}

export function addImportToClass(
  sourceFile: SourceFile,
  importName: string | string[],
  moduleSpecifier: string,
) {
  const addImport = (
    sourceFile: SourceFile,
    importName: string,
    moduleSpecifier: string,
  ) => {
    const classDeclaration = sourceFile.getClasses()[0];

    if (!classDeclaration) {
      return;
    }

    let importDeclaration = sourceFile.getImportDeclaration(moduleSpecifier);

    if (!importDeclaration) {
      // Create the import declaration if it does not exist.
      importDeclaration = sourceFile.addImportDeclaration({
        moduleSpecifier,
      });
    }

    const importSpecifier = importDeclaration
      .getNamedImports()
      .find((n) => n.getName() === importName);

    if (!importSpecifier) {
      importDeclaration.addNamedImport(importName);
    }
  };

  if (Array.isArray(importName)) {
    importName.forEach((name) => {
      addImport(sourceFile, name, moduleSpecifier);
    });
  } else {
    addImport(sourceFile, importName, moduleSpecifier);
  }
}

export function removeImportFromClass(
  sourceFile: SourceFile,
  importName: string | string[],
  moduleSpecifier: string,
) {
  const removeImport = (
    sourceFile: SourceFile,
    importName: string,
    moduleSpecifier: string,
  ) => {
    const importDeclaration = sourceFile.getImportDeclaration(moduleSpecifier);

    if (!importDeclaration) {
      return;
    }

    const importSpecifier = importDeclaration
      .getNamedImports()
      .find((n) => n.getName() === importName);

    if (importSpecifier) {
      importSpecifier.remove();
    }

    if (importDeclaration.getNamedImports().length === 0) {
      importDeclaration.remove();
    }
  };

  if (Array.isArray(importName)) {
    importName.forEach((name) => {
      removeImport(sourceFile, name, moduleSpecifier);
    });
  } else {
    removeImport(sourceFile, importName, moduleSpecifier);
  }
}

export function addExportToFile(
  sourceFile: SourceFile,
  importName: string | string[],
  moduleSpecifier: string,
) {
  const addExport = (
    sourceFile: SourceFile,
    importName: string,
    moduleSpecifier: string,
  ) => {
    let exportDeclaration = sourceFile.getExportDeclaration(moduleSpecifier);

    if (!exportDeclaration) {
      // Create the import declaration if it does not exist.
      exportDeclaration = sourceFile.addExportDeclaration({
        moduleSpecifier,
      });
    }

    const importSpecifier = exportDeclaration
      .getNamedExports()
      .find((n) => n.getName() === importName);

    if (!importSpecifier) {
      exportDeclaration.addNamedExport(importName);
    }
  };

  if (Array.isArray(importName)) {
    importName.forEach((name) => {
      addExport(sourceFile, name, moduleSpecifier);
    });
  } else {
    addExport(sourceFile, importName, moduleSpecifier);
  }
}
