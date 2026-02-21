"use client";

import { useState, useEffect } from "react";
import { ScheduleItem } from "@/components/EventList";

type Props = {
  events?: ScheduleItem[];
  onSelectDate?: (date: string | null) => void;
};

type ViewMode = "Day" | "Month" | "Year";

export default function MiniCalendar({
  events = [],
  onSelectDate,
}: Props) {
  const today = new Date();

  // Load last selected date from localStorage if available
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("miniCalendarDate");
      return saved ? new Date(saved) : today;
    }
    return today;
  });

  const [viewMode, setViewMode] = useState<ViewMode>("Month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const hasEventOnDay = (day: number) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const handleSelectDate = (dateValue: string) => {
    setViewMode("Day");
    onSelectDate?.(dateValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("miniCalendarDate", dateValue);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-purple-500 to-pink-500 p-4 text-white">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            if (viewMode === "Month") setCurrentDate(new Date(year, month - 1, 1));
            if (viewMode === "Year") setCurrentDate(new Date(year - 1, month, 1));
          }}
          className="opacity-80 hover:opacity-100"
        >
          ‹
        </button>

        <button
          onClick={() => {
            if (viewMode === "Day") {
              setViewMode("Month");
              onSelectDate?.(null);
            }
          }}
          className="font-semibold text-sm"
        >
          {monthName}
        </button>

        <button
          onClick={() => {
            if (viewMode === "Month") setCurrentDate(new Date(year, month + 1, 1));
            if (viewMode === "Year") setCurrentDate(new Date(year + 1, month, 1));
          }}
          className="opacity-80 hover:opacity-100"
        >
          ›
        </button>
      </div>

      {/* ================= WEEK DAYS ================= */}
      {viewMode === "Month" && (
        <div className="grid grid-cols-7 text-xs text-center opacity-80 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      )}

      {/* ================= DAYS ================= */}
      {viewMode === "Month" && (
        <div className="grid grid-cols-7 gap-1 text-xs">
          {Array.from({ length: firstDay }).map((_, i) => <span key={i} />)}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const hasEvent = hasEventOnDay(day);

            const dateValue = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

            return (
              <button
                key={day}
                onClick={() => handleSelectDate(dateValue)}
                className={`relative flex items-center justify-center h-8 w-8 rounded-full
                  ${isToday ? "bg-white text-pink-600 font-semibold" : "hover:bg-white/20"}`}
              >
                {day}
                {hasEvent && (
                  <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-yellow-300" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ================= YEAR VIEW ================= */}
      {viewMode === "Year" && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          {Array.from({ length: 12 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentDate(new Date(year, i, 1));
                setViewMode("Month");
              }}
              className="rounded-lg bg-white/20 py-2 hover:bg-white/30"
            >
              {new Date(year, i).toLocaleDateString("en-US", { month: "short" })}
            </button>
          ))}
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <div className="mt-4 flex justify-between gap-2 text-xs">
        <button
          onClick={() => setViewMode("Day")}
          className={`flex-1 rounded-lg py-1 ${
            viewMode === "Day" ? "bg-white text-pink-600 font-semibold" : "bg-white/20"
          }`}
        >
          Day
        </button>

        <button
          onClick={() => setViewMode("Month")}
          className={`flex-1 rounded-lg py-1 ${
            viewMode === "Month" ? "bg-white text-pink-600 font-semibold" : "bg-white/20"
          }`}
        >
          Month
        </button>

        <button
          onClick={() => setViewMode("Year")}
          className={`flex-1 rounded-lg py-1 ${
            viewMode === "Year" ? "bg-white text-pink-600 font-semibold" : "bg-white/20"
          }`}
        >
          Year
        </button>
      </div>
    </div>
  );
}