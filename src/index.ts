import WorkoutConverterAdapter from "./adapter";
import NextRepAdapter from "./adapters/nextrep";
import StrongAdapter from "./adapters/strong";
import { AdapterInfo } from "./schema";

const adapters: WorkoutConverterAdapter[] = [
  new NextRepAdapter(),
  new StrongAdapter(),
];

export function getAdapterInfo(): AdapterInfo[] {
  return adapters.map((a) => a.getInfo());
}

function getAdapterByName(name: string): WorkoutConverterAdapter | null {
  return adapters.find((a) => a.getInfo().title == name) ?? null;
}

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
