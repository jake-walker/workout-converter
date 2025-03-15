import { z } from "npm:zod@^3.24.2";
import type WorkoutConverterAdapter from "../adapter.ts";
import type { AdapterInfo, WorkoutDataType } from "../schema.ts";

const SUPPORTED_SCHEMA = 7;

const nextRepDataExport = z.object({
  appVersion: z.string(),
  appBuildNumber: z.string(),
  schemaVersion: z.literal(SUPPORTED_SCHEMA.toString()),
  exportDate: z.coerce.date(),
  workouts: z.array(z.object({
    title: z.string(),
    createdAt: z.coerce.date(),
    completedAt: z.coerce.date().nullable(),
    rpe: z.number().min(0).max(10).int().nullable(),
    isTemplate: z.boolean(),
    exercises: z.array(z.object({
      exerciseName: z.string(),
      sets: z.array(z.object({
        reps: z.number().int().finite().positive(),
        weight: z.number().finite(),
        restTime: z.number().finite().positive().nullable(),
        completed: z.boolean(),
      }))
    }))
  }))
});

export default class NextRepAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: "NextRep",
      description: "Workout converter for NextRep strength training data.",
      website: "https://nextrep.app",
    }
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    const parsed = nextRepDataExport.parse(JSON.parse(await data.text()));

    return {
      metadata: {
        name: `${this.getInfo().title} Import`,
        notes: `From NextRep ${parsed.appVersion}+${parsed.appBuildNumber} (${parsed.schemaVersion}). Contains ${parsed.workouts.length} workouts.`
      },
      workouts: parsed.workouts.filter((w) => w.isTemplate === false).map((w) => ({
        name: w.title,
        startedAt: w.createdAt,
        finishedAt: w.completedAt ?? undefined,
        rpe: w.rpe ?? undefined,
        exercises: w.exercises.map((e) => ({
          name: e.exerciseName,
          sets: e.sets.map((s) => ({
            completed: s.completed,
            restTime: s.restTime ?? undefined,
            measurements: {
              reps: s.reps,
              weightKg: s.weight,
              distanceKm: undefined,
              durationSeconds: undefined
            }
          }))
        }))
      })),
      templates: parsed.workouts.filter((w) => w.isTemplate === true).map((t) => ({
        name: t.title,
        exercises: t.exercises.map((e) => ({
          name: e.exerciseName,
          sets: e.sets.length,
        }))
      })),
    }
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const toExport: z.infer<typeof nextRepDataExport> = {
      appVersion: "x.x.x",
      appBuildNumber: "x",
      exportDate: new Date(),
      schemaVersion: SUPPORTED_SCHEMA.toString(),
      workouts: []
    };

    for (const workout of data.workouts) {
      toExport.workouts.push({
        title: workout.name,
        createdAt: workout.startedAt,
        completedAt: workout.finishedAt ?? null,
        isTemplate: false,
        rpe: workout.rpe ?? null,
        exercises: workout.exercises.map((e) => ({
          exerciseName: e.name,
          sets: e.sets.map((s) => ({
            reps: s.measurements.reps ?? 0,
            weight: s.measurements.weightKg ?? 0,
            restTime: s.restTime ?? null,
            completed: s.completed
          })),
        })),
      });
    }

    return Promise.resolve(new Blob([JSON.stringify(toExport)], { type: "application/json" }));
  }
}
