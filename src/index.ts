import type WorkoutConverterAdapter from "./adapter.ts";
import NextRepAdapter from "./adapters/nextrep.ts";
import StrongAdapter from "./adapters/strong.ts";
import type { AdapterInfo, WorkoutDataType } from "./schema.ts";

export const adapters: WorkoutConverterAdapter[] = [
  new NextRepAdapter(),
  new StrongAdapter(),
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
 * convertData(myBlob, "Strong", "NextRep");
 * @param {Blob} input - The input data to be converted.
 * @param {string} fromAdapterName - The name of the adapter to convert data from.
 * @param {string} toAdapterName - The name of the adapter to convert data to.
 * @returns {Blob} Returns the converted data as a blob.
 */
export async function convertData(input: Blob, fromAdapterName: string, toAdapterName: string): Promise<Blob> {
  const fromAdapter = getAdapterByName(fromAdapterName);
  const toAdapter = getAdapterByName(toAdapterName);

  if (fromAdapter === null) {
    throw new Error("Could not find input adapter");
  }

  if (toAdapter === null) {
    throw new Error("Could not find output adapter");
  }

  const intermediate = await fromAdapter.importWorkoutData(input);
  return toAdapter.exportWorkoutData(intermediate);
}
