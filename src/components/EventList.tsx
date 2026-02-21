"use client";

import { useState, useMemo, useEffect } from "react";
import { Bell } from "lucide-react";
import EventCard from "@/components/EventCard";

export type ScheduleItem = {
  endTime: string;
  description: string;
  startTime: any;
  title: string;
  date: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  type: "Meeting" | "Event" | "Personal" | "Deadline";
  weekday: string;

  /* Alarm  */
  alarmMinutes?: number;
  alarmBefore?: number;
};

type Props = {
  events: ScheduleItem[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onMove: (fromIndex: number, toDay: string) => void;

  filterType?: string;
  filterPriority?: string;
  search?: string;
};

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EventList({
  events,
  onEdit,
  onDelete,
  onMove,
  filterType = "All Types",
  filterPriority = "All Priorities",
  search = "",
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [localEvents, setLocalEvents] = useState<ScheduleItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("events");
      return saved ? JSON.parse(saved) : events;
    }
    return events;
  });

  /* Update localEvents whenever props.events change */
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  /* Persist to localStorage whenever localEvents change */
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(localEvents));
  }, [localEvents]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  /* FILTERS */
  const filteredEvents = useMemo(() => {
    return localEvents.filter((event) => {
      const matchType =
        filterType === "All Types" || event.type === filterType;

      const matchPriority =
        filterPriority === "All Priorities" || event.priority === filterPriority;

      const matchSearch =
        search.trim() === "" ||
        event.title.toLowerCase().includes(search.toLowerCase());

      return matchType && matchPriority && matchSearch;
    });
  }, [localEvents, filterType, filterPriority, search]);

  return (
    <div className="grid grid-cols-7 gap-6">
      {WEEK_DAYS.map((day) => {
        const dayEvents = filteredEvents.filter(
          (event) => event.weekday === day
        );

        const isToday = day === today;

        return (
          <div
            key={day}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) {
                onMove(dragIndex, day);

                /* Update localEvents for localStorage */
                const updated = [...localEvents];
                updated[dragIndex].weekday = day;
                setLocalEvents(updated);

                setDragIndex(null);
              }
            }}
            className={`flex flex-col rounded-2xl border bg-white
              ${
                isToday
                  ? "border-pink-500 ring-1 ring-pink-300"
                  : "border-gray-200"
              }
            `}
          >
            {/* ===== Day Header ===== */}
            <div className="flex flex-col items-center gap-2 py-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full font-bold text-sm
                  ${
                    isToday
                      ? "bg-pink-500 text-white"
                      : dayEvents.length
                      ? "bg-pink-100 text-pink-600"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {day.charAt(0)}
              </div>

              <span
                className={`text-xs font-medium ${
                  isToday ? "text-pink-600" : "text-gray-500"
                }`}
              >
                {day.slice(0, 3)}
              </span>
            </div>

            {/* ===== Events ===== */}
            <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
              {dayEvents.length === 0 ? (
                <p className="text-center text-xs text-gray-400">No tasks</p>
              ) : (
                dayEvents.map((event) => {
                  const realIndex = localEvents.indexOf(event);

                  const alarmValue = event.alarmMinutes ?? event.alarmBefore;

                  return (
                    <div
                      key={realIndex}
                      draggable
                      onDragStart={() => setDragIndex(realIndex)}
                      className="relative cursor-grab active:cursor-grabbing"
                    >
                      {/* Alarm Indicator */}
                      {alarmValue && (
                        <div className="absolute -top-2 -left-2 z-10 rounded-full bg-pink-500 p-1 text-white shadow">
                          <Bell size={12} />
                        </div>
                      )}

                      <EventCard
                        title={event.title}
                        time={event.time}
                        type={event.type}
                        priority={event.priority}
                        alarmMinutes={event.alarmMinutes}
                        onEdit={() => onEdit(realIndex)}
                        onDelete={() => {
                          onDelete(realIndex);
                          setLocalEvents(localEvents.filter((_, i) => i !== realIndex));
                        }}
                        onAlarmChange={(minutes) => {
                          const updated = [...localEvents];
                          updated[realIndex].alarmMinutes = minutes ?? undefined;
                          setLocalEvents(updated);
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}