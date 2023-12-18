import { CliOptions } from '../../types/cli-options';
import {kebabCaseToCamelCase, kebabCaseToPascalCase} from './string-utils';
import * as path from 'path';

export function getRelativePath(importFilePath: string, targetPath: string): string {
  console.log(importFilePath, targetPath);
  return path.relative(path.dirname(importFilePath), targetPath);
}

export function getOptionsFromArgv(argv: string[]): Partial<CliOptions> {
  const options = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg) {
      continue;
    }

    if (arg.startsWith("--")) {
      const key = kebabCaseToCamelCase(arg.replace("--", ""));
      const value = argv[i + 1] === undefined || argv[i + 1].startsWith("--") ? true
        : ['true', 'false'].includes(argv[i + 1]) ? argv[i + 1]　=== 'true'
          : argv[i + 1];
      Object.assign(options, {
        [key]: value,
      })
    }
  }
  return options as CliOptions;
}
