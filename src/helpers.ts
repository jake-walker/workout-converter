import fs from "fs";

export function readFileBlob(filename: string): Blob {
  const buffer = fs.readFileSync(filename);
  return new Blob([buffer]);
}

export function parseOptionalInt(value: any, excludeZero = false): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  try {
    let parsed = parseInt(value, 10);
    return parsed == 0 && excludeZero ? undefined : parsed;
  } catch (ex) {
    return undefined;
  }
}

export function parseOptionalFloat(value: any, excludeZero = false): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  try {
    let parsed = parseFloat(value);
    return parsed == 0 && excludeZero ? undefined : parsed;
  } catch (ex) {
    return undefined;
  }
}
