// Copyright 2026 Jake Walker.
// SPDX-License-Identifier: GPL-3.0-only

import { assertEquals } from "@std/assert";
import type WorkoutConverterAdapter from "../src/adapter.ts";
import { convertData } from "../src/main.ts";
import {
  type AdapterInfo,
  workoutData,
  type WorkoutDataType,
} from "../src/schema.ts";
import { DateTime } from "ts-luxon";

const testData: WorkoutDataType = {
  metadata: {
    name: "Dummy Data",
    notes: "Dummy Notes",
  },
  exercises: [],
  templates: [
    {
      id: "c46a3efc-7a01-4266-a15b-029d680973dd",
      name: "Test template 1",
      createdAt: new Date(),
      exercises: [],
    },
    {
      id: "d371aabf-0751-48f8-9396-754deabb4d16",
      name: "Test template 2",
      createdAt: new Date(),
      exercises: [],
    },
  ],
  workouts: [
    {
      id: "3234bb5e-c2ad-4c05-b5e0-91c03fcb88f9",
      name: "Test workout 1",
      startedAt: DateTime.now().minus({ hours: 1 }).toJSDate(),
      endedAt: DateTime.now().toJSDate(),
      exercises: [],
    },
    {
      id: "abd568b9-2a96-489e-9701-70c1aa17c1c8",
      name: "Test workout 2",
      startedAt: DateTime.now().minus({ days: 2, hours: 1 }).toJSDate(),
      endedAt: DateTime.now().minus({ days: 2 }).toJSDate(),
      exercises: [],
    },
    {
      id: "feddb55a-46d6-4caf-a33b-dd57a23e6f48",
      name: "Test workout 3",
      startedAt: DateTime.now().minus({ days: 7, hours: 1 }).toJSDate(),
      endedAt: DateTime.now().minus({ days: 7 }).toJSDate(),
      exercises: [],
    },
  ],
};

class DummyAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: "Dummy Adapter",
      description: "Test",
      website: "https://example.com",
    };
  }

  importWorkoutData(_data: Blob): Promise<WorkoutDataType> {
    return Promise.resolve({ ...testData });
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    return Promise.resolve(
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
  }
}

async function parseJsonExport(blob: Blob): Promise<WorkoutDataType> {
  return workoutData.parse(JSON.parse(await blob.text()));
}

Deno.test("no filters does not alter data", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter);
  const actual = await parseJsonExport(converted);

  assertEquals(actual, testData);
});

Deno.test("excludeOlderThanDays filter removes old workouts", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter, {
    excludeOlderThanDays: 5,
  });
  const actual = await parseJsonExport(converted);

  assertEquals(actual, {
    ...testData,
    workouts: testData.workouts.slice(0, 2),
  });
});

Deno.test("excludeTemplates filter removes all templates", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter, {
    excludeTemplates: true,
  });
  const actual = await parseJsonExport(converted);

  assertEquals(actual, { ...testData, templates: [] });
});

Deno.test("excludeWorkouts filter removes all workouts", async () => {
  const adapter = new DummyAdapter();
  const converted = await convertData(new Blob(), adapter, adapter, {
    excludeWorkouts: true,
  });
  const actual = await parseJsonExport(converted);

  assertEquals(actual, { ...testData, workouts: [] });
});
