import { build, emptyDir } from "@deno/dnt";
import { copy } from "https://deno.land/std@0.224.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";

await emptyDir("./npm");
await copy("./test/sample_data", "./npm/script/test/sample_data", { overwrite: true });
await copy("./test/sample_data", "./npm/esm/test/sample_data", { overwrite: true });

const versionFile = await Deno.readTextFile(path.join(path.dirname(path.fromFileUrl(import.meta.url)), "../.release-please-manifest.json"));

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  rootTestDir: "./test",
  testPattern: "**/*.test.ts",
  filterDiagnostic(diagnostic) {
    return !diagnostic?.file?.fileName.includes("@std/assert");
  },
  test: false,
  shims: {
    deno: true,
  },
  package: {
    name: "@jakew/workout-converter",
    version: JSON.parse(versionFile)["."],
    description: "A workout data conversion tool.",
    license: "GPL-3.0-only",
    author: "Jake Walker <hi@jakew.me> (https://jakew.me)",
    repository: {
      type: "git",
      url: "git+https://github.com/jake-walker/workout-converter"
    },
    bugs: {
      url: "https://github.com/jake-walker/workout-converter/issues",
      email: "jake@nextrep.app"
    }
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  }
});

await Deno.writeTextFile("npm/.npmignore", "script/test/sample_data\nesm/test/sample_data", { append: true });
