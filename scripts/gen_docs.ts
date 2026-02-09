// deno-lint-ignore-file no-import-prefix
import { md } from "npm:mdbox@0.1.1";
import { getAdapterInfo } from "../src/main.ts";
import { automd, defineGenerator } from "npm:automd@0.4.3";

Deno.mkdir("docs").catch((_) => {});

const adapterTable = defineGenerator({
  name: "adapter-table",
  generate() {
    return {
      contents: md.table({
        columns: ["Format", "Description"],
        rows: getAdapterInfo().map((
          a,
        ) => [md.bold(md.link(a.website, a.title)), a.description]),
      }),
    };
  },
});

await automd({
  generators: {
    "adapter-table": adapterTable,
  },
});
