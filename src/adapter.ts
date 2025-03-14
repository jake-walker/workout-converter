import { type AdapterInfo, type WorkoutDataType } from "./schema";

abstract class WorkoutConverterAdapter {
  getInfo(): AdapterInfo {
    throw new Error("Not implemented");
  }

  async importWorkoutData(data: Blob): Promise<WorkoutDataType> {
    throw new Error("Not implemented");
  }

  async exportWorkoutData(data: WorkoutDataType): Promise<Blob> {
    throw new Error("Not implemented");
  }
}

export default WorkoutConverterAdapter;
