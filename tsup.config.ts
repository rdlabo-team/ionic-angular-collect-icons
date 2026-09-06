import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    target: "node22",
  },
  {
    dts: true,
    entry: ["src/runtime.ts"],
    external: ["./all-icons.mjs"],
    format: ["cjs", "esm"],
    target: "es2022",
  },
  {
    dts: false,
    entry: ["src/all-icons.mts"],
    format: ["esm"],
    minify: true,
    noExternal: [/^ionicons(?:\/.*)?$/],
    target: "es2022",
  },
]);
