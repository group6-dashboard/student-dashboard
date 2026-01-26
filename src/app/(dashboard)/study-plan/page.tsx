"use client";

import { Text } from "@/components/ui/primitives";
import Tabs, { TabKey } from "@/components/study-plan/Tabs";
import WeeklyView from "@/components/study-plan/WeeklyView";
//import SummaryView from "@/components/study-plan/SummaryView";
import TaskListPanel from "@/components/study-plan/TaskListPanel";
import TaskCreateModal from "@/components/study-plan/TaskCreateModal";

import type { PlanResult, StudyTask } from "@/lib/study-plan/types";
import { generateStudyPlan } from "@/lib/study-plan/planner";
import { useState } from "react";

const mockTasks: StudyTask[] = [
  {
    id: "mock-1",
    title: "Task1",
    type: "Exam Prep",
    startDate: "2026-01-29",
    endDate: "2026-02-17",
    totalHours: 100,
    maxHoursPerWeek: 15,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "mock-2",
    title: "task2",
    type: "Assignment",
    startDate: "2026-01-29",
    endDate: "2026-03-29",
    totalHours: 200,
    maxHoursPerWeek: 25,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "mock-3",
    title: "task3",
    type: "Lecture",
    startDate: "2026-01-29",
    endDate: "2026-02-29",
    totalHours: 50,
    maxHoursPerWeek: 12,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
];

export default function StudyPlanGenerator() {
  const [tasks, setTasks] = useState<StudyTask[]>(mockTasks);
  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState<TabKey>("Weekly");
  const [result, setResult] = useState<PlanResult | null>(() =>
    generateStudyPlan(mockTasks),
  );

  const onAddTask = (task: StudyTask) => {
    setTasks((prev) => [...prev, task]);
  };

  const onDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const onGenerate = () => {
    setResult(generateStudyPlan(tasks));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text as="h1" variant="h2" className="font-semibold">
          Study Plan Generator
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-4 space-y-4">
          <TaskListPanel
            tasks={tasks}
            onAddClick={() => setOpen(true)}
            onDelete={onDeleteTask}
            onGenerate={onGenerate}
          />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-card ring-1 ring-border/50 shadow-soft">
            <Tabs value={tab} onChange={setTab} />
            <div className="p-5">
              {!result ? (
                <div className="text-sm text-muted-foreground">
                  Add tasks on the left and click <b>Generate Study Plan</b> to
                  view the plan.
                </div>
              ) : tab === "Weekly" ? (
                <WeeklyView result={result} />
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>
                    This summary view is designed as a set of weekly donut
                    charts.{" "}
                  </p>
                  <br />
                  <p>
                    Each chart represents one week, giving users a high-level
                    overview of how their study time is allocated and how it
                    evolves over the month.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <TaskCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={onAddTask}
      />
    </div>
  );
}
