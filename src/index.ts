import WorkoutConverterAdapter from "./adapter";
import NextRepAdapter from "./adapters/nextrep";
import StrongAdapter from "./adapters/strong";
import { AdapterInfo } from "./schema";

const adapters: WorkoutConverterAdapter[] = [
  new NextRepAdapter(),
  new StrongAdapter(),
];

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

function getAdapterByName(name: string): WorkoutConverterAdapter | null {
  return adapters.find((a) => a.getInfo().title == name) ?? null;
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
