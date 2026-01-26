import { parseISODate, weeksBetween } from "./date";
import type { PlanResult, StudyTask, WeekAllocation } from "./types";

// Scheme A defaults (hidden from UI)
const WEEKLY_HOURS = 40;
const BUFFER_PERCENT = 0; // change to 0 if you want no buffer

export function generateStudyPlan(tasks: StudyTask[]): PlanResult {
  if (tasks.length === 0) {
    return {
      weeks: [],
      taskStatus: [],
      totals: {
        totalRequired: 0,
        totalCapacity: 0,
        totalBuffer: 0,
        totalAllocated: 0,
      },
      notices: [],
    };
  }

  // derive plan period from tasks
  const planStart = minISO(tasks.map((t) => t.startDate));
  const planEnd = maxISO(tasks.map((t) => t.endDate));

  const usablePerWeek = round1(WEEKLY_HOURS * (1 - BUFFER_PERCENT / 100));
  const bufferPerWeek = round1(WEEKLY_HOURS * (BUFFER_PERCENT / 100));

  const weeks = weeksBetween(planStart, planEnd).map((w, index) => ({
    index: index + 1,
    start: w.start,
    end: w.end,
    capacityHours: usablePerWeek,
    bufferHours: bufferPerWeek,
  }));

  const weekAllocations: WeekAllocation[] = weeks.map((w) => ({
    week: w,
    rows: [],
    usedHours: 0,
    remainingHours: w.capacityHours,
  }));

  // earliest endDate first
  const sortedTasks = [...tasks].sort(
    (a, b) =>
      parseISODate(a.endDate).getTime() - parseISODate(b.endDate).getTime(),
  );

  // greedy allocation within task date range + task weekly cap
  for (const task of sortedTasks) {
    let remaining = Math.max(0, task.totalHours);

    const allowedWeeks = weekAllocations.filter((w) => {
      return (
        w.week.start <= parseISODate(task.endDate) &&
        w.week.end >= parseISODate(task.startDate)
      );
    });

    for (const week of allowedWeeks) {
      if (remaining <= 0) break;

      const taskWeeklyLimit = task.maxHoursPerWeek ?? Infinity;
      const alreadyThisWeek = week.rows
        .filter((r) => r.taskId === task.id)
        .reduce((s, r) => s + r.hours, 0);

      const taskWeekRemaining = taskWeeklyLimit - alreadyThisWeek;

      const allocatable = Math.min(
        remaining,
        week.remainingHours,
        taskWeekRemaining,
      );

      if (allocatable > 0) {
        week.rows.push({
          taskId: task.id,
          title: task.title || "Untitled task",
          type: task.type,
          hours: round1(allocatable),
          deadline: task.endDate,
          isAfterDeadline: false,
        });

        week.usedHours = round1(week.usedHours + allocatable);
        week.remainingHours = round1(week.week.capacityHours - week.usedHours);
        remaining = round1(remaining - allocatable);
      }
    }
  }

  const taskStatus = tasks.map((task) => {
    const allocated = weekAllocations
      .flatMap((w) => w.rows)
      .filter((r) => r.taskId === task.id)
      .reduce((s, r) => s + r.hours, 0);

    const required = Math.max(0, task.totalHours);
    const remaining = round1(required - allocated);

    return {
      taskId: task.id,
      requiredHours: round1(required),
      allocatedTotalHours: round1(allocated),
      remainingHours: remaining,
      deadline: task.endDate,
      risk: allocated + 1e-9 < required ? "Deadline Risk" : "OK",
    } as const;
  });

  const totalRequired = round1(
    tasks.reduce((s, t) => s + Math.max(0, t.totalHours), 0),
  );
  const totalCapacity = round1(
    weekAllocations.reduce((s, w) => s + w.week.capacityHours, 0),
  );
  const totalBuffer = round1(
    weekAllocations.reduce((s, w) => s + w.week.bufferHours, 0),
  );
  const totalAllocated = round1(
    weekAllocations.reduce((s, w) => s + w.usedHours, 0),
  );

  const notices: PlanResult["notices"] = [];

  if (totalRequired > totalCapacity) {
    notices.push({
      kind: "danger",
      message: `Total required hours are ${totalRequired}h, but you only have ${totalCapacity}h available (default ${WEEKLY_HOURS}h/week with ${BUFFER_PERCENT}% buffer).`,
    });
  }

  for (const s of taskStatus) {
    if (s.risk !== "OK") {
      const title = tasks.find((t) => t.id === s.taskId)?.title ?? "Task";
      notices.push({
        kind: "warning",
        message: `Deadline Risk: "${title}" cannot be fully scheduled within its date range (${s.allocatedTotalHours}/${s.requiredHours}h).`,
      });
    }
  }

  return {
    weeks: weekAllocations,
    taskStatus,
    totals: { totalRequired, totalCapacity, totalBuffer, totalAllocated },
    notices,
  };
}

function minISO(list: string[]) {
  return list.reduce((min, cur) =>
    parseISODate(cur).getTime() < parseISODate(min).getTime() ? cur : min,
  );
}

function maxISO(list: string[]) {
  return list.reduce((max, cur) =>
    parseISODate(cur).getTime() > parseISODate(max).getTime() ? cur : max,
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
