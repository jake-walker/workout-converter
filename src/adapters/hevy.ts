// Copyright 2026 Jake Walker.
// SPDX-License-Identifier: GPL-3.0-only

import { parse, stringify } from "@std/csv";
import type WorkoutConverterAdapter from "../adapter.ts";
import type { AdapterInfo, SetType, WorkoutDataType } from "../schema.ts";
import {
  inferExerciseType,
  parseOptionalFloat,
  parseOptionalInt,
  randomUUID,
  uuidArray,
} from "../helpers.ts";
import { DateTime } from "ts-luxon";

type HevyColumn =
  | "title"
  | "start_time"
  | "end_time"
  | "description"
  | "exercise_title"
  | "superset_id"
  | "exercise_notes"
  | "set_index"
  | "set_type"
  | "weight_kg"
  | "reps"
  | "distance_km"
  | "duration_seconds"
  | "rpe";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export default class HevyAdapter implements WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    return {
      title: "Hevy",
      description:
        "Convert workout data to and from Hevy's CSV format. Hevy does not support the export of templates and importing to Hevy requires a Strong CSV file.",
      website: "https://www.hevyapp.com/",
    };
  }

  fromHevySetType(v: string): SetType {
    if (v.toLowerCase() == "normal") {
      return "regular";
    } else if (v.toLowerCase().startsWith("warm")) {
      return "warmup";
    } else {
      throw new Error(`Unexpected set type '${v}'`);
    }
  }

  toHevySetType(v: SetType): string {
    switch (v) {
      case "warmup":
        return "warm-up";
      default:
        return "normal";
    }
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    const parsed = parse(await data.text(), {
      skipFirstRow: true,
      strip: true,
    }) as Record<HevyColumn, string>[];

    const allExercises = uuidArray(
      new Set(parsed.map((r) => r["exercise_title"])),
    );
    const exerciseSetSample: {
      [id: string]:
        WorkoutDataType["workouts"][number]["exercises"][number]["sets"][
          number
        ];
    } = {};

    const workouts: { [d: string]: WorkoutDataType["workouts"][number] } = {};

    for (const row of parsed) {
      if (!(row["start_time"] in workouts)) {
        const startedAt = DateTime.fromFormat(row["start_time"], DATE_FORMAT);
        const endedAt = DateTime.fromFormat(row["end_time"], DATE_FORMAT);

        workouts[row["start_time"]] = {
          id: randomUUID(),
          name: row["title"],
          startedAt: startedAt.toJSDate(),
          endedAt: endedAt.toJSDate(),
          rpe: parseOptionalInt(row["rpe"]),
          notes: row["description"] === "" ? undefined : row["description"],
          exercises: [],
        };
      }

      const exercises = workouts[row["start_time"]].exercises;
      const exerciseId = allExercises[row["exercise_title"]];
      const exerciseIdx = exercises.findIndex((v) =>
        v.exerciseId === exerciseId
      );

      const set:
        WorkoutDataType["workouts"][number]["exercises"][number]["sets"][
          number
        ] = {
          id: randomUUID(),
          type: this.fromHevySetType(row["set_type"]),
          completed: true,
          notes: row["exercise_notes"] === ""
            ? undefined
            : row["exercise_notes"],
          weight: parseOptionalFloat(row["weight_kg"], true),
          reps: parseOptionalInt(row["reps"], true),
          distance: parseOptionalFloat(row["distance_km"], true),
          duration: parseOptionalInt(row["duration_seconds"], true),
        };

      if (!(exerciseId in exerciseSetSample)) {
        exerciseSetSample[exerciseId] = set;
      }

      if (exerciseIdx === -1) {
        exercises.push({
          id: randomUUID(),
          exerciseId,
          supersetId: row["superset_id"] != "" ? row["superset_id"] : undefined,
          sets: [set],
        });
      } else {
        exercises[exerciseIdx].sets.push(set);
      }
    }

    return {
      metadata: {
        name: `${this.getInfo().title} Import`,
        notes: `Imported ${parsed.length} rows`,
      },
      exercises: Object.entries(allExercises).map((
        [exerciseName, exerciseId],
      ) => ({
        id: exerciseId,
        name: exerciseName,
        exerciseType: exerciseId in exerciseSetSample
          ? inferExerciseType(exerciseSetSample[exerciseId])
          : "weightReps",
      })),
      templates: [],
      workouts: Object.values(workouts),
    };
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const rows: Record<HevyColumn, string>[] = [];

    for (const workout of data.workouts) {
      const formattedStartDate = DateTime.fromJSDate(workout.startedAt)
        .toFormat(DATE_FORMAT);
      const formattedEndDate = workout.endedAt != undefined
        ? DateTime.fromJSDate(workout.endedAt).toFormat(DATE_FORMAT)
        : formattedStartDate;

      for (const exercise of workout.exercises) {
        const exerciseName = data.exercises.find((e) =>
          e.id === exercise.exerciseId
        )?.name ?? "Unknown Exercise";

        for (const [index, set] of exercise.sets.entries()) {
          rows.push({
            title: workout.name,
            start_time: formattedStartDate,
            end_time: formattedEndDate,
            description: workout.notes || "",
            exercise_title: exerciseName,
            superset_id: exercise.supersetId || "",
            exercise_notes: set.notes || "",
            set_index: index.toString(),
            set_type: this.toHevySetType(set.type),
            weight_kg: set.weight?.toString() || "",
            reps: set.reps?.toString() || "",
            distance_km: set.distance?.toString() || "",
            duration_seconds: set.duration?.toString() || "",
            rpe: workout.rpe?.toString() || "",
          });
        }
      }
    }

    const csv = stringify(rows, {
      headers: true,
      columns: [
        "title",
        "start_time",
        "end_time",
        "description",
        "exercise_title",
        "superset_id",
        "exercise_notes",
        "set_index",
        "set_type",
        "weight_kg",
        "reps",
        "distance_km",
        "duration_seconds",
        "rpe",
      ],
    });

    return Promise.resolve(
      new Blob([csv.replaceAll("\r\n", "\n")], { type: "text/csv" }),
    );
  }
}
