import {Project, SourceFile} from 'ts-morph';
import dedent from 'ts-dedent';
import {generateUseIcons} from './0002-generate-use-icons';
import {cwd} from 'node:process';

export const createTestIconFile = async (fileSource: {
  filePath: string;
  sourceFileText: string
}[]): Promise<SourceFile> => {
  const project = new Project({ useInMemoryFileSystem: true });
  for (const file of fileSource) {
    project.createSourceFile(file.filePath, dedent(file.sourceFileText));
  }
  const useIconFile = project.createSourceFile("use-icons.ts", dedent(``));

  await generateUseIcons(project, {
    dryRun: false,
    iconPath: "src/use-icons.ts",
    projectPath: cwd(),
    interactive: false,
    initialize: false,
  });

  return useIconFile;
}
