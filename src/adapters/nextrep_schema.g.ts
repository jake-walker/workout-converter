import * as z from "zod";

// The type of exercise and corresponds to how the app will prompt for user input.

export const MeasurementTypeSchema = z.enum([
  "distance",
  "time",
  "weightReps",
]);
export type MeasurementType = z.infer<typeof MeasurementTypeSchema>;

export const SetTypeSchema = z.enum([
  "regular",
  "warmup",
]);
export type SetType = z.infer<typeof SetTypeSchema>;

export const ExerciseSchema = z.object({
  "description": z.string().optional(),
  "id": z.string(),
  "measurementType": MeasurementTypeSchema.optional(),
  "name": z.string(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

export const MetaSchema = z.object({
  "exportDate": z.coerce.date(),
  "nrBuildNumber": z.string(),
  "nrSchemaVersion": z.number(),
  "nrVersion": z.string(),
});
export type Meta = z.infer<typeof MetaSchema>;

export const TargetRepRangeSchema = z.object({
  "max": z.number(),
  "min": z.number(),
});
export type TargetRepRange = z.infer<typeof TargetRepRangeSchema>;

export const WorkoutSetSchema = z.object({
  "completed": z.boolean(),
  "timestamp": z.coerce.date().optional(),
  "id": z.string(),
  "type": SetTypeSchema,
  "distance": z.number().optional(),
  "duration": z.number().optional(),
  "reps": z.number().optional(),
  "restTime": z.number().optional(),
  "targetRepRange": TargetRepRangeSchema.optional(),
  "weight": z.number().optional(),
});
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;

export const TemplateSetSchema = z.object({
  "distance": z.number().optional(),
  "duration": z.number().optional(),
  "id": z.string(),
  "reps": z.number().optional(),
  "restTime": z.number().optional(),
  "targetRepRange": TargetRepRangeSchema.optional(),
  "type": SetTypeSchema,
  "weight": z.number().optional(),
});
export type TemplateSet = z.infer<typeof TemplateSetSchema>;

export const WorkoutExerciseSchema = z.object({
  "exerciseId": z.string(),
  "id": z.string(),
  "notes": z.string().optional(),
  "sets": z.array(WorkoutSetSchema),
  "supersetGroupId": z.string().optional(),
});
export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>;

export const TemplateExerciseSchema = z.object({
  "exerciseId": z.string(),
  "id": z.string(),
  "notes": z.string().optional(),
  "sets": z.array(TemplateSetSchema),
  "supersetGroupId": z.string().optional(),
  "warmupSetCount": z.number().optional(),
});
export type TemplateExercise = z.infer<typeof TemplateExerciseSchema>;

export const WorkoutSchema = z.object({
  "endTime": z.coerce.date().optional(),
  "exercises": z.array(WorkoutExerciseSchema),
  "id": z.string(),
  "name": z.string(),
  "notes": z.string().optional(),
  "rpe": z.number().optional(),
  "startTime": z.coerce.date(),
});
export type Workout = z.infer<typeof WorkoutSchema>;

export const TemplateSchema = z.object({
  "createdAt": z.coerce.date(),
  "exercises": z.array(TemplateExerciseSchema),
  "id": z.string(),
  "name": z.string(),
});
export type Template = z.infer<typeof TemplateSchema>;

export const NextRepExportSchema = z.object({
  "exercises": z.array(ExerciseSchema),
  "meta": MetaSchema,
  "templates": z.array(TemplateSchema),
  "workouts": z.array(WorkoutSchema),
});
export type NextRepExport = z.infer<typeof NextRepExportSchema>;
