import { z } from "zod";

export type AdapterInfo = {
  title: string;
  description: string;
  website: string;
}

export const workoutData = z.object({
  metadata: z.object({
    name: z.string(),
    notes: z.string(),
  }),
  workouts: z.array(z.object({
    name: z.string(),
    startedAt: z.date(),
    finishedAt: z.date().optional(),
    rpe: z.number().optional(),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.array(z.object({
        userNotes: z.string().optional(),
        completed: z.boolean().default(true),
        restTime: z.number().finite().positive().int().optional(),
        measurements: z.object({
          reps: z.number().positive().finite().int().optional(),
          weightKg: z.number().finite().optional(),
          distanceKm: z.number().finite().optional(),
          durationSeconds: z.number().finite().optional(),
        }),
      }))
    })),
  })),
  templates: z.array(z.object({
    name: z.string(),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.number().positive().int().finite(),
    }))
  }))
});

export type WorkoutDataType = z.infer<typeof workoutData>;
