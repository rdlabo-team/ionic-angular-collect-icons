import { saveFileChanges } from "./log-utils";

import { describe, expect, it, vi } from "vitest";

describe("saveFileChanges", () => {
  it("should not save changes if dryRun is true", async () => {
    const sourceFile: any = {
      getFilePath: () => "foo.ts",
      getFullText: () => "foo",
      formatText: vi.fn(),
      save: vi.fn(),
    };

    const result = await saveFileChanges(sourceFile, { dryRun: true });

    expect(sourceFile.save).not.toHaveBeenCalled();
    expect(result).toBe("foo");
  });

  it("should save changes if dryRun is false", async () => {
    const sourceFile: any = {
      save: vi.fn(),
      getFullText: () => "foo",
      formatText: vi.fn(),
    };

    const result = await saveFileChanges(sourceFile, { dryRun: false });

    expect(sourceFile.save).toHaveBeenCalled();
    expect(result).toBe("foo");
  });

  it("can preserve surrounding formatting", async () => {
    const sourceFile: any = {
      save: vi.fn(),
      getFullText: () => "foo",
      formatText: vi.fn(),
    };

    await saveFileChanges(sourceFile, { dryRun: false }, { format: false });

    expect(sourceFile.formatText).not.toHaveBeenCalled();
    expect(sourceFile.save).toHaveBeenCalled();
  });
});
