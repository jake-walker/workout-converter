import { assertEquals } from "@std/assert";
import NextRepAdapter from "../../src/adapters/nextrep.ts";
import { workoutData } from "../../src/schema.ts";
import sampleData from "../sample_data/converted.ts";
import { readSampleFileAsBlob } from "../helpers.ts";

Deno.test("NextRepAdapter imports data correctly", async () => {
  const adapter = new NextRepAdapter();

  const data = await adapter.importWorkoutData(await readSampleFileAsBlob("nextrep.json"));

  assertEquals(workoutData.safeParse(data).error, undefined);

  const sampleDataCopy = { ...sampleData };

  sampleDataCopy.workouts.forEach((workout, workoutIndex) => {
    workout.exercises.forEach((exercise, exerciseIndex) => {
      exercise.sets.forEach((_set, setIndex) => {
        delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].userNotes;
      });
    });
  });

  assertEquals(data.workouts, sampleDataCopy.workouts);
  assertEquals(data.templates, sampleDataCopy.templates);
});

Deno.test("NextRepAdapter exports sample data correctly", async () => {
  const adapter = new NextRepAdapter();

  const data = await adapter.exportWorkoutData(sampleData);
  const expected = await readSampleFileAsBlob("nextrep.json");

  const jsonData = JSON.parse(await data.text());
  const jsonExpected = JSON.parse(await expected.text());

  assertEquals(jsonData.workouts, jsonExpected.workouts);
});
