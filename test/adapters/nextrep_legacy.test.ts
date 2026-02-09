import { assertEquals } from "@std/assert";
import NextRepLegacyAdapter from "../../src/adapters/nextrep_legacy.ts";
import { workoutData } from "../../src/schema.ts";
import sampleData from "../sample_data/converted.ts";
import { normaliseUuids, readSampleFileAsBlob } from "../helpers.ts";

Deno.test("NextRepLegacyAdapter imports data correctly", async () => {
  const adapter = new NextRepLegacyAdapter();

  const data = normaliseUuids(
    await adapter.importWorkoutData(
      await readSampleFileAsBlob("nextrep_legacy.json"),
    ),
  );

  assertEquals(workoutData.safeParse(data).error, undefined);

  const sampleDataCopy = normaliseUuids(sampleData);

  sampleDataCopy.workouts.forEach((workout, workoutIndex) => {
    workout.exercises.forEach((exercise, exerciseIndex) => {
      exercise.sets.forEach((_set, setIndex) => {
        delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex]
          .sets[setIndex].notes;
      });
    });
  });

  assertEquals(data.workouts, sampleDataCopy.workouts);
  assertEquals(data.templates, sampleDataCopy.templates);
});

Deno.test("NextRepLegacyAdapter exports sample data correctly", async () => {
  const adapter = new NextRepLegacyAdapter();

  const data = await adapter.exportWorkoutData(sampleData);
  const expected = await readSampleFileAsBlob("nextrep_legacy.json");

  const jsonData = JSON.parse(await data.text());
  const jsonExpected = JSON.parse(await expected.text());

  assertEquals(jsonData.workouts, jsonExpected.workouts);
});
