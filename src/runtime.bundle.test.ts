import { build, type Metafile } from "esbuild";
import { describe, expect, it } from "vitest";

const DISTRIBUTED_CATALOG = /(?:^|\/)dist\/all-icons\.mjs$/;

const getDistributedCatalogBytes = (
  output: Metafile["outputs"][string],
): number =>
  Object.entries(output.inputs).reduce(
    (total, [inputPath, input]) =>
      total +
      (DISTRIBUTED_CATALOG.test(inputPath.replaceAll("\\", "/"))
        ? input.bytesInOutput
        : 0),
    0,
  );

const bundleRuntime = async () =>
  build({
    bundle: true,
    external: ["@angular/core"],
    format: "esm",
    metafile: true,
    minify: true,
    platform: "browser",
    splitting: true,
    stdin: {
      contents: `
        import { initializeIonicons } from "./dist/runtime.mjs";
        import { add } from "ionicons/icons";
        void initializeIonicons({ add });
      `,
      loader: "ts",
      resolveDir: process.cwd(),
      sourcefile: "runtime-bundle-entry.ts",
    },
    treeShaking: true,
    write: false,
    outdir: "out",
  });

describe("initializeIonicons production bundle", () => {
  it("keeps the distributed catalog out of the initial entry", async () => {
    const production = await bundleRuntime();
    const outputs = Object.entries(production.metafile.outputs);
    const entry = outputs.find(
      ([, output]) => output.entryPoint === "runtime-bundle-entry.ts",
    );
    expect(entry).toBeDefined();

    const [, entryOutput] = entry!;
    const catalogImport = entryOutput.imports.find(
      (imported) => imported.kind === "dynamic-import",
    );
    expect(catalogImport).toBeDefined();
    expect(entryOutput.bytes).toBeLessThan(100_000);
    expect(getDistributedCatalogBytes(entryOutput)).toBe(0);
  });

  it("ships the distributed catalog behind a dynamic import", async () => {
    const production = await bundleRuntime();
    const entryOutput = Object.values(production.metafile.outputs).find(
      (output) => output.entryPoint === "runtime-bundle-entry.ts",
    );
    const catalogImport = entryOutput?.imports.find(
      (imported) => imported.kind === "dynamic-import",
    );
    const catalogOutput = catalogImport
      ? production.metafile.outputs[catalogImport.path]
      : undefined;

    expect(catalogOutput).toBeDefined();
    expect(catalogOutput!.bytes).toBeGreaterThan(500_000);
    expect(getDistributedCatalogBytes(catalogOutput!)).toBeGreaterThan(500_000);
  });
});
