"use client";

import { useState, useEffect } from "react";

type ScheduleInput = {
  title: string;
  type: string;
  priority: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;

  // 🔔 Alarm (اضافه شده – بدون حذف قبلی)
  alarmEnabled?: boolean;
  alarmMinutes?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleInput) => void;
  initialData?: ScheduleInput | null;
};

export default function NewScheduleModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState<ScheduleInput>(
    initialData ?? {
      title: "",
      type: "Meeting",
      priority: "Medium",
      date: "",
      startTime: "",
      endTime: "",
      description: "",

      // 🔔 مقدار پیش‌فرض آلارم
      alarmEnabled: false,
      alarmMinutes: 5,
    }
  );

  // ✅ ریست فرم هنگام ساخت اسکجول جدید
  useEffect(() => {
    if (open && !initialData) {
      setForm({
        title: "",
        type: "Meeting",
        priority: "Medium",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        alarmEnabled: false,
        alarmMinutes: 5,
      });
    }

    if (open && initialData) {
      setForm({
        ...initialData,
        alarmEnabled:
          initialData.alarmEnabled ?? false,
        alarmMinutes:
          initialData.alarmMinutes ?? 5,
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {initialData
            ? "Edit Schedule"
            : "New Schedule"}
        </h2>

        <input
          aria-label="Title"
          placeholder="Schedule title"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            aria-label="Type"
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option>Meeting</option>
            <option>Event</option>
            <option>Personal</option>
            <option>Deadline</option>
          </select>

          <select
            aria-label="Priority"
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value,
              })
            }
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <input
          type="date"
          aria-label="Date"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={form.date}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
        />

        {/* ⏰ Time Picker */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            aria-label="Start time"
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.startTime}
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
          />
          <input
            type="time"
            aria-label="End time"
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.endTime}
            onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value,
              })
            }
          />
        </div>

        <textarea
          aria-label="Description"
          placeholder="Description (optional)"
          className="h-24 w-full rounded-lg border px-3 py-2 text-sm resize-none"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* 🔔 Alarm Settings (جدید – حرفه‌ای) */}
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Alarm reminder
            </span>

            <input
              type="checkbox"
              checked={form.alarmEnabled}
              onChange={(e) =>
                setForm({
                  ...form,
                  alarmEnabled: e.target.checked,
                })
              }
            />
          </div>

          {form.alarmEnabled && (
            <div className="flex items-center gap-3 text-sm">
              <span>Notify me</span>

              <select
                className="rounded-lg border px-2 py-1"
                value={form.alarmMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alarmMinutes: Number(
                      e.target.value
                    ),
                  })
                }
              >
                <option value={5}>
                  5 minutes before
                </option>
                <option value={10}>
                  10 minutes before
                </option>
                <option value={15}>
                  15 minutes before
                </option>
                <option value={30}>
                  30 minutes before
                </option>
                <option value={60}>
                  1 hour before
                </option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSubmit(form);
              onClose();
            }}
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white"
          >
            {initialData
              ? "Save Changes"
              : "Create Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
