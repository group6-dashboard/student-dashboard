"use client";

import { Button, Text, Badge } from "@/components/ui/primitives";
import type { StudyTask } from "@/lib/study-plan/types";

export default function TaskListItem({
  task,
  onDelete,
}: {
  task: StudyTask;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Badge>{task.type}</Badge>
          <Text className="font-medium truncate">
            {task.title || "Untitled task"}
          </Text>
        </div>
        <Text variant="caption">
          {task.startDate} → {task.endDate} · {task.totalHours}h
          {task.maxHoursPerWeek ? ` · max ${task.maxHoursPerWeek}h/week` : ""}
        </Text>
      </div>

      <Button variant="ghost" size="sm" onClick={onDelete}>
        ✕
      </Button>
    </div>
  );
}
