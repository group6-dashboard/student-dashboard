"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge, Divider, Text } from "@/components/ui/primitives";
import { overviewMock } from "@/data/overviewMock";
import { useState } from "react";

function Donut({
  percent,
  size = 104,
  stroke = 10,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="hsl(var(--border) / 0.55)"
        strokeWidth={stroke}
      />
      {/* progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeOpacity={0.9}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default function Page() {
  const {
    upcomingClasses,
    assignments,
    credits,
    budget,
    focusTasks,
    activityTrend7,
    activityTrend30,
  } = overviewMock;

  const nextAssignment = [...assignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )[0];

  const formatDate = (dateStr: string) =>
    new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  const creditsPercent = Math.round((credits.earned / credits.total) * 100);
  const budgetPercent = Math.round((budget.spent / budget.total) * 100);
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [tasks, setTasks] = useState(focusTasks);
  const [newTask, setNewTask] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const activityTrend = range === "7d" ? activityTrend7 : activityTrend30;
  const maxActivity = Math.max(...activityTrend.map((item) => item.value));
  const totalActivity = activityTrend.reduce((sum, item) => sum + item.value, 0);
  const avgActivity = Math.round(totalActivity / activityTrend.length);
  const peakActivity = Math.max(...activityTrend.map((item) => item.value));

  return (
    <div className="space-y-6">
      <div>
        <Text className="mt-1" variant="muted">
          Quick snapshot of your week, priorities, and progress.
        </Text>
      </div>

      {/* Top row: 4 cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Credits earned</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <Donut percent={creditsPercent} size={110} stroke={10} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-lg font-semibold">
                  {credits.earned}/{credits.total}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {creditsPercent}% complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingClasses.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.location}
                  </div>
                </div>
                <Badge variant="secondary">{item.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.course}
                  </div>
                </div>
                <Badge variant="outline">{formatDate(item.dueDate)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-semibold">€{budget.spent}</div>
              <div className="text-xs text-muted-foreground">
                of €{budget.total}
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary/20"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Focus for today</CardTitle>
                <CardDescription>
                  Add your key tasks, study blocks, and reminders here.
                </CardDescription>
              </div>
              {!showTaskForm && (
                <button
                  type="button"
                  onClick={() => setShowTaskForm(true)}
                  className="h-9 rounded-lg border border-border/50 bg-card px-3 text-sm font-medium text-foreground hover:bg-accent/60"
                >
                  + New task
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showTaskForm && (
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const trimmed = newTask.trim();
                  if (!trimmed) return;
                  setTasks((prev) => [
                    { id: `task-${Date.now()}`, title: trimmed, done: false },
                    ...prev,
                  ]);
                  setNewTask("");
                  setShowTaskForm(false);
                }}
              >
                <input
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder="Add a focus task"
                  className="h-9 flex-1 rounded-lg border border-border/50 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-primary/10 px-3 text-sm font-medium text-primary"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false);
                    setNewTask("");
                  }}
                  className="h-9 rounded-lg border border-border/50 bg-card px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((item) =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item
                        )
                      )
                    }
                    className={
                      task.done
                        ? "h-4 w-4 rounded-full border border-primary/40 bg-primary/10"
                        : "h-4 w-4 rounded-full border border-border/50 bg-card"
                    }
                    aria-label={
                      task.done ? "Mark as not done" : "Mark as done"
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((item) =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item
                        )
                      )
                    }
                    className={
                      task.done
                        ? "flex-1 text-left text-sm text-muted-foreground line-through"
                        : "flex-1 text-left text-sm"
                    }
                  >
                    {task.title}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTasks((prev) =>
                        prev.filter((item) => item.id !== task.id)
                      )
                    }
                    className="text-xs text-muted-foreground hover:text-foreground"
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next deadline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium">{nextAssignment.title}</div>
              <Badge variant="outline">{formatDate(nextAssignment.dueDate)}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {nextAssignment.course}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
  <CardHeader>
    <div className="flex items-start justify-between gap-4">
      <div>
        <CardTitle>Activity trend</CardTitle>
        <CardDescription>
          {range === "7d"
            ? "Last 7 days of study activity"
            : "Last 30 days of study activity"}
        </CardDescription>
      </div>

      <div className="inline-flex rounded-lg border border-border/50 bg-card p-1">
        <button
          type="button"
          className={
            range === "7d"
              ? "rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              : "rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          }
          onClick={() => setRange("7d")}
        >
          Last 7 days
        </button>
        <button
          type="button"
          className={
            range === "30d"
              ? "rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              : "rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          }
          onClick={() => setRange("30d")}
        >
          1 month
        </button>
      </div>
    </div>
  </CardHeader>

  <CardContent className="space-y-5">
    {/* Chart (full width) */}
    <div className="flex items-end justify-between gap-4">
      {activityTrend.map((item) => {
        const height = Math.max(14, Math.round((item.value / maxActivity) * 120));
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full max-w-[44px] rounded-md bg-primary/20"
              style={{ height }}
              title={`${item.value}`}
            />
            <Text variant="caption">{item.label}</Text>
          </div>
        );
      })}
    </div>

    <Divider />

    {/* Legend + Stats row */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>Daily minutes</span>
        <span className="h-2 w-2 rounded-full bg-primary/30" />
        <span>Higher is better</span>
      </div>

      <div className="grid w-full gap-3 md:w-auto md:grid-cols-3">
        <div className="rounded-lg border border-border/50 bg-card px-4 py-3">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="mt-1 text-lg font-semibold">{totalActivity}</div>
        </div>
        <div className="rounded-lg border border-border/50 bg-card px-4 py-3">
          <div className="text-xs text-muted-foreground">Average</div>
          <div className="mt-1 text-lg font-semibold">{avgActivity}</div>
        </div>
        <div className="rounded-lg border border-border/50 bg-card px-4 py-3">
          <div className="text-xs text-muted-foreground">Peak</div>
          <div className="mt-1 text-lg font-semibold">{peakActivity}</div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

    </div>
  );
}
