// deno-lint-ignore-file no-explicit-any
export function parseOptionalInt(value: any, excludeZero = false): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  try {
    const parsed = parseInt(value, 10);
    return parsed == 0 && excludeZero ? undefined : parsed;
  } catch (_ex) {
    return undefined;
  }
}

export function parseOptionalFloat(value: any, excludeZero = false): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  try {
    const parsed = parseFloat(value);
    return parsed == 0 && excludeZero ? undefined : parsed;
  } catch (_ex) {
    return undefined;
  }
}
