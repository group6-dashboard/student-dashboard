"use client";

import { useEffect, useState } from "react";

export default function EventListHeader() {
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("events");
      if (saved) {
        const events = JSON.parse(saved);
        setTotalTasks(events.length);
      }
    }
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">
          Weekly Schedule ({totalTasks})
        </h3>

        <span className="text-sm text-white/80">
          Drag & manage your tasks
        </span>
      </div>
    </div>
  );
}