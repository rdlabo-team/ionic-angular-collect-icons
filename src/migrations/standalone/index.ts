import type { Project } from "ts-morph";
import type { CliOptions } from "../../types/cli-options";
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
  /** Ask an interactive user before migrating a legacy initializer. */
  confirmInitializerMigration?: () => Promise<boolean>;
}

interface InitializerMigrationOptions {
  project: Project;
  cliOptions: CliOptions;
  confirmInitializerMigration?: () => Promise<boolean>;
}

export const migrateInitializerWithConsent = async ({
  project,
  cliOptions,
  confirmInitializerMigration,
}: InitializerMigrationOptions) => {
  const initializerResult = await initializeAddIcons(project, cliOptions);
  if (initializerResult !== "permission-required") {
    return initializerResult;
  }

  if (!confirmInitializerMigration) {
    log.warn(
      "A legacy Ionicons initializer was detected but cannot be changed without confirmation in this non-interactive environment.",
    );
    log.info("Use --migrate true to approve recognized migrations explicitly.");
    return initializerResult;
  }

  const approved = await confirmInitializerMigration();
  if (!approved) {
    log.info("The legacy Ionicons initializer was left unchanged.");
    return "declined" as const;
  }

  return initializeAddIcons(project, { ...cliOptions, migrate: true });
};

export const isSupportedIonicVersion = (version: string): boolean => {
  const match = /^(0|[1-9]\d*)\./.exec(version);
  return match !== null && Number(match[1]) >= 9;
};

export const runStandaloneMigration = async ({
  project,
  cliOptions,
  dir,
  spinner,
  confirmInitializerMigration,
}: StandaloneMigrationOptions) => {
  const hasIonicAngularMinVersion = await checkInstalledIonicVersion(dir);
  if (!hasIonicAngularMinVersion) {
    return false;
  }

  const initializerResult = await migrateInitializerWithConsent({
    project,
    cliOptions,
    confirmInitializerMigration,
  });

  spinner.start(`Migrating project located at: ${dir}`);
  const initializerWasProtected =
    initializerResult === "declined" ||
    initializerResult === "permission-required";
  if (cliOptions.initialize && !initializerWasProtected) {
    // remove addIcons method from component constructor
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
 * Verifies that the installed version of @ionic/angular is at least 9.0.0.
 * If the version cannot be detected, the user is prompted to continue.
 * If the version is less than 9.0.0, the migration is canceled.
 * @param dir The directory of the project to be migrated.
 * @returns True if the installed version of @ionic/angular is at least 9.0.0 or the user opted to continue, false otherwise.
 */
export async function checkInstalledIonicVersion(
  dir: string,
  getVersion = getActualPackageVersion,
) {
  const ionicAngularVersion = await getVersion(dir, "@ionic/angular");

  if (!ionicAngularVersion) {
    log.warn(
      "We could not detect the version of @ionic/angular installed in your project.",
    );
    log.warn("This migration requires @ionic/angular version 9.0.0 or later.");
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
    const logVersionError = () => {
      log.error(
        "This migration requires @ionic/angular version 9.0.0 or later.",
      );
      log.error("Install the latest version of @ionic/angular and try again.");
      log.error("Migration canceled.");
    };

    if (!isSupportedIonicVersion(ionicAngularVersion)) {
      logVersionError();
      return false;
    }
  }
  return true;
}
