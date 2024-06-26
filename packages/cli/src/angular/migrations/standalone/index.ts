import type { Project } from "ts-morph";
import type { CliOptions } from "../../../types/cli-options";
import { removeAddIcons } from "./0001-remove-add-icons";
import { generateUseIcons } from "./0002-generate-use-icons";

import { confirm, group, log, spinner } from "@clack/prompts";
import { getActualPackageVersion } from "../../utils/package-utils";
import { initializeAddIcons } from "./0000-initialize-add-icons";

interface StandaloneMigrationOptions {
  /**
   * The project instance. Contains the source files to be migrated.
   */
  project: Project;
  /**
   * The user-specified CLI options.
   */
  cliOptions: CliOptions;
  /**
   * The user-specified directory for running the migration.
   */
  dir: string;
  /**
   * The spinner instance for logging progress.
   */
  spinner: ReturnType<typeof spinner>;
}

export const runStandaloneMigration = async ({
  project,
  cliOptions,
  dir,
  spinner,
}: StandaloneMigrationOptions) => {
  const hasIonicAngularMinVersion = await checkInstalledIonicVersion(dir);
  if (!hasIonicAngularMinVersion) {
    return false;
  }

  spinner.start(`Migrating project located at: ${dir}`);

  if (cliOptions.initialize) {
    // remove addIcons method from component constructor
    await initializeAddIcons(project, cliOptions);
    await removeAddIcons(project, cliOptions);
  }
  // Migrate components using Ionic components
  await generateUseIcons(project, cliOptions);

  spinner.stop(`Project migration at ${dir} completed successfully.`);

  log.success(
    "We recommend reviewing the changes made by this migration and formatting your code (e.g., with Prettier) before committing.",
  );

  return true;
};

/**
 * Verifies that the installed version of @ionic/angular is at least 7.5.0.
 * If the version cannot be detected, the user is prompted to continue.
 * If the version is less than 7.5.0, the user is prompted to install the latest version.
 * @param dir The directory of the project to be migrated.
 * @returns True if the installed version of @ionic/angular is at least 7.5.0 or the user opted to continue, false otherwise.
 */
async function checkInstalledIonicVersion(dir: string) {
  const ionicAngularVersion = await getActualPackageVersion(
    dir,
    "@ionic/angular",
  );

  if (!ionicAngularVersion) {
    log.warn(
      "We could not detect the version of @ionic/angular installed in your project.",
    );
    log.warn(
      "This migration requires @ionic/angular version of 7.5.0 or later.",
    );
    log.warn("Do you want to proceed anyway?");

    const { continue: shouldContinue } = await group({
      continue: () =>
        confirm({
          message: "Continue?",
          initialValue: false,
        }),
    });

    if (!shouldContinue || typeof shouldContinue !== "boolean") {
      log.info("Migration canceled.");
      return false;
    }
  } else {
    const [major, minor] = ionicAngularVersion.split(".");
    const majorVersion = parseInt(major);
    const minorVersion = parseInt(minor);

    const logVersionError = () => {
      log.error(
        "This migration requires an @ionic/angular version of v7.5.0 or greater.",
      );
      log.error("Install the latest version of @ionic/angular and try again.");
      log.error("Migration canceled.");
    };

    if (majorVersion < 7) {
      logVersionError();
      return false;
    }

    // only need to add if is major v7 then compare with minor 5.
    if (majorVersion == 7 && minorVersion < 5) {
      logVersionError();
      return false;
    }
  }
  return true;
}
