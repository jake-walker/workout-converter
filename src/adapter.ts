// Copyright 2026 Jake Walker.
// SPDX-License-Identifier: GPL-3.0-only

// deno-lint-ignore-file no-unused-vars

import type { AdapterInfo, WorkoutDataType } from "./schema.ts";

abstract class WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    throw new Error("Not implemented");
  }

  importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    throw new Error("Not implemented");
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    throw new Error("Not implemented");
  }
}

export default WorkoutConverterAdapter;
