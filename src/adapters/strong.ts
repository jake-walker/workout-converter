import { parse, stringify } from "jsr:@std/csv@^1.0.5";
import type WorkoutConverterAdapter from "../adapter.ts";
import type { AdapterInfo, WorkoutDataType } from "../schema.ts";
import parseDuration from "npm:parse-duration@^2.1.3";
import { inferExerciseType, parseOptionalFloat, parseOptionalInt, randomUUID, uuidArray } from "../helpers.ts";
import { DateTime, Duration } from "npm:ts-luxon@^6.0.0";

type StrongColumn =
  "Date" |
  "Workout Name" |
  "Duration" |
  "Exercise Name" |
  "Set Order" |
  "Weight" |
  "Reps" |
  "Distance" |
  "Seconds" |
  "Notes" |
  "Workout Notes" |
  "RPE";

const DATE_FORMAT = "yyyy-MM-dd h:mm:ss\u202fa";

export default class StrongAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: 'Strong',
      description: 'Convert workout data to and from Strong\'s CSV format. Please note Strong does not support the export of templates, or importing data back into the app.',
      website: 'https://strong.app',
    }
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    const parsed = parse(await data.text(), {
      skipFirstRow: true,
      strip: true,
    }) as Record<StrongColumn, string>[];

    const allExercises = uuidArray(new Set(parsed.map((r) => r["Exercise Name"])));
    const exerciseSetSample: { [id: string]: WorkoutDataType["workouts"][number]["exercises"][number]["sets"][number] } = {};

    const workouts: { [d: string]: WorkoutDataType['workouts'][number] } = {};

    for (const row of parsed) {
      if (!(row["Date"] in workouts)) {
        const startedAt = DateTime.fromFormat(row["Date"].toUpperCase(), DATE_FORMAT);
        const durationMs = parseDuration(row["Duration"]) ?? 0;
        const endedAt = startedAt.plus(Duration.fromMillis(durationMs));

        workouts[row["Date"]] = {
          id: randomUUID(),
          name: row["Workout Name"],
          startedAt: startedAt.toJSDate(),
          endedAt: endedAt.toJSDate(),
          rpe: parseOptionalInt(row["RPE"]),
          notes: row["Workout Notes"] === "" ? undefined : row["Workout Notes"],
          exercises: [],
        }
      }

      const exercises = workouts[row["Date"]].exercises;
      const exerciseId = allExercises[row["Exercise Name"]];
      const exerciseIdx = exercises.findIndex((v) => v.exerciseId === exerciseId);

      const set: WorkoutDataType["workouts"][number]["exercises"][number]["sets"][number] = {
        id: randomUUID(),
        completed: true,
        notes: row["Notes"] === "" ? undefined : row["Notes"],
        weight: parseOptionalFloat(row["Weight"], true),
        reps: parseOptionalInt(row["Reps"], true),
        distance: parseOptionalFloat(row["Distance"], true),
        duration: parseOptionalInt(row["Seconds"], true),
      }

      if (!(exerciseId in exerciseSetSample)) {
        exerciseSetSample[exerciseId] = set;
      }

      if (exerciseIdx === -1) {
        exercises.push({
          id: randomUUID(),
          exerciseId,
          supersetId: undefined,
          sets: [set]
        });
      } else {
        exercises[exerciseIdx].sets.push(set);
      }
    }

    return {
      metadata: {
        name: `${this.getInfo().title} Import`,
        notes: `Imported ${parsed.length} rows`
      },
      exercises: Object.entries(allExercises).map(([exerciseName, exerciseId]) => ({
        id: exerciseId,
        name: exerciseName,
        exerciseType: exerciseId in exerciseSetSample ? inferExerciseType(exerciseSetSample[exerciseId]) : "weightReps"
      })),
      templates: [],
      workouts: Object.values(workouts),
    }
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const rows: Record<StrongColumn, string>[] = [];

    for (const workout of data.workouts) {
      const formattedDate = DateTime.fromJSDate(workout.startedAt).toFormat(DATE_FORMAT);
      const duration = (workout.endedAt ?? workout.startedAt).getTime() - workout.startedAt.getTime();

      for (const exercise of workout.exercises) {
        const exerciseName = data.exercises.find((e) => e.id === exercise.exerciseId)?.name ?? "Unknown Exercise";

        for (const [index, set] of exercise.sets.entries()) {
          rows.push({
            Date: formattedDate.toLowerCase(),
            "Workout Name": workout.name,
            Duration: `${duration / 60000}m`,
            "Exercise Name": exerciseName,
            "Set Order": (index + 1).toString(),
            "Weight": set.weight?.toString() || "0",
            "Reps": set.reps?.toString() || "0",
            Distance: set.distance?.toString() || "0",
            Seconds: set.duration?.toString() || "0",
            Notes: set.notes || "",
            "Workout Notes": workout.notes || "",
            RPE: workout.rpe?.toString() || "",
          })
        }
      }
    }

    const csv = stringify(rows, {
      headers: true,
      columns: [
        "Date",
        "Workout Name",
        "Duration",
        "Exercise Name",
        "Set Order",
        "Weight",
        "Reps",
        "Distance",
        "Seconds",
        "Notes",
        "Workout Notes",
        "RPE"
      ],
    });

    return Promise.resolve(new Blob([csv.replaceAll("\r\n", "\n")], { type: "text/csv" }));
  }
}
