import { parseISODate, weeksBetween } from "./date";
import type { PlanResult, StudyTask, WeekAllocation } from "./types";

type Opts = { weeklyHours: number };

export function generateStudyPlan(tasks: StudyTask[], opts: Opts): PlanResult {
  const WEEKLY_HOURS = Math.max(0, Math.floor(opts.weeklyHours));

  if (tasks.length === 0) {
    return {
      weeks: [],
      taskStatus: [],
      totals: {
        totalRequired: 0,
        totalCapacity: 0,
        totalAllocated: 0,
      },
    };
  }

  const planStart = minISO(tasks.map((t) => t.startDate));
  const planEnd = maxISO(tasks.map((t) => t.endDate));

  const weeks = weeksBetween(planStart, planEnd).map((w, index) => ({
    index: index + 1,
    start: w.start,
    end: w.end,
    capacityHours: WEEKLY_HOURS,
  }));

  const weekAllocations: WeekAllocation[] = weeks.map((w) => ({
    week: w,
    rows: [],
    usedHours: 0,
    remainingHours: w.capacityHours,
  }));

  // remaining hours per task (integer)
  const remaining = new Map<string, number>();
  for (const t of tasks) {
    remaining.set(t.id, Math.max(0, Math.floor(t.totalHours)));
  }

  const isActive = (task: StudyTask, week: WeekAllocation) => {
    const s = parseISODate(task.startDate);
    const e = parseISODate(task.endDate);
    return week.week.start <= e && week.week.end >= s;
  };

  const addOrUpdateRow = (
    week: WeekAllocation,
    task: StudyTask,
    hours: number,
  ) => {
    if (hours <= 0) return;

    const existing = week.rows.find((r) => r.taskId === task.id);
    if (existing) {
      existing.hours += hours;
    } else {
      week.rows.push({
        taskId: task.id,
        title: task.title || "Untitled task",
        type: task.type,
        hours,
        deadline: task.endDate,
        isAfterDeadline: false,
      });
    }

    week.usedHours += hours;
    week.remainingHours = week.week.capacityHours - week.usedHours;
  };

  // helper: count how many future weeks (including current) this task is active
  function countActiveWeeksFrom(
    task: StudyTask,
    allocations: WeekAllocation[],
    currentIndex: number,
  ) {
    let count = 0;
    for (let i = currentIndex; i < allocations.length; i++) {
      if (isActive(task, allocations[i])) count += 1;
    }
    return count;
  }

  // Allocate week by week
  for (let wi = 0; wi < weekAllocations.length; wi++) {
    const week = weekAllocations[wi];
    const capacity = week.week.capacityHours;
    if (capacity <= 0) continue;

    const activeTasks = tasks
      .filter((t) => isActive(t, week))
      .filter((t) => (remaining.get(t.id) ?? 0) > 0);

    if (activeTasks.length === 0) continue;

    // caps + weights
    const weeklyCapOf = (t: StudyTask) =>
      t.maxHoursPerWeek == null
        ? Infinity
        : Math.max(0, Math.floor(t.maxHoursPerWeek));

    const allocationByTaskId = new Map<string, number>();
    let left = capacity;

    // ---------- Pass 1: deficit/urgency-based allocation ----------
    // pressure = remaining / activeWeeksLeft; higher pressure first; tie-breaker: earlier deadline
    const urgencySorted = activeTasks
      .map((t) => {
        const r = remaining.get(t.id) ?? 0;
        const weeksLeft = Math.max(
          1,
          countActiveWeeksFrom(t, weekAllocations, wi),
        );
        const pressure = r / weeksLeft;
        return { task: t, r, weeksLeft, pressure };
      })
      .sort((a, b) => {
        if (b.pressure !== a.pressure) return b.pressure - a.pressure;
        // earlier endDate first if same pressure
        return (
          parseISODate(a.task.endDate).getTime() -
          parseISODate(b.task.endDate).getTime()
        );
      });

    for (const item of urgencySorted) {
      if (left <= 0) break;

      const t = item.task;
      const r = item.r;
      const weeklyCap = weeklyCapOf(t);

      const already = allocationByTaskId.get(t.id) ?? 0;
      const canGive = Math.min(weeklyCap - already, r - already, left);
      if (canGive <= 0) continue;

      // baseline needed this week: ceil(remaining / weeksLeft)
      const baseline = Math.ceil(r / item.weeksLeft);
      const give = Math.min(baseline, canGive);

      if (give > 0) {
        allocationByTaskId.set(t.id, already + give);
        left -= give;
      }
    }

    // ---------- Pass 2: distribute remaining hours by weight (your original spirit) ----------
    if (left > 0) {
      const sortedByWeight = activeTasks.map((t) => ({ task: t }));

      // one-by-one distribution to respect caps and remaining
      while (left > 0) {
        let progressed = false;

        for (const item of sortedByWeight) {
          if (left <= 0) break;

          const t = item.task;
          const r = remaining.get(t.id) ?? 0;
          const weeklyCap = weeklyCapOf(t);
          const already = allocationByTaskId.get(t.id) ?? 0;

          if (already < weeklyCap && already < r) {
            allocationByTaskId.set(t.id, already + 1);
            left -= 1;
            progressed = true;
          }
        }

        // if no task can take more, stop to avoid infinite loop
        if (!progressed) break;
      }
    }

    // ---------- Write into week and update remaining ----------
    for (const task of activeTasks) {
      const h = allocationByTaskId.get(task.id) ?? 0;
      if (h <= 0) continue;

      addOrUpdateRow(week, task, h);
      remaining.set(task.id, (remaining.get(task.id) ?? 0) - h);
    }
  }
  // taskStatus + totals (integer)
  const taskStatus = tasks.map((task) => {
    const allocated = weekAllocations
      .flatMap((w) => w.rows)
      .filter((r) => r.taskId === task.id)
      .reduce((s, r) => s + r.hours, 0);

    const required = Math.max(0, Math.floor(task.totalHours));
    return {
      taskId: task.id,
      requiredHours: required,
      allocatedTotalHours: allocated,
      remainingHours: required - allocated,
      deadline: task.endDate,
    };
  });

  const totalRequired = tasks.reduce(
    (s, t) => s + Math.max(0, Math.floor(t.totalHours)),
    0,
  );
  const totalCapacity = weekAllocations.reduce(
    (s, w) => s + w.week.capacityHours,
    0,
  );
  const totalAllocated = weekAllocations.reduce((s, w) => s + w.usedHours, 0);

  return {
    weeks: weekAllocations,
    taskStatus,
    totals: { totalRequired, totalCapacity, totalAllocated },
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
