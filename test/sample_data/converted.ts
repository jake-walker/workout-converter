import type { WorkoutDataType } from "../../src/schema.ts";

const sampleData: WorkoutDataType = {
  metadata: {
    name: "Sample Workout Data",
    notes: "Sample Workout Data",
  },
  exercises: [
    {
      id: "4ff8059e-91c0-4064-bff1-07468d4a4d07",
      name: "Test Exercise A",
      exerciseType: "weightReps"
    },
    {
      id: "3a561a27-2739-47d3-904b-981484ba5bc9",
      name: "Test Exercise B",
      exerciseType: "weightReps"
    },
    {
      id: "4ebf45c4-1222-4ad3-b5fd-34917371dd9f",
      name: "Test Exercise C",
      exerciseType: "weightReps"
    }
  ],
  templates: [],
  workouts: [
    {
      id: "86532a0b-a71c-40bc-9e13-31e76d955935",
      name: "Test Workout A",
      startedAt: new Date(2025, 0, 30, 12, 34, 56),
      endedAt: new Date(2025, 0, 30, 13, 23, 56),
      rpe: undefined,
      notes: undefined,
      exercises: [
        {
          id: "3933b668-a664-42dc-82fe-6e59b627b2bd",
          exerciseId: "4ff8059e-91c0-4064-bff1-07468d4a4d07", // Test Exercise A
          notes: undefined,
          supersetId: undefined,
          sets: [
            {
              id: "0f8a5956-67f5-4fc3-8ffa-b441e1f2111d",
              type: "regular",
              completed: true,
              reps: 10,
              weight: 25.0,
              notes: "Hello",
              restTime: 90,
              duration: undefined,
              distance: undefined
            },
            {
              id: "263d4361-6198-445f-a15d-fbf6377ef114",
              type: "regular",
              completed: true,
              reps: 20,
              weight: 27.5,
              notes: "World",
              restTime: 90,
              duration: undefined,
              distance: undefined
            },
            {
              id: "24275166-6d95-4489-bda9-09278b30afbe",
              type: "regular",
              completed: true,
              reps: 30,
              weight: 30.0,
              notes: "12345",
              restTime: 90,
              duration: undefined,
              distance: undefined
            }
          ]
        },
        {
          id: "14bfd017-dff7-4481-9a68-4c8e0ebd2190",
          exerciseId: "3a561a27-2739-47d3-904b-981484ba5bc9", // Test Exercise B
          notes: undefined,
          supersetId: undefined,
          sets: [
            {
              id: "bc44d7e2-46d8-4fb1-819d-790c66b160ee",
              type: "regular",
              completed: true,
              restTime: 90,
              reps: 5,
              weight: 32.5,
              duration: undefined,
              distance: undefined
            },
            {
              id: "dfe9465c-ddf6-4f5f-af4f-640fdb6ad036",
              type: "regular",
              completed: true,
              restTime: 90,
              reps: 15,
              weight: 35.0,
              duration: undefined,
              distance: undefined
            },
            {
              id: "b430ddf8-5517-484d-ae1e-db405fe5a530",
              type: "regular",
              completed: true,
              restTime: 90,
              reps: 25,
              weight: 37.5,
              duration: undefined,
              distance: undefined
            }
          ]
        }
      ]
    },
    {
      id: "678f5b05-318d-4236-9a40-71f503ce82ec",
      name: "Test Workout B",
      startedAt: new Date(2025, 0, 29, 17, 30, 0),
      endedAt: new Date(2025, 0, 29, 18, 34, 0),
      rpe: undefined,
      notes: undefined,
      exercises: [
        {
          id: "933958a2-4501-4dd4-9567-fe841e9deaa3",
          exerciseId: "4ebf45c4-1222-4ad3-b5fd-34917371dd9f", // Test Exercise C
          notes: undefined,
          supersetId: undefined,
          sets: [
            {
              id: "cb63c837-14c0-489f-bf7c-6e62add70856",
              type: "regular",
              completed: true,
              reps: 10,
              weight: 25.0,
              duration: undefined,
              restTime: undefined,
              distance: undefined
            },
            {
              id: "f4608a0e-3d17-43e4-9613-668d21dd851a",
              type: "regular",
              completed: true,
              reps: 20,
              weight: 27.5,
              duration: undefined,
              restTime: undefined,
              distance: undefined
            },
            {
              id: "d7864425-b4a2-4765-a896-c490da9646a0",
              type: "regular",
              completed: true,
              reps: 30,
              weight: 30.0,
              duration: undefined,
              restTime: undefined,
              distance: undefined
            }
          ]
        },
        {
          id: "74bc13b3-2e0e-4912-b40b-79084ccca37c",
          exerciseId: "4ff8059e-91c0-4064-bff1-07468d4a4d07", // Test Exercise A
          notes: undefined,
          supersetId: undefined,
          sets: [
            {
              id: "6cb5971b-f0b1-4362-8f64-c06f646b50bf",
              type: "regular",
              completed: true,
              reps: 5,
              weight: 32.5,
              duration: undefined,
              restTime: undefined,
              distance: undefined
            },
            {
              id: "7fca1b04-83ce-4f9d-9177-93d7870c0b3e",
              type: "regular",
              completed: true,
              reps: 15,
              weight: 35.0,
              duration: undefined,
              restTime: undefined,
              distance: undefined
            },
            {
              id: "1c28b52a-032c-427c-bbd4-07d5a537d389",
              type: "regular",
              completed: true,
              reps: 25,
              weight: 37.5,
              duration: undefined,
              restTime: undefined,
              distance: undefined
            }
          ]
        }
      ]
    }
  ]
};

export default sampleData;
