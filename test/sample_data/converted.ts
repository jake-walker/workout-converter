import type { WorkoutDataType } from "../../src/schema.ts";

const sampleData: WorkoutDataType = {
  metadata: {
    name: "Sample Workout Data",
    notes: "Sample Workout Data",
  },
  templates: [],
  workouts: [
    {
      name: "Test Workout A",
      startedAt: new Date(2025, 0, 30, 12, 34, 56),
      finishedAt: new Date(2025, 0, 30, 13, 23, 56),
      rpe: undefined,
      exercises: [
        {
          name: "Test Exercise A",
          sets: [
            {
              completed: true,
              measurements: {
                reps: 10,
                weightKg: 25.0,
                distanceKm: undefined,
                durationSeconds: undefined
              },
              userNotes: "Hello",
              restTime: 90,
            },
            {
              completed: true,
              measurements: {
                reps: 20,
                weightKg: 27.5,
                distanceKm: undefined,
                durationSeconds: undefined
              },
              userNotes: "World",
              restTime: 90,
            },
            {
              completed: true,
              measurements: {
                reps: 30,
                weightKg: 30.0,
                distanceKm: undefined,
                durationSeconds: undefined
              },
              userNotes: "12345",
              restTime: 90,
            }
          ]
        },
        {
          name: "Test Exercise B",
          sets: [
            {
              completed: true,
              restTime: 90,
              userNotes: undefined,
              measurements: {
                reps: 5,
                weightKg: 32.5,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            },
            {
              completed: true,
              restTime: 90,
              userNotes: undefined,
              measurements: {
                reps: 15,
                weightKg: 35.0,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            },
            {
              completed: true,
              restTime: 90,
              userNotes: undefined,
              measurements: {
                reps: 25,
                weightKg: 37.5,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            }
          ]
        }
      ]
    },
    {
      name: "Test Workout B",
      startedAt: new Date(2025, 0, 29, 17, 30, 0),
      finishedAt: new Date(2025, 0, 29, 18, 34, 0),
      rpe: undefined,
      exercises: [
        {
          name: "Test Exercise C",
          sets: [
            {
              completed: true,
              restTime: undefined,
              userNotes: undefined,
              measurements: {
                reps: 10,
                weightKg: 25.0,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            },
            {
              completed: true,
              restTime: undefined,
              userNotes: undefined,
              measurements: {
                reps: 20,
                weightKg: 27.5,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            },
            {
              completed: true,
              restTime: undefined,
              userNotes: undefined,
              measurements: {
                reps: 30,
                weightKg: 30.0,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            }
          ]
        },
        {
          name: "Test Exercise A",
          sets: [
            {
              completed: true,
              restTime: undefined,
              userNotes: undefined,
              measurements: {
                reps: 5,
                weightKg: 32.5,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            },
            {
              completed: true,
              restTime: undefined,
              userNotes: undefined,
              measurements: {
                reps: 15,
                weightKg: 35.0,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            },
            {
              completed: true,
              restTime: undefined,
              userNotes: undefined,
              measurements: {
                reps: 25,
                weightKg: 37.5,
                distanceKm: undefined,
                durationSeconds: undefined
              },
            }
          ]
        }
      ]
    }
  ]
};

export default sampleData;
