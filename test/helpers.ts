import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import type { WorkoutDataType } from "../src/schema.ts";

export async function readSampleFileAsBlob(filename: string): Promise<Blob> {
  const file = await Deno.readFile(path.join(path.dirname(path.fromFileUrl(import.meta.url)), '/sample_data/', filename));
  return new Blob([file]);
}

function createSequentialUuidGenerator(startCounter = 0) {
  let counter = startCounter;

  return function generate() {
    counter++;

    const hexCounter = counter.toString(16).padStart(32, '0');
    const p1 = hexCounter.substring(0, 8);
    const p2 = hexCounter.substring(8, 12);
    const p3 = hexCounter.substring(12, 16);
    const p4 = hexCounter.substring(16, 20);
    const p5 = hexCounter.substring(20, 32);

    return `${p1}-${p2}-${p3}-${p4}-${p5}`;
  }
}

export function normaliseUuids(exportData: WorkoutDataType): WorkoutDataType {
  const output: WorkoutDataType = { ...exportData };

  const generateUuid = createSequentialUuidGenerator();

  const exerciseMap = Object.fromEntries(exportData.exercises.map((e) => [e.id, generateUuid()]));

  for (let i = 0; i < output.exercises.length; i++) {
    output.exercises[i].id = exerciseMap[output.exercises[i].id];
  }

  for (let i = 0; i < output.templates.length; i++) {
    output.templates[i].id = generateUuid();

    for (let j = 0; j < output.templates[i].exercises.length; j++) {
      output.templates[i].exercises[j].id = generateUuid();
      output.templates[i].exercises[j].exerciseId = exerciseMap[output.templates[i].exercises[j].exerciseId];

      for (let k = 0; k < output.templates[i].exercises[j].sets.length; k++) {
        output.templates[i].exercises[j].sets[k].id = generateUuid();
      }
    }
  }

  for (let i = 0; i < output.workouts.length; i++) {
    output.workouts[i].id = generateUuid();

    for (let j = 0; j < output.workouts[i].exercises.length; j++) {
      output.workouts[i].exercises[j].id = generateUuid();
      output.workouts[i].exercises[j].exerciseId = exerciseMap[output.workouts[i].exercises[j].exerciseId];

      for (let k = 0; k < output.workouts[i].exercises[j].sets.length; k++) {
        output.workouts[i].exercises[j].sets[k].id = generateUuid();
      }
    }
  }

  return output
}
