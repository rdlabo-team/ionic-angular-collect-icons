import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { getActualPackageVersion } from "./package-utils";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("getActualPackageVersion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null if package is not installed", async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    const actual = await getActualPackageVersion(
      "invalidDir",
      "@ionic/angular",
    );

    expect(actual).toBeNull();
  });

  it("should return null if package.json cannot be read", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFile).mockRejectedValue(new Error("Invalid JSON"));

    const actual = await getActualPackageVersion("validDir", "@ionic/angular");

    expect(actual).toBeNull();
  });

  it("should return the package version", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ version: "1.0.0" }));

    const actual = await getActualPackageVersion("validDir", "@ionic/angular");

    expect(actual).toBe("1.0.0");
  });

  it("should find a package hoisted above the project directory", async () => {
    const workspaceDir = resolve("workspace");
    const projectDir = join(workspaceDir, "projects", "mobile");
    const hoistedPackageJson = join(
      workspaceDir,
      "node_modules",
      "@ionic/angular",
      "package.json",
    );

    vi.mocked(existsSync).mockImplementation(
      (candidate) => candidate === hoistedPackageJson,
    );
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ version: "9.1.0" }));

    const actual = await getActualPackageVersion(projectDir, "@ionic/angular");

    expect(actual).toBe("9.1.0");
    expect(readFile).toHaveBeenCalledWith(hoistedPackageJson, {
      encoding: "utf-8",
    });
  });

  it("should prefer the package installed in the project directory", async () => {
    const workspaceDir = resolve("workspace");
    const projectDir = join(workspaceDir, "projects", "mobile");
    const projectPackageJson = join(
      projectDir,
      "node_modules",
      "@ionic/angular",
      "package.json",
    );

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ version: "9.0.0" }));

    await getActualPackageVersion(projectDir, "@ionic/angular");

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledWith(projectPackageJson, {
      encoding: "utf-8",
    });
  });
});
