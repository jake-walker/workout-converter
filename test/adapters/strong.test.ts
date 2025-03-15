import { expect, test, describe } from "vitest";
import StrongAdapter from "../../src/adapters/strong";
import { readFileBlob } from "../../src/helpers";
import sampleData from "../../sample_data/converted";
import { workoutData } from "../../src/schema";

describe("StrongAdapter", () => {
  const adapter = new StrongAdapter();

  test("imports sample data correctly", async () => {
    const data = await adapter.importWorkoutData(readFileBlob("./sample_data/strong.csv"));

    expect(workoutData.safeParse(data).error).toBeUndefined();

    const sampleDataCopy = sampleData;

    sampleDataCopy.workouts.forEach((workout, workoutIndex) => {
      workout.exercises.forEach((exercise, exerciseIndex) => {
        exercise.sets.forEach((set, setIndex) => {
          delete sampleDataCopy.workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].restTime;
        });
      });
    });

    expect(data.workouts).toEqual(sampleDataCopy.workouts);
  });

  test("exports sample data correctly", async () => {
    const data = await adapter.exportWorkoutData(sampleData);
    const expected = readFileBlob("./sample_data/strong.csv");

    expect(await data.text()).toEqual(await expected.text());
  });
});
