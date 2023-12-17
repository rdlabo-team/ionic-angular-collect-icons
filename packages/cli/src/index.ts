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

const IONIC_REPOSITORY_ISSUES_URL =
  "https://github.com/rdlabo-team/ionic-angular-collect-icons/issues";
const isInteractive = (): boolean =>
  TERMINAL_INFO.tty &&
  !TERMINAL_INFO.ci &&
  !process.argv.includes("--non-interactive");

async function main() {
  console.clear();

  intro("@rdlabo/ionic-angular-collect-icons");
  intro(
    "This utility will collect ion-icon from your Ionic Angular project, and generate files to collect and export all icons.",
  );

  log.warning("--------------------------------------------------");
  log.warning(
    "⚠️  This utility is experimental. Always review the changes made before committing them to your project. ⚠️",
  );
  log.warning("--------------------------------------------------");

  const cli = isInteractive()
    ? await group({
        dryRun: () =>
          confirm({
            message:
              "Would you like to run this migration as a dry run? No changes will be written to your project.",
            initialValue: true,
          }),
        dir: () =>
          text({
            message:
              "Please enter the path to your project (default is the current working directory):",
            initialValue: cwd(),
          }),
      })
    : {
        // If we are in a non-interactive terminal then use defaults
        dryRun: false,
        dir: cwd(),
      };

  if (typeof cli.dryRun !== "boolean") {
    // User aborted the prompt
    return;
  }

  let project: Project;

  if (existsSync(`${cli.dir}/tsconfig.json`)) {
    project = new Project({
      tsConfigFilePath: `${cli.dir}/tsconfig.json`,
    });
  } else {
    project = new Project();
  }

  const s = spinner();

  project.addSourceFilesAtPaths([
    `${cli.dir}/src/**/*.html`,
    `${cli.dir}/src/**/*.ts`,
    `${cli.dir}/angular.json`,
  ]);

  try {
    await runStandaloneMigration({
      project,
      cliOptions: cli,
      dir: cli.dir,
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
