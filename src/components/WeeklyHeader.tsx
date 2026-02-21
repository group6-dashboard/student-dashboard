"use client";

import { useState, useEffect } from "react";

const DAYS = [
  { key: "Sunday", label: "S" },
  { key: "Monday", label: "M" },
  { key: "Tuesday", label: "T" },
  { key: "Wednesday", label: "W" },
  { key: "Thursday", label: "T" },
  { key: "Friday", label: "F" },
  { key: "Saturday", label: "S" },
];

export default function WeeklyHeader() {
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    const current = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    setToday(current);
  }, []);

  return (
    <div className="grid grid-cols-7 gap-2 mb-4">
      {DAYS.map((day) => {
        const isToday = day.key === today;

        return (
          <div
            key={day.key}
            className={`h-12 rounded-lg flex items-center justify-center font-semibold
              ${
                isToday
                  ? "bg-gradient-to-b from-pink-500 to-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            {day.label}
          </div>
        );
      })}
    </div>
  );
}