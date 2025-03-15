import { parse, stringify } from "jsr:@std/csv@^1.0.5";
import type WorkoutConverterAdapter from "../adapter.ts";
import type { AdapterInfo, WorkoutDataType } from "../schema.ts";
import parseDuration from "parse-duration";
import { parseOptionalFloat, parseOptionalInt } from "../helpers.ts";
import { DateTime, Duration } from "ts-luxon";

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
      description: 'Workout converter for Strong strength training data. Please note Strong does not support export of templates.',
      website: 'https://strong.app/',
    }
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    const parsed = parse(await data.text(), {
      skipFirstRow: true,
      strip: true,
    }) as Record<StrongColumn, string>[];

    const workouts: { [d: string]: WorkoutDataType['workouts'][number] } = {};

    for (const row of parsed) {
      if (!(row["Date"] in workouts)) {
        const startedAt = DateTime.fromFormat(row["Date"].toUpperCase(), DATE_FORMAT);
        const durationMs = parseDuration(row["Duration"]) ?? 0;
        const endedAt = startedAt.plus(Duration.fromMillis(durationMs));

        workouts[row["Date"]] = {
          name: row["Workout Name"],
          startedAt: startedAt.toJSDate(),
          finishedAt: endedAt.toJSDate(),
          rpe: parseOptionalInt(row["RPE"]),
          exercises: [],
        }
      }

      const exercises = workouts[row["Date"]].exercises;
      const exerciseIdx = exercises.findIndex((v) => v.name === row["Exercise Name"]);

      const set: WorkoutDataType["workouts"][number]["exercises"][number]["sets"][number] = {
        completed: true,
        userNotes: row["Notes"] === "" ? undefined : row["Notes"],
        measurements: {
          weightKg: parseOptionalFloat(row["Weight"], true),
          reps: parseOptionalInt(row["Reps"], true),
          distanceKm: parseOptionalFloat(row["Distance"], true),
          durationSeconds: parseOptionalInt(row["Seconds"], true),
        }
      }

      if (exerciseIdx === -1) {
        exercises.push({
          name: row["Exercise Name"],
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
      templates: [],
      workouts: Object.values(workouts),
    }
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const rows: Record<StrongColumn, string>[] = [];

    for (const workout of data.workouts) {
      const formattedDate = DateTime.fromJSDate(workout.startedAt).toFormat(DATE_FORMAT);
      const duration = (workout.finishedAt ?? workout.startedAt).getTime() - workout.startedAt.getTime();

      for (const exercise of workout.exercises) {
        for (const [index, set] of exercise.sets.entries()) {
          rows.push({
            Date: formattedDate.toLowerCase(),
            "Workout Name": workout.name,
            Duration: `${duration / 60000}m`,
            "Exercise Name": exercise.name,
            "Set Order": (index + 1).toString(),
            "Weight": set.measurements.weightKg?.toString() || "0",
            "Reps": set.measurements.reps?.toString() || "0",
            Distance: set.measurements.distanceKm?.toString() || "0",
            Seconds: set.measurements.durationSeconds?.toString() || "0",
            Notes: set.userNotes || "",
            "Workout Notes": "",
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
