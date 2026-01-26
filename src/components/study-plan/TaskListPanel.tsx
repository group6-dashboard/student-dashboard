"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button, Text } from "@/components/ui/primitives";
import type { StudyTask } from "@/lib/study-plan/types";
import TaskListItem from "./TaskListItem";

export default function TaskListPanel({
  tasks,
  onAddClick,
  onDelete,
  onGenerate,
}: {
  tasks: StudyTask[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
  onGenerate: () => void;
}) {
  const hasTasks = tasks.length > 0;

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {!hasTasks ? (
          <>
            <div className="rounded-xl border border-border/50 p-4">
              <Text variant="muted">
                No tasks yet. Click <b>+ Add Task</b> to create one.
              </Text>
            </div>

            {/* Add Task Button */}
            <Button className="w-full" onClick={onAddClick}>
              + Add Task
            </Button>
          </>
        ) : (
          <>
            {/* Task List Summary */}
            <div className="space-y-2">
              {tasks.map((t) => (
                <TaskListItem
                  key={t.id}
                  task={t}
                  onDelete={() => onDelete(t.id)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" className="w-full" onClick={onAddClick}>
                + Add Task
              </Button>
              <Button className="w-full" onClick={onGenerate}>
                Generate Study Plan
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
