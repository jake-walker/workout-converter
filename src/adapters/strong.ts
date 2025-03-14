import { parse, writeToString } from "fast-csv";
import WorkoutConverterAdapter from "../adapter";
import { AdapterInfo, WorkoutDataType } from "../schema";
import parseDuration from "parse-duration";
import { parseOptionalFloat, parseOptionalInt } from "../helpers";
import { DateTime, Duration } from "luxon";

interface StrongRow {
  "Date": string,
  "Workout Name": string,
  "Duration": string,
  "Exercise Name": string,
  "Set Order": string,
  "Weight": string,
  "Reps": string,
  "Distance": string,
  "Seconds": string,
  "Notes": string,
  "Workout Notes": string,
  "RPE": string,
}

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
    return new Promise((resolve, reject) => {
      const workouts: { [d: string]: WorkoutDataType['workouts'][number] } = {};

      const stream = data.stream();
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");
      const parser = parse({ headers: true });

      let rowCount = 0;


      parser.on("data", (row: StrongRow) => {
        rowCount += 1;

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
          userNotes: row["Notes"] == "" ? undefined : row["Notes"],
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
      });

      parser.on("end", () => {
        resolve({
          metadata: {
            name: `${this.getInfo().title} Import`,
            notes: `Imported ${rowCount} rows`
          },
          templates: [],
          workouts: Object.values(workouts),
        });
      })

      parser.on("error", (err) => {
        reject(err);
      });

      reader.read().then(function processText({ done, value }) {
        if (done) {
          parser.end();
          return;
        }

        parser.write(decoder.decode(value, { stream: true }));
        reader.read().then(processText);
      })
    });
  }

  exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    const rows: StrongRow[] = [];

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

    return new Promise((resolve, reject) => {
      writeToString(rows, { headers: true, quoteColumns: [false, true, false, true, false, false, false, false, false, true, true, false], quoteHeaders: false, })
        .then((str) => {
          const blob = new Blob([str, '\n'], { type: "text/csv" });
          resolve(blob);
        }).catch(err => {
          reject(err);
        });
    });
  }
}
