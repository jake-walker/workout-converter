import { z } from "npm:zod@^3.24.2";

export type AdapterInfo = {
  title: string;
  description: string;
  website: string;
}

export type ConversionFilter = {
  excludeOlderThanDays?: number;
  excludeTemplates?: boolean;
  excludeWorkouts?: boolean;
}

export const workoutData = z.object({
  metadata: z.object({
    name: z.string(),
    notes: z.string(),
  }),
  exercises: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    exerciseType: z.enum(["weightReps", "timed", "cardio"]).default("weightReps")
  })),
  templates: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    createdAt: z.coerce.date(),
    exercises: z.array(z.object({
      id: z.string().uuid(),
      exerciseId: z.string().uuid(),
      notes: z.string().optional(),
      supersetId: z.string().uuid().optional(),
      sets: z.array(z.object({
        id: z.string().uuid(),
        defaultDistance: z.number().optional(),
        defaultDuration: z.number().int().optional(),
        defaultReps: z.number().int().optional(),
        defaultWeight: z.number().optional(),
        restTime: z.number().int().optional()
      }))
    }))
  })),
  workouts: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    startedAt: z.coerce.date(),
    endedAt: z.coerce.date().optional(),
    notes: z.string().optional(),
    rpe: z.number().int().min(0).max(10).optional(),
    exercises: z.array(z.object({
      id: z.string().uuid(),
      exerciseId: z.string().uuid(),
      notes: z.string().optional(),
      supersetId: z.string().uuid().optional(),
      sets: z.array(z.object({
        id: z.string().uuid(),
        notes: z.string().optional(),
        distance: z.number().optional(),
        duration: z.number().int().optional(),
        reps: z.number().int().optional(),
        weight: z.number().optional(),
        restTime: z.number().int().optional(),
        completed: z.boolean()
      }))
    }))
  }))
}).refine((schema) => {
  const allUsedExerciseIds = [
    ...schema.templates.flatMap((t) => t.exercises.map((e) => e.exerciseId)),
    ...schema.workouts.flatMap((w) => w.exercises.map((e) => e.exerciseId))
  ];
  const definedExerciseIds = schema.exercises.map((e) => e.id);

  return allUsedExerciseIds.every((id) => definedExerciseIds.includes(id));
}, {
  message: "Exercises inside templates and/or workouts are not defined"
});

export type WorkoutDataType = z.infer<typeof workoutData>;
