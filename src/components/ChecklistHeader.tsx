"use client";

import { Clock, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChecklistHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const i = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>{time}</span>
      </div>

      <div className="flex items-center gap-2 border rounded-lg px-3 h-10">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search events..."
          className="outline-none text-sm"
        />
      </div>

      <select className="h-10 rounded-lg border px-3 text-sm">
        <option>All Types</option>
        <option>Meeting</option>
        <option>Event</option>
        <option>Personal</option>
      </select>

      <select className="h-10 rounded-lg border px-3 text-sm">
        <option>All Priorities</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button className="ml-auto h-10 rounded-lg border px-4 text-sm">
        Import
      </button>
      <button className="h-10 rounded-lg bg-pink-500 px-4 text-sm text-white">
        Export
      </button>
    </div>
  );
}
