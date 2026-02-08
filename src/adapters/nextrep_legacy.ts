import { z } from "zod";
import type WorkoutConverterAdapter from "../adapter.ts";
import type { AdapterInfo, WorkoutDataType } from "../schema.ts";
import { randomUUID, uuidArray } from "../helpers.ts";

const SUPPORTED_SCHEMA = 10;

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
      notes: z.string().nullable(),
      supersetGroup: z.string().nullable(),
      sets: z.array(z.object({
        reps: z.number().int().finite().nullable(),
        weight: z.number().finite().nullable(),
        duration: z.number().int().finite().nullable(),
        speed: z.number().finite().nullable(),
        resistanceLevel: z.number().int().nullable(),
        restTime: z.number().finite().nullable(),
        completed: z.boolean(),
      }))
    }))
  }))
});

export default class NextRepLegacyAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: "NextRep (v1)",
      description: "Convert workout and template data to and from the format used for version 1 of the NextRep app.",
      website: "https://nextrep.app",
    }
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    const parsed = nextRepDataExport.parse(JSON.parse(await data.text()));

    const allExercises: Set<string> = new Set(parsed.workouts.flatMap((w) => w.exercises.map((e) => e.exerciseName)));
    const exerciseIds = uuidArray(allExercises);

    const allSupersetId: Set<string> = new Set(parsed.workouts.flatMap((w) => w.exercises.map((e) => e.supersetGroup)).filter((s) => s !== null));
    const supersetIds = uuidArray(allSupersetId);

    const internalData: WorkoutDataType = {
      metadata: {
        name: `${this.getInfo().title} Import`,
        notes: `From NextRep ${parsed.appVersion}+${parsed.appBuildNumber} (${parsed.schemaVersion}). Contains ${parsed.workouts.length} workouts.`
      },
      exercises: Object.entries(exerciseIds).map(([exerciseName, exerciseId]) => ({
        id: exerciseId,
        name: exerciseName,
        exerciseType: "weightReps"
      })),
      workouts: parsed.workouts.filter((w) => w.isTemplate === false).map((w) => ({
        id: randomUUID(),
        name: w.title,
        startedAt: w.createdAt,
        endedAt: w.completedAt ?? undefined,
        rpe: w.rpe ?? undefined,
        notes: undefined,
        exercises: w.exercises.map((e) => ({
          id: randomUUID(),
          exerciseId: exerciseIds[e.exerciseName],
          notes: e.notes ?? undefined,
          supersetId: e.supersetGroup !== null ? supersetIds[e.supersetGroup] : undefined,
          sets: e.sets.map((s) => ({
            id: randomUUID(),
            type: "regular",
            duration: s.duration ?? undefined,
            reps: (s.reps !== null && s.reps > 0) ? s.reps : undefined,
            weight: s.weight ?? undefined,
            completed: s.completed,
            restTime: s.restTime ?? undefined,
            distance: undefined
          }))
        }))
      })),
      templates: parsed.workouts.filter((w) => w.isTemplate === true).map((w) => ({
        id: randomUUID(),
        name: w.title,
        createdAt: w.createdAt,
        exercises: w.exercises.map((e) => ({
          id: randomUUID(),
          exerciseId: exerciseIds[e.exerciseName],
          notes: e.notes ?? undefined,
          supersetId: e.supersetGroup !== null ? supersetIds[e.supersetGroup] : undefined,
          sets: e.sets.map((s) => ({
            id: randomUUID(),
            type: "regular",
            defaultDuration: s.duration ?? undefined,
            defaultReps: s.reps ?? undefined,
            defaultWeight: s.weight ?? undefined,
            restTime: s.restTime ?? undefined
          }))
        }))
      })),
    };

    return internalData;
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const toExport: z.infer<typeof nextRepDataExport> = {
      appVersion: "x.x.x",
      appBuildNumber: "x",
      exportDate: new Date(),
      schemaVersion: SUPPORTED_SCHEMA.toString(),
      workouts: []
    };

    for (const template of data.templates) {
      toExport.workouts.push({
        title: template.name,
        createdAt: template.createdAt,
        completedAt: null,
        isTemplate: true,
        rpe: null,
        exercises: template.exercises.map((e) => ({
          exerciseName: data.exercises.find((def) => def.id == e.exerciseId)?.name ?? "Unknown Exercise",
          notes: e.notes ?? null,
          supersetGroup: e.supersetId ?? null,
          sets: e.sets.map((s) => ({
            reps: s.defaultReps ?? null,
            weight: s.defaultWeight ?? null,
            duration: s.defaultDuration ?? null,
            speed: null,
            resistanceLevel: null,
            restTime: s.restTime ?? null,
            completed: false
          }))
        }))
      })
    }

    for (const workout of data.workouts) {
      toExport.workouts.push({
        title: workout.name,
        createdAt: workout.startedAt,
        completedAt: workout.endedAt ?? null,
        isTemplate: false,
        rpe: workout.rpe ?? null,
        exercises: workout.exercises.map((e) => ({
          exerciseName: data.exercises.find((def) => def.id == e.exerciseId)?.name ?? "Unknown Exercise",
          notes: e.notes ?? null,
          supersetGroup: e.supersetId ?? null,
          sets: e.sets.map((s) => ({
            reps: s.reps ?? null,
            weight: s.weight ?? null,
            duration: s.duration ?? null,
            speed: null,
            resistanceLevel: null,
            restTime: s.restTime ?? null,
            completed: s.completed
          })),
        })),
      });
    }

    return Promise.resolve(new Blob([JSON.stringify(toExport)], { type: "application/json" }));
  }
}
