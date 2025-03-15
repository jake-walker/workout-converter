import * as path from "https://deno.land/std@0.224.0/path/mod.ts";

export async function readSampleFileAsBlob(filename: string): Promise<Blob> {
  const file = await Deno.readFile(path.join(path.dirname(path.fromFileUrl(import.meta.url)), '/sample_data/', filename));
  return new Blob([file]);
}
