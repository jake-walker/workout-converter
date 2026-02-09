import { DateTime } from "ts-luxon";
import type WorkoutConverterAdapter from "./adapter.ts";
import NextRepAdapter from "./adapters/nextrep.ts";
import StrongAdapter from "./adapters/strong.ts";
import { workoutData, type AdapterInfo, type ConversionFilter, type WorkoutDataType } from "./schema.ts";
import NextRepLegacyAdapter from "./adapters/nextrep_legacy.ts";
import HevyAdapter from "./adapters/hevy.ts";

export const adapters: WorkoutConverterAdapter[] = [
  new NextRepAdapter(),
  new NextRepLegacyAdapter(),
  new StrongAdapter(),
  new HevyAdapter(),
];

export type { AdapterInfo, WorkoutConverterAdapter, WorkoutDataType };

/**
 * Get information about all available adapters.
 * @example
 * getAdapterInfo();
 * // -> [{"title": "NextRep", "description": "...", "website": "https://nextrep.app"}]
 * @returns {AdapterInfo[]} Returns information about all available adapters.
 */
export function getAdapterInfo(): AdapterInfo[] {
  return adapters.map((a) => a.getInfo());
}

/**
 * Get a single adapter by it's name.
 * @example
 * getAdapterByName("NextRep");
 * // -> WorkoutConverterAdapter
 * @param {string} name - The name of the adapter to get.
 * @returns {WorkoutConverterAdapter | null} Returns an instance of the adapter.
 */
export function getAdapterByName(name: string): WorkoutConverterAdapter | null {
  return adapters.find((a) => a.getInfo().title.toLowerCase() == name.toLowerCase()) ?? null;
}

/**
 * Perform data conversion using a specified input and output adapter.
 * @example
 * convertData(myBlob, getAdapterByName("Strong")!, getAdapterByName("NextRep")!);
 * @param {Blob} input - The input data to be converted.
 * @param {WorkoutConverterAdapter} fromAdapter - The adapter to convert data from.
 * @param {WorkoutConverterAdapter} toAdapter - The adapter to convert data to.
 * @param {ConversionFilter} filters - Filters that are applied after data is imported, and before it is exported.
 * @returns {Blob} Returns the converted data as a blob.
 */
export async function convertData(input: Blob, fromAdapter: WorkoutConverterAdapter, toAdapter: WorkoutConverterAdapter, filters?: ConversionFilter): Promise<Blob> {
  const intermediate = workoutData.parse(await fromAdapter.importWorkoutData(input));

  if (filters?.excludeOlderThanDays && filters.excludeOlderThanDays > 0) {
    const excludeBefore = DateTime.now().minus({ days: filters.excludeOlderThanDays }).toJSDate();
    intermediate.workouts = intermediate.workouts.filter((w) => w.startedAt >= excludeBefore);
  }

  if (filters?.excludeTemplates === true) {
    intermediate.templates = [];
  }

  if (filters?.excludeWorkouts === true) {
    intermediate.workouts = [];
  }

  return toAdapter.exportWorkoutData(intermediate);
}

if (import.meta.main) {
  (async () => {
    const args = Deno.args;

    if (args.length !== 3) {
      console.error("Usage: <filename> <from adapter> <to adapter>");
      Deno.exit(1);
    }

    const [filename, fromAdapterName, toAdapterName] = args;

    const input = new Blob([await Deno.readFile(filename)]);
    const fromAdapter = getAdapterByName(fromAdapterName);
    const toAdapter = getAdapterByName(toAdapterName);

    if (fromAdapter === null) {
      console.error(`${fromAdapterName} is not a known adapter name!`);
      Deno.exit(1);
    }

    if (toAdapter === null) {
      console.error(`${toAdapterName} is not a known adapter name!`);
      Deno.exit(1);
    }

    const result = await convertData(input, fromAdapter!, toAdapter!);

    console.log(await result.text());
  })();
}
