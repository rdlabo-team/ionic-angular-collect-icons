#!/usr/bin/env node

import {
  intro,
  outro,
  log,
  text,
  confirm,
  group,
  spinner,
} from "@clack/prompts";
import color from "picocolors";
import { TERMINAL_INFO } from "@ionic/utils-terminal";
import { Project } from "ts-morph";
import { existsSync } from "node:fs";

import { cwd } from "node:process";
import { runStandaloneMigration } from "./angular/migrations/standalone";
import { getOptionsFromArgv } from "./angular/utils/cli-utils";
import { CliOptions } from "./types/cli-options";

const IONIC_REPOSITORY_ISSUES_URL =
  "https://github.com/rdlabo-team/ionic-angular-collect-icons/issues";

const cliOptions = getOptionsFromArgv(process.argv);

const isInteractive = (): boolean =>
  TERMINAL_INFO.tty && !TERMINAL_INFO.ci && cliOptions.interactive === true;

async function main() {
  console.clear();

  intro("@rdlabo/ionic-angular-collect-icons");
  intro(
    "This utility will collect ion-icon from your Ionic Angular project, and generate files to collect and export all icons.",
  );

  const _cli = isInteractive()
    ? await group({
        dryRun: () =>
          confirm({
            message:
              "Would you like to run this migration as a dry run? No changes will be written to your project.",
            initialValue: true,
          }),
        projectPath: () =>
          text({
            message:
              "Please enter the path to your project (default is the current working directory):",
            initialValue: cwd(),
          }),
      })
    : Object.assign({
        // If we are in a non-interactive terminal then use defaults
        dryRun: false,
        projectPath: cwd(),
      });

  const cli = Object.assign(
    _cli,
    {
      initialize: false,
      iconPath: "src/use-icons.ts",
    },
    cliOptions,
  ) as CliOptions;

  if (typeof cli.dryRun !== "boolean") {
    // User aborted the prompt
    return;
  }

  let project: Project;

  if (existsSync(`${cli.projectPath}/tsconfig.json`)) {
    project = new Project({
      tsConfigFilePath: `${cli.projectPath}/tsconfig.json`,
    });
  } else {
    project = new Project();
  }

  const s = spinner();

  project.addSourceFilesAtPaths([
    `${cli.projectPath}/src/**/*.html`,
    `${cli.projectPath}/src/**/*.ts`,
    `${cli.projectPath}/angular.json`,
  ]);

  try {
    await runStandaloneMigration({
      project,
      cliOptions: cli,
      dir: cli.projectPath,
      spinner: s,
    });
  } catch (e: any) {
    s.stop("An error occurred during the migration.", 1);
    log.error(e.message);
  }

  outro(
    `If you encounter any issues with this migration utility, please report them at: ${color.underline(
      IONIC_REPOSITORY_ISSUES_URL,
    )}`,
  );
}

main().catch(console.error);
