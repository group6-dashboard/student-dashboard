export type TaskType = "Assignment" | "Lecture" | "Lab" | "Exam Prep" | "Other";

export type AvailabilityDay =
  | "Mon"
  | "Tue"
  | "Wed"
  | "Thu"
  | "Fri"
  | "Sat"
  | "Sun";

export type StudyTask = {
  id: string;
  title: string;
  type: TaskType;

  // per-task constraints
  startDate: string;
  endDate: string;
  totalHours: number;
  maxHoursPerWeek?: number;
  availableDays?: AvailabilityDay[]; // UI only for now (not used by algorithm yet)
};

export type WeekBucket = {
  index: number;
  start: Date;
  end: Date;
  capacityHours: number; // usable hours after buffer
};

export type AllocationRow = {
  taskId: string;
  title: string;
  type: TaskType;
  hours: number;
  deadline: string;
  isAfterDeadline: boolean; // reserved for future extension
};

export type WeekAllocation = {
  week: WeekBucket;
  rows: AllocationRow[];
  usedHours: number;
  remainingHours: number;
};

export type TaskStatus = {
  taskId: string;
  requiredHours: number;
  allocatedTotalHours: number;
  remainingHours: number;
  deadline: string;
  risk: "OK" | "Deadline Risk";
};

export type PlanResult = {
  weeks: WeekAllocation[];
  taskStatus: TaskStatus[];
  totals: {
    totalRequired: number;
    totalCapacity: number;
    totalAllocated: number;
  };
  notices: Array<{
    kind: "warning" | "danger";
    message: string;
  }>;
};
