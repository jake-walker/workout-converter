import { assertEquals } from "@std/assert";
import WorkoutConverterAdapter from "../src/adapter.ts";
import { convertData } from "../src/index.ts";
import { AdapterInfo, workoutData, WorkoutDataType } from "../src/schema.ts";
import { DateTime } from "npm:ts-luxon@6";

const testData: WorkoutDataType = {
  metadata: {
    name: "Dummy Data",
    notes: "Dummy Notes"
  },
  templates: [
    { name: "Test template 1", exercises: [] },
    { name: "Test template 2", exercises: [] }
  ],
  workouts: [
    { name: "Test workout 1", startedAt: DateTime.now().minus({ hours: 1 }).toJSDate(), finishedAt: DateTime.now().toJSDate(), exercises: [] },
    { name: "Test workout 2", startedAt: DateTime.now().minus({ days: 2, hours: 1 }).toJSDate(), finishedAt: DateTime.now().minus({ days: 2 }).toJSDate(), exercises: [] },
    { name: "Test workout 3", startedAt: DateTime.now().minus({ days: 7, hours: 1 }).toJSDate(), finishedAt: DateTime.now().minus({ days: 7 }).toJSDate(), exercises: [] },
  ]
};

class DummyAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: "Dummy Adapter",
      description: "Test",
      website: "https://example.com"
    }
  }

  importWorkoutData(_data: Blob): Promise<WorkoutDataType> {
    return Promise.resolve({ ...testData });
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    return Promise.resolve(new Blob([JSON.stringify(data)], { type: "application/json" }));
  }
}

async function parseJsonExport(blob: Blob): Promise<WorkoutDataType> {
  return workoutData.parse(JSON.parse(await blob.text()));
}

Deno.test("no filters does not alter data", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter);
  const actual = await parseJsonExport(converted)

  assertEquals(actual, testData);
});

Deno.test("excludeOlderThanDays filter removes old workouts", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter, {
    excludeOlderThanDays: 5
  });
  const actual = await parseJsonExport(converted);

  assertEquals(actual, { ...testData, workouts: testData.workouts.slice(0, 2) });
});

Deno.test("excludeTemplates filter removes all templates", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter, {
    excludeTemplates: true
  });
  const actual = await parseJsonExport(converted);

  assertEquals(actual, { ...testData, templates: [] });
});

Deno.test("excludeWorkouts filter removes all workouts", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter, {
    excludeWorkouts: true
  });
  const actual = await parseJsonExport(converted);

  assertEquals(actual, { ...testData, workouts: [] });
});
