import { describe, test, expect } from "vitest";
import NextRepAdapter from "./nextrep";
import { readFileBlob } from "../helpers";
import { workoutData } from "../schema";
import sampleData from "../../sample_data/converted";

describe("NextRepAdapter", () => {
  const adapter = new NextRepAdapter();

  test("imports sample data correctly", async () => {
    const data = await adapter.importWorkoutData(readFileBlob("./sample_data/nextrep.json"));

    expect(workoutData.safeParse(data).error).toBeUndefined();

    const sampleDataCopy = sampleData;

    sampleDataCopy.workouts.forEach((workout, workoutIndex) => {
      workout.exercises.forEach((exercise, exerciseIndex) => {
        exercise.sets.forEach((set, setIndex) => {
          delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].userNotes;
        });
      });
    });

    expect(data.workouts).toEqual(sampleDataCopy.workouts);
    expect(data.templates).toEqual(sampleDataCopy.templates);
  });

  test("exports sample data correctly", async () => {
    const data = await adapter.exportWorkoutData(sampleData);
    const expected = readFileBlob("./sample_data/nextrep.json");

    const jsonData = JSON.parse(await data.text());
    const jsonExpected = JSON.parse(await expected.text());

    expect(jsonData.workouts).toEqual(jsonExpected.workouts);
  });
});
