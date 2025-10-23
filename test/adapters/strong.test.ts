import { assertEquals, assertObjectMatch } from "@std/assert";
import StrongAdapter from "../../src/adapters/strong.ts";
import sampleData from "../sample_data/converted.ts";
import { workoutData } from "../../src/schema.ts";
import { normaliseUuids, readSampleFileAsBlob } from "../helpers.ts";


Deno.test("StrongAdapter imports sample data correctly", async () => {
  const adapter = new StrongAdapter();
  const data = normaliseUuids(await adapter.importWorkoutData(await readSampleFileAsBlob("strong.csv")));

  assertEquals(workoutData.safeParse(data).error, undefined);

  const sampleDataCopy = normaliseUuids(sampleData);

  sampleDataCopy.workouts.forEach((workout, workoutIndex) => {
    workout.exercises.forEach((exercise, exerciseIndex) => {
      delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex].notes;
      exercise.sets.forEach((_set, setIndex) => {
        delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].restTime;
      });
    });
  });

  // deno-lint-ignore no-explicit-any
  assertObjectMatch(data.workouts, sampleDataCopy.workouts as any);
});

Deno.test("StrongAdapter exports sample data correctly", async () => {
  const adapter = new StrongAdapter();
  const data = await adapter.exportWorkoutData(sampleData);
  const expected = await readSampleFileAsBlob("strong.csv");

  assertEquals(await data.text(), (await expected.text()).replaceAll("\"", ""));
});
