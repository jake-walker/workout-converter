import { assertEquals, assertObjectMatch } from "@std/assert";
import HevyAdapter from "../../src/adapters/hevy.ts";
import sampleData from "../sample_data/converted.ts";
import { workoutData } from "../../src/schema.ts";
import { normaliseUuids, readSampleFileAsBlob } from "../helpers.ts";

Deno.test("HevyAdapter imports sample data correctly", async () => {
  const adapter = new HevyAdapter();
  const data = normaliseUuids(
    await adapter.importWorkoutData(await readSampleFileAsBlob("hevy.csv")),
  );

  assertEquals(workoutData.safeParse(data).error, undefined);

  const sampleDataCopy = normaliseUuids(sampleData);

  sampleDataCopy.workouts.forEach((workout, workoutIndex) => {
    workout.exercises.forEach((exercise, exerciseIndex) => {
      delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex]
        .notes;
      exercise.sets.forEach((_set, setIndex) => {
        delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex]
          .sets[setIndex].restTime;
      });
    });
  });

  // deno-lint-ignore no-explicit-any
  assertObjectMatch(data.workouts, sampleDataCopy.workouts as any);
});

Deno.test("HevyAdapter exports sample data correctly", async () => {
  const adapter = new HevyAdapter();
  const data = await adapter.exportWorkoutData(sampleData);
  const expected = await readSampleFileAsBlob("hevy.csv");

  assertEquals(
    (await data.text()).replaceAll('"', ""),
    (await expected.text()).replaceAll('"', ""),
  );
});
