"use client";

import { useEffect, useState } from "react";

export type FilterType =
  | "All"
  | "Meeting"
  | "Event"
  | "Personal"
  | "Deadline";

export type FilterPriority =
  | "All"
  | "High"
  | "Medium"
  | "Low";

export type ViewMode =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Agenda";

type Props = {
  onNewSchedule: () => void;

  search: string;
  filterType: FilterType;
  filterPriority: FilterPriority;

  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: FilterType) => void;
  onFilterPriorityChange: (value: FilterPriority) => void;
};

export default function ScheduleHeader({
  onNewSchedule,
  search,
  filterType,
  filterPriority,
  onSearchChange,
  onFilterTypeChange,
  onFilterPriorityChange,
}: Props) {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      {/* 🔹 TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">
              {time}
            </p>
            <h1 className="text-2xl font-semibold">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h1>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            type="text"
            placeholder="Search events..."
            className="h-10 w-56 rounded-full border px-4 text-sm focus:outline-none"
          />

          {/* Type */}
          <select
            value={filterType}
            onChange={(e) =>
              onFilterTypeChange(
                e.target.value as FilterType
              )
            }
            className="h-10 rounded-full border px-4 text-sm"
          >
            <option value="All">All Types</option>
            <option value="Meeting">Meeting</option>
            <option value="Event">Event</option>
            <option value="Personal">Personal</option>
            <option value="Deadline">Deadline</option>
          </select>

          {/* Priority */}
          <select
            value={filterPriority}
            onChange={(e) =>
              onFilterPriorityChange(
                e.target.value as FilterPriority
              )
            }
            className="h-10 rounded-full border px-4 text-sm"
          >
            <option value="All">
              All Priorities
            </option>
            <option value="High">High</option>
            <option value="Medium">
              Medium
            </option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="h-10 rounded-full border px-5 text-sm">
            Import
          </button>

          <button className="h-10 rounded-full bg-pink-500 px-5 text-sm text-white">
            Export
          </button>

          <button
            onClick={onNewSchedule}
            className="h-10 rounded-full bg-white px-5 text-sm shadow"
          >
            + New Schedule
          </button>
        </div>
      </div>

      {/* Gradient Header */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-5 text-white">
        <h2 className="text-xl font-semibold">
          Schedule Overview
        </h2>
        <p className="text-sm text-white/80">
          Search, filter and manage your
          schedules
        </p>
      </div>
    </div>
  );
}
