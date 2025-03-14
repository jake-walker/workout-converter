import { WorkoutDataType } from "../src/schema";

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
      exercises: [
        {
          name: "Test Exercise A",
          sets: [
            {
              completed: true,
              measurements: {
                reps: 10,
                weightKg: 25.0,
              },
              userNotes: "Hello",
              restTime: 90,
            },
            {
              completed: true,
              measurements: {
                reps: 20,
                weightKg: 27.5,
              },
              userNotes: "World",
              restTime: 90,
            },
            {
              completed: true,
              measurements: {
                reps: 30,
                weightKg: 30.0,
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
              measurements: {
                reps: 5,
                weightKg: 32.5,
              },
            },
            {
              completed: true,
              restTime: 90,
              measurements: {
                reps: 15,
                weightKg: 35.0,
              },
            },
            {
              completed: true,
              restTime: 90,
              measurements: {
                reps: 25,
                weightKg: 37.5,
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
      exercises: [
        {
          name: "Test Exercise C",
          sets: [
            {
              completed: true,
              measurements: {
                reps: 10,
                weightKg: 25.0,
              },
            },
            {
              completed: true,
              measurements: {
                reps: 20,
                weightKg: 27.5,
              },
            },
            {
              completed: true,
              measurements: {
                reps: 30,
                weightKg: 30.0,
              },
            }
          ]
        },
        {
          name: "Test Exercise A",
          sets: [
            {
              completed: true,
              measurements: {
                reps: 5,
                weightKg: 32.5,
              },
            },
            {
              completed: true,
              measurements: {
                reps: 15,
                weightKg: 35.0,
              },
            },
            {
              completed: true,
              measurements: {
                reps: 25,
                weightKg: 37.5,
              },
            }
          ]
        }
      ]
    }
  ]
};

export default sampleData;
