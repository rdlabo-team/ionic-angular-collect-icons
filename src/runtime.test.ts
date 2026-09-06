import { afterEach, describe, expect, it, vi } from "vitest";

const { addIcons, isDevMode } = vi.hoisted(() => ({
  addIcons: vi.fn(),
  isDevMode: vi.fn(),
}));

vi.mock("@angular/core", () => ({ isDevMode }));
vi.mock("ionicons", () => ({ addIcons }));
vi.mock("./all-icons.mjs", () => ({
  default: { add: "all-add", close: "all-close" },
}));

import { initializeIonicons } from "./runtime";

describe("initializeIonicons", () => {
  afterEach(() => {
    addIcons.mockClear();
    isDevMode.mockReset();
  });

  it("registers only collected icons in production", async () => {
    isDevMode.mockReturnValue(false);
    const collected = { add: "collected-add" };

    await initializeIonicons(collected);

    expect(addIcons).toHaveBeenCalledTimes(1);
    expect(addIcons).toHaveBeenCalledWith(collected);
  });

  it("registers collected icons before the complete development catalog", async () => {
    isDevMode.mockReturnValue(true);
    const collected = { add: "collected-add" };

    const initialized = initializeIonicons(collected);

    expect(addIcons).toHaveBeenNthCalledWith(1, collected);
    await initialized;
    expect(addIcons).toHaveBeenNthCalledWith(2, {
      add: "all-add",
      close: "all-close",
    });
  });
});
