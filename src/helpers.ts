// deno-lint-ignore-file no-explicit-any
import type { WorkoutDataType } from "./schema.ts";

export function randomUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return uuid;
}


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

export function uuidArray<T extends string>(values: Set<T>): Record<T, string> {
  const output: Record<T, string> = {} as Record<T, string>;

  for (const v of values) {
    output[v] = randomUUID();
  }

  return output;
}

export function inferExerciseType(setData: WorkoutDataType["workouts"][number]["exercises"][number]["sets"][number]): WorkoutDataType["exercises"][number]["exerciseType"] {
  if (setData.distance !== undefined && setData.duration !== undefined) {
    return "cardio"
  } else if (setData.duration !== undefined) {
    return "timed"
  } else {
    return "weightReps"
  }
}

export function fractionalSecondsReplacer(key: any, value: any): any {
  if (typeof value === "string") {
    const isoWithFractionalSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (isoWithFractionalSeconds.test(value)) {
      return value.replace(/\.\d{3}Z$/, "Z");
    }
  }
  return value;
}
