import { isDevMode } from "@angular/core";
import { addIcons } from "ionicons";

export type IoniconDictionary = Parameters<typeof addIcons>[0];

/**
 * Registers the collected icons synchronously and supplements them with the
 * complete Ionicons catalog from an isolated lazy bundle in Angular
 * development mode.
 */
export async function initializeIonicons(
  useIcons: IoniconDictionary,
): Promise<void> {
  addIcons(useIcons);

  if (isDevMode()) {
    const { default: allIcons } = await import("./all-icons.mjs");
    addIcons(allIcons);
  }
}
