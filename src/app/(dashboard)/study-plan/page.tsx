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

export default function StudyPlanGenerator() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState<TabKey>("Weekly");
  const [result, setResult] = useState<PlanResult | null>(null);

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
                  Summary tab is under development.
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
