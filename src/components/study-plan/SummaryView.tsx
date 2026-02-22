"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, Text } from "@/components/ui/primitives";
import type { PlanResult, StudyTask } from "@/lib/study-plan/types";

export default function SummaryView({
  result,
  tasks,
}: {
  result: PlanResult;
  tasks: StudyTask[];
}) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const { totals, taskStatus, weeks } = result;

  const totalWeeks = weeks.length;
  const totalTasks = taskStatus.length;

  return (
    <div className="space-y-4">
      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Weeks in plan" value={`${totalWeeks}`} />
            <Row label="Tasks" value={`${totalTasks}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row
              label="Required"
              value={`${totals.totalRequired.toFixed(1)}h`}
            />
            <Row
              label="Allocated"
              value={`${totals.totalAllocated.toFixed(1)}h`}
            />
          </CardContent>
        </Card>
      </div>

      {/* TASK BREAKDOWN */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Per-task breakdown</CardTitle>
          <Text variant="caption" className="text-muted-foreground">
            Allocated vs required
          </Text>
        </CardHeader>

        <CardContent className="space-y-2">
          {taskStatus.length === 0 ? (
            <Text variant="muted">No tasks.</Text>
          ) : (
            <div className="space-y-2">
              {taskStatus.map((s) => {
                const task = taskMap.get(s.taskId);
                const title = task?.title?.trim()
                  ? task.title
                  : "Untitled task";
                const type = task?.type ?? "Other";

                return (
                  <div
                    key={s.taskId}
                    className="rounded-xl border border-border/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge>{type}</Badge>
                          <Text className="font-medium truncate">{title}</Text>
                        </div>
                        <Text
                          variant="caption"
                          className="text-muted-foreground"
                        >
                          {s.deadline}
                        </Text>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <MiniStat
                        label="Allocated"
                        value={`${s.allocatedTotalHours.toFixed(1)}h`}
                      />
                      <MiniStat
                        label="Required"
                        value={`${s.requiredHours.toFixed(1)}h`}
                      />
                      <MiniStat
                        label="Remaining"
                        value={`${s.remainingHours.toFixed(1)}h`}
                        danger={s.remainingHours > 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className="font-medium">{value}</Text>
    </div>
  );
}

function MiniStat({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/50 px-3 py-2">
      <Text variant="caption" className="text-muted-foreground">
        {label}
      </Text>
      <Text className={danger ? "font-medium text-destructive" : "font-medium"}>
        {value}
      </Text>
    </div>
  );
}
