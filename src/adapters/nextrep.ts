// Copyright 2026 Jake Walker.
// SPDX-License-Identifier: GPL-3.0-only

import type WorkoutConverterAdapter from "../adapter.ts";
import { fractionalSecondsReplacer } from "../helpers.ts";
import type { AdapterInfo, WorkoutDataType } from "../schema.ts";
import {
  type MeasurementType,
  type NextRepExport,
  NextRepExportSchema,
} from "./nextrep_schema.g.ts";

const SUPPORTED_SCHEMA = 1;

export default class NextRepAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: "NextRep",
      description:
        "Convert workout and template data to and from NextRep's JSON format.",
      website: "https://nextrep.app",
    };
  }

  private convertExportMeasurementType(
    val: MeasurementType | undefined,
  ): WorkoutDataType["exercises"][number]["exerciseType"] {
    if (val === "weightReps" || val === undefined) {
      return "weightReps";
    } else if (val === "distance") {
      return "cardio";
    } else if (val === "time") {
      return "timed";
    }

    throw new Error(`Failed to convert from measurement type \"${val}\"`);
  }

  private convertInternalMeasurementType(
    val: WorkoutDataType["exercises"][number]["exerciseType"],
  ): MeasurementType {
    if (val === "weightReps") {
      return "weightReps";
    } else if (val === "cardio") {
      return "distance";
    } else if (val === "timed") {
      return "time";
    }

    throw new Error(`Failed to convert from measurement type \"${val}\"`);
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    const parsed = NextRepExportSchema.parse(JSON.parse(await data.text()));

    return {
      metadata: {
        name: `${this.getInfo().title} Import`,
        notes:
          `From NextRep ${parsed.meta.nrVersion}+${parsed.meta.nrBuildNumber} (${parsed.meta.nrSchemaVersion}). Contains ${parsed.workouts.length} workouts.`,
      },
      exercises: parsed.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        exerciseType: this.convertExportMeasurementType(e.measurementType),
      })),
      workouts: parsed.workouts.map((w) => ({
        id: w.id,
        name: w.name,
        startedAt: w.startTime,
        endedAt: w.endTime,
        notes: w.notes,
        exercises: w.exercises.map((e) => ({
          id: e.id,
          exerciseId: e.exerciseId,
          notes: e.notes,
          supersetId: e.supersetGroupId,
          sets: e.sets.map((s) => ({
            id: s.id,
            type: s.type,
            distance: s.distance,
            duration: s.duration,
            reps: s.reps,
            weight: s.weight,
            restTime: s.restTime,
            completed: s.completed,
          })),
        })),
      })),
      templates: parsed.templates.map((t) => ({
        id: t.id,
        name: t.name,
        createdAt: t.createdAt,
        exercises: t.exercises.map((e) => ({
          id: e.id,
          exerciseId: e.exerciseId,
          notes: e.notes,
          supersetId: e.supersetGroupId,
          sets: e.sets.map((s) => ({
            id: s.id,
            type: s.type,
            defaultDistance: s.distance,
            defaultDuration: s.duration,
            defaultReps: s.reps,
            defaultWeight: s.weight,
            restTime: s.restTime,
          })),
        })),
      })),
    };
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const toExport: NextRepExport = {
      meta: {
        exportDate: new Date(),
        nrBuildNumber: "x",
        nrSchemaVersion: SUPPORTED_SCHEMA,
        nrVersion: "x.x.x",
      },
      exercises: data.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        measurementType: this.convertInternalMeasurementType(e.exerciseType),
      })),
      templates: data.templates.map((t) => ({
        id: t.id,
        name: t.name,
        createdAt: t.createdAt,
        exercises: t.exercises.map((e) => ({
          id: e.id,
          exerciseId: e.exerciseId,
          notes: e.notes,
          supersetGroupId: e.supersetId,
          sets: e.sets.map((s) => ({
            id: s.id,
            type: s.type,
            distance: s.defaultDistance,
            duration: s.defaultDuration,
            reps: s.defaultReps,
            weight: s.defaultWeight,
            restTime: s.restTime,
          })),
        })),
      })),
      workouts: data.workouts.map((w) => ({
        id: w.id,
        name: w.name,
        startTime: w.startedAt,
        endTime: w.endedAt,
        notes: w.notes,
        exercises: w.exercises.map((e) => ({
          id: e.id,
          exerciseId: e.exerciseId,
          notes: e.notes,
          supersetGroupId: e.supersetId,
          sets: e.sets.map((s) => ({
            id: s.id,
            type: s.type,
            distance: s.distance,
            duration: s.duration,
            reps: s.reps,
            weight: s.weight,
            restTime: s.restTime,
            completed: s.completed,
          })),
        })),
      })),
    };

    return Promise.resolve(
      new Blob([JSON.stringify(toExport, fractionalSecondsReplacer)], {
        type: "application/json",
      }),
    );
  }
}
