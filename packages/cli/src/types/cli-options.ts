export interface CliOptions {
  /**
   * If true, run using prompts.
   */
  interactive: boolean;

  /**
   * If true, run with initialize method.
   */
  initialize: boolean;

  /**
   * The path to the project.
   */
  projectPath: string;

  /**
   * The path to the icon file.
   */
  iconPath: string;

  /**
   * If true, run the schematic but do not commit changes.
   */
  dryRun: boolean;
}
