"use client";

import { Clock, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChecklistHeader() {
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterPriority, setFilterPriority] = useState("All Priorities");

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

  /* ===================== IMPORT / EXPORT ===================== */
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        localStorage.setItem("checklist", JSON.stringify(data));
        alert("Checklist imported!");
      } catch {
        alert("Invalid JSON file");
      }
    };
    input.click();
  };

  const handleExport = () => {
    const saved = localStorage.getItem("checklist");
    if (!saved) {
      alert("No checklist to export!");
      return;
    }
    const blob = new Blob([saved], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "checklist.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="h-10 rounded-lg border px-3 text-sm"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option>All Types</option>
        <option>Meeting</option>
        <option>Event</option>
        <option>Personal</option>
      </select>

      <select
        className="h-10 rounded-lg border px-3 text-sm"
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
      >
        <option>All Priorities</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button
        onClick={handleImport}
        className="ml-auto h-10 rounded-lg border px-4 text-sm"
      >
        Import
      </button>
      <button
        onClick={handleExport}
        className="h-10 rounded-lg bg-pink-500 px-4 text-sm text-white"
      >
        Export
      </button>
    </div>
  );
}