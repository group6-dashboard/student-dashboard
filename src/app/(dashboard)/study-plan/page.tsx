"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Text } from "@/components/ui/primitives";

import Tabs, { TabKey } from "@/components/study-plan/Tabs";
import WeeklyView from "@/components/study-plan/WeeklyView";
import SummaryView from "@/components/study-plan/SummaryView";
import TaskListPanel from "@/components/study-plan/TaskListPanel";
import TaskCreateModal from "@/components/study-plan/TaskCreateModal";

import type { PlanResult, StudyTask } from "@/lib/study-plan/types";
import { generateStudyPlan } from "@/lib/study-plan/planner";
import { useState } from "react";

const mockTasks: StudyTask[] = [
  {
    id: "mock-1",
    title: "Software testing exam",
    type: "Exam Prep",
    startDate: "2026-01-29",
    endDate: "2026-02-17",
    totalHours: 80,
    maxHoursPerWeek: 20,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "mock-2",
    title: "Entrepreneurship",
    type: "Assignment",
    startDate: "2026-01-29",
    endDate: "2026-03-29",
    totalHours: 200,
    maxHoursPerWeek: 25,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "mock-3",
    title: "Research and development",
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

  const [weeklyHours, setWeeklyHours] = useState<string>("");
  const [weeklyHoursError, setWeeklyHoursError] = useState<string | null>(null);

  const [tab, setTab] = useState<TabKey>("Weekly");
  const [result, setResult] = useState<PlanResult | null>(null);

  const onAddTask = (task: StudyTask) => {
    setTasks((prev) => [...prev, task]);
  };

  const onDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const onGenerate = () => {
    if (weeklyHours.trim() === "") {
      setWeeklyHoursError("“Available study time” cannot be empty.");
      return;
    }

    const n = Number(weeklyHours);
    if (!Number.isFinite(n) || n <= 0) {
      setWeeklyHoursError("“Available study time” must be greater than 0.");
      return;
    }

    setWeeklyHoursError(null);
    setResult(generateStudyPlan(tasks, { weeklyHours: n }));
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Study Plan Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan your weekly study schedule based on tasks, deadlines, and
          available time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-4 space-y-4">
          {/* Weekly availability */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Available study time (hours/week)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Input
                  id="weeklyHours"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={weeklyHours}
                  onChange={(e) => {
                    const raw = e.target.value;

                    if (raw === "") {
                      setWeeklyHours("");
                      setWeeklyHoursError(
                        "Available study time cannot be empty.",
                      );
                      return;
                    }

                    if (!/^\d+$/.test(raw)) return;

                    const normalized = raw.replace(/^0+(?=\d)/, "");

                    setWeeklyHours(normalized);

                    setWeeklyHoursError(null);
                  }}
                  onBlur={() => {
                    if (weeklyHours.trim() === "") {
                      setWeeklyHoursError(
                        "Available study time cannot be empty.",
                      );
                      return;
                    }
                    const n = Number(weeklyHours);
                    if (!Number.isFinite(n) || n <= 0) {
                      setWeeklyHoursError(
                        "Available study time must be greater than 0.",
                      );
                      return;
                    }

                    setWeeklyHoursError(null);
                  }}
                />
                {weeklyHoursError && (
                  <Text variant="caption" className="text-destructive">
                    {weeklyHoursError}
                  </Text>
                )}
                <Text variant="caption" className="text-muted-foreground">
                  This value will be applied when you click “Generate Study
                  Plan”.
                </Text>
              </div>
            </CardContent>
          </Card>

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
                <SummaryView result={result} tasks={tasks} />
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
