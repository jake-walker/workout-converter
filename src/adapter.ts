// Copyright 2026 Jake Walker.
// SPDX-License-Identifier: GPL-3.0-only

// deno-lint-ignore-file no-unused-vars

import type { AdapterInfo, WorkoutDataType } from "./schema.ts";

/**
 * @abstract
 * @class WorkoutConverterAdapter
 * @description Abstract base class for workout data adapters.
 *   Adapters are responsible for converting workout data between
 *   a specific format and the standardized `WorkoutDataType`.
 */
abstract class WorkoutConverterAdapter {
  /**
   * @method getInfo
   * @description Retrieves information about the adapter.
   * @returns {AdapterInfo} An object containing the adapter's title, description, and website.
   */
  getInfo(): AdapterInfo {
    throw new Error("Not implemented");
  }

  /**
   * @method importWorkoutData
   * @description Imports workout data from a Blob (specific format) into the standardized `WorkoutDataType`.
   * @param {Blob} data - The workout data in the adapter's specific format.
   * @returns {Promise<WorkoutDataType>} A promise that resolves with the standardized workout data.
   */
  importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    throw new Error("Not implemented");
  }

  /**
   * @method exportWorkoutData
   * @description Exports standardized `WorkoutDataType` into a Blob (specific format).
   * @param {WorkoutDataType} data - The standardized workout data.
   * @returns {Promise<Blob>} A promise that resolves with the workout data in the adapter's specific format.
   */
  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    throw new Error("Not implemented");
  }
}

export default WorkoutConverterAdapter;
