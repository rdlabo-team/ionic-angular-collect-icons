import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/**
 * Looks up the installed package version in the closest node_modules directory.
 * Parent directories are also searched to support packages hoisted by npm
 * workspaces and other multi-project setups.
 *
 * @param dir The project directory.
 * @param packageName The name of the package to lookup.
 * @returns The version of the package or null if the package is not installed.
 */
export const getActualPackageVersion = async (
  dir: string,
  packageName: string,
) => {
  let currentDir = resolve(dir);
  let packageJsonPath: string | null = null;

  while (packageJsonPath === null) {
    const candidate = join(
      currentDir,
      "node_modules",
      packageName,
      "package.json",
    );

    if (existsSync(candidate)) {
      packageJsonPath = candidate;
      break;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  if (!packageJsonPath) {
    return null;
  }

  try {
    const packageJson = await readFile(packageJsonPath, { encoding: "utf-8" });
    const packageJsonContents = JSON.parse(packageJson);
    const version = packageJsonContents.version;

    return version;
  } catch (e) {
    return null;
  }
};
