"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Button, Input, Label, Select, Text } from "@/components/ui/primitives";
import type {
  StudyTask,
  TaskType,
  AvailabilityDay,
} from "@/lib/study-plan/types";
import { weeksCountBetween, daysCountBetween } from "@/lib/study-plan/date";
import { useState } from "react";

const TYPES: TaskType[] = [
  "Assignment",
  "Lecture",
  "Project",
  "Exam Prep",
  "Other",
];
const DAYS: AvailabilityDay[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function newDraft(): StudyTask {
  const id = crypto.randomUUID?.() ?? String(Date.now());
  return {
    id,
    title: "",
    type: "Assignment",
    startDate: todayISO(),
    endDate: todayISO(),
    totalHours: 0,
    maxHoursPerWeek: undefined,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  };
}

export default function TaskCreateModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (task: StudyTask) => void;
}) {
  const [draft, setDraft] = useState<StudyTask>(() => newDraft());
  const weeks = weeksCountBetween(draft.startDate, draft.endDate);
  const days = daysCountBetween(draft.startDate, draft.endDate);

  if (!open) return null;

  const canAdd =
    draft.title.trim().length > 0 &&
    draft.totalHours > 0 &&
    draft.startDate <= draft.endDate;

  const add = () => {
    if (!canAdd) return;
    onAdd(draft);
    setDraft(newDraft());
    onClose();
  };

  const toggleDay = (d: AvailabilityDay) => {
    const cur = draft.availableDays ?? [];
    const has = cur.includes(d);
    setDraft({
      ...draft,
      availableDays: has ? cur.filter((x) => x !== d) : [...cur, d],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* floating card */}
      <div className="relative w-[92%] max-w-xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold">Add Task</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Task title</Label>
              <Input
                placeholder="e.g. React Router assignment"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={draft.type}
                onChange={(e) =>
                  setDraft({ ...draft, type: e.target.value as TaskType })
                }
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) =>
                    setDraft({ ...draft, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End date</Label>
                <Input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) =>
                    setDraft({ ...draft, endDate: e.target.value })
                  }
                />
              </div>
              <Text variant="caption" className="text-muted-foreground">
                Time window: ~{weeks} week{weeks > 1 ? "s" : ""} ({days} day
                {days > 1 ? "s" : ""})
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Total hours</Label>
                <Input
                  type="text"
                  min={0}
                  step={0.5}
                  value={draft.totalHours}
                  onChange={(e) =>
                    setDraft({ ...draft, totalHours: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Max hours / week</Label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Optional"
                  value={draft.maxHoursPerWeek ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      maxHoursPerWeek:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Available days</Label>
              <div className="flex flex-wrap gap-2 pt-2">
                {DAYS.map((d) => {
                  const active = (draft.availableDays ?? []).includes(d);
                  return (
                    <Button
                      key={d}
                      size="sm"
                      variant={active ? "primary" : "outline"}
                      onClick={() => toggleDay(d)}
                    >
                      {d[0]}
                    </Button>
                  );
                })}
              </div>
            </div>

            {!canAdd && (
              <Text variant="caption" className="text-muted-foreground">
                Please fill title, set Total hours &gt; 0, and ensure Start date
                ≤ End date.
              </Text>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={add} disabled={!canAdd}>
              Add
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
